import type { HadaraActorContext } from '../core/actor-context';
import type { HadaraNextAction } from '../core/next-action';
import { createTaskAuditCloseReport, createTaskCloseReport, TaskAuditCloseReport, TaskCloseReport } from './task-close';
import { createTaskFinishReport, TaskFinishReport } from './task-finish';
import { createTaskLifecycleNextAction, defaultTaskLifecycleActor } from './lifecycle-next-actions';
import { createTaskReadyReport, TaskReadyReport } from './task-ready';

export type TaskLifecyclePhase =
  | 'draft'
  | 'in-progress'
  | 'finish-required'
  | 'ready-required'
  | 'close-required'
  | 'audit-required'
  | 'closed-valid'
  | 'repair-required'
  | 'blocked'
  | 'unknown';

export type TaskLifecycleCheckStatus = 'satisfied' | 'required' | 'blocked' | 'warning' | 'pending' | 'unknown';

export interface TaskLifecycleReport {
  schemaVersion: 'hadara.task.lifecycle.v1';
  command: 'task.lifecycle';
  ok: boolean;
  readOnly: true;
  taskId: string;
  generatedAt: string;
  actor: HadaraActorContext;
  phase: TaskLifecyclePhase;
  checks: TaskLifecycleChecks;
  satisfied: string[];
  blockers: TaskLifecycleBlocker[];
  repair?: TaskLifecycleRepair;
  primaryNextAction?: HadaraNextAction;
  nextActions: HadaraNextAction[];
  issues: TaskLifecycleIssue[];
}

export interface TaskLifecycleChecks {
  finish: TaskLifecycleCheck;
  sharedDocs: TaskLifecycleCheck;
  ready: TaskLifecycleCheck;
  close: TaskLifecycleCheck;
  audit: TaskLifecycleCheck;
}

export interface TaskLifecycleCheck {
  status: TaskLifecycleCheckStatus;
  summary: string;
  sourceReport: string;
  command?: string;
}

export interface TaskLifecycleBlocker {
  code: string;
  severity: 'error' | 'warning';
  summary: string;
  command?: string;
}

export interface TaskLifecycleRepair {
  classification: 'not-closed' | 'closed-stale' | 'closed-invalid' | 'duplicate-close-proof' | 'closed-valid' | 'unknown';
  summary: string;
  nextCommand?: string;
  sourceReport: 'hadara.task.audit_close.v1';
}

export interface TaskLifecycleIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
}

export interface TaskLifecycleOptions {
  actor?: HadaraActorContext;
}

interface LifecycleReports {
  finish: TaskFinishReport;
  ready: TaskReadyReport;
  close: TaskCloseReport;
  audit: TaskAuditCloseReport;
}

export function createTaskLifecycleReport(projectRoot: string, taskId: string, options: TaskLifecycleOptions = {}): TaskLifecycleReport {
  const actor = options.actor ?? defaultTaskLifecycleActor();
  const reports: LifecycleReports = {
    finish: createTaskFinishReport(projectRoot, taskId, 'dry-run', { actor }),
    ready: createTaskReadyReport(projectRoot, taskId, 'done', { actor }),
    close: createTaskCloseReport(projectRoot, taskId, 'dry-run', { actor }),
    audit: createTaskAuditCloseReport(projectRoot, taskId, { actor })
  };
  const checks = createChecks(taskId, reports);
  const repair = createRepair(taskId, reports.audit);
  const phase = choosePhase(reports, checks, repair);
  const nextAction = chooseNextAction(taskId, phase, reports, checks, repair);
  const issues = collectIssues(reports);
  const blockers = collectBlockers(phase, reports, checks, repair);
  const satisfied = Object.entries(checks)
    .filter(([, check]) => check.status === 'satisfied')
    .map(([id]) => id);

  return {
    schemaVersion: 'hadara.task.lifecycle.v1',
    command: 'task.lifecycle',
    ok: !reports.finish.issues.some((issue) => issue.code === 'TASK_NOT_FOUND'),
    readOnly: true,
    taskId,
    generatedAt: new Date().toISOString(),
    actor,
    phase,
    checks,
    satisfied,
    blockers,
    ...(repair ? { repair } : {}),
    ...(nextAction ? { primaryNextAction: nextAction } : {}),
    nextActions: nextAction ? [nextAction] : [],
    issues
  };
}

