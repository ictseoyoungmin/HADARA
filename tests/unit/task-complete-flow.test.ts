import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { appendEvidence } from '../../src/evidence/evidence';
import { handleTaskCommand } from '../../src/cli/task';
import { createTaskCloseReport } from '../../src/task/task-close';
import { createTaskCompleteFlowReport } from '../../src/task/task-complete-flow';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-complete-flow-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('task complete flow report', () => {
  it('summarizes the next finish action for a draft task without writing files', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Complete draft');
    const before = snapshotFiles(root);

    const report = createTaskCompleteFlowReport(root, task.id);

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.complete_flow.v1',
      command: 'task.complete',
      ok: false,
      readOnly: true,
      taskId: task.id,
      actor: { agentId: 'unknown', runId: 'local', role: 'operator', parentRunId: null },
      stage: 'finish-required',
      primaryNextAction: {
        id: 'execute-finish',
        command: `hadara task finish --task ${task.id} --execute --json`,
        writeBoundary: 'task-local',
        recommendedActorRole: 'worker'
      }
    });
    expect(report.nextActions).toHaveLength(1);
    expect(report.steps.find((step) => step.id === 'finish')).toMatchObject({ status: 'required', sourceReport: 'hadara.task.finish.v1' });
    expect(validateSchema('hadara.task.complete_flow.v1', report).ok).toBe(true);
  });

  it('surfaces shared-doc pending state as coordinator-oriented after finish bookkeeping is current', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Shared docs pending');
    completeTask(root, task.id, task.dir);

    const report = createTaskCompleteFlowReport(root, task.id);

    expect(report.stage).toBe('handoff-update-suggested');
    expect(report.stateDocs).toEqual({ pending: 0, missing: 3, current: 0, recommendedActorRole: 'coordinator' });
    expect(report.primaryNextAction).toMatchObject({
      id: 'update-state-docs',
      recommendedActorRole: 'coordinator',
      writeBoundary: 'shared-doc',
      requiresBeforeHash: true,
      stalePlanRisk: 'medium'
    });
    expect(report.conflicts).toContainEqual(expect.objectContaining({ code: 'SHARED_DOC_PENDING', severity: 'warning' }));
  });

  it('reports close-required when ready but close evidence has not been appended', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close required');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);

    const report = createTaskCompleteFlowReport(root, task.id);

    expect(report.stage).toBe('close-required');
    expect(report.primaryNextAction).toMatchObject({
      id: 'append-close-evidence',
      command: `hadara task close --task ${task.id} --execute --json`,
      writeBoundary: 'evidence-append'
    });
    expect(report.nextActions).toHaveLength(1);
  });

  it('reports complete after close evidence is appended and audit matches current hashes', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Complete closed');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const closePlan = createTaskCloseReport(root, task.id, 'dry-run');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: closePlan.closeEvidence.summary,
      result: 'passed',
      visibility: 'public'
    });

    const report = createTaskCompleteFlowReport(root, task.id);

    expect(report.ok).toBe(true);
    expect(report.stage).toBe('complete');
    expect(report.primaryNextAction).toBeUndefined();
    expect(report.nextActions).toEqual([]);
    expect(report.steps.every((step) => step.status === 'passed')).toBe(true);
    expect(validateSchema('hadara.task.complete_flow.v1', report).ok).toBe(true);
  });

  it('rejects execute requests with the task complete schema instead of mutating state', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'No execute');
    const before = snapshotFiles(root);

    const report = createTaskCompleteFlowReport(root, task.id, { executeRequested: true });

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({
      ok: false,
      readOnly: true,
      stage: 'blocked',
      issues: [
        {
          severity: 'error',
          code: 'TASK_COMPLETE_EXECUTE_UNSUPPORTED'
        }
      ]
    });
    expect(report.primaryNextAction).toBeUndefined();
    expect(validateSchema('hadara.task.complete_flow.v1', report).ok).toBe(true);
  });

  it('routes the CLI task complete command through the read-only report', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI complete');
    const writes: string[] = [];
    const originalLog = console.log;
    console.log = (message?: unknown) => {
      writes.push(String(message));
    };
    try {
      expect(handleTaskCommand({ args: ['task', 'complete', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }
    const report = JSON.parse(writes.join('\n'));

    expect(report.schemaVersion).toBe('hadara.task.complete_flow.v1');
    expect(report.command).toBe('task.complete');
    expect(report.readOnly).toBe(true);
    expect(report.stage).toBe('finish-required');
    expect(process.exitCode).toBe(6);
  });

  it('threads explicit actor CLI options into task complete reports', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI complete actor');
    const writes: string[] = [];
    const originalLog = console.log;
    console.log = (message?: unknown) => {
      writes.push(String(message));
    };
    try {
      expect(
        handleTaskCommand({
          args: ['task', 'complete', '--task', task.id, '--agent-id', 'coord-2', '--run-id', 'run-complete', '--actor-role', 'coordinator', '--json'],
          projectRoot: root,
          jsonOutput: true
        })
      ).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const report = JSON.parse(writes.join('\n'));
    expect(report.actor).toEqual({ agentId: 'coord-2', runId: 'run-complete', role: 'coordinator', parentRunId: null });
  });
});

function snapshotFiles(root: string): Record<string, string> {
  const files: Record<string, string> = {};
  walk(root, (filePath) => {
    files[toPortablePath(path.relative(root, filePath))] = fs.readFileSync(filePath, 'utf8');
  });
  return files;
}

function walk(dir: string, visit: (filePath: string) => void): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, visit);
    if (entry.isFile()) visit(fullPath);
  }
}

