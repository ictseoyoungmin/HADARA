import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appendEvidence } from '../../src/evidence/evidence';
import { createTaskAuditCloseReport, createTaskCloseReport, executeTaskCloseEvidence, formatTaskAuditCloseReport } from '../../src/task/task-close';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-close-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('task close report', () => {
  it('creates a read-only close plan with loop-boundary next actions for a completed task', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close ready task');
    completeTask(root, task.id, task.dir);

    const report = createTaskCloseReport(root, task.id, 'dry-run');

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.close.v1',
      command: 'task.close',
      ok: true,
      mode: 'dry-run',
      taskId: task.id,
      validation: {
        ok: true,
        level: 'done',
        issueCount: 0
      },
      evidenceLint: { ok: true, issueCount: 0 },
      protocolDoctor: { ok: true, issueCount: 0 },
      closeEvidence: {
        planned: true,
        appended: false,
        kind: 'command-log',
        result: 'passed',
        excludedFromCurrentValidationLoop: true
      }
    });
    expect(report.validation.validatedBeforeCloseEvidenceReportHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(report.validation.validatedBeforeCloseEvidenceSourceHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(report.validation.validatedBeforeCloseEvidenceHash).toBe(report.validation.validatedBeforeCloseEvidenceReportHash);
    expect(report.nextActions).toContainEqual(
      expect.objectContaining({
        id: 'append-close-evidence',
        loopBoundary: true,
        command: `hadara task close --task ${task.id} --execute --json`
      })
    );
  });

  it('reports blockers for tasks that are not done-ready', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close blocked task');

    const report = createTaskCloseReport(root, task.id, 'dry-run');

    expect(report.ok).toBe(false);
    expect(report.summary.blockers).toBeGreaterThan(0);
    expect(report.closeEvidence.planned).toBe(false);
    expect(report.nextActions).toContainEqual(expect.objectContaining({ id: 'resolve-close-blockers', required: true }));
  });

  it('appends only close evidence in execute mode after blockers pass', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close execute evidence');
    completeTask(root, task.id, task.dir);

    const report = createTaskCloseReport(root, task.id, 'execute');
    const before = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');
    executeTaskCloseEvidence(root, report);
    const after = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');

    expect(report.ok).toBe(true);
    expect(report.closeEvidence.appended).toBe(true);
    expect(report.closeEvidence.sourceHash).toBe(report.validation.validatedBeforeCloseEvidenceSourceHash);
    expect(after.split(/\r?\n/).filter(Boolean).length).toBe(before.split(/\r?\n/).filter(Boolean).length + 1);
    expect(after).toContain('"kind":"command-log"');
    expect(after).toContain('"Task close validation for ' + task.id);
    expect(report.closeEvidence.markdownPath).toBe(`tasks/${task.id}-close-execute-evidence/EVIDENCE.md`);
    expect(report.closeEvidence.evidencePath).toBe(`tasks/${task.id}-close-execute-evidence/evidence.jsonl`);
    expect(report.nextActions.map((action) => action.id)).toEqual(['close-evidence-appended', 'audit-close']);
    expect(report.nextActions).toContainEqual(expect.objectContaining({ id: 'audit-close', command: `hadara task audit-close --task ${task.id} --json` }));
  });

  it('audits close evidence and reports hash drift as a warning', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close audit evidence');
    completeTask(root, task.id, task.dir);
    const closeReport = createTaskCloseReport(root, task.id, 'execute');
    executeTaskCloseEvidence(root, closeReport);

    const audit = createTaskAuditCloseReport(root, task.id);
    expect(audit).toMatchObject({
      schemaVersion: 'hadara.task.audit_close.v1',
      command: 'task.audit-close',
      ok: true,
      summary: { closeEvidenceRecords: 1, blockers: 0 }
    });
    expect(audit.latestCloseEvidence?.validationReportHash).toBe(closeReport.validation.validatedBeforeCloseEvidenceReportHash);
    expect(audit.latestCloseEvidence?.sourceHash).toBe(closeReport.validation.validatedBeforeCloseEvidenceSourceHash);
    expect(formatTaskAuditCloseReport(audit)).toContain('State\n- Closed: yes');
    expect(formatTaskAuditCloseReport(audit)).toContain('Close Evidence\n- Latest: passed');
    expect(formatTaskAuditCloseReport(audit)).toContain('Audit\n- Blockers: 0');
    expect(formatTaskAuditCloseReport(audit)).toContain('Suggested next');

    fs.appendFileSync(path.join(task.dir, 'PLAN.md'), '\n| 2 | Drift after close. | Done | Drift. |\n', 'utf8');
    const drift = createTaskAuditCloseReport(root, task.id);
    expect(drift.ok).toBe(true);
    expect(drift.issues).toContainEqual(expect.objectContaining({ severity: 'warning', code: 'TASK_CLOSE_AUDIT_SOURCE_HASH_DRIFT' }));
  });

  it('reports missing close evidence during audit', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close audit missing');
    completeTask(root, task.id, task.dir);

    const audit = createTaskAuditCloseReport(root, task.id);

    expect(audit.ok).toBe(false);
    expect(audit.issues).toContainEqual(expect.objectContaining({ code: 'TASK_CLOSE_EVIDENCE_MISSING' }));
  });
});

