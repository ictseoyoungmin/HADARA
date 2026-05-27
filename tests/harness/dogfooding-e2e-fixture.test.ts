import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
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
      expect(report.decision.action).toBe(fixture.policyChecks[index].expectedAction);
      expect(report.ok).toBe(true);
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