export function formatTaskLifecycleReport(report: TaskLifecycleReport): string {
  const lines = [`[HADARA] task lifecycle ${report.taskId}: ${report.phase}`];
  lines.push(`readOnly=${report.readOnly} ok=${report.ok}`);
  if (report.primaryNextAction) lines.push(`next=${report.primaryNextAction.command ?? report.primaryNextAction.summary ?? report.primaryNextAction.id}`);
  for (const [id, check] of Object.entries(report.checks)) lines.push(`${check.status.toUpperCase()}\t${id}\t${check.summary}`);
  for (const blocker of report.blockers) lines.push(`[${blocker.severity}] ${blocker.code}: ${blocker.summary}`);
  if (report.repair && report.repair.classification !== 'closed-valid') lines.push(`repair=${report.repair.classification}\t${report.repair.summary}`);
  return lines.join('\n');
}

function createChecks(taskId: string, reports: LifecycleReports): TaskLifecycleChecks {
  const sharedDocsPending = reports.finish.stateDocs.filter((doc) => doc.state === 'pending' || doc.state === 'missing');
  return {
    finish: {
      status: reports.finish.ok ? (reports.finish.summary.plannedWrites > 0 ? 'required' : 'satisfied') : 'blocked',
      summary: reports.finish.summary.plannedWrites > 0 ? 'Task status bookkeeping has planned writes.' : reports.finish.ok ? 'Task finish bookkeeping is current.' : 'Task finish blockers exist.',
      sourceReport: 'hadara.task.finish.v1',
      command: reports.finish.summary.plannedWrites > 0 ? `hadara task finish --task ${taskId} --json` : undefined
    },
    sharedDocs: {
      status: sharedDocsPending.length > 0 ? 'warning' : reports.finish.ok ? 'satisfied' : 'pending',
      summary: sharedDocsPending.length > 0 ? `${sharedDocsPending.length} shared state doc(s) are pending or missing this task.` : 'Shared state docs are current for this task.',
      sourceReport: 'hadara.task.finish.v1'
    },
    ready: {
      status: reports.ready.ok ? 'satisfied' : 'required',
      summary: reports.ready.ok ? 'Done-level readiness passed.' : 'Done-level readiness requires remediation.',
      sourceReport: 'hadara.task.ready.v1',
      command: `hadara task ready --task ${taskId} --level done --json`
    },
    close: {
      status: reports.audit.auditVerdict.closeEvidenceFound ? 'satisfied' : reports.close.ok ? 'required' : 'blocked',
      summary: reports.audit.auditVerdict.closeEvidenceFound ? 'Close evidence exists.' : reports.close.ok ? 'Close evidence has not been appended.' : 'Close preconditions have blockers.',
      sourceReport: 'hadara.task.close.v1',
      command: reports.audit.auditVerdict.closeEvidenceFound ? undefined : `hadara task close --task ${taskId} --json`
    },
    audit: {
      status: reports.audit.ok ? 'satisfied' : reports.audit.auditVerdict.closeEvidenceFound ? 'required' : 'pending',
      summary: reports.audit.ok ? 'Close audit passed.' : reports.audit.auditVerdict.closeEvidenceFound ? 'Close audit requires repair.' : 'Audit waits for close evidence.',
      sourceReport: 'hadara.task.audit_close.v1',
      command: `hadara task audit-close --task ${taskId} --json`
    }
  };
}

function choosePhase(reports: LifecycleReports, checks: TaskLifecycleChecks, repair: TaskLifecycleRepair | undefined): TaskLifecyclePhase {
  if (reports.finish.issues.some((issue) => issue.code === 'TASK_NOT_FOUND')) return 'unknown';
  if (!reports.finish.ok) return 'blocked';
  if (checks.finish.status === 'required') return 'finish-required';
  if (checks.sharedDocs.status === 'warning') return 'ready-required';
  if (!reports.ready.ok) return 'ready-required';
  if (!reports.close.ok) return 'ready-required';
  if (!reports.audit.auditVerdict.closeEvidenceFound) return 'close-required';
  if (reports.audit.ok) return 'closed-valid';
  if (repair && repair.classification !== 'closed-valid') return 'repair-required';
  return 'audit-required';
}

function chooseNextAction(
  taskId: string,
  phase: TaskLifecyclePhase,
  reports: LifecycleReports,
  checks: TaskLifecycleChecks,
  repair: TaskLifecycleRepair | undefined
): HadaraNextAction | undefined {
  if (phase === 'closed-valid') return undefined;
  if (phase === 'unknown') return reviewAction('select-existing-task', `Select an existing Task Capsule before inspecting lifecycle state for ${taskId}.`);
  if (phase === 'blocked') return reports.finish.primaryNextAction ?? reviewAction('resolve-finish-blockers', `Resolve task finish blockers for ${taskId}.`);
  if (phase === 'finish-required') return reports.finish.primaryNextAction;
  if (checks.sharedDocs.status === 'warning') {
    return reports.finish.primaryNextAction ?? reviewAction('update-state-docs', `Update shared state docs for ${taskId} before close.`, 'shared-doc', 'coordinator', true, 'medium');
  }
  if (phase === 'ready-required') return reports.ready.primaryNextAction ?? reports.close.primaryNextAction;
  if (phase === 'close-required') return reports.close.nextActions.find((action) => action.id === 'append-close-evidence') ?? reports.close.primaryNextAction;
  if (phase === 'repair-required') {
    return reviewAction('repair-close-proof', repair?.summary ?? `Repair close proof for ${taskId}.`, 'read-only', 'reviewer', false, 'none', repair?.nextCommand);
  }
  if (phase === 'audit-required') return reports.audit.primaryNextAction ?? reviewAction('run-audit-close', `Run close audit for ${taskId}.`, 'read-only', 'reviewer', false, 'none', `hadara task audit-close --task ${taskId} --json`);
  return undefined;
}

