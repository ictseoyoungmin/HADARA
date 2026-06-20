import crypto from 'node:crypto';
import type { HadaraActorContext } from '../core/actor-context';
import type { HadaraNextAction } from '../core/next-action';
import { createTaskAuditCloseReport, createTaskCloseReport, executeTaskCloseEvidence, TaskAuditCloseReport, TaskCloseReport } from './task-close';
import { createTaskFinishReport, TaskFinishReport } from './task-finish';
import { createTaskLifecycleNextAction, defaultTaskLifecycleActor } from './lifecycle-next-actions';
import { createTaskReadyReport, TaskReadyReport } from './task-ready';

export type TaskFinalizeMode = 'dry-run' | 'execute' | 'execute-refused';
export type TaskFinalizeStepId = 'finish' | 'ready' | 'close' | 'audit-close';
export type TaskFinalizeStepStatus = 'satisfied' | 'required' | 'blocked' | 'pending' | 'unknown';

export interface TaskFinalizeReport {
  schemaVersion: 'hadara.task.finalize.v1';
  command: 'task.finalize';
  ok: boolean;
  readOnly: boolean;
  mode: TaskFinalizeMode;
  taskId: string;
  generatedAt: string;
  actor: HadaraActorContext;
  planHash?: string;
  summary: {
    steps: number;
    required: number;
    blocked: number;
    satisfied: number;
    executeSupported: boolean;
  };
  steps: TaskFinalizeStep[];
  execution?: TaskFinalizeExecution;
  primaryNextAction?: HadaraNextAction;
  nextActions: HadaraNextAction[];
  issues: TaskFinalizeIssue[];
}

export interface TaskFinalizeStep {
  id: TaskFinalizeStepId;
  status: TaskFinalizeStepStatus;
  summary: string;
  command: string;
  mode: 'dry-run' | 'execute' | 'read-only';
  writeBoundary: 'read-only' | 'task-local' | 'evidence-append';
  expectedWritePaths: string[];
  alreadySatisfied: boolean;
  sourceReport: string;
}

export interface TaskFinalizeIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
}

export interface TaskFinalizeExecution {
  requestedPlanHash?: string;
  currentPlanHash?: string;
  planHashMatched: boolean;
  executedSteps: TaskFinalizeExecutedStep[];
  stoppedAt?: TaskFinalizeStepId;
}

export interface TaskFinalizeExecutedStep {
  id: TaskFinalizeStepId;
  status: 'executed' | 'satisfied' | 'blocked' | 'skipped';
  command: string;
  ok: boolean;
  reportHash: string;
  summary: string;
  writeBoundary: 'read-only' | 'task-local' | 'evidence-append';
}

export interface TaskFinalizeOptions {
  executeRequested?: boolean;
  planHash?: string;
  actor?: HadaraActorContext;
}

interface FinalizeReports {
  finish: TaskFinishReport;
  ready: TaskReadyReport;
  close: TaskCloseReport;
  audit: TaskAuditCloseReport;
}

export function createTaskFinalizeReport(projectRoot: string, taskId: string, options: TaskFinalizeOptions = {}): TaskFinalizeReport {
  const actor = options.actor ?? defaultTaskLifecycleActor();
  const reports = createFinalizeReports(projectRoot, taskId, actor);
  const steps = createSteps(taskId, reports);
  const issues = collectIssues(reports);
  const planHash = hashPlan(taskId, steps);
  if (options.executeRequested) return executeFinalizePlan(projectRoot, taskId, actor, reports, steps, issues, planHash, options.planHash);
  return createFinalizeReport(taskId, actor, 'dry-run', true, steps, issues, planHash);
}

export function formatTaskFinalizeReport(report: TaskFinalizeReport): string {
  const lines = [`[HADARA] task finalize ${report.taskId}: ${report.mode}`];
  lines.push(`readOnly=${report.readOnly} ok=${report.ok} planHash=${report.planHash ?? 'none'}`);
  if (report.primaryNextAction) lines.push(`next=${report.primaryNextAction.command ?? report.primaryNextAction.summary ?? report.primaryNextAction.id}`);
  for (const step of report.steps) lines.push(`${step.status.toUpperCase()}\t${step.id}\t${step.command}`);
  for (const issue of report.issues) lines.push(`[${issue.severity}] ${issue.code}: ${issue.message}`);
  return lines.join('\n');
}

