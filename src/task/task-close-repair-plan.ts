import type { HadaraActorContext } from '../core/actor-context';
import type { HadaraNextAction } from '../core/next-action';
import { createTaskLifecycleNextAction, defaultTaskLifecycleActor } from './lifecycle-next-actions';
import { createTaskAuditCloseReport, createTaskCloseReport, TaskAuditCloseReport, TaskCloseReport } from './task-close';

export type TaskCloseRepairClassification =
  | 'not-closed'
  | 'closed-stale'
  | 'closed-invalid'
  | 'duplicate-close-proof'
  | 'closed-valid'
  | 'unknown';

export interface TaskCloseRepairPlanReport {
  schemaVersion: 'hadara.task.closeRepairPlan.v1';
  command: 'task.close-repair-plan';
  ok: boolean;
  readOnly: true;
  taskId: string;
  generatedAt: string;
  actor: HadaraActorContext;
  classification: TaskCloseRepairClassification;
  repairNeeded: boolean;
  summary: string;
  evidence: {
    closeEvidenceFound: boolean;
    closeEvidenceValid: boolean;
    closeEvidenceRecords: number;
    latestCloseEvidenceId?: string;
    duplicateCloseEvidenceCount?: number;
    supersededCloseEvidenceIds?: string[];
    recordedValidationReportHash?: string;
    currentValidationReportHash: string;
    reportHashMatches?: boolean;
    recordedSourceHash?: string;
    currentSourceHash: string;
    sourceHashMatches?: boolean;
  };
  causes: TaskCloseRepairCause[];
  primaryNextAction?: HadaraNextAction;
  nextActions: HadaraNextAction[];
  issues: TaskCloseRepairIssue[];
}

export interface TaskCloseRepairCause {
  code: string;
  severity: 'error' | 'warning' | 'info';
  summary: string;
  sourceReport: 'hadara.task.audit_close.v1' | 'hadara.task.close.v1';
  path?: string;
}

export interface TaskCloseRepairIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
}

export interface TaskCloseRepairPlanOptions {
  actor?: HadaraActorContext;
}

interface CloseRepairReports {
  close: TaskCloseReport;
  audit: TaskAuditCloseReport;
}

export function createTaskCloseRepairPlanReport(projectRoot: string, taskId: string, options: TaskCloseRepairPlanOptions = {}): TaskCloseRepairPlanReport {
  const actor = options.actor ?? defaultTaskLifecycleActor();
  const reports: CloseRepairReports = {
    close: createTaskCloseReport(projectRoot, taskId, 'dry-run', { actor }),
    audit: createTaskAuditCloseReport(projectRoot, taskId, { actor })
  };
  const classification = classifyRepair(reports);
  const causes = collectCauses(reports, classification);
  const nextActions = createRepairNextActions(taskId, classification, reports);
  const issues = collectIssues(reports);
  return {
    schemaVersion: 'hadara.task.closeRepairPlan.v1',
    command: 'task.close-repair-plan',
    ok: !reports.close.issues.some((issue) => issue.code === 'TASK_NOT_FOUND') && !reports.audit.issues.some((issue) => issue.code === 'TASK_NOT_FOUND'),
    readOnly: true,
    taskId,
    generatedAt: new Date().toISOString(),
    actor,
    classification,
    repairNeeded: classification !== 'closed-valid',
    summary: summarizeClassification(classification, reports),
    evidence: createEvidenceSummary(reports.audit),
    causes,
    ...(nextActions[0] ? { primaryNextAction: nextActions[0] } : {}),
    nextActions,
    issues
  };
}

export function formatTaskCloseRepairPlanReport(report: TaskCloseRepairPlanReport): string {
  const lines = [`[HADARA] task close-repair-plan ${report.taskId}: ${report.classification}`];
  lines.push(`readOnly=${report.readOnly} repairNeeded=${report.repairNeeded} ok=${report.ok}`);
  lines.push(report.summary);
  if (report.primaryNextAction) lines.push(`next=${report.primaryNextAction.command ?? report.primaryNextAction.summary ?? report.primaryNextAction.id}`);
  for (const cause of report.causes) lines.push(`[${cause.severity}] ${cause.code}: ${cause.summary}`);
  return lines.join('\n');
}