function createRepair(taskId: string, audit: TaskAuditCloseReport): TaskLifecycleRepair | undefined {
  if (audit.ok) {
    return {
      classification: 'closed-valid',
      summary: 'Close proof is current and valid.',
      sourceReport: 'hadara.task.audit_close.v1'
    };
  }
  if (!audit.auditVerdict.closeEvidenceFound) {
    return {
      classification: 'not-closed',
      summary: 'No close evidence exists for this task.',
      nextCommand: `hadara task close --task ${taskId} --json`,
      sourceReport: 'hadara.task.audit_close.v1'
    };
  }
  if (!audit.auditVerdict.closeEvidenceValid) {
    return {
      classification: 'closed-invalid',
      summary: 'Close evidence exists but is invalid or malformed.',
      nextCommand: `hadara task close --task ${taskId} --json`,
      sourceReport: 'hadara.task.audit_close.v1'
    };
  }
  if (!audit.auditVerdict.reportHashMatches || !audit.auditVerdict.sourceHashMatches) {
    return {
      classification: 'closed-stale',
      summary: 'Close evidence exists but no longer matches current validation or source hashes.',
      nextCommand: `hadara task close --task ${taskId} --json`,
      sourceReport: 'hadara.task.audit_close.v1'
    };
  }
  return {
    classification: 'unknown',
    summary: 'Close audit did not pass and no specific repair classification matched.',
    nextCommand: `hadara task audit-close --task ${taskId} --json`,
    sourceReport: 'hadara.task.audit_close.v1'
  };
}

function collectBlockers(
  phase: TaskLifecyclePhase,
  reports: LifecycleReports,
  checks: TaskLifecycleChecks,
  repair: TaskLifecycleRepair | undefined
): TaskLifecycleBlocker[] {
  const blockers: TaskLifecycleBlocker[] = [];
  if (phase === 'unknown') blockers.push({ code: 'TASK_LIFECYCLE_TASK_UNKNOWN', severity: 'error', summary: 'Task was not found.' });
  if (phase === 'blocked') blockers.push({ code: 'TASK_LIFECYCLE_FINISH_BLOCKED', severity: 'error', summary: 'Task finish report has blockers.', command: reports.finish.primaryNextAction?.command });
  if (checks.sharedDocs.status === 'warning') blockers.push({ code: 'TASK_LIFECYCLE_SHARED_DOCS_PENDING', severity: 'warning', summary: checks.sharedDocs.summary, command: reports.finish.primaryNextAction?.command });
  if (phase === 'repair-required' && repair) blockers.push({ code: 'TASK_LIFECYCLE_CLOSE_REPAIR_REQUIRED', severity: 'warning', summary: repair.summary, command: repair.nextCommand });
  return blockers;
}

function collectIssues(reports: LifecycleReports): TaskLifecycleIssue[] {
  const seen = new Set<string>();
  const issues: TaskLifecycleIssue[] = [];
  for (const issue of [...reports.finish.issues, ...reports.ready.issues, ...reports.close.issues, ...reports.audit.issues]) {
    const key = `${issue.severity}:${issue.code}:${issue.path ?? ''}:${issue.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    issues.push({ severity: issue.severity, code: issue.code, message: issue.message, ...(issue.path ? { path: issue.path } : {}) });
  }
  return issues;
}

function reviewAction(
  id: string,
  message: string,
  writeBoundary: HadaraNextAction['writeBoundary'] = 'read-only',
  recommendedActorRole: HadaraNextAction['recommendedActorRole'] = 'worker',
  requiresBeforeHash = false,
  stalePlanRisk: HadaraNextAction['stalePlanRisk'] = 'none',
  command?: string
): HadaraNextAction {
  return createTaskLifecycleNextAction({
    id,
    kind: command ? 'command' : 'review',
    required: true,
    message,
    ...(command ? { command } : {}),
    writeBoundary,
    recommendedActorRole,
    requiresBeforeHash,
    stalePlanRisk
  });
}
