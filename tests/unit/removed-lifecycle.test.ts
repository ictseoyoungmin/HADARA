import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleTaskCommand } from '../../src/cli/task';
import { REMOVED_TASK_SUBCOMMANDS } from '../../src/cli/removed-lifecycle';
import { validateSchema } from '../../src/core/schema';
import { appendEvidence } from '../../src/evidence/evidence';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTaskFinalizeReport } from '../../src/task/task-finalize';
import { createTaskReadyReport } from '../../src/task/task-ready';
import { createTaskWorkbenchReport } from '../../src/services/task-workbench';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-removed-lifecycle-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

function captureJson(args: string[], root: string): Record<string, unknown> {
  const output: string[] = [];
  const originalLog = console.log;
  console.log = (value?: unknown) => {
    output.push(String(value));
  };
  try {
    expect(handleTaskCommand({ args, projectRoot: root, jsonOutput: true })).toBe(true);
  } finally {
    console.log = originalLog;
  }
  return JSON.parse(output.join('\n')) as Record<string, unknown>;
}

describe('FD-013 removed lifecycle surface', () => {
  it('answers every removed subcommand with a structured redirect stub and no writes', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Removed surface stub');
    const before = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');

    for (const sub of Object.keys(REMOVED_TASK_SUBCOMMANDS)) {
      const report = captureJson(['task', sub, '--task', task.id, '--json'], root);
      expect(validateSchema('hadara.commandRemoved.v1', report).ok).toBe(true);
      expect(report).toMatchObject({
        schemaVersion: 'hadara.commandRemoved.v1',
        ok: false,
        code: 'TASK_LIFECYCLE_COMMAND_REMOVED'
      });
      expect(String(report.replacementCommand)).toMatch(/hadara task (finalize|status)/);
      expect(process.exitCode).toBe(6);
      process.exitCode = undefined;
    }
    expect(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')).toBe(before);
  });

  it('keeps field-level ready diagnostics inside task status --detail full (parity, rc0 item 6 AC-3)', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Ready parity fixture');
    // Broken-on-purpose capsule: invalid risk state token plus placeholder handoff.
    const taskPath = path.join(task.dir, 'TASK.md');
    fs.writeFileSync(
      taskPath,
      fs.readFileSync(taskPath, 'utf8').replace('| RF-1 | Follow-up | TBD | Open | TBD |', '| RF-1 | Follow-up | TBD | Resolved | TBD |'),
      'utf8'
    );

    const readyReport = createTaskReadyReport(root, task.id, 'done');
    expect(readyReport.ok).toBe(false);
    const readyIssueKeys = readyReport.issues
      .filter((issue) => issue.severity === 'error')
      .map((issue) => `${issue.code}::${issue.path ?? ''}`)
      .sort();
    expect(readyIssueKeys.length).toBeGreaterThan(0);

    const workbench = createTaskWorkbenchReport(root, task.id, new Date(), { detail: 'full' });
    const workbenchIssueKeys = new Set(
      workbench.issues.map((issue) => `${issue.code}::${(issue as { path?: string }).path ?? ''}`)
    );
    for (const key of readyIssueKeys) {
      expect(workbenchIssueKeys.has(key), `ready blocker ${key} must appear in status --detail full`).toBe(true);
    }
  });

  it('exposes a machine-readable close audit verdict in finalize dry-run and status --detail full (rc0 item 6 AC-4)', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Audit contract fixture');

    const finalizeDryRun = createTaskFinalizeReport(root, task.id);
    expect(['not-closed', 'in-progress', 'blocked', 'ready-to-close']).toContain(finalizeDryRun.state);
    expect(finalizeDryRun.steps.some((step) => step.id === 'audit-close')).toBe(true);

    const workbench = createTaskWorkbenchReport(root, task.id, new Date(), { detail: 'full' });
    expect(['not-closed', 'closed-valid', 'closed-stale', 'closed-invalid', 'unknown']).toContain(workbench.state.closeState);
  });

  it('recovers a partially executed finalize run by rerunning finalize alone (rc0 item 6 AC-2)', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Recovery fixture');
    completeRecoveryFixture(root, task.id, task.dir);
    // First auto run executes finish (write) then blocks at ready because the
    // handoff is still a scaffold placeholder.
    const first = createTaskFinalizeReport(root, task.id, { executeRequested: true, auto: true });
    expect(first.ok).toBe(false);
    expect(first.execution?.executedSteps.map((step) => step.id)).toContain('finish');
    expect(first.execution?.stoppedAt).toBe('ready');

    // Repair the blocker, then a single finalize rerun must reach closed-valid
    // with no standalone low-level command involved.
    fs.writeFileSync(
      path.join(task.dir, 'HANDOFF.md'),
      '# Handoff\n\n## Current State\n\n| Field | Value |\n|---|---|\n| Status | Done |\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| Recovery fixture complete. | Evidence. |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| Continue. | Done. | docs/TASK_BOARD.md |\n',
      'utf8'
    );
    const second = createTaskFinalizeReport(root, task.id, { executeRequested: true, auto: true });
    expect(second.ok).toBe(true);
    expect(second.state).toBe('closed-valid');
  });
});

