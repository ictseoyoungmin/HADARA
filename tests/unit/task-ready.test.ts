import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleTaskCommand } from '../../src/cli/task';
import { appendEvidence } from '../../src/evidence/evidence';
import { createTaskReadyReport } from '../../src/task/task-ready';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-ready-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('task ready report', () => {
  it('returns a friendly ready report for a done-ready task', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Ready task');
    completeTask(root, task.id, task.dir);

    const report = createTaskReadyReport(root, task.id);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.ready.v1',
      command: 'task.ready',
      ok: true,
      level: 'done',
      actor: { agentId: 'unknown', runId: 'local', role: 'operator', parentRunId: null },
      summary: { ready: true, blockers: 0 },
      checks: { doneValidation: true, evidenceLint: true, protocolDoctor: true }
    });
    expect(report.primaryNextAction).toMatchObject({
      id: 'run-task-close',
      command: `hadara task close --task ${task.id} --json`,
      writeBoundary: 'read-only',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'none'
    });
  });

  it('returns blockers and remediation-oriented actions for a draft task', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Blocked ready task');

    const report = createTaskReadyReport(root, task.id);

    expect(report.ok).toBe(false);
    expect(report.summary.ready).toBe(false);
    expect(report.summary.blockers).toBeGreaterThan(0);
    expect(report.primaryNextAction).toMatchObject({
      id: 'finish-first',
      command: `hadara task finish --task ${task.id} --json`,
      writeBoundary: 'task-local',
      recommendedActorRole: 'worker',
      stalePlanRisk: 'low'
    });
    expect(report.nextActions).toContainEqual(expect.objectContaining({ id: 'resolve-ready-blockers', required: true }));
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'HARNESS_ACCEPTANCE_INCOMPLETE',
          path: `tasks/${task.id}-blocked-ready-task/ACCEPTANCE.md`,
          heading: 'Acceptance Criteria',
          fixHint: expect.stringContaining('acceptance criterion'),
          remediationHint: expect.objectContaining({
            path: `tasks/${task.id}-blocked-ready-task/ACCEPTANCE.md`,
            heading: 'Acceptance Criteria',
            blocking: true
          })
        })
      ])
    );
  });

  it('surfaces plan status drift blockers from done-level harness validation', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Ready plan drift task');
    completeTask(root, task.id, task.dir);
    fs.appendFileSync(path.join(task.dir, 'PLAN.md'), '| 2 | Finish stale work. | In Progress | Pending. |\n', 'utf8');

    const report = createTaskReadyReport(root, task.id);

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: 'HARNESS_TASK_PLAN_STATUS_DRIFT',
        path: `tasks/${task.id}-ready-plan-drift-task/PLAN.md`,
        fixHint: expect.stringContaining('In Progress')
      })
    );
    expect(report.nextActions).toContainEqual(expect.objectContaining({ id: 'resolve-ready-blockers', required: true }));
  });

  it('threads explicit actor CLI options into task ready reports', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Ready actor task');
    completeTask(root, task.id, task.dir);
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };
    try {
      expect(
        handleTaskCommand({
          args: ['task', 'ready', '--task', task.id, '--agent-id', 'worker-ready', '--run-id', 'run-ready', '--actor-role', 'worker', '--json'],
          projectRoot: root,
          jsonOutput: true
        })
      ).toBe(true);
    } finally {
      console.log = originalLog;
    }

    const report = JSON.parse(output.join('\n'));
    expect(report.actor).toEqual({ agentId: 'worker-ready', runId: 'run-ready', role: 'worker', parentRunId: null });
  });
});

function completeTask(root: string, taskId: string, taskDir: string): void {
  fs.writeFileSync(
    path.join(taskDir, 'TASK.md'),
    fs
      .readFileSync(path.join(taskDir, 'TASK.md'), 'utf8')
      .replace(/\| Status \| Draft \|/g, '| Status | Done |')
      .replace('| Created | TBD |', '| Created | 2026-06-02 |')
      .replace('| Updated | TBD |', '| Updated | 2026-06-02 |')
      .replace(/\nDraft\n/, '\nDone\n')
      .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Exercise task ready. | Fixture verifies ready preflight. |')
      .replace('| TBD | TBD |', '| Complete fixture documents. | Needed for done-level validation. |')
      .replace('| TBD | TBD |', '| Broad workflow mutation. | Outside fixture scope. |')
      .replace('| TBD | Draft | Initial task scaffold. | TBD |', '| 2026-05-31T00:00:00.000Z | Done | Fixture complete. | Evidence. |'),
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
  fs.writeFileSync(path.join(taskDir, 'CONTEXT.md'), '# Context\n\n## Required Reading Used\n\n| Document | Why It Matters | Read Status |\n|---|---|---|\n| docs/TASK_BOARD.md | Fixture. | Read |\n\n## Assumptions\n\n| Assumption | Source | Risk If Wrong |\n|---|---|---|\n| Fixture is complete. | Test | Low. |\n\n## Constraints\n\n| Constraint | Source | Notes |\n|---|---|---|\n| Read-only ready report. | Test | No writes. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'FILES.md'), '# Files\n\n| Path | Action | Reason | Status |\n|---|---|---|---|\n| src/task/task-ready.ts | Add | Ready report. | Done |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'ACCEPTANCE.md'), '# Acceptance Criteria\n\n| ID | Criterion | Status | Evidence |\n|---|---|---|---|\n| AC-1 | Fixture complete. | Met | Evidence. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'TESTS.md'), '# Tests\n\n## Routine Checks\n\n| Command | Purpose | Required For Done | Latest Result | Evidence |\n|---|---|---|---|---|\n| Fixture | Exercise ready. | Yes | Passed | Evidence. |\n\n## Special Checks\n\n| Check | Required? | Reason | Latest Result | Evidence |\n|---|---|---|---|---|\n| None | No | Fixture. | Not Run | Not applicable. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'RISKS.md'), '# Risks\n\n| Risk | Impact | Likelihood | Mitigation | Status |\n|---|---|---|---|---|\n| Fixture drift | Low | Low | Keep local. | Mitigated |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'DECISIONS.md'), '# Decisions\n\n| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n| D-1 | Use fixture. | Accepted | Test ready report. | Test. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'HANDOFF.md'), '# Handoff\n\n## Current State\n\n| Field | Value |\n|---|---|\n| Status | Done |\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| Fixture complete. | Evidence. |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| Continue. | Done. | docs/TASK_BOARD.md |\n', 'utf8');
  appendEvidence(root, { taskId, kind: 'test-log', summary: 'Ready fixture validation passed.', result: 'passed', visibility: 'public' });
}