function completeTask(root: string, taskId: string, taskDir: string): void {
  fs.writeFileSync(
    path.join(taskDir, 'TASK.md'),
    fs
      .readFileSync(path.join(taskDir, 'TASK.md'), 'utf8')
      .replace(/\| Status \| Draft \|/g, '| Status | Done |')
      .replace('| Created | TBD |', '| Created | 2026-06-05 |')
      .replace('| Updated | TBD |', '| Updated | 2026-06-05 |')
      .replace(/\nDraft\n/, '\nDone\n')
      .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Exercise task complete flow. | Fixture verifies completion flow. |')
      .replace('| TBD | TBD |', '| Complete fixture capsule. | Needed for done-level validation. |')
      .replace('| TBD | TBD |', '| Broad workflow mutation. | Outside fixture scope. |')
      .replace('| TBD | Draft | Initial task scaffold. | TBD |', '| 2026-06-05T00:00:00.000Z | Done | Fixture complete. | Evidence. |'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'TASK_BOARD.md'),
    fs
      .readFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), 'utf8')
      .split(/\r?\n/)
      .map((line) => (line.startsWith(`| ${taskId} |`) ? line.replace('| Draft |', '| Done |') : line))
      .join('\n'),
    'utf8'
  );
  fs.writeFileSync(path.join(taskDir, 'PLAN.md'), '# Plan\n\n| Step | Action | Status | Evidence |\n|---|---|---|---|\n| 1 | Complete fixture. | Done | Fixture. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'CONTEXT.md'), '# Context\n\n## Required Reading Used\n\n| Document | Why It Matters | Read Status |\n|---|---|---|\n| docs/TASK_BOARD.md | Fixture. | Read |\n\n## Assumptions\n\n| Assumption | Source | Risk If Wrong |\n|---|---|---|\n| Fixture is complete. | Test | Low. |\n\n## Constraints\n\n| Constraint | Source | Notes |\n|---|---|---|\n| Read-only complete report. | Test | No writes. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'FILES.md'), '# Files\n\n| Path | Action | Reason | Status |\n|---|---|---|---|\n| src/task/task-complete-flow.ts | Add | Complete flow report. | Done |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'ACCEPTANCE.md'), '# Acceptance Criteria\n\n| ID | Criterion | Status | Evidence |\n|---|---|---|\n| AC-1 | Fixture complete. | Met | Evidence. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'TESTS.md'), '# Tests\n\n## Routine Checks\n\n| Command | Purpose | Required For Done | Latest Result | Evidence |\n|---|---|---|---|---|\n| Fixture | Exercise complete flow. | Yes | Passed | Evidence. |\n\n## Special Checks\n\n| Check | Required? | Reason | Latest Result | Evidence |\n|---|---|---|---|---|\n| None | No | Fixture. | Not Run | Not applicable. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'RISKS.md'), '# Risks\n\n| Risk | Impact | Likelihood | Mitigation | Status |\n|---|---|---|---|---|\n| Fixture drift | Low | Low | Keep local. | Mitigated |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'DECISIONS.md'), '# Decisions\n\n| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n| D-1 | Use read-model composition. | Accepted | Test shared lifecycle reports. | Test. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'HANDOFF.md'), '# Handoff\n\n## Current State\n\n| Field | Value |\n|---|---|\n| Status | Done |\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| Fixture complete. | Evidence. |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| Continue. | Done. | docs/TASK_BOARD.md |\n', 'utf8');
  appendEvidence(root, { taskId, kind: 'test-log', summary: 'Complete-flow fixture validation passed.', result: 'passed', visibility: 'public' });
}

function markStateDocsCurrent(root: string, taskId: string): void {
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), `# Development Slices\n\n| ID | Task |\n|---|---|\n| 1 | ${taskId} |\n`, 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), `# Project State\n\nLatest completed task: ${taskId}.\n`, 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# Agent Handoff\n\nActive task context includes ${taskId}.\n`, 'utf8');
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
