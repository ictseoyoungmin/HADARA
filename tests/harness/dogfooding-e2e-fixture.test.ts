import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import { createContextExportReport } from '../../src/hermes/context-export';
import { appendEvidenceTextArtifact } from '../../src/evidence/evidence';
import { validateTaskCapsule } from '../../src/harness/validate';
import { createPolicyCheckReport } from '../../src/services/policy-service';
import { createTaskCapsule, TaskCapsule } from '../../src/task/task-capsule';

interface DogfoodingFixture {
  schemaVersion: 'hadara.dogfooding.fixture.v1';
  name: string;
  taskTitle: string;
  contextMustContain: string[];
  policyChecks: Array<{
    command: string;
    mode: string;
    expectedAction: string;
    expectedState: 'allowed' | 'requested' | 'blocked';
    expectedOk: boolean;
  }>;
  evidence: {
    kind: 'test-log' | 'command-log' | 'diff-summary' | 'screenshot' | 'note';
    result: 'passed' | 'failed' | 'blocked' | 'unknown';
    summary: string;
    artifactFile: string;
  };
  handoff: {
    summary: string;
    next: string;
  };
}

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('Dogfooding E2E fixture', () => {
  it('replays context export through capsule evidence, handoff, policy, and done-level validation', () => {
    const fixture = readFixture();
    const root = tempProject();

    const initialContext = createContextExportReport(root);
    expect(initialContext).toMatchObject({
      schemaVersion: 'hadara.context.export.v1',
      command: 'context.export',
      ok: true,
      mode: 'memory',
      contextPath: null
    });
    for (const expectedText of fixture.contextMustContain) {
      expect(initialContext.content).toContain(expectedText);
    }

    const task = createTaskCapsule(root, fixture.taskTitle);
    writeTaskWorkPlan(task);

    const policyReports = fixture.policyChecks.map((check) => createPolicyCheckReport(check.command, check.mode));
    for (const [index, report] of policyReports.entries()) {
      const expected = fixture.policyChecks[index];
      expect(policyDecisionState(report.decision.action)).toBe(expected.expectedState);
      expect(report.decision.action).toBe(expected.expectedAction);
      expect(report.ok).toBe(expected.expectedOk);
    }

    const evidence = appendEvidenceTextArtifact(
      root,
      {
        taskId: task.id,
        kind: fixture.evidence.kind,
        summary: fixture.evidence.summary,
        result: fixture.evidence.result
      },
      {
        fileName: fixture.evidence.artifactFile,
        content: renderFixtureReport(fixture, task, initialContext.content, policyReports)
      }
    );
    const evidencePath = evidence.evidence.schemaVersion === 'hadara.evidence.v2' ? evidence.evidence.artifacts[0].path : evidence.evidence.evidencePath;
    expect(evidencePath).toMatch(/^artifacts\/test-log\/.+-dogfooding-fixture-report\.txt$/);
    assertGeneratedCapsuleFiles({ root, task, fixture, evidencePath: evidencePath ?? '' });

    writeProjectHandoff(root, task.id, fixture);
    expect(fs.readFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), 'utf8')).toContain(task.id);

    markTaskDone(task);
    markTaskBoardDone(root, task.id);
    markAcceptanceDone(task.dir);
    writeTaskHandoff(task.dir, fixture);
    assertCompletedCapsuleFiles({ root, task, fixture, evidencePath });

    const finalContext = createContextExportReport(root);
    expect(finalContext.content).toContain(task.id);
    expect(finalContext.content).toContain(fixture.handoff.summary);

    const doneValidation = validateTaskCapsule(root, task.id, { level: 'done' });
    expect(doneValidation).toMatchObject({
      schemaVersion: 'hadara.harness.validate.v1',
      command: 'harness.validate',
      ok: true,
      level: 'done',
      issues: []
    });
    expect(doneValidation.checkedFiles).toEqual(expect.arrayContaining([`tasks/${task.id}-dogfood-fixture-task/evidence.jsonl`, 'docs/TASK_BOARD.md']));
  });

  const builtCliPath = path.join(process.cwd(), 'dist', 'cli', 'main.js');
  const canSpawnNode = spawnSync(process.execPath, ['--version'], { encoding: 'utf8' }).error?.code !== 'EPERM';
  const runIfBuilt = fs.existsSync(builtCliPath) && canSpawnNode ? it : it.skip;

  runIfBuilt('smokes the dogfooding replay through built CLI JSON surfaces only', () => {
    const fixture = readFixture();
    const root = tempProject();
    const task = createTaskCapsule(root, fixture.taskTitle);
    writeTaskWorkPlan(task);

    const executedCommands: string[] = [];
    const contextReport = runBuiltCliJson(root, executedCommands, ['hermes', 'export-context', '--json']);
    expect(contextReport).toMatchObject({
      schemaVersion: 'hadara.hermes.export-context.v1',
      command: 'hermes.export-context',
      ok: true,
      output: {
        path: '.hadara/context/HADARA_CONTEXT.md'
      }
    });

    const taskReport = runBuiltCliJson(root, executedCommands, ['task', 'status', '--task', task.id, '--json']);
    expect(taskReport).toMatchObject({
      schemaVersion: 'hadara.task.status.summary.v1',
      command: 'task.status',
      ok: true,
      mode: 'selected-task',
      task: {
        title: fixture.taskTitle
      }
    });

    for (const check of fixture.policyChecks) {
      const policyReport = runBuiltCliJson(root, executedCommands, ['policy', 'preflight-shell', ...check.command.split(' '), '--mode', check.mode, '--json']);
      expect(policyDecisionState(policyReport.decision.action)).toBe(check.expectedState);
      expect(policyReport.decision.action).toBe(check.expectedAction);
      expect(policyReport.ok).toBe(check.expectedOk);
    }

    const evidenceReport = runBuiltCliJson(root, executedCommands, [
      'evidence',
      'add-command',
      '--task',
      task.id,
      '--summary',
      fixture.evidence.summary,
      '--result',
      fixture.evidence.result,
      '--json'
    ]);
    expect(evidenceReport).toMatchObject({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.add-command',
      ok: true,
      evidence: {
        taskId: task.id,
        legacy: { kind: 'command-log', result: fixture.evidence.result },
        outcome: fixture.evidence.result,
        visibility: 'public'
      },
      issues: []
    });

    const evidenceListReport = runBuiltCliJson(root, executedCommands, ['evidence', 'list', '--task', task.id, '--json']);
    expect(evidenceListReport).toMatchObject({
      schemaVersion: 'hadara.evidence.list.v1',
      command: 'evidence.list',
      ok: true,
      records: [
        {
          schemaVersion: 'hadara.evidence.v2',
          taskId: task.id,
          legacy: { kind: 'command-log', result: fixture.evidence.result },
          outcome: fixture.evidence.result,
          visibility: 'public'
        }
      ]
    });

    writeProjectHandoff(root, task.id, fixture);
    markTaskDone(task);
    markTaskBoardDone(root, task.id);
    markAcceptanceDone(task.dir);
    writeTaskHandoff(task.dir, fixture);

    const validationReport = runBuiltCliJson(root, executedCommands, ['harness', 'validate', '--task', task.id, '--level', 'done', '--json']);
    expect(validationReport).toMatchObject({
      schemaVersion: 'hadara.harness.validate.v1',
      command: 'harness.validate',
      ok: true,
      level: 'done',
      issues: []
    });

    expect(executedCommands).toEqual([
      'hermes export-context --json',
      `task status --task ${task.id} --json`,
      ...fixture.policyChecks.map((check) => `policy preflight-shell ${check.command} --mode ${check.mode} --json`),
      `evidence add-command --task ${task.id} --summary ${fixture.evidence.summary} --result ${fixture.evidence.result} --json`,
      `evidence list --task ${task.id} --json`,
      `harness validate --task ${task.id} --level done --json`
    ]);
    expect(executedCommands.some((command) => /^(run|mcp|release|dashboard)\b/.test(command))).toBe(false);
  });
});

