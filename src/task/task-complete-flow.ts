import type { HadaraActorContext } from '../core/actor-context';
import type { HadaraNextAction } from '../core/next-action';
import { createTaskAuditCloseReport, createTaskCloseReport, TaskAuditCloseReport, TaskCloseReport } from './task-close';
import { createTaskFinishReport, TaskFinishReport } from './task-finish';
import { createTaskLifecycleNextAction, defaultTaskLifecycleActor } from './lifecycle-next-actions';
import { createTaskReadyReportFromClosePlan, TaskReadyReport } from './task-ready';

export type TaskCompleteFlowStage =
  | 'evidence-required'
  | 'finish-required'
  | 'ready-required'
  | 'close-required'
  | 'audit-required'
  | 'handoff-update-suggested'
  | 'complete'
  | 'blocked'
  | 'unknown';

export interface TaskCompleteFlowReport {
  schemaVersion: 'hadara.task.complete_flow.v1';
  command: 'task.complete';
  ok: boolean;
  readOnly: true;
  taskId: string;
  generatedAt: string;
  actor: HadaraActorContext;
  stage: TaskCompleteFlowStage;
  primaryNextAction?: HadaraNextAction;
  nextActions: HadaraNextAction[];
  steps: TaskCompleteFlowStep[];
  conflicts: TaskCompleteFlowConflict[];
  stateDocs?: {
    pending: number;
    missing: number;
    current: number;
    recommendedActorRole: 'coordinator';
  };
  issues: TaskCompleteFlowIssue[];
}

export interface TaskCompleteFlowStep {
  id: 'evidence' | 'finish' | 'ready' | 'close' | 'audit-close' | 'handoff';
  status: 'passed' | 'required' | 'pending' | 'blocked' | 'warning' | 'skipped' | 'unknown';
  summary: string;
  sourceReport?: string;
}

export interface TaskCompleteFlowConflict {
  code: 'CONCURRENT_TASK_ACTIVITY' | 'STALE_PLAN' | 'SHARED_DOC_PENDING' | 'CLOSE_EVIDENCE_DUPLICATE' | 'UNKNOWN';
  severity: 'warning' | 'error';
  summary: string;
}

export interface TaskCompleteFlowIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
}

export interface TaskCompleteFlowOptions {
  executeRequested?: boolean;
  actor?: HadaraActorContext;
}

interface LifecycleReports {
  finish: TaskFinishReport;
  ready: TaskReadyReport;
  close: TaskCloseReport;
  audit: TaskAuditCloseReport;
}

export function createTaskCompleteFlowReport(projectRoot: string, taskId: string, options: TaskCompleteFlowOptions = {}): TaskCompleteFlowReport {
  const actor = options.actor ?? defaultTaskLifecycleActor();
  if (options.executeRequested) {
    return buildReport(taskId, actor, 'blocked', [], [
      { id: 'finish', status: 'skipped', summary: 'Task complete has no execute mode.' },
      { id: 'ready', status: 'skipped', summary: 'Task complete has no execute mode.' },
      { id: 'close', status: 'skipped', summary: 'Task complete has no execute mode.' },
      { id: 'audit-close', status: 'skipped', summary: 'Task complete has no execute mode.' }
    ], [], [
      {
        severity: 'error',
        code: 'TASK_COMPLETE_EXECUTE_UNSUPPORTED',
        message: 'task complete is read-only; use the reported lifecycle command instead of --execute.'
      }
    ]);
  }

  const close = createTaskCloseReport(projectRoot, taskId, 'dry-run', { actor });
  const reports: LifecycleReports = {
    finish: createTaskFinishReport(projectRoot, taskId, 'dry-run', { actor }),
    ready: createTaskReadyReportFromClosePlan(projectRoot, taskId, 'done', close, actor),
    close,
    audit: createTaskAuditCloseReport(projectRoot, taskId, { actor, closePlan: close })
  };

  const stateDocs = summarizeStateDocs(reports.finish);
  const issues = collectIssues(reports);
  const decision = chooseStageAndAction(taskId, reports, stateDocs);
  const steps = createSteps(decision.stage, reports, stateDocs);
  const conflicts = createConflicts(stateDocs);

  return buildReport(taskId, actor, decision.stage, decision.action ? [decision.action] : [], steps, conflicts, issues, stateDocs);
}

