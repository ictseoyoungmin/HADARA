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
    for (const legacyFile of LEGACY_SIDECAR_FILES) {
      expect(fs.existsSync(path.join(task.dir, legacyFile))).toBe(false);
    }
    appendEvidence(root, { taskId: task.id, kind: 'test-log', summary: 'CI proof validation passed', result: 'passed', visibility: 'public' });

    const report = createCiGateReport(root, 'strict', { taskId: task.id });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.ci.gate.v1',
      command: 'ci.gate',
      ok: true,
      mode: 'strict',
      scope: { taskId: task.id, taskCount: 1 },
      blockers: [],
      stateConsistency: {
        mode: 'advisory',
        strictBlocking: false
      }
    });
    expect(report.checks.map((check) => check.source)).toEqual(expect.arrayContaining(['protocol', 'evidence', 'proof', 'release', 'state']));
    expect(report.warnings).toContainEqual(expect.objectContaining({ source: 'state', code: expect.any(String), fixHint: expect.any(String) }));
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

const LEGACY_SIDECAR_FILES = ['PLAN.md', 'CONTEXT.md', 'FILES.md', 'ACCEPTANCE.md', 'TESTS.md', 'RISKS.md', 'DECISIONS.md'];

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
      .replace('| In | TBD |', '| In | Complete fixture documents. |')
      .replace('| Out | TBD |', '| Out | Broad workflow mutation. |')
      .replace('| AC-1 | Scope is implemented. | Must | Pending | TBD | TBD |', '| AC-1 | Scope is implemented. | Must | Met | Evidence attached. | tests/unit/ci-gate.test.ts |')
      .replace('| AC-2 | Validation evidence is recorded. | Must | Pending | TBD | TBD |', '| AC-2 | Validation evidence is recorded. | Must | Met | Evidence attached. | tests/unit/ci-gate.test.ts |')
      .replace('| AC-1 | Scope is implemented. | Yes | Pending | TBD | Required | TBD |', '| AC-1 | Scope is implemented. | Yes | Met | Evidence attached. | Required | tests/unit/ci-gate.test.ts |')
      .replace('| AC-2 | Validation evidence is recorded. | Yes | Pending | TBD | Required | TBD |', '| AC-2 | Validation evidence is recorded. | Yes | Met | Evidence attached. | Required | tests/unit/ci-gate.test.ts |')
      .replace('| TBD | Yes | Not Run | TBD |', '| Fixture validation | Yes | Passed | Evidence attached. |')
      .replace('| TBD | TBD | Yes | Not Run | TBD |', '| Fixture validation | Local fixture setup. | Yes | Passed | Evidence attached. |')
      .replace('| N/A | TBD | TBD |', '| tests/unit/ci-gate.test.ts | Complete current capsule docs without legacy sidecars. | Evidence attached. |')
      .replace('| TBD | N/A | TBD | TBD | TBD |', '| tests/unit/ci-gate.test.ts | test fixture | Complete current capsule docs without legacy sidecars. | Keep CI gate fixtures aligned with current task structure. | Evidence attached. |')
      .replace('| RF-1 | Follow-up | TBD | Open | TBD |', '| RF-1 | Follow-up | None. | Closed | Fixture. |'),
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
  fs.writeFileSync(path.join(taskDir, 'HANDOFF.md'), '# Handoff\n\n## Current State\n\n| Field | Value |\n|---|---|\n| Status | Done |\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| Fixture complete. | Evidence. |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| Continue. | Done. | docs/TASK_BOARD.md |\n', 'utf8');
}