function readFixture(): DogfoodingFixture {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'tests', 'fixtures', 'dogfooding', 'hadara-on-hadara-flow.json'), 'utf8'));
}

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-dogfood-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.mkdirSync(path.join(dir, '.hadara'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, '.hadara', 'scaffold.json'),
    JSON.stringify({ schemaVersion: 'hadara.scaffold.v1', hadaraProtocol: '0.4', profile: 'standard', createdWith: 'hadara@0.4.0' }, null, 2) + '\n',
    'utf8'
  );
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# AGENTS\n\nUse HADARA protocol.\n', 'utf8');
  fs.writeFileSync(
    path.join(dir, 'docs', 'PROJECT_STATE.md'),
    '# PROJECT_STATE\n\n## Current Status\n\n- Dogfooding fixture project\n',
    'utf8'
  );
  fs.writeFileSync(
    path.join(dir, 'docs', 'AGENT_HANDOFF.md'),
    '# AGENT_HANDOFF\n\n## Current State\n\n- Ready for dogfooding fixture\n',
    'utf8'
  );
  fs.writeFileSync(path.join(dir, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'HADARA_WORKFLOW.md'), '# HADARA_WORKFLOW\n\nAttach evidence before marking work complete.\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'ROADMAP.md'), '# ROADMAP\n\n## Current Freeze: v0.3 Operations Layer\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n\n| Order | Slice |\n|---|---|\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'CLI_JSON_CONTRACT.md'), '# CLI_JSON_CONTRACT\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'MCP_BRIDGE_CONTRACT.md'), '# MCP_BRIDGE_CONTRACT\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'MCP_EVIDENCE_ATTACH_CONTRACT.md'), '# MCP_EVIDENCE_ATTACH_CONTRACT\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'ARCHITECTURE.md'), '# ARCHITECTURE\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'SECURITY_MODEL.md'), '# SECURITY_MODEL\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'TEST_STRATEGY.md'), '# TEST_STRATEGY\n', 'utf8');
  return dir;
}

