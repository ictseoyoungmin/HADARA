import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleTaskCommand } from '../../src/cli/task';
import { validateSchema } from '../../src/core/schema';
import { appendEvidence } from '../../src/evidence/evidence';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTaskFinalizeReport } from '../../src/task/task-finalize';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-finalize-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('task finalize dry-run plan', () => {
  it('returns a read-only finish-required plan with a stable plan hash for a draft task', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize draft');
    const before = snapshotFiles(root);

    const report = createTaskFinalizeReport(root, task.id);
    const second = createTaskFinalizeReport(root, task.id);

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.finalize.v1',
      command: 'task.finalize',
      ok: false,
      readOnly: true,
      mode: 'dry-run',
      taskId: task.id,
      summary: { steps: 4, required: 1, blocked: 0, executeSupported: true },
      primaryNextAction: {
        id: 'finalize-finish',
        command: `hadara task finish --task ${task.id} --execute --json`,
        writeBoundary: 'task-local'
      }
    });
    expect(report.planHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(second.planHash).toBe(report.planHash);
    expect(report.steps.map((step) => step.id)).toEqual(['finish', 'ready', 'close', 'audit-close']);
    expect(report.steps.find((step) => step.id === 'finish')).toMatchObject({
      status: 'required',
      mode: 'execute',
      writeBoundary: 'task-local',
      expectedWritePaths: expect.arrayContaining([`tasks/${task.id}-finalize-draft/TASK.md`, 'docs/TASK_BOARD.md'])
    });
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('plans close evidence append after finish, state docs, and readiness are satisfied', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize close');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);

    const report = createTaskFinalizeReport(root, task.id);

    expect(report.ok).toBe(false);
    expect(report.summary).toMatchObject({ required: 1, blocked: 0, satisfied: 2 });
    expect(report.primaryNextAction).toMatchObject({ id: 'finalize-close', command: `hadara task close --task ${task.id} --execute --json`, writeBoundary: 'evidence-append' });
    expect(report.steps.find((step) => step.id === 'close')).toMatchObject({
      status: 'required',
      mode: 'execute',
      writeBoundary: 'evidence-append',
      expectedWritePaths: [`tasks/${task.id}-finalize-close/evidence.jsonl`],
      alreadySatisfied: false
    });
  });

  it('refuses execute without a reviewed plan hash and does not write', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize execute refused');
    const before = snapshotFiles(root);

    const report = createTaskFinalizeReport(root, task.id, { executeRequested: true });

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({
      ok: false,
      readOnly: true,
      mode: 'execute-refused',
      summary: { executeSupported: true },
      issues: [{ severity: 'error', code: 'TASK_FINALIZE_PLAN_HASH_REQUIRED' }]
    });
    expect(report.planHash).toMatch(/^sha256:/);
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('refuses execute when the reviewed plan hash is stale and does not write', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize stale hash');
    const before = snapshotFiles(root);

    const report = createTaskFinalizeReport(root, task.id, { executeRequested: true, planHash: 'sha256:0000000000000000000000000000000000000000000000000000000000000000' });

    expect(snapshotFiles(root)).toEqual(before);
    expect(report).toMatchObject({
      ok: false,
      readOnly: true,
      mode: 'execute-refused',
      execution: {
        requestedPlanHash: 'sha256:0000000000000000000000000000000000000000000000000000000000000000',
        planHashMatched: false,
        executedSteps: []
      },
      issues: [{ severity: 'error', code: 'TASK_FINALIZE_PLAN_HASH_MISMATCH' }]
    });
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('executes matching finish then stops before close when readiness blocks', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize stop on blocker');
    const plan = createTaskFinalizeReport(root, task.id);

    const report = createTaskFinalizeReport(root, task.id, { executeRequested: true, planHash: plan.planHash });

    expect(report).toMatchObject({
      ok: false,
      readOnly: false,
      mode: 'execute',
      execution: {
        requestedPlanHash: plan.planHash,
        planHashMatched: true,
        stoppedAt: 'ready'
      }
    });
    expect(report.execution?.executedSteps.map((step) => step.id)).toEqual(['finish', 'ready']);
    expect(report.execution?.executedSteps[0]).toMatchObject({ id: 'finish', status: 'executed', ok: true, writeBoundary: 'task-local' });
    expect(report.execution?.executedSteps[1]).toMatchObject({ id: 'ready', status: 'blocked', ok: false, writeBoundary: 'read-only' });
    expect(snapshotFiles(root)[`tasks/${task.id}-finalize-stop-on-blocker/evidence.jsonl`]).not.toContain('Task close validation');
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('executes matching close evidence append and returns closed-valid after audit', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Finalize execute close');
    completeTask(root, task.id, task.dir);
    markStateDocsCurrent(root, task.id);
    const plan = createTaskFinalizeReport(root, task.id);

    const report = createTaskFinalizeReport(root, task.id, { executeRequested: true, planHash: plan.planHash });

    expect(report).toMatchObject({
      ok: true,
      readOnly: false,
      mode: 'execute',
      summary: { required: 0, blocked: 0, satisfied: 4 },
      execution: {
        requestedPlanHash: plan.planHash,
        planHashMatched: true
      },
      steps: expect.arrayContaining([
        expect.objectContaining({ id: 'close', status: 'satisfied' }),
        expect.objectContaining({ id: 'audit-close', status: 'satisfied' })
      ])
    });
    expect(report.execution?.executedSteps.map((step) => step.id)).toEqual(['finish', 'ready', 'close', 'audit-close']);
    expect(report.execution?.executedSteps.find((step) => step.id === 'close')).toMatchObject({ status: 'executed', ok: true, writeBoundary: 'evidence-append' });
    expect(snapshotFiles(root)[`tasks/${task.id}-finalize-execute-close/evidence.jsonl`]).toContain('Task close validation');
    expect(validateSchema('hadara.task.finalize.v1', report).ok).toBe(true);
  });

  it('routes the CLI task finalize command through the read-only report', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CLI finalize');
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (message?: unknown) => {
      output.push(String(message));
    };
    try {
      expect(handleTaskCommand({ args: ['task', 'finalize', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const report = JSON.parse(output.join('\n'));
    expect(report.schemaVersion).toBe('hadara.task.finalize.v1');
    expect(report.command).toBe('task.finalize');
    expect(report.mode).toBe('dry-run');
    expect(report.planHash).toMatch(/^sha256:/);
    expect(process.exitCode).toBe(6);
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
      .replace('| Created | TBD |', '| Created | 2026-06-07 |')
      .replace('| Updated | TBD |', '| Updated | 2026-06-07 |')
      .replace(/\nDraft\n/, '\nDone\n')
      .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Exercise finalize planning. | Fixture verifies finalize plan. |')
      .replace('| TBD | TBD |', '| Complete fixture capsule. | Needed for done-level validation. |')
      .replace('| TBD | TBD |', '| Broad workflow mutation. | Outside fixture scope. |')
      .replace('| TBD | Draft | Initial task scaffold. | TBD |', '| 2026-06-07T00:00:00.000Z | Done | Fixture complete. | Evidence. |'),
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
  fs.writeFileSync(path.join(taskDir, 'CONTEXT.md'), '# Context\n\n## Required Reading Used\n\n| Document | Why It Matters | Read Status |\n|---|---|---|\n| docs/TASK_BOARD.md | Fixture. | Read |\n\n## Assumptions\n\n| Assumption | Source | Risk If Wrong |\n|---|---|---|\n| Fixture is complete. | Test | Low. |\n\n## Constraints\n\n| Constraint | Source | Notes |\n|---|---|---|\n| Finalize is read-only. | Test | No writes. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'FILES.md'), '# Files\n\n| Path | Action | Reason | Status |\n|---|---|---|---|\n| src/task/task-finalize.ts | Add | Finalize plan. | Done |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'ACCEPTANCE.md'), '# Acceptance Criteria\n\n| ID | Criterion | Status | Evidence |\n|---|---|---|---|\n| AC-1 | Fixture complete. | Met | Evidence. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'TESTS.md'), '# Tests\n\n## Routine Checks\n\n| Command | Purpose | Required For Done | Latest Result | Evidence |\n|---|---|---|---|---|\n| Fixture | Exercise finalize plan. | Yes | Passed | Evidence. |\n\n## Special Checks\n\n| Check | Required? | Reason | Latest Result | Evidence |\n|---|---|---|---|---|\n| None | No | Fixture. | Not Run | Not applicable. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'RISKS.md'), '# Risks\n\n| Risk | Impact | Likelihood | Mitigation | Status |\n|---|---|---|---|---|\n| Fixture drift | Low | Low | Keep local. | Mitigated |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'DECISIONS.md'), '# Decisions\n\n| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n| D-1 | Use finalize fixture. | Accepted | Test plan report. | Test. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'HANDOFF.md'), '# Handoff\n\n## Current State\n\n| Field | Value |\n|---|---|\n| Status | Done |\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| Fixture complete. | Evidence. |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| Continue. | Done. | docs/TASK_BOARD.md |\n', 'utf8');
  appendEvidence(root, { taskId, kind: 'test-log', summary: 'Finalize fixture validation passed.', result: 'passed', visibility: 'public' });
}

function markStateDocsCurrent(root: string, taskId: string): void {
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), `# Development Slices\n\n| ID | Task |\n|---|---|\n| 1 | ${taskId} |\n`, 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), `# Project State\n\nLatest completed task: ${taskId}.\n`, 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# Agent Handoff\n\nActive task context includes ${taskId}.\n`, 'utf8');
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
