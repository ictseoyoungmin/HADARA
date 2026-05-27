import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import { createContextExportReport } from '../../src/hermes/context-export';
import { appendEvidenceTextArtifact } from '../../src/evidence/evidence';
import { validateTaskCapsule } from '../../src/harness/validate';
import { updateHandoff } from '../../src/handoff/handoff';
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
    expect(evidence.evidence.evidencePath).toMatch(/^artifacts\/test-log\/.+-dogfooding-fixture-report\.txt$/);
    assertGeneratedCapsuleFiles({ root, task, fixture, evidencePath: evidence.evidence.evidencePath });

    updateHandoff({
      projectRoot: root,
      taskId: task.id,
      summary: fixture.handoff.summary,
      nextStep: fixture.handoff.next
    });
    expect(fs.readFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), 'utf8')).toContain(task.id);

    markTaskDone(task);
    markTaskBoardDone(root, task.id);
    markAcceptanceDone(task.dir);
    writeTaskHandoff(task.dir, fixture);
    assertCompletedCapsuleFiles({ root, task, fixture, evidencePath: evidence.evidence.evidencePath });

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
  const runIfBuilt = fs.existsSync(builtCliPath) ? it : it.skip;

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

    const taskReport = runBuiltCliJson(root, executedCommands, ['task', 'show', task.id, '--json']);
    expect(taskReport).toMatchObject({
      schemaVersion: 'hadara.task.show.v1',
      command: 'task.show',
      ok: true,
      task: {
        id: task.id,
        title: fixture.taskTitle
      }
    });

    for (const check of fixture.policyChecks) {
      const policyReport = runBuiltCliJson(root, executedCommands, ['policy', 'check-shell', ...check.command.split(' '), '--mode', check.mode, '--json']);
      expect(policyDecisionState(policyReport.decision.action)).toBe(check.expectedState);
      expect(policyReport.decision.action).toBe(check.expectedAction);
      expect(policyReport.ok).toBe(check.expectedOk);
    }

    const evidenceReport = runBuiltCliJson(root, executedCommands, [
      'evidence',
      'collect',
      '--task',
      task.id,
      '--kind',
      fixture.evidence.kind,
      '--summary',
      fixture.evidence.summary,
      '--result',
      fixture.evidence.result,
      '--json'
    ]);
    expect(evidenceReport).toMatchObject({
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.collect',
      ok: true,
      evidence: {
        taskId: task.id,
        kind: fixture.evidence.kind,
        result: fixture.evidence.result,
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
          taskId: task.id,
          kind: fixture.evidence.kind,
          result: fixture.evidence.result,
          visibility: 'public'
        }
      ]
    });

    const handoffPreflight = runBuiltCliJson(root, executedCommands, ['write', 'preflight', 'handoff', 'update', '--task', task.id, '--json']);
    expect(handoffPreflight).toMatchObject({
      schemaVersion: 'hadara.write.preflight.v1',
      command: 'handoff.update',
      ok: true,
      writes: ['docs/AGENT_HANDOFF.md']
    });

    updateHandoff({
      projectRoot: root,
      taskId: task.id,
      summary: fixture.handoff.summary,
      nextStep: fixture.handoff.next
    });
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
      `task show ${task.id} --json`,
      ...fixture.policyChecks.map((check) => `policy check-shell ${check.command} --mode ${check.mode} --json`),
      `evidence collect --task ${task.id} --kind ${fixture.evidence.kind} --summary ${fixture.evidence.summary} --result ${fixture.evidence.result} --json`,
      `evidence list --task ${task.id} --json`,
      `write preflight handoff update --task ${task.id} --json`,
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
  fs.writeFileSync(path.join(dir, 'docs', 'IMPLEMENTATION_SOP.md'), '# IMPLEMENTATION_SOP\n\nAttach evidence before marking work complete.\n', 'utf8');
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

function writeTaskWorkPlan(task: TaskCapsule): void {
  fs.writeFileSync(
    path.join(task.dir, 'TASK.md'),
    `# ${task.id} ${task.title}

## Goal

Replay a miniature HADARA-on-HADARA workflow.

## Scope

- Read context export guidance.
- Check policy for the validation command.
- Attach evidence.
- Update handoff.
- Pass done-level harness validation.

## Out of Scope

- Real shell execution.
- Provider calls.
- MCP writes.

## Status

Draft
`,
    'utf8'
  );
  fs.writeFileSync(
    path.join(task.dir, 'ACCEPTANCE.md'),
    '# Acceptance Criteria\n\n- [ ] Context export was read.\n- [ ] Policy continuity was checked.\n- [ ] Evidence was attached.\n- [ ] Handoff was updated.\n- [ ] Done-level harness validation passed.\n',
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
  expect(taskMarkdown).toContain('## Status\n\nDraft');

  const evidenceMarkdown = fs.readFileSync(path.join(input.task.dir, 'EVIDENCE.md'), 'utf8');
  expect(evidenceMarkdown).toContain(input.fixture.evidence.summary);
  expect(evidenceMarkdown).toContain(input.fixture.evidence.result);

  const evidenceJsonl = fs.readFileSync(path.join(input.task.dir, 'evidence.jsonl'), 'utf8').trim().split(/\r?\n/).map(JSON.parse);
  expect(evidenceJsonl).toHaveLength(1);
  expect(evidenceJsonl[0]).toMatchObject({
    schemaVersion: 'hadara.evidence.v1',
    taskId: input.task.id,
    kind: input.fixture.evidence.kind,
    summary: input.fixture.evidence.summary,
    result: input.fixture.evidence.result,
    visibility: 'public',
    evidencePath: input.evidencePath
  });

  expect(input.evidencePath).toBeDefined();
  expect(fs.readFileSync(path.join(input.task.dir, input.evidencePath ?? ''), 'utf8')).toContain(`Task: ${input.task.id}`);
  expect(fs.readFileSync(path.join(input.root, 'docs', 'TASK_BOARD.md'), 'utf8')).toContain(`| ${input.task.id} | ${input.fixture.taskTitle} | Draft |`);
}

function assertCompletedCapsuleFiles(input: { root: string; task: TaskCapsule; fixture: DogfoodingFixture; evidencePath?: string }): void {
  const taskMarkdown = fs.readFileSync(path.join(input.task.dir, 'TASK.md'), 'utf8');
  expect(taskMarkdown).toContain('## Status\n\nDone');

  const handoffMarkdown = fs.readFileSync(path.join(input.task.dir, 'HANDOFF.md'), 'utf8');
  expect(handoffMarkdown).toContain(input.fixture.handoff.summary);
  expect(handoffMarkdown).toContain(input.fixture.handoff.next);

  const evidenceMarkdown = fs.readFileSync(path.join(input.task.dir, 'EVIDENCE.md'), 'utf8');
  expect(evidenceMarkdown).toContain(input.evidencePath);

  const evidenceRecord = JSON.parse(fs.readFileSync(path.join(input.task.dir, 'evidence.jsonl'), 'utf8').trim());
  expect(evidenceRecord).toMatchObject({
    taskId: input.task.id,
    kind: input.fixture.evidence.kind,
    result: input.fixture.evidence.result,
    visibility: 'public',
    evidencePath: input.evidencePath
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
  fs.writeFileSync(taskPath, fs.readFileSync(taskPath, 'utf8').replace(/\nDraft\n$/, '\nDone\n'), 'utf8');
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
