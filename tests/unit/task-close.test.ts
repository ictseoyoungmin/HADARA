import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { handleTaskCommand } from '../../src/cli/task';
import { appendEvidence } from '../../src/evidence/evidence';
import { createTaskAuditCloseReport, createTaskCloseReport, executeTaskCloseEvidence, formatTaskAuditCloseReport } from '../../src/task/task-close';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-close-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, '.hadara'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, '.hadara', 'slot-registry.json'),
    `${JSON.stringify({ schemaVersion: 'hadara.managedSlot.registry.v1', registryVersion: 1, slots: [], tableSchemas: [] }, null, 2)}\n`,
    'utf8'
  );
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
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
      actor: { agentId: 'unknown', runId: 'local', role: 'operator', parentRunId: null },
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
      },
      closeEvidenceWrite: {
        duplicateFound: false,
        duplicateAction: 'append'
      }
    });
    expect(report.closeEvidenceWrite?.idempotencyKey).toBe(`close:${task.id}:${report.validation.validatedBeforeCloseEvidenceSourceHash}:${report.validation.validatedBeforeCloseEvidenceReportHash}`);
    expect(report.validation.validatedBeforeCloseEvidenceReportHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(report.validation.validatedBeforeCloseEvidenceSourceHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(report.validation.slotRegistryVersion).toBe(1);
    expect(report.validation.slotRegistryHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(report.closeEvidence.slotRegistryVersion).toBe(1);
    expect(report.closeEvidence.slotRegistryHash).toBe(report.validation.slotRegistryHash);
    expect(report.closeEvidence.closeEvidenceSnapshot).toMatchObject({
      requiredAcceptanceIds: ['AC-1'],
      latestFailedOrBlockedEvidenceRefs: [],
      unresolvedEvidenceClassifications: []
    });
    expect(report.closeEvidence.closeEvidenceSnapshot?.evidenceSummaryHash).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(report.closeEvidence.summary).toContain(`slotRegistryHash ${report.validation.slotRegistryHash}`);
    expect(report.validation.validatedBeforeCloseEvidenceHash).toBe(report.validation.validatedBeforeCloseEvidenceReportHash);
    expect(report.lifecycle).toMatchObject({
      model: 'validation-close-audit',
      reportPhase: 'pre-close-plan',
      nextPhaseAfterSuccess: 'close-execute',
      validationPhase: {
        role: 'prove-readiness',
        command: `hadara task close --task ${task.id} --json`,
        includesCloseEvidenceAppend: false
      },
      closePhase: {
        role: 'record-proof',
        command: `hadara task close --task ${task.id} --execute --json`,
        writes: 'close-evidence-only'
      },
      auditPhase: {
        role: 'check-close-record',
        command: `hadara task audit-close --task ${task.id} --json`,
        writes: 'none'
      },
      closeEvidenceLoopBoundary: {
        excludedFromCurrentValidationLoop: true
      }
    });
    expect(report.nextActions.map((action) => action.id)).toEqual(['append-close-evidence']);
    expect(report.primaryNextAction).toMatchObject({
      id: 'append-close-evidence',
      loopBoundary: true,
      command: `hadara task close --task ${task.id} --execute --json`,
      writeBoundary: 'evidence-append',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'low'
    });
    expect(report.primaryNextAction).not.toHaveProperty('message');
  });

  it('reports blockers for tasks that are not done-ready', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close blocked task');

    const report = createTaskCloseReport(root, task.id, 'dry-run');

    expect(report.ok).toBe(false);
    expect(report.summary.blockers).toBeGreaterThan(0);
    expect(report.closeEvidence.planned).toBe(false);
    expect(report.primaryNextAction).toMatchObject({ id: 'run-done-validation', writeBoundary: 'read-only' });
    expect(report.nextActions).toContainEqual(expect.objectContaining({ id: 'resolve-close-blockers', required: true }));
    expect(report.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'HARNESS_ACCEPTANCE_INCOMPLETE',
          path: `tasks/${task.id}-close-blocked-task/TASK.md`,
          heading: 'Acceptance Criteria',
          fixHint: expect.stringContaining('acceptance criterion'),
          remediationHint: expect.objectContaining({
            path: `tasks/${task.id}-close-blocked-task/TASK.md`,
            heading: 'Acceptance Criteria',
            blocking: true
          })
        })
      ])
    );
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
    expect(report.lifecycle).toMatchObject({
      reportPhase: 'close-execute',
      nextPhaseAfterSuccess: 'post-close-audit',
      closePhase: { writes: 'close-evidence-only' },
      auditPhase: { command: `hadara task audit-close --task ${task.id} --json`, writes: 'none' }
    });
    expect(report.closeEvidence.sourceHash).toBe(report.validation.validatedBeforeCloseEvidenceSourceHash);
    expect(after.split(/\r?\n/).filter(Boolean).length).toBe(before.split(/\r?\n/).filter(Boolean).length + 1);
    expect(after).toContain('"kind":"command-log"');
    expect(after).toContain('"Task close validation for ' + task.id);
    expect(report.closeEvidence.markdownPath).toBe(`tasks/${task.id}-close-execute-evidence/EVIDENCE.md`);
    expect(report.closeEvidence.evidencePath).toBe(`tasks/${task.id}-close-execute-evidence/evidence.jsonl`);
    const closeRecord = JSON.parse(after.trim().split(/\r?\n/).at(-1) ?? '{}');
    expect(closeRecord).toMatchObject({
      schemaVersion: 'hadara.evidence.v2',
      idempotencyKey: report.closeEvidenceWrite?.idempotencyKey,
      closeEvidenceSnapshot: report.closeEvidence.closeEvidenceSnapshot,
      actor: { agentId: 'unknown', runId: 'local', role: 'operator', parentRunId: null }
    });
    expect(report.closeEvidenceWrite?.executeRecheck).toEqual({ performed: true, duplicateFound: false, action: 'append' });
    expect(closeRecord.tags).toEqual(expect.arrayContaining(['close-proof', `idempotency:${report.closeEvidenceWrite?.idempotencyKey}`]));
    expect(report.nextActions.map((action) => action.id)).toEqual(['close-evidence-appended', 'audit-close']);
    expect(report.nextActions).toContainEqual(expect.objectContaining({ id: 'audit-close', command: `hadara task audit-close --task ${task.id} --json`, writeBoundary: 'read-only', recommendedActorRole: 'reviewer' }));
    expect(report.nextActions[0]).not.toHaveProperty('message');
  });

  it('does not append duplicate close evidence for the same source and report hash', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close duplicate evidence');
    completeTask(root, task.id, task.dir);
    const firstReport = createTaskCloseReport(root, task.id, 'execute');
    executeTaskCloseEvidence(root, firstReport);
    const afterFirst = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');

    const duplicateReport = createTaskCloseReport(root, task.id, 'execute');
    executeTaskCloseEvidence(root, duplicateReport);
    const afterDuplicate = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');

    expect(duplicateReport.closeEvidenceWrite).toMatchObject({
      idempotencyKey: firstReport.closeEvidenceWrite?.idempotencyKey,
      duplicateFound: true,
      duplicateAction: 'no-op'
    });
    expect(duplicateReport.closeEvidence.planned).toBe(false);
    expect(duplicateReport.closeEvidence.appended).toBe(false);
    expect(duplicateReport.nextActions).toContainEqual(expect.objectContaining({ id: 'close-evidence-duplicate-noop', writeBoundary: 'read-only' }));
    expect(afterDuplicate).toBe(afterFirst);
    const audit = createTaskAuditCloseReport(root, task.id);
    expect(audit.closeEvidenceAudit).toMatchObject({
      latestCloseEvidenceId: expect.stringMatching(new RegExp(`^ev:${task.id}:`)),
      supersededCloseEvidenceIds: [],
      duplicateCloseEvidenceCount: 0,
      verdict: 'valid'
    });
  });

  it('rechecks evidence immediately before append and no-ops a stale same-hash execute report', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close race recheck');
    completeTask(root, task.id, task.dir);
    const staleExecuteReport = createTaskCloseReport(root, task.id, 'execute');
    const firstReport = createTaskCloseReport(root, task.id, 'execute');
    executeTaskCloseEvidence(root, firstReport);
    const afterFirst = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');

    executeTaskCloseEvidence(root, staleExecuteReport);
    const afterStaleExecute = fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8');

    expect(staleExecuteReport.closeEvidenceWrite).toMatchObject({
      idempotencyKey: firstReport.closeEvidenceWrite?.idempotencyKey,
      duplicateFound: true,
      duplicateAction: 'no-op',
      executeRecheck: {
        performed: true,
        duplicateFound: true,
        action: 'no-op'
      }
    });
    expect(staleExecuteReport.closeEvidence.planned).toBe(false);
    expect(staleExecuteReport.closeEvidence.appended).toBe(false);
    expect(staleExecuteReport.nextActions).toContainEqual(expect.objectContaining({ id: 'close-evidence-duplicate-noop', writeBoundary: 'read-only' }));
    expect(afterStaleExecute).toBe(afterFirst);
    const audit = createTaskAuditCloseReport(root, task.id);
    expect(audit.closeEvidenceAudit).toMatchObject({
      duplicateCloseEvidenceCount: 0,
      verdict: 'valid'
    });
  });

  it('appends changed close evidence and marks the previous proof as superseded', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close supersedes evidence');
    completeTask(root, task.id, task.dir);
    const firstReport = createTaskCloseReport(root, task.id, 'execute');
    executeTaskCloseEvidence(root, firstReport);
    const firstRecord = JSON.parse(fs.readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8').trim().split(/\r?\n/).at(-1) ?? '{}');

    fs.appendFileSync(path.join(task.dir, 'TASK.md'), '\n<!-- close-source drift for supersede fixture -->\n', 'utf8');
    const secondReport = createTaskCloseReport(root, task.id, 'execute');
    executeTaskCloseEvidence(root, secondReport);
    const records = fs
      .readFileSync(path.join(task.dir, 'evidence.jsonl'), 'utf8')
      .trim()
      .split(/\r?\n/)
      .map((line) => JSON.parse(line));
    const secondRecord = records.at(-1);

    expect(secondReport.closeEvidenceWrite).toMatchObject({
      duplicateFound: false,
      duplicateAction: 'append',
      supersedes: [firstRecord.id]
    });
    expect(secondRecord.tags).toEqual(expect.arrayContaining([`supersedes:${firstRecord.id}`, `idempotency:${secondReport.closeEvidenceWrite?.idempotencyKey}`]));
    const audit = createTaskAuditCloseReport(root, task.id);
    expect(audit.latestCloseEvidence?.id).toBe(secondRecord.id);
    expect(audit.closeEvidenceAudit).toMatchObject({
      latestCloseEvidenceId: secondRecord.id,
      supersededCloseEvidenceIds: [firstRecord.id],
      duplicateCloseEvidenceCount: 0,
      verdict: 'valid'
    });
    expect(audit.auditVerdict).toMatchObject({
      verdict: 'closed-valid',
      reportHashMatches: true,
      sourceHashMatches: true
    });
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
      actor: { agentId: 'unknown', runId: 'local', role: 'operator', parentRunId: null },
      summary: { closeEvidenceRecords: 1, blockers: 0 }
    });
    expect(audit.nextActions).toEqual([]);
    expect(audit.latestCloseEvidence?.validationReportHash).toBe(closeReport.validation.validatedBeforeCloseEvidenceReportHash);
    expect(audit.latestCloseEvidence?.sourceHash).toBe(closeReport.validation.validatedBeforeCloseEvidenceSourceHash);
    expect(audit.latestCloseEvidence?.slotRegistryHash).toBe(closeReport.validation.slotRegistryHash);
    expect(audit.latestCloseEvidence?.slotRegistryVersion).toBe(closeReport.validation.slotRegistryVersion);
    expect(audit.latestCloseEvidence?.closeEvidenceSnapshot).toEqual(closeReport.closeEvidence.closeEvidenceSnapshot);
    expect(audit.currentCloseEvidenceSnapshot).toEqual(closeReport.closeEvidence.closeEvidenceSnapshot);
    expect(audit.currentSlotRegistryHash).toBe(closeReport.validation.slotRegistryHash);
    expect(audit.currentSlotRegistryVersion).toBe(closeReport.validation.slotRegistryVersion);
    expect(audit.closeEvidenceAudit).toMatchObject({
      latestCloseEvidenceId: expect.stringMatching(new RegExp(`^ev:${task.id}:`)),
      supersededCloseEvidenceIds: [],
      duplicateCloseEvidenceCount: 0,
      verdict: 'valid'
    });
    expect(audit.auditVerdict).toMatchObject({
      phase: 'post-close-audit',
      verdict: 'closed-valid',
      closeEvidenceFound: true,
      closeEvidenceValid: true,
      reportHashMatches: true,
      sourceHashMatches: true,
      slotRegistryHashMatches: true,
      recordedValidationReportHash: closeReport.validation.validatedBeforeCloseEvidenceReportHash,
      recordedSourceHash: closeReport.validation.validatedBeforeCloseEvidenceSourceHash,
      recordedSlotRegistryHash: closeReport.validation.slotRegistryHash,
      recordedSlotRegistryVersion: closeReport.validation.slotRegistryVersion,
      currentValidationReportHash: audit.currentValidationReportHash,
      currentSourceHash: audit.currentSourceHash,
      currentSlotRegistryHash: audit.currentSlotRegistryHash,
      currentSlotRegistryVersion: audit.currentSlotRegistryVersion,
      blockers: 0,
      warnings: 0,
      writeBoundary: 'read-only',
      model: 'validation-close-audit'
    });
    expect(formatTaskAuditCloseReport(audit)).toContain('State\n- Closed: yes');
    expect(formatTaskAuditCloseReport(audit)).toContain('Close Evidence\n- Latest: passed');
    expect(formatTaskAuditCloseReport(audit)).toContain('- Slot registry hash: sha256:');
    expect(formatTaskAuditCloseReport(audit)).toContain('Audit\n- Verdict: closed-valid');
    expect(formatTaskAuditCloseReport(audit)).toContain('- Blockers: 0');
    expect(formatTaskAuditCloseReport(audit)).toContain('Suggested next');

    fs.appendFileSync(path.join(task.dir, 'TASK.md'), '\n<!-- close-source drift for audit fixture -->\n', 'utf8');
    const drift = createTaskAuditCloseReport(root, task.id);
    expect(drift.ok).toBe(true);
    expect(drift.auditVerdict).toMatchObject({
      verdict: 'closed-with-drift-warnings',
      closeEvidenceFound: true,
      closeEvidenceValid: true,
      reportHashMatches: true,
      sourceHashMatches: false,
      writeBoundary: 'read-only'
    });
    expect(drift.issues).toContainEqual(expect.objectContaining({ severity: 'warning', code: 'TASK_CLOSE_AUDIT_SOURCE_HASH_DRIFT' }));

    fs.appendFileSync(path.join(root, '.hadara', 'slot-registry.json'), '\n', 'utf8');
    const registryDrift = createTaskAuditCloseReport(root, task.id);
    expect(registryDrift.auditVerdict).toMatchObject({
      verdict: 'closed-with-drift-warnings',
      slotRegistryHashMatches: false
    });
    expect(registryDrift.issues).toContainEqual(expect.objectContaining({ severity: 'warning', code: 'TASK_CLOSE_AUDIT_SLOT_REGISTRY_HASH_DRIFT' }));
  });

  it('reports evidence snapshot drift without placing proof in close-source docs', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close snapshot drift');
    completeTask(root, task.id, task.dir);
    const closeReport = createTaskCloseReport(root, task.id, 'execute');
    executeTaskCloseEvidence(root, closeReport);

    appendEvidence(root, { taskId: task.id, kind: 'command-log', summary: 'Post-close validation failed.', result: 'failed', visibility: 'public', category: 'validation' });
    const drift = createTaskAuditCloseReport(root, task.id);

    expect(drift.auditVerdict.verdict).toBe('closed-with-drift-warnings');
    expect(drift.issues).toContainEqual(expect.objectContaining({ severity: 'warning', code: 'EVIDENCE_SNAPSHOT_DRIFT' }));
    expect(drift.currentCloseEvidenceSnapshot?.latestFailedOrBlockedEvidenceRefs).toHaveLength(1);
    expect(fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8')).not.toContain('## Close Proof');
    expect(fs.readFileSync(path.join(task.dir, 'HANDOFF.md'), 'utf8')).not.toContain('CloseState');
    expect(fs.readFileSync(path.join(task.dir, 'EVIDENCE.md'), 'utf8')).toContain('## Close Proof');
  });

  it('reports missing close evidence during audit', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Close audit missing');
    completeTask(root, task.id, task.dir);

    const audit = createTaskAuditCloseReport(root, task.id);

    expect(audit.ok).toBe(false);
    expect(audit.auditVerdict).toMatchObject({
      verdict: 'not-closed',
      closeEvidenceFound: false,
      closeEvidenceValid: false,
      blockers: 1,
      writeBoundary: 'read-only'
    });
    expect(audit.primaryNextAction).toMatchObject({
      id: 'close-first',
      command: `hadara task close --task ${task.id} --json`,
      writeBoundary: 'read-only',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'none'
    });
    expect(audit.closeEvidenceAudit).toMatchObject({
      supersededCloseEvidenceIds: [],
      duplicateCloseEvidenceCount: 0,
      verdict: 'not-closed'
    });
    expect(audit.issues).toContainEqual(expect.objectContaining({ code: 'TASK_CLOSE_EVIDENCE_MISSING' }));
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