function writeProjectHandoff(root: string, taskId: string, fixture: DogfoodingFixture): void {
  fs.writeFileSync(
    path.join(root, 'docs', 'AGENT_HANDOFF.md'),
    [
      '# AGENT_HANDOFF',
      '',
      '## Current State',
      '',
      `| Task | Summary | Next |`,
      `|---|---|---|`,
      `| ${taskId} | ${fixture.handoff.summary} | ${fixture.handoff.next} |`,
      ''
    ].join('\n'),
    'utf8'
  );
}

function writeTaskWorkPlan(task: TaskCapsule): void {
  fs.writeFileSync(
    path.join(task.dir, 'TASK.md'),
    `# ${task.id} ${task.title}

## Identity

| Field | Value |
|---|---|
| ID | ${task.id} |
| Title | ${task.title} |
| Status | Draft |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

Replay a miniature HADARA-on-HADARA workflow.

## Source Documents

| Path | Role | Authority | Status | Source Hash | Notes |
|---|---|---|---|---|---|
| docs/HADARA_WORKFLOW.md | reference | reference-only | implemented | sha256:8954439e63eb4908133fc59794e66816cc8fa77fc7a1f75852dde1a424e7e63f | Evidence and handoff workflow. |

## Goal

| Goal | Notes |
|---|---|
| Replay a miniature HADARA-on-HADARA workflow. | Local-only deterministic fixture. |

## Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read exported HADARA context. | Pending | TBD |
| 2 | Check policy decisions without executing shell commands. | Pending | TBD |
| 3 | Attach public evidence and update handoff. | Pending | TBD |
| 4 | Run done-level harness validation. | Pending | TBD |

## Acceptance

| ID | Criterion | Required | Status | Evidence | Disposition | Reference |
|---|---|---:|---|---|---|---|
| AC-1 | Context export was read. | Yes | Pending | TBD | Required | fixture |
| AC-2 | Policy continuity was checked. | Yes | Pending | TBD | Required | fixture |
| AC-3 | Evidence was attached. | Yes | Pending | TBD | Required | fixture |
| AC-4 | Handoff was updated. | Yes | Pending | TBD | Required | fixture |
| AC-5 | Done-level harness validation passed. | Yes | Pending | TBD | Required | fixture |

## Validation

| Check | Command / Method | Required | Latest Result | Evidence |
|---|---|---:|---|---|
| Done-level harness validation | harness validate --level done | Yes | Not Run | TBD |

## Change Summary

| Path | Area | Change | Reason | Evidence |
|---|---|---|---|---|
| docs/AGENT_HANDOFF.md | handoff | Update fixture handoff summary. | Record workflow state. | TBD |
| EVIDENCE.md | evidence | Attach public fixture evidence. | Prove fixture workflow. | TBD |

## Risks / Follow-ups

| ID | Kind | Summary | State | Reference |
|---|---|---|---|---|
| RF-1 | Risk | Fixture accidentally implies real execution. | Mitigated | Policy assertions block shell/provider/MCP write/release commands. |
`,
    'utf8'
  );
  fs.writeFileSync(
    path.join(task.dir, 'ACCEPTANCE.md'),
    '# Acceptance Criteria\n\n- [ ] Context export was read.\n- [ ] Policy continuity was checked.\n- [ ] Evidence was attached.\n- [ ] Handoff was updated.\n- [ ] Done-level harness validation passed.\n',
    'utf8'
  );
  fs.writeFileSync(
    path.join(task.dir, 'PLAN.md'),
    '# Plan\n\n1. Read exported HADARA context.\n2. Create a temporary Task Capsule workflow.\n3. Check policy decisions without executing shell commands.\n4. Attach public evidence and update handoff.\n5. Run done-level harness validation.\n',
    'utf8'
  );
  fs.writeFileSync(
    path.join(task.dir, 'CONTEXT.md'),
    '# Context\n\nThis fixture proves a local HADARA-on-HADARA flow can move from context export to done-level validation without provider calls or shell execution.\n',
    'utf8'
  );
  fs.writeFileSync(
    path.join(task.dir, 'FILES.md'),
    '# Files\n\n| Path | Action | Reason |\n|---|---|---|\n| docs/AGENT_HANDOFF.md | Update | Record fixture handoff summary. |\n| EVIDENCE.md | Update | Attach public fixture evidence. |\n| evidence.jsonl | Update | Index public fixture evidence. |\n',
    'utf8'
  );
  fs.writeFileSync(
    path.join(task.dir, 'TESTS.md'),
    '# Tests\n\n## Required\n\n- Done-level harness validation for the fixture capsule\n- Policy decision assertions for allowed, requested, and blocked commands\n\n## Optional\n\n- Built CLI JSON-surface smoke when dist exists\n',
    'utf8'
  );
  fs.writeFileSync(
    path.join(task.dir, 'RISKS.md'),
    '# Risks\n\n| Risk | Mitigation |\n|---|---|\n| Fixture accidentally implies real execution | Assert no shell/provider/MCP write/release commands are used. |\n',
    'utf8'
  );
  fs.writeFileSync(
    path.join(task.dir, 'DECISIONS.md'),
    '# Decisions\n\n- Keep the dogfooding fixture deterministic and local-only.\n- Use existing CLI JSON surfaces instead of adding a public dogfooding command.\n',
    'utf8'
  );
}