function classifyRepair(reports: CloseRepairReports): TaskCloseRepairClassification {
  const audit = reports.audit;
  if (reports.close.issues.some((issue) => issue.code === 'TASK_NOT_FOUND') || audit.issues.some((issue) => issue.code === 'TASK_NOT_FOUND')) return 'unknown';
  if (!audit.auditVerdict.closeEvidenceFound) return 'not-closed';
  if ((audit.closeEvidenceAudit?.duplicateCloseEvidenceCount ?? 0) > 0) return 'duplicate-close-proof';
  if (!audit.auditVerdict.closeEvidenceValid || audit.auditVerdict.verdict === 'close-evidence-invalid') return 'closed-invalid';
  if (audit.auditVerdict.reportHashMatches === false || audit.auditVerdict.sourceHashMatches === false || audit.auditVerdict.verdict === 'closed-with-drift-warnings') return 'closed-stale';
  if (audit.auditVerdict.verdict === 'closed-valid') return 'closed-valid';
  return 'unknown';
}

function summarizeClassification(classification: TaskCloseRepairClassification, reports: CloseRepairReports): string {
  switch (classification) {
    case 'not-closed':
      return 'No valid close evidence exists. Run ready if needed, then review and execute close.';
    case 'closed-stale':
      return 'Close evidence exists but recorded source or validation hashes no longer match current state.';
    case 'closed-invalid':
      return 'Close-like evidence exists but the latest close proof is invalid or malformed.';
    case 'duplicate-close-proof':
      return 'Multiple close proofs share conflicting or duplicate identity; inspect latest proof and append a fresh proof if needed.';
    case 'closed-valid':
      return 'Close proof is current and valid. No repair is needed.';
    case 'unknown':
      return reports.close.issues.some((issue) => issue.code === 'TASK_NOT_FOUND') ? 'Task was not found.' : 'Close repair state could not be classified.';
  }
}

function createEvidenceSummary(audit: TaskAuditCloseReport): TaskCloseRepairPlanReport['evidence'] {
  return {
    closeEvidenceFound: audit.auditVerdict.closeEvidenceFound,
    closeEvidenceValid: audit.auditVerdict.closeEvidenceValid,
    closeEvidenceRecords: audit.summary.closeEvidenceRecords,
    ...(audit.closeEvidenceAudit?.latestCloseEvidenceId ? { latestCloseEvidenceId: audit.closeEvidenceAudit.latestCloseEvidenceId } : {}),
    ...(audit.closeEvidenceAudit ? { duplicateCloseEvidenceCount: audit.closeEvidenceAudit.duplicateCloseEvidenceCount, supersededCloseEvidenceIds: audit.closeEvidenceAudit.supersededCloseEvidenceIds } : {}),
    ...(audit.auditVerdict.recordedValidationReportHash ? { recordedValidationReportHash: audit.auditVerdict.recordedValidationReportHash } : {}),
    currentValidationReportHash: audit.auditVerdict.currentValidationReportHash,
    ...(typeof audit.auditVerdict.reportHashMatches === 'boolean' ? { reportHashMatches: audit.auditVerdict.reportHashMatches } : {}),
    ...(audit.auditVerdict.recordedSourceHash ? { recordedSourceHash: audit.auditVerdict.recordedSourceHash } : {}),
    currentSourceHash: audit.auditVerdict.currentSourceHash,
    ...(typeof audit.auditVerdict.sourceHashMatches === 'boolean' ? { sourceHashMatches: audit.auditVerdict.sourceHashMatches } : {})
  };
}

