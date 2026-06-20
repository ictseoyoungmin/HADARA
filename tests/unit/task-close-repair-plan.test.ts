import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleTaskCommand } from '../../src/cli/task';
import { validateSchema } from '../../src/core/schema';
import { appendEvidence } from '../../src/evidence/evidence';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTaskCloseReport } from '../../src/task/task-close';
import { createTaskCloseRepairPlanReport } from '../../src/task/task-close-repair-plan';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-close-repair-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('task close repair plan', () => {
  it('classifies missing close evidence as not-closed without writing files', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Repair missing close');
    completeTask(root, task.id, task.dir);
    const before = snapshotFiles(root);

    const report = createTaskCloseRepairPlanReport(root, task.id);

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.closeRepairPlan.v1',
      command: 'task.close-repair-plan',
      ok: true,
      readOnly: true,
      classification: 'not-closed',
      repairNeeded: true,
      evidence: { closeEvidenceFound: false, closeEvidenceValid: false },
      primaryNextAction: {
        id: 'review-close-plan',
        command: `hadara task close --task ${task.id} --json`,
        writeBoundary: 'read-only'
      }
    });
    expect(report.causes).toContainEqual(expect.objectContaining({ code: 'CLOSE_REPAIR_NOT_CLOSED' }));
    expect(validateSchema('hadara.task.closeRepairPlan.v1', report).ok).toBe(true);
  });

  it('classifies stale close evidence after close-source drift', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Repair stale close');
    completeTask(root, task.id, task.dir);
    appendCloseEvidence(root, task.id);
    fs.appendFileSync(path.join(task.dir, 'PLAN.md'), '| 2 | Drift after close. | Done | Drift. |\n', 'utf8');

    const report = createTaskCloseRepairPlanReport(root, task.id);

    expect(report.classification).toBe('closed-stale');
    expect(report.evidence.sourceHashMatches).toBe(false);
    expect(report.causes).toContainEqual(expect.objectContaining({ code: 'CLOSE_REPAIR_SOURCE_HASH_DRIFT' }));
    expect(report.primaryNextAction).toMatchObject({ id: 'review-close-plan', command: `hadara task close --task ${task.id} --json` });
  });

  it('classifies failed close-like evidence as closed-invalid', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Repair invalid close');
    completeTask(root, task.id, task.dir);
    const closePlan = createTaskCloseReport(root, task.id, 'dry-run');
    appendEvidence(root, {
      taskId: task.id,
      kind: 'command-log',
      summary: closePlan.closeEvidence.summary,
      result: 'failed',
      visibility: 'public'
    });

    const report = createTaskCloseRepairPlanReport(root, task.id);

    expect(report.classification).toBe('closed-invalid');
    expect(report.evidence.closeEvidenceValid).toBe(false);
    expect(report.causes).toContainEqual(expect.objectContaining({ code: 'CLOSE_REPAIR_INVALID_PROOF' }));
  });

  it('classifies duplicate close proofs separately from valid proofs', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Repair duplicate close');
    completeTask(root, task.id, task.dir);
    appendCloseEvidence(root, task.id);
    appendCloseEvidence(root, task.id);

    const report = createTaskCloseRepairPlanReport(root, task.id);

    expect(report.classification).toBe('duplicate-close-proof');
    expect(report.evidence.duplicateCloseEvidenceCount).toBe(1);
    expect(report.causes).toContainEqual(expect.objectContaining({ code: 'CLOSE_REPAIR_DUPLICATE_PROOF' }));
  });

  it('classifies current close evidence as closed-valid', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Repair valid close');
    completeTask(root, task.id, task.dir);
    appendCloseEvidence(root, task.id);

    const report = createTaskCloseRepairPlanReport(root, task.id);

    expect(report.classification).toBe('closed-valid');
    expect(report.repairNeeded).toBe(false);
    expect(report.nextActions).toEqual([]);
    expect(report.causes).toContainEqual(expect.objectContaining({ code: 'CLOSE_REPAIR_NOT_NEEDED' }));
  });

  it('routes the CLI task close-repair-plan command through the read-only report', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI close repair');
    completeTask(root, task.id, task.dir);
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (message?: unknown) => {
      output.push(String(message));
    };
    try {
      expect(handleTaskCommand({ args: ['task', 'close-repair-plan', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const report = JSON.parse(output.join('\n'));
    expect(report.schemaVersion).toBe('hadara.task.closeRepairPlan.v1');
    expect(report.command).toBe('task.close-repair-plan');
    expect(report.classification).toBe('not-closed');
    expect(process.exitCode).toBeUndefined();
  });
});

function appendCloseEvidence(root: string, taskId: string): void {
  const closePlan = createTaskCloseReport(root, taskId, 'dry-run');
  appendEvidence(root, {
    taskId,
    kind: 'command-log',
    summary: closePlan.closeEvidence.summary,
    result: 'passed',
    visibility: 'public'
  });
}

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
      .replace('| Created | TBD |', '| Created | 2026-06-02 |')
      .replace('| Updated | TBD |', '| Updated | 2026-06-02 |')
      .replace(/\nDraft\n/, '\nDone\n')
      .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Exercise close repair planning. | Fixture verifies close repair state. |')
      .replace('| TBD | TBD |', '| Complete fixture documents. | Needed for done-level validation. |')
      .replace('| TBD | TBD |', '| Broad workflow mutation. | Outside fixture scope. |')
      .replace('| TBD | Draft | Initial task scaffold. | TBD |', '| 2026-06-02T00:00:00.000Z | Done | Fixture complete. | Evidence. |'),
    'utf8'
  );
  updateTaskBoardDone(root, taskId);
  fs.writeFileSync(path.join(taskDir, 'PLAN.md'), '# Plan\n\n| Step | Action | Status | Evidence |\n|---|---|---|---|\n| 1 | Complete fixture. | Done | Fixture. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'CONTEXT.md'), '# Context\n\n## Required Reading Used\n\n| Document | Why It Matters | Read Status |\n|---|---|---|\n| docs/TASK_BOARD.md | Fixture. | Read |\n\n## Assumptions\n\n| Assumption | Source | Risk If Wrong |\n|---|---|---|\n| Fixture is complete. | Test | Low. |\n\n## Constraints\n\n| Constraint | Source | Notes |\n|---|---|---|\n| Read-only repair plan. | Test | No writes. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'FILES.md'), '# Files\n\n| Path | Action | Reason | Status |\n|---|---|---|---|\n| src/task/task-close-repair-plan.ts | Add | Repair plan. | Done |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'ACCEPTANCE.md'), '# Acceptance Criteria\n\n| ID | Criterion | Status | Evidence |\n|---|---|---|---|\n| AC-1 | Fixture complete. | Met | Evidence. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'TESTS.md'), '# Tests\n\n## Routine Checks\n\n| Command | Purpose | Required For Done | Latest Result | Evidence |\n|---|---|---|---|---|\n| Fixture | Exercise repair plan. | Yes | Passed | Evidence. |\n\n## Special Checks\n\n| Check | Required? | Reason | Latest Result | Evidence |\n|---|---|---|---|---|\n| None | No | Fixture. | Not Run | Not applicable. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'RISKS.md'), '# Risks\n\n| Risk | Impact | Likelihood | Mitigation | Status |\n|---|---|---|---|---|\n| Fixture drift | Low | Low | Keep local. | Mitigated |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'DECISIONS.md'), '# Decisions\n\n| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n| D-1 | Use fixture. | Accepted | Test repair plan. | Test. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'HANDOFF.md'), '# Handoff\n\n## Current State\n\n| Field | Value |\n|---|---|\n| Status | Done |\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| Fixture complete. | Evidence. |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| Continue. | Done. | docs/TASK_BOARD.md |\n', 'utf8');
  appendEvidence(root, { taskId, kind: 'test-log', summary: 'Close-ready fixture validation passed.', result: 'passed', visibility: 'public' });
}

function updateTaskBoardDone(root: string, taskId: string): void {
  const taskBoard = path.join(root, 'docs', 'TASK_BOARD.md');
  fs.writeFileSync(
    taskBoard,
    fs
      .readFileSync(taskBoard, 'utf8')
      .split(/\r?\n/)
      .map((line) => (line.startsWith(`| ${taskId} |`) ? line.replace('| Draft |', '| Done |') : line))
      .join('\n'),
    'utf8'
  );
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