function renderFixtureReport(
  fixture: DogfoodingFixture,
  task: TaskCapsule,
  context: string,
  policyReports: ReturnType<typeof createPolicyCheckReport>[]
): string {
  return [
    `Fixture: ${fixture.name}`,
    `Task: ${task.id}`,
    `Context bytes: ${Buffer.byteLength(context, 'utf8')}`,
    `Policy checks: ${policyReports.map((report) => `${report.input.command} -> ${report.decision.action}`).join(', ')}`,
    'Result: ready for done-level validation'
  ].join('\n');
}

function policyDecisionState(action: string): 'allowed' | 'requested' | 'blocked' {
  if (action === 'allow') return 'allowed';
  if (action === 'ask') return 'requested';
  if (action === 'deny') return 'blocked';
  throw new Error(`Unsupported policy action: ${action}`);
}

function assertGeneratedCapsuleFiles(input: { root: string; task: TaskCapsule; fixture: DogfoodingFixture; evidencePath?: string }): void {
  const taskMarkdown = fs.readFileSync(path.join(input.task.dir, 'TASK.md'), 'utf8');
  expect(taskMarkdown).toContain('Replay a miniature HADARA-on-HADARA workflow.');
  expect(taskMarkdown).toContain('| Status | Draft |');

  const evidenceMarkdown = fs.readFileSync(path.join(input.task.dir, 'EVIDENCE.md'), 'utf8');
  expect(evidenceMarkdown).toContain(input.fixture.evidence.summary);
  expect(evidenceMarkdown).toContain(input.fixture.evidence.result);

  const evidenceJsonl = fs.readFileSync(path.join(input.task.dir, 'evidence.jsonl'), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
  expect(evidenceJsonl).toHaveLength(1);
  expect(evidenceJsonl[0]).toMatchObject({
    schemaVersion: 'hadara.evidence.v2',
    taskId: input.task.id,
    summary: input.fixture.evidence.summary,
    outcome: input.fixture.evidence.result,
    visibility: 'public',
    artifacts: [{ path: input.evidencePath, visibility: 'public', artifactType: input.fixture.evidence.kind }],
    legacy: { kind: input.fixture.evidence.kind, result: input.fixture.evidence.result, evidencePath: input.evidencePath }
  });

  expect(input.evidencePath).toBeDefined();
  expect(fs.readFileSync(path.join(input.task.dir, input.evidencePath ?? ''), 'utf8')).toContain(`Task: ${input.task.id}`);
  expect(fs.readFileSync(path.join(input.root, 'docs', 'TASK_BOARD.md'), 'utf8')).toContain(`| ${input.task.id} | ${input.fixture.taskTitle} | Draft |`);
}

function assertCompletedCapsuleFiles(input: { root: string; task: TaskCapsule; fixture: DogfoodingFixture; evidencePath?: string }): void {
  const taskMarkdown = fs.readFileSync(path.join(input.task.dir, 'TASK.md'), 'utf8');
  expect(taskMarkdown).toContain('| Status | Done |');

  const handoffMarkdown = fs.readFileSync(path.join(input.task.dir, 'HANDOFF.md'), 'utf8');
  expect(handoffMarkdown).toContain(input.fixture.handoff.summary);
  expect(handoffMarkdown).toContain(input.fixture.handoff.next);

  const evidenceMarkdown = fs.readFileSync(path.join(input.task.dir, 'EVIDENCE.md'), 'utf8');
  expect(evidenceMarkdown).toContain(input.fixture.evidence.summary);
  expect(evidenceMarkdown).toContain(`ev:${input.task.id}:`);

  const evidenceRecord = JSON.parse(fs.readFileSync(path.join(input.task.dir, 'evidence.jsonl'), 'utf8').trim());
  expect(evidenceRecord).toMatchObject({
    schemaVersion: 'hadara.evidence.v2',
    taskId: input.task.id,
    legacy: { kind: input.fixture.evidence.kind, result: input.fixture.evidence.result, evidencePath: input.evidencePath },
    outcome: input.fixture.evidence.result,
    visibility: 'public',
    artifacts: [{ path: input.evidencePath, visibility: 'public', artifactType: input.fixture.evidence.kind }]
  });

  expect(fs.readFileSync(path.join(input.root, 'docs', 'AGENT_HANDOFF.md'), 'utf8')).toContain(input.task.id);
  expect(fs.readFileSync(path.join(input.root, 'docs', 'TASK_BOARD.md'), 'utf8')).toContain(`| ${input.task.id} | ${input.fixture.taskTitle} | Done |`);
}

function runBuiltCliJson(projectRoot: string, executedCommands: string[], args: string[]): any {
  executedCommands.push(args.join(' '));
  const result = spawnSync(process.execPath, [path.join(process.cwd(), 'dist', 'cli', 'main.js'), ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: {
      ...process.env,
      HADARA_PROJECT_ROOT: projectRoot
    }
  });
  expect(result.error).toBeUndefined();
  expect(result.stderr).toBe('');
  expect(result.stdout.trim()).not.toBe('');
  return JSON.parse(result.stdout);
}

function markTaskDone(task: TaskCapsule): void {
  const taskPath = path.join(task.dir, 'TASK.md');
  const content = fs
    .readFileSync(taskPath, 'utf8')
    .replace('| Status | Draft |', '| Status | Done |')
    .replace('| Updated | 2026-06-02 |', '| Updated | 2026-06-02 |')
    .replace('| Pending | TBD | Required | fixture |', '| Met | Dogfooding fixture. | Required | fixture |')
    .replace('| Not Run | TBD |', '| Passed | Dogfooding fixture. |')
    .concat('\n## History\n\n| Date | State | Note |\n|---|---|---|\n| 2026-06-02 | Done | Dogfooding fixture completed. |\n');
  fs.writeFileSync(taskPath, `${content.trimEnd()}\n`, 'utf8');
}

function markTaskBoardDone(projectRoot: string, taskId: string): void {
  const taskBoardPath = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  const updated = fs
    .readFileSync(taskBoardPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => {
      if (!line.startsWith(`| ${taskId} |`)) return line;
      const cells = line
        .slice(1, line.endsWith('|') ? -1 : undefined)
        .split('|')
        .map((cell) => cell.trim());
      cells[2] = 'Done';
      return `| ${cells.join(' | ')} |`;
    })
    .join('\n');
  fs.writeFileSync(taskBoardPath, updated, 'utf8');
}

function markAcceptanceDone(taskDir: string): void {
  const acceptancePath = path.join(taskDir, 'ACCEPTANCE.md');
  fs.writeFileSync(acceptancePath, fs.readFileSync(acceptancePath, 'utf8').replace(/- \[ \]/g, '- [x]'), 'utf8');
}

function writeTaskHandoff(taskDir: string, fixture: DogfoodingFixture): void {
  fs.writeFileSync(
    path.join(taskDir, 'HANDOFF.md'),
    `# Handoff

## Last Completed

${fixture.handoff.summary}

## Next Recommended Step

${fixture.handoff.next}
`,
    'utf8'
  );
}