function collectCauses(reports: CloseRepairReports, classification: TaskCloseRepairClassification): TaskCloseRepairCause[] {
  const causes: TaskCloseRepairCause[] = [];
  if (classification === 'closed-valid') {
    causes.push({ code: 'CLOSE_REPAIR_NOT_NEEDED', severity: 'info', summary: 'Audit reports closed-valid.', sourceReport: 'hadara.task.audit_close.v1' });
    return causes;
  }
  if (classification === 'not-closed') {
    causes.push({ code: 'CLOSE_REPAIR_NOT_CLOSED', severity: 'error', summary: 'No close evidence was found.', sourceReport: 'hadara.task.audit_close.v1' });
  }
  if (classification === 'duplicate-close-proof') {
    causes.push({
      code: 'CLOSE_REPAIR_DUPLICATE_PROOF',
      severity: 'warning',
      summary: `${reports.audit.closeEvidenceAudit?.duplicateCloseEvidenceCount ?? 0} duplicate close proof record(s) were found.`,
      sourceReport: 'hadara.task.audit_close.v1'
    });
  }
  if (reports.audit.auditVerdict.reportHashMatches === false) {
    causes.push({ code: 'CLOSE_REPAIR_REPORT_HASH_DRIFT', severity: 'warning', summary: 'Recorded validation report hash differs from the current validation hash.', sourceReport: 'hadara.task.audit_close.v1' });
  }
  if (reports.audit.auditVerdict.sourceHashMatches === false) {
    causes.push({ code: 'CLOSE_REPAIR_SOURCE_HASH_DRIFT', severity: 'warning', summary: 'Recorded close-source hash differs from the current close-source hash.', sourceReport: 'hadara.task.audit_close.v1' });
  }
  if (!reports.audit.auditVerdict.closeEvidenceValid && reports.audit.auditVerdict.closeEvidenceFound) {
    causes.push({ code: 'CLOSE_REPAIR_INVALID_PROOF', severity: 'error', summary: 'Latest close evidence is not a passed command-log close proof.', sourceReport: 'hadara.task.audit_close.v1' });
  }
  for (const issue of reports.audit.issues) {
    if (causes.some((cause) => cause.code === issue.code)) continue;
    causes.push({ code: issue.code, severity: issue.severity, summary: issue.message, sourceReport: 'hadara.task.audit_close.v1', ...(issue.path ? { path: issue.path } : {}) });
  }
  if (causes.length === 0) causes.push({ code: 'CLOSE_REPAIR_UNKNOWN', severity: 'warning', summary: 'Repair state is not closed-valid but no specific cause was available.', sourceReport: 'hadara.task.audit_close.v1' });
  return causes;
}

function createRepairNextActions(taskId: string, classification: TaskCloseRepairClassification, reports: CloseRepairReports): HadaraNextAction[] {
  if (classification === 'closed-valid') return [];
  if (classification === 'unknown') {
    return [
      createTaskLifecycleNextAction({
        id: 'inspect-task',
        kind: 'review',
        required: true,
        message: `Inspect task ${taskId} before repairing close state.`,
        writeBoundary: 'read-only',
        recommendedActorRole: 'reviewer',
        requiresBeforeHash: false,
        stalePlanRisk: 'none'
      })
    ];
  }
  const actions: HadaraNextAction[] = [];
  if (!reports.close.ok) {
    actions.push(
      createTaskLifecycleNextAction({
        id: 'run-ready',
        required: true,
        command: `hadara task ready --task ${taskId} --level done --json`,
        message: 'Resolve readiness blockers before appending a fresh close proof.',
        writeBoundary: 'read-only',
        recommendedActorRole: 'worker',
        requiresBeforeHash: false,
        stalePlanRisk: 'none'
      })
    );
  }
  actions.push(
    createTaskLifecycleNextAction({
      id: 'review-close-plan',
      required: true,
      command: `hadara task close --task ${taskId} --json`,
      message: 'Review the current close plan before appending or replacing close evidence.',
      writeBoundary: 'read-only',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: classification === 'closed-stale' ? 'medium' : 'low'
    })
  );
  actions.push(
    createTaskLifecycleNextAction({
      id: 'audit-after-repair',
      required: false,
      command: `hadara task audit-close --task ${taskId} --json`,
      message: 'After close execute, audit the repaired close proof.',
      writeBoundary: 'read-only',
      recommendedActorRole: 'reviewer',
      requiresBeforeHash: false,
      stalePlanRisk: 'none'
    })
  );
  return actions;
}

function collectIssues(reports: CloseRepairReports): TaskCloseRepairIssue[] {
  const seen = new Set<string>();
  const issues: TaskCloseRepairIssue[] = [];
  for (const issue of [...reports.close.issues, ...reports.audit.issues]) {
    const key = `${issue.severity}:${issue.code}:${issue.path ?? ''}:${issue.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    issues.push({ severity: issue.severity, code: issue.code, message: issue.message, ...(issue.path ? { path: issue.path } : {}) });
  }
  return issues;
}