function executeFinalizePlan(
  projectRoot: string,
  taskId: string,
  actor: HadaraActorContext,
  initialReports: FinalizeReports,
  initialSteps: TaskFinalizeStep[],
  initialIssues: TaskFinalizeIssue[],
  currentPlanHash: string,
  requestedPlanHash?: string
): TaskFinalizeReport {
  if (!requestedPlanHash) return createExecuteRefusal(taskId, actor, 'TASK_FINALIZE_PLAN_HASH_REQUIRED', 'task finalize --execute requires a reviewed --plan-hash from a dry-run report.', currentPlanHash, initialSteps);
  if (requestedPlanHash !== currentPlanHash) {
    return createExecuteRefusal(
      taskId,
      actor,
      'TASK_FINALIZE_PLAN_HASH_MISMATCH',
      'task finalize --execute refused because --plan-hash does not match the current dry-run plan.',
      currentPlanHash,
      initialSteps,
      {
        requestedPlanHash,
        currentPlanHash,
        planHashMatched: false,
        executedSteps: []
      }
    );
  }

  const executedSteps: TaskFinalizeExecutedStep[] = [];
  const initialBlocker = initialSteps.find((step) => step.status === 'blocked');
  if (initialBlocker) {
    return createFinalizeReport(taskId, actor, 'execute', false, initialSteps, initialIssues, currentPlanHash, {
      requestedPlanHash,
      currentPlanHash,
      planHashMatched: true,
      executedSteps: [createExecutedStep(initialBlocker, false, initialReports[reportKeyForStep(initialBlocker.id)], 'blocked')],
      stoppedAt: initialBlocker.id
    });
  }

  let reports = initialReports;
  let steps = initialSteps;
  let finishStep = steps.find((step) => step.id === 'finish');
  if (finishStep?.status === 'required') {
    const finishReport = createTaskFinishReport(projectRoot, taskId, 'execute', { actor });
    executedSteps.push(createExecutedStep(finishStep, finishReport.ok, finishReport, finishReport.ok ? 'executed' : 'blocked'));
    if (!finishReport.ok) return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, 'finish');
    reports = createFinalizeReports(projectRoot, taskId, actor);
    steps = createSteps(taskId, reports);
  } else if (finishStep?.status === 'satisfied') {
    executedSteps.push(createExecutedStep(finishStep, true, reports.finish, 'satisfied'));
  }

  const readyStep = steps.find((step) => step.id === 'ready');
  if (readyStep?.status !== 'satisfied') {
    executedSteps.push(createExecutedStep(readyStep ?? fallbackStep(taskId, 'ready'), reports.ready.ok, reports.ready, reports.ready.ok ? 'satisfied' : 'blocked'));
    return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, 'ready');
  }
  executedSteps.push(createExecutedStep(readyStep, true, reports.ready, 'satisfied'));

  const closeStep = steps.find((step) => step.id === 'close');
  if (closeStep?.status === 'required') {
    const closeReport = createTaskCloseReport(projectRoot, taskId, 'execute', { actor });
    if (closeReport.ok) executeTaskCloseEvidence(projectRoot, closeReport);
    executedSteps.push(createExecutedStep(closeStep, closeReport.ok, closeReport, closeReport.ok ? 'executed' : 'blocked'));
    if (!closeReport.ok) return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, 'close');
    reports = createFinalizeReports(projectRoot, taskId, actor);
    steps = createSteps(taskId, reports);
  } else if (closeStep?.status === 'satisfied') {
    executedSteps.push(createExecutedStep(closeStep, true, reports.close, 'satisfied'));
  } else {
    executedSteps.push(createExecutedStep(closeStep ?? fallbackStep(taskId, 'close'), false, reports.close, 'blocked'));
    return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, 'close');
  }

  const auditStep = steps.find((step) => step.id === 'audit-close');
  executedSteps.push(createExecutedStep(auditStep ?? fallbackStep(taskId, 'audit-close'), reports.audit.ok, reports.audit, reports.audit.ok ? 'satisfied' : 'blocked'));
  return createPostExecutionReport(projectRoot, taskId, actor, requestedPlanHash, currentPlanHash, executedSteps, reports.audit.ok ? undefined : 'audit-close');
}

function createPostExecutionReport(
  projectRoot: string,
  taskId: string,
  actor: HadaraActorContext,
  requestedPlanHash: string,
  reviewedPlanHash: string,
  executedSteps: TaskFinalizeExecutedStep[],
  stoppedAt?: TaskFinalizeStepId
): TaskFinalizeReport {
  const reports = createFinalizeReports(projectRoot, taskId, actor);
  const steps = createSteps(taskId, reports);
  const issues = collectIssues(reports);
  const nextAction = createPrimaryNextAction(taskId, steps);
  const finalAudit = reports.audit.auditVerdict.verdict === 'closed-valid';
  const execution: TaskFinalizeExecution = {
    requestedPlanHash,
    currentPlanHash: reviewedPlanHash,
    planHashMatched: true,
    executedSteps,
    ...(stoppedAt ? { stoppedAt } : {})
  };
  return {
    schemaVersion: 'hadara.task.finalize.v1',
    command: 'task.finalize',
    ok: finalAudit && issues.every((issue) => issue.severity !== 'error') && steps.every((step) => step.status === 'satisfied'),
    readOnly: false,
    mode: 'execute',
    taskId,
    generatedAt: new Date().toISOString(),
    actor,
    planHash: reviewedPlanHash,
    summary: summarizeSteps(steps),
    steps,
    execution,
    ...(nextAction ? { primaryNextAction: nextAction } : {}),
    nextActions: nextAction ? [nextAction] : [],
    issues
  };
}