function completeRecoveryFixture(root: string, taskId: string, taskDir: string): void {
  fs.writeFileSync(
    path.join(taskDir, 'TASK.md'),
    fs
      .readFileSync(path.join(taskDir, 'TASK.md'), 'utf8')
      // Status intentionally stays pre-Done: the finalize finish step owns
      // the Done flip, so done-level handoff blockers only surface at the
      // ready step after finish has already written (the AC-2 partial state).
      .replace(/\| Status \| Draft \|/g, '| Status | In Progress |')
      .replace('| Created | TBD |', '| Created | 2026-07-06 |')
      .replace('| Updated | TBD |', '| Updated | 2026-07-06 |')
      .replace(/\nDraft\n/, '\nIn Progress\n')
      .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Exercise recovery. | Fixture verifies finalize recovery. |')
      .replace('| TBD | TBD |', '| Complete fixture capsule. | Needed for done-level validation. |')
      .replace('| TBD | TBD |', '| Broad workflow mutation. | Outside fixture scope. |')
      .replace('| TBD | Draft | Initial task scaffold. | TBD |', '| 2026-07-06T00:00:00.000Z | In Progress | Fixture in progress. | Evidence. |'),
    'utf8'
  );
  fs.writeFileSync(path.join(taskDir, 'PLAN.md'), '# Plan\n\n| Step | Action | Status | Evidence |\n|---|---|---|---|\n| 1 | Complete fixture. | Done | Fixture. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'CONTEXT.md'), '# Context\n\n## Required Reading Used\n\n| Document | Why It Matters | Read Status |\n|---|---|---|\n| docs/TASK_BOARD.md | Fixture. | Read |\n\n## Assumptions\n\n| Assumption | Source | Risk If Wrong |\n|---|---|---|\n| Fixture is complete. | Test | Low. |\n\n## Constraints\n\n| Constraint | Source | Notes |\n|---|---|---|\n| Recovery uses finalize only. | Test | No standalone commands. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'FILES.md'), '# Files\n\n| Path | Action | Reason | Status |\n|---|---|---|---|\n| src/task/task-finalize.ts | Add | Recovery fixture. | Done |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'ACCEPTANCE.md'), '# Acceptance Criteria\n\n| ID | Criterion | Status | Evidence |\n|---|---|---|---|\n| AC-1 | Fixture complete. | Met | Evidence. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'TESTS.md'), '# Tests\n\n## Routine Checks\n\n| Command | Purpose | Required For Done | Latest Result | Evidence |\n|---|---|---|---|---|\n| Fixture | Exercise recovery. | Yes | Passed | Evidence. |\n\n## Special Checks\n\n| Check | Required? | Reason | Latest Result | Evidence |\n|---|---|---|---|---|\n| None | No | Fixture. | Not Run | Not applicable. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'RISKS.md'), '# Risks\n\n| Risk | Impact | Likelihood | Mitigation | Status |\n|---|---|---|---|---|\n| Fixture drift | Low | Low | Keep local. | Mitigated |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'DECISIONS.md'), '# Decisions\n\n| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n| D-1 | Use recovery fixture. | Accepted | Test recovery path. | Test. |\n', 'utf8');
  // HANDOFF.md is intentionally left as the scaffold placeholder: it is the
  // deliberate ready-step blocker that produces the partially executed state.
  appendEvidence(root, { taskId, kind: 'test-log', summary: 'Recovery fixture validation passed.', result: 'passed', visibility: 'public' });
}