export function formatTaskCompleteFlowReport(report: TaskCompleteFlowReport): string {
  const lines = [`[HADARA] task complete ${report.taskId}: ${report.stage}`];
  lines.push(`readOnly=${report.readOnly} ok=${report.ok}`);
  if (report.primaryNextAction) lines.push(`next=${report.primaryNextAction.command ?? report.primaryNextAction.summary ?? report.primaryNextAction.id}`);
  for (const step of report.steps) lines.push(`${step.status.toUpperCase()}\t${step.id}\t${step.summary}`);
  for (const conflict of report.conflicts) lines.push(`[${conflict.severity}] ${conflict.code}: ${conflict.summary}`);
  for (const issue of report.issues) lines.push(`[${issue.severity}] ${issue.code}: ${issue.message}`);
  return lines.join('\n');
}

function buildReport(
  taskId: string,
  actor: HadaraActorContext,
  stage: TaskCompleteFlowStage,
  nextActions: HadaraNextAction[],
  steps: TaskCompleteFlowStep[],
  conflicts: TaskCompleteFlowConflict[],
  issues: TaskCompleteFlowIssue[],
  stateDocs?: TaskCompleteFlowReport['stateDocs']
): TaskCompleteFlowReport {
  return {
    schemaVersion: 'hadara.task.complete_flow.v1',
    command: 'task.complete',
    ok: stage === 'complete',
    readOnly: true,
    taskId,
    generatedAt: new Date().toISOString(),
    actor,
    stage,
    ...(nextActions[0] ? { primaryNextAction: nextActions[0] } : {}),
    nextActions,
    steps,
    conflicts,
    ...(stateDocs ? { stateDocs } : {}),
    issues
  };
}

function chooseStageAndAction(
  taskId: string,
  reports: LifecycleReports,
  stateDocs: TaskCompleteFlowReport['stateDocs'] | undefined
): { stage: TaskCompleteFlowStage; action?: HadaraNextAction } {
  if (reports.finish.issues.some((issue) => issue.code === 'TASK_NOT_FOUND')) {
    return { stage: 'unknown', action: missingTaskAction(taskId) };
  }
  if (!reports.finish.ok) return { stage: 'blocked', action: reports.finish.primaryNextAction };
  if (reports.finish.summary.plannedWrites > 0) return { stage: 'finish-required', action: reports.finish.primaryNextAction };
  if (stateDocs && stateDocs.pending + stateDocs.missing > 0) return { stage: 'handoff-update-suggested', action: reports.finish.primaryNextAction };
  if (!reports.ready.ok) {
    if (reports.ready.primaryNextAction?.id === 'refresh-evidence') return { stage: 'evidence-required', action: reports.ready.primaryNextAction };
    if (reports.ready.primaryNextAction?.id === 'finish-first') return { stage: 'finish-required', action: reports.ready.primaryNextAction };
    return { stage: 'ready-required', action: reports.ready.primaryNextAction };
  }
  if (!reports.close.ok) return { stage: 'ready-required', action: reports.close.primaryNextAction };
  if (!reports.audit.auditVerdict.closeEvidenceFound) {
    return {
      stage: 'close-required',
      action: reports.close.nextActions.find((action) => action.id === 'append-close-evidence') ?? reports.close.primaryNextAction
    };
  }
  if (!reports.audit.ok) return { stage: 'audit-required', action: reports.audit.primaryNextAction ?? auditIssueAction(taskId) };
  return { stage: 'complete' };
}