function createFinalizeReport(
  taskId: string,
  actor: HadaraActorContext,
  mode: TaskFinalizeMode,
  readOnly: boolean,
  steps: TaskFinalizeStep[],
  issues: TaskFinalizeIssue[],
  planHash?: string,
  execution?: TaskFinalizeExecution
): TaskFinalizeReport {
  const nextAction = createPrimaryNextAction(taskId, steps);
  return {
    schemaVersion: 'hadara.task.finalize.v1',
    command: 'task.finalize',
    ok: mode === 'execute' ? false : issues.every((issue) => issue.severity !== 'error') && steps.every((step) => step.status === 'satisfied'),
    readOnly,
    mode,
    taskId,
    generatedAt: new Date().toISOString(),
    actor,
    ...(planHash ? { planHash } : {}),
    summary: summarizeSteps(steps),
    steps,
    ...(execution ? { execution } : {}),
    ...(nextAction ? { primaryNextAction: nextAction } : {}),
    nextActions: nextAction ? [nextAction] : [],
    issues
  };
}

function createExecuteRefusal(
  taskId: string,
  actor: HadaraActorContext,
  code: string,
  message: string,
  currentPlanHash: string,
  steps: TaskFinalizeStep[],
  execution?: TaskFinalizeExecution
): TaskFinalizeReport {
  return {
    ...createFinalizeReport(taskId, actor, 'execute-refused', true, steps, [{ severity: 'error', code, message }], currentPlanHash, execution),
    ok: false
  };
}

function createFinalizeReports(projectRoot: string, taskId: string, actor: HadaraActorContext): FinalizeReports {
  return {
    finish: createTaskFinishReport(projectRoot, taskId, 'dry-run', { actor }),
    ready: createTaskReadyReport(projectRoot, taskId, 'done', { actor }),
    close: createTaskCloseReport(projectRoot, taskId, 'dry-run', { actor }),
    audit: createTaskAuditCloseReport(projectRoot, taskId, { actor })
  };
}

function createSteps(taskId: string, reports: FinalizeReports): TaskFinalizeStep[] {
  const finishStatus = reports.finish.ok ? (reports.finish.summary.plannedWrites > 0 ? 'required' : 'satisfied') : 'blocked';
  const readyStatus = finishStatus === 'satisfied' ? (reports.ready.ok ? 'satisfied' : 'required') : 'pending';
  const closeStatus = readyStatus === 'satisfied' ? (reports.audit.auditVerdict.closeEvidenceFound ? 'satisfied' : reports.close.ok ? 'required' : 'blocked') : 'pending';
  const auditStatus = reports.audit.auditVerdict.closeEvidenceFound ? (reports.audit.ok ? 'satisfied' : 'required') : 'pending';
  return [
    {
      id: 'finish',
      status: finishStatus,
      summary: finishStatus === 'required' ? 'Apply bounded finish bookkeeping.' : finishStatus === 'satisfied' ? 'Finish bookkeeping is current.' : 'Finish blockers must be resolved.',
      command: finishStatus === 'required' ? `hadara task finish --task ${taskId} --execute --json` : `hadara task finish --task ${taskId} --json`,
      mode: finishStatus === 'required' ? 'execute' : 'dry-run',
      writeBoundary: finishStatus === 'required' ? 'task-local' : 'read-only',
      expectedWritePaths: reports.finish.writes.map((write) => write.path),
      alreadySatisfied: finishStatus === 'satisfied',
      sourceReport: 'hadara.task.finish.v1'
    },
    {
      id: 'ready',
      status: readyStatus,
      summary: readyStatus === 'satisfied' ? 'Done-level readiness passed.' : readyStatus === 'pending' ? 'Ready waits for finish.' : 'Run readiness and resolve blockers.',
      command: `hadara task ready --task ${taskId} --level done --json`,
      mode: 'read-only',
      writeBoundary: 'read-only',
      expectedWritePaths: [],
      alreadySatisfied: readyStatus === 'satisfied',
      sourceReport: 'hadara.task.ready.v1'
    },
    {
      id: 'close',
      status: closeStatus,
      summary: closeStatus === 'required' ? 'Append close evidence after reviewing close dry-run.' : closeStatus === 'satisfied' ? 'Close evidence exists.' : closeStatus === 'pending' ? 'Close waits for readiness.' : 'Close preconditions have blockers.',
      command: closeStatus === 'required' ? `hadara task close --task ${taskId} --execute --json` : `hadara task close --task ${taskId} --json`,
      mode: closeStatus === 'required' ? 'execute' : 'dry-run',
      writeBoundary: closeStatus === 'required' ? 'evidence-append' : 'read-only',
      expectedWritePaths: closeStatus === 'required' && reports.finish.task ? [`${reports.finish.task.capsule}/evidence.jsonl`] : [],
      alreadySatisfied: closeStatus === 'satisfied',
      sourceReport: 'hadara.task.close.v1'
    },
    {
      id: 'audit-close',
      status: auditStatus,
      summary: auditStatus === 'satisfied' ? 'Close audit passed.' : auditStatus === 'pending' ? 'Audit waits for close evidence.' : 'Run close audit and repair any drift.',
      command: `hadara task audit-close --task ${taskId} --json`,
      mode: 'read-only',
      writeBoundary: 'read-only',
      expectedWritePaths: [],
      alreadySatisfied: auditStatus === 'satisfied',
      sourceReport: 'hadara.task.audit_close.v1'
    }
  ];
}