function completeTask(root: string, taskId: string, taskDir: string): void {
  fs.writeFileSync(
    path.join(taskDir, 'TASK.md'),
    fs
      .readFileSync(path.join(taskDir, 'TASK.md'), 'utf8')
      .replace(/\| Status \| Draft \|/g, '| Status | Done |')
      .replace(/\nDraft\n/, '\nDone\n')
      .replace('| TBD | Replace with the smallest verifiable outcome. |', '| Exercise task close planning. | Fixture verifies close readiness. |')
      .replace('| TBD | TBD |', '| Complete fixture documents. | Needed for done-level validation. |')
      .replace('| TBD | TBD |', '| Broad workflow mutation. | Outside fixture scope. |')
      .replace('| TBD | Draft | Initial task scaffold. | TBD |', '| 2026-05-31T00:00:00.000Z | Done | Fixture complete. | Evidence. |'),
    'utf8'
  );
  updateTaskBoardDone(root, taskId);
  fs.writeFileSync(path.join(taskDir, 'PLAN.md'), '# Plan\n\n| Step | Action | Status | Evidence |\n|---|---|---|---|\n| 1 | Complete fixture. | Done | Fixture. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'CONTEXT.md'), '# Context\n\n## Required Reading Used\n\n| Document | Why It Matters | Read Status |\n|---|---|---|\n| docs/TASK_BOARD.md | Fixture. | Read |\n\n## Assumptions\n\n| Assumption | Source | Risk If Wrong |\n|---|---|---|\n| Fixture is complete. | Test | Low. |\n\n## Constraints\n\n| Constraint | Source | Notes |\n|---|---|---|\n| Read-only close plan. | Test | No writes. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'FILES.md'), '# Files\n\n| Path | Action | Reason | Status |\n|---|---|---|---|\n| src/task/task-close.ts | Add | Close plan. | Done |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'ACCEPTANCE.md'), '# Acceptance Criteria\n\n| ID | Criterion | Status | Evidence |\n|---|---|---|---|\n| AC-1 | Fixture complete. | Met | Evidence. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'TESTS.md'), '# Tests\n\n## Routine Checks\n\n| Command | Purpose | Required For Done | Latest Result | Evidence |\n|---|---|---|---|---|\n| Fixture | Exercise close. | Yes | Passed | Evidence. |\n\n## Special Checks\n\n| Check | Required? | Reason | Latest Result | Evidence |\n|---|---|---|---|---|\n| None | No | Fixture. | Not Run | Not applicable. |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'RISKS.md'), '# Risks\n\n| Risk | Impact | Likelihood | Mitigation | Status |\n|---|---|---|---|---|\n| Fixture drift | Low | Low | Keep local. | Mitigated |\n', 'utf8');
  fs.writeFileSync(path.join(taskDir, 'DECISIONS.md'), '# Decisions\n\n| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n| D-1 | Use fixture. | Accepted | Test close plan. | Test. |\n', 'utf8');
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
