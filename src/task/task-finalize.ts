import crypto from 'node:crypto';
import type { HadaraActorContext } from '../core/actor-context';
import type { HadaraNextAction } from '../core/next-action';
import { createTaskAuditCloseReport, createTaskCloseReport, TaskAuditCloseReport, TaskCloseReport } from './task-close';
import { createTaskFinishReport, TaskFinishReport } from './task-finish';
import { createTaskLifecycleNextAction, defaultTaskLifecycleActor } from './lifecycle-next-actions';
import { createTaskReadyReport, TaskReadyReport } from './task-ready';

export type TaskFinalizeMode = 'dry-run' | 'execute-refused';
export type TaskFinalizeStepId = 'finish' | 'ready' | 'close' | 'audit-close';
export type TaskFinalizeStepStatus = 'satisfied' | 'required' | 'blocked' | 'pending' | 'unknown';

export interface TaskFinalizeReport {
  schemaVersion: 'hadara.task.finalize.v1';
  command: 'task.finalize';
  ok: boolean;
  readOnly: true;
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
    executeSupported: false;
  };
  steps: TaskFinalizeStep[];
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
  if (options.executeRequested) return createExecuteRefusal(taskId, actor, options.planHash);
  const reports: FinalizeReports = {
    finish: createTaskFinishReport(projectRoot, taskId, 'dry-run', { actor }),
    ready: createTaskReadyReport(projectRoot, taskId, 'done', { actor }),
    close: createTaskCloseReport(projectRoot, taskId, 'dry-run', { actor }),
    audit: createTaskAuditCloseReport(projectRoot, taskId, { actor })
  };
  const steps = createSteps(taskId, reports);
  const issues = collectIssues(reports);
  const nextAction = createPrimaryNextAction(taskId, steps);
  const planHash = hashPlan(taskId, steps);
  return {
    schemaVersion: 'hadara.task.finalize.v1',
    command: 'task.finalize',
    ok: issues.every((issue) => issue.severity !== 'error') && steps.every((step) => step.status === 'satisfied'),
    readOnly: true,
    mode: 'dry-run',
    taskId,
    generatedAt: new Date().toISOString(),
    actor,
    planHash,
    summary: summarizeSteps(steps),
    steps,
    ...(nextAction ? { primaryNextAction: nextAction } : {}),
    nextActions: nextAction ? [nextAction] : [],
    issues
  };
}

export function formatTaskFinalizeReport(report: TaskFinalizeReport): string {
  const lines = [`[HADARA] task finalize ${report.taskId}: ${report.mode}`];
  lines.push(`readOnly=${report.readOnly} ok=${report.ok} planHash=${report.planHash ?? 'none'}`);
  if (report.primaryNextAction) lines.push(`next=${report.primaryNextAction.command ?? report.primaryNextAction.summary ?? report.primaryNextAction.id}`);
  for (const step of report.steps) lines.push(`${step.status.toUpperCase()}\t${step.id}\t${step.command}`);
  for (const issue of report.issues) lines.push(`[${issue.severity}] ${issue.code}: ${issue.message}`);
  return lines.join('\n');
}

function createExecuteRefusal(taskId: string, actor: HadaraActorContext, planHash?: string): TaskFinalizeReport {
  const code = planHash ? 'TASK_FINALIZE_EXECUTE_DEFERRED' : 'TASK_FINALIZE_PLAN_HASH_REQUIRED';
  const message = planHash
    ? 'task finalize execute is reserved for a later guarded orchestration capsule.'
    : 'task finalize --execute requires a reviewed --plan-hash from a dry-run report.';
  return {
    schemaVersion: 'hadara.task.finalize.v1',
    command: 'task.finalize',
    ok: false,
    readOnly: true,
    mode: 'execute-refused',
    taskId,
    generatedAt: new Date().toISOString(),
    actor,
    summary: { steps: 0, required: 0, blocked: 1, satisfied: 0, executeSupported: false },
    steps: [],
    nextActions: [],
    issues: [{ severity: 'error', code, message }]
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
    executeSupported: false
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