function collectIssues(reports: FinalizeReports): TaskFinalizeIssue[] {
  const seen = new Set<string>();
  const issues: TaskFinalizeIssue[] = [];
  for (const issue of [...reports.finish.issues, ...reports.ready.issues, ...reports.close.issues, ...reports.audit.issues]) {
    const key = `${issue.severity}:${issue.code}:${issue.path ?? ''}:${issue.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    issues.push({ severity: issue.severity, code: issue.code, message: issue.message, ...(issue.path ? { path: issue.path } : {}) });
  }
  return issues;
}

function createPrimaryNextAction(taskId: string, steps: TaskFinalizeStep[]): HadaraNextAction | undefined {
  const nextStep = steps.find((step) => step.status === 'required' || step.status === 'blocked');
  if (!nextStep) return undefined;
  return createTaskLifecycleNextAction({
    id: `finalize-${nextStep.id}`,
    kind: nextStep.status === 'blocked' ? 'review' : 'command',
    required: true,
    command: nextStep.status === 'blocked' ? undefined : nextStep.command,
    message: nextStep.summary,
    writeBoundary: nextStep.writeBoundary,
    recommendedActorRole: nextStep.writeBoundary === 'read-only' ? 'reviewer' : 'worker',
    requiresBeforeHash: false,
    stalePlanRisk: nextStep.writeBoundary === 'read-only' ? 'none' : 'low'
  });
}

function summarizeSteps(steps: TaskFinalizeStep[]): TaskFinalizeReport['summary'] {
  return {
    steps: steps.length,
    required: steps.filter((step) => step.status === 'required').length,
    blocked: steps.filter((step) => step.status === 'blocked').length,
    satisfied: steps.filter((step) => step.status === 'satisfied').length,
    executeSupported: true
  };
}

function createExecutedStep(step: TaskFinalizeStep, ok: boolean, report: unknown, status: TaskFinalizeExecutedStep['status']): TaskFinalizeExecutedStep {
  return {
    id: step.id,
    status,
    command: step.command,
    ok,
    reportHash: hashReport(report),
    summary: step.summary,
    writeBoundary: step.writeBoundary
  };
}

function hashReport(report: unknown): string {
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify(report)).digest('hex')}`;
}

function reportKeyForStep(stepId: TaskFinalizeStepId): keyof FinalizeReports {
  if (stepId === 'finish') return 'finish';
  if (stepId === 'ready') return 'ready';
  if (stepId === 'close') return 'close';
  return 'audit';
}

function fallbackStep(taskId: string, id: TaskFinalizeStepId): TaskFinalizeStep {
  return {
    id,
    status: 'unknown',
    summary: 'Step state could not be determined.',
    command: id === 'audit-close' ? `hadara task audit-close --task ${taskId} --json` : `hadara task ${id} --task ${taskId} --json`,
    mode: 'read-only',
    writeBoundary: 'read-only',
    expectedWritePaths: [],
    alreadySatisfied: false,
    sourceReport: 'unknown'
  };
}

function hashPlan(taskId: string, steps: TaskFinalizeStep[]): string {
  const stable = {
    taskId,
    steps: steps.map((step) => ({
      id: step.id,
      status: step.status,
      command: step.command,
      mode: step.mode,
      writeBoundary: step.writeBoundary,
      expectedWritePaths: step.expectedWritePaths,
      alreadySatisfied: step.alreadySatisfied,
      sourceReport: step.sourceReport
    }))
  };
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify(stable)).digest('hex')}`;
}