function createSteps(
  stage: TaskCompleteFlowStage,
  reports: LifecycleReports,
  stateDocs: TaskCompleteFlowReport['stateDocs'] | undefined
): TaskCompleteFlowStep[] {
  const blockedBeforeReady = stage === 'finish-required' || stage === 'handoff-update-suggested' || stage === 'blocked' || stage === 'unknown';
  const closePending = blockedBeforeReady || stage === 'ready-required' || stage === 'evidence-required';
  const auditPending = closePending || stage === 'close-required';
  return [
    {
      id: 'evidence',
      status: reports.close.evidenceLint.ok ? 'passed' : stage === 'evidence-required' ? 'required' : 'blocked',
      summary: reports.close.evidenceLint.ok ? 'Evidence lint passed.' : 'Evidence requires lint or semantic cleanup.',
      sourceReport: 'hadara.task.close.v1'
    },
    {
      id: 'finish',
      status: reports.finish.ok ? (reports.finish.summary.plannedWrites > 0 ? 'required' : 'passed') : stage === 'unknown' ? 'unknown' : 'blocked',
      summary: reports.finish.summary.plannedWrites > 0 ? 'Task status bookkeeping must be applied.' : reports.finish.ok ? 'Task finish bookkeeping is current.' : 'Task finish blockers must be resolved.',
      sourceReport: 'hadara.task.finish.v1'
    },
    {
      id: 'handoff',
      status: stateDocs && stateDocs.pending + stateDocs.missing > 0 ? 'warning' : reports.finish.ok ? 'passed' : 'pending',
      summary:
        stateDocs && stateDocs.pending + stateDocs.missing > 0
          ? 'Shared state docs have pending or missing task state.'
          : reports.finish.ok
            ? 'Shared state docs are current for this task.'
            : 'Shared state docs should be checked after finish blockers.',
      sourceReport: 'hadara.task.finish.v1'
    },
    {
      id: 'ready',
      status: blockedBeforeReady ? 'pending' : reports.ready.ok ? 'passed' : 'required',
      summary: blockedBeforeReady ? 'Ready check should run after earlier lifecycle guidance.' : reports.ready.ok ? 'Done-level readiness passed.' : 'Done-level readiness requires remediation.',
      sourceReport: 'hadara.task.ready.v1'
    },
    {
      id: 'close',
      status: closePending ? 'pending' : reports.audit.auditVerdict.closeEvidenceFound ? 'passed' : 'required',
      summary: closePending ? 'Close should run after readiness.' : reports.audit.auditVerdict.closeEvidenceFound ? 'Close evidence exists.' : 'Close evidence should be appended after reviewing the close plan.',
      sourceReport: 'hadara.task.close.v1'
    },
    {
      id: 'audit-close',
      status: auditPending ? 'pending' : reports.audit.ok ? 'passed' : 'required',
      summary: auditPending ? 'Audit should run after close evidence exists.' : reports.audit.ok ? 'Close audit passed.' : 'Close audit requires attention.',
      sourceReport: 'hadara.task.audit_close.v1'
    }
  ];
}

function summarizeStateDocs(report: TaskFinishReport): TaskCompleteFlowReport['stateDocs'] | undefined {
  if (report.stateDocs.length === 0) return undefined;
  return {
    pending: report.stateDocs.filter((doc) => doc.state === 'pending').length,
    missing: report.stateDocs.filter((doc) => doc.state === 'missing').length,
    current: report.stateDocs.filter((doc) => doc.state === 'current').length,
    recommendedActorRole: 'coordinator'
  };
}

function createConflicts(stateDocs: TaskCompleteFlowReport['stateDocs'] | undefined): TaskCompleteFlowConflict[] {
  if (!stateDocs || stateDocs.pending + stateDocs.missing === 0) return [];
  return [
    {
      code: 'SHARED_DOC_PENDING',
      severity: 'warning',
      summary: `${stateDocs.pending + stateDocs.missing} shared state doc(s) are pending or missing this task state.`
    }
  ];
}

function collectIssues(reports: LifecycleReports): TaskCompleteFlowIssue[] {
  const seen = new Set<string>();
  const issues: TaskCompleteFlowIssue[] = [];
  for (const issue of [...reports.finish.issues, ...reports.ready.issues, ...reports.close.issues, ...reports.audit.issues]) {
    const key = `${issue.severity}:${issue.code}:${issue.path ?? ''}:${issue.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    issues.push({ severity: issue.severity, code: issue.code, message: issue.message, ...(issue.path ? { path: issue.path } : {}) });
  }
  return issues;
}

function missingTaskAction(taskId: string): HadaraNextAction {
  return createTaskLifecycleNextAction({
    id: 'select-existing-task',
    kind: 'review',
    required: true,
    message: `Select an existing Task Capsule before completing ${taskId}.`,
    writeBoundary: 'read-only',
    recommendedActorRole: 'operator',
    requiresBeforeHash: false,
    stalePlanRisk: 'none'
  });
}

function auditIssueAction(taskId: string): HadaraNextAction {
  return createTaskLifecycleNextAction({
    id: 'resolve-audit-close-issues',
    kind: 'review',
    required: true,
    message: `Resolve close audit issues for ${taskId}.`,
    writeBoundary: 'read-only',
    recommendedActorRole: 'reviewer',
    requiresBeforeHash: false,
    stalePlanRisk: 'none'
  });
}
