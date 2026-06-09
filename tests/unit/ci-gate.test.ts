import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleCiCommand } from '../../src/cli/ci';
import { appendEvidence } from '../../src/evidence/evidence';
import { createCiGateReport } from '../../src/services/ci-gate';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-ci-gate-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('ci gate report', () => {
  it('passes strict mode for a focused done task with substantive evidence and no blockers', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CI gate ok');
    completeTask(root, task.id, task.dir);
    appendEvidence(root, { taskId: task.id, kind: 'test-log', summary: 'CI proof validation passed', result: 'passed', visibility: 'public' });

    const report = createCiGateReport(root, 'strict', { taskId: task.id });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.ci.gate.v1',
      command: 'ci.gate',
      ok: true,
      mode: 'strict',
      scope: { taskId: task.id, taskCount: 1 },
      blockers: []
    });
    expect(report.checks.map((check) => check.source)).toEqual(expect.arrayContaining(['protocol', 'evidence', 'proof', 'release']));
  });

  it('keeps advisory mode ok while surfacing blockers', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CI gate advisory blocked');
    completeTask(root, task.id, task.dir);
    appendEvidence(root, { taskId: task.id, kind: 'test-log', summary: 'pytest failed', result: 'failed', visibility: 'public' });

    const advisory = createCiGateReport(root, 'advisory', { taskId: task.id });
    const strict = createCiGateReport(root, 'strict', { taskId: task.id });

    expect(advisory.ok).toBe(true);
    expect(advisory.blockers).toContainEqual(expect.objectContaining({ source: 'proof', code: 'TASK_DONE_WITH_FAILED_EVIDENCE' }));
    expect(strict.ok).toBe(false);
  });

  it('fails strict mode when there are no Done task capsules to validate', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Draft only task');

    const report = createCiGateReport(root, 'strict');

    expect(report.scope).toMatchObject({ taskCount: 0, allowEmpty: false });
    expect(report.ok).toBe(false);
    expect(report.blockers).toContainEqual(expect.objectContaining({ source: 'proof', code: 'CI_GATE_NO_DONE_TASKS' }));
    expect(report.warnings).not.toContainEqual(expect.objectContaining({ code: 'CI_GATE_NO_DONE_TASKS' }));
  });

  it('passes strict mode with an empty Done scope only when --allow-empty is set', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Draft only task');

    const report = createCiGateReport(root, 'strict', { allowEmpty: true });

    expect(report.scope).toMatchObject({ taskCount: 0, allowEmpty: true });
    expect(report.warnings).toContainEqual(expect.objectContaining({ source: 'proof', code: 'CI_GATE_NO_DONE_TASKS' }));
    expect(report.blockers).not.toContainEqual(expect.objectContaining({ code: 'CI_GATE_NO_DONE_TASKS' }));
  });

  it('blocks strict mode when an explicit --task is not found', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Existing task');

    const report = createCiGateReport(root, 'strict', { taskId: 'T-9999' });

    expect(report.scope).toMatchObject({ taskId: 'T-9999', taskCount: 0 });
    expect(report.ok).toBe(false);
    expect(report.blockers).toContainEqual(expect.objectContaining({ source: 'proof', code: 'CI_GATE_TASK_NOT_FOUND', taskId: 'T-9999' }));
  });

  it('prints ci gate JSON through the CLI handler', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'CI gate cli');
    completeTask(root, task.id, task.dir);
    appendEvidence(root, { taskId: task.id, kind: 'command-log', summary: 'CI gate smoke passed', result: 'passed', visibility: 'public' });
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };
    try {
      expect(handleCiCommand({ args: ['ci', 'gate', '--mode', 'strict', '--task', task.id, '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    expect(JSON.parse(output.join('\n'))).toMatchObject({
      schemaVersion: 'hadara.ci.gate.v1',
      command: 'ci.gate',
      mode: 'strict',
      scope: { taskId: task.id, taskCount: 1 }
    });
  });
});

function completeTask(root: string, taskId: string, taskDir: string): void {
  fs.writeFileSync(
    path.join(taskDir, 'TASK.md'),
    fs
      .readFileSync(path.join(taskDir, 'TASK.md'), 'utf8')
      .replace(/\| Status \| Draft \|/g, '| Status | Done |')
      .replace('| Created | TBD |', '| Created | 2026-06-09 |')
      .replace('| Updated | TBD |', '| Updated | 2026-06-09 |')
      .replace(/\nDraft\n/, '\nDone\n')
      .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Exercise CI gate. | Fixture verifies gate readiness. |')
      .replace('| TBD | TBD |', '| Complete fixture documents. | Needed for done-level validation. |')
      .replace('| TBD | TBD |', '| Broad workflow mutation. | Outside fixture scope. |')
      .replace('| TBD | Draft | Initial task scaffold. | TBD |', '| 2026-06-09T00:00:00.000Z | Done | Fixture complete. | Evidence. |'),
    'utf8'
  );
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
  fs.writeFileSync(path.join(taskDir, 'PLAN.md'), '# Plan\n\n| Step | Action | Status | Evidence |\n|---|---|---|---|\n| 1 | Complete fixture. | Done | Fixture. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'CONTEXT.md'), '# Context\n\n## Required Reading Used\n\n| Document | Why It Matters | Read Status |\n|---|---|---|\n| docs/TASK_BOARD.md | Fixture. | Read |\n\n## Assumptions\n\n| Assumption | Source | Risk If Wrong |\n|---|---|---|\n| Fixture is complete. | Test | Low. |\n\n## Constraints\n\n| Constraint | Source | Notes |\n|---|---|---|\n| CI gate is read-only. | Test | No writes. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'FILES.md'), '# Files\n\n| Path | Action | Reason | Status |\n|---|---|---|---|\n| test | Modify | Test helper. | Done |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'ACCEPTANCE.md'), '# Acceptance Criteria\n\n| ID | Criterion | Status | Evidence |\n|---|---|---|---|\n| AC-1 | Test acceptance. | Met | Evidence attached. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'TESTS.md'), '# Tests\n\n## Routine Checks\n\n| Command | Purpose | Required For Done | Latest Result | Evidence |\n|---|---|---|---|---|\n| Fixture | Exercise CI gate. | Yes | Passed | Evidence. |\n\n## Special Checks\n\n| Check | Required? | Reason | Latest Result | Evidence |\n|---|---|---|---|---|\n| None | No | Fixture. | Not Run | Not applicable. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'RISKS.md'), '# Risks\n\n| Risk | Impact | Likelihood | Mitigation | Status |\n|---|---|---|---|---|\n| Fixture drift | Low | Low | Keep local. | Mitigated |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'DECISIONS.md'), '# Decisions\n\n| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n| D-1 | Use fixture. | Accepted | Test CI gate. | Test. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'HANDOFF.md'), '# Handoff\n\n## Current State\n\n| Field | Value |\n|---|---|\n| Status | Done |\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| Fixture complete. | Evidence. |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| Continue. | Done. | docs/TASK_BOARD.md |\n', 'utf8');
}
