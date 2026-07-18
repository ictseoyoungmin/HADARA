import crypto from 'node:crypto';
import type { HadaraActorContext } from '../core/actor-context';
import type { HadaraNextAction } from '../core/next-action';
import { createTaskFinalizeReport, formatTaskFinalizeReport, type TaskFinalizeOptions, type TaskFinalizeProgressEvent, type TaskFinalizeReport } from './task-finalize';
import { defaultTaskLifecycleActor } from './lifecycle-next-actions';

export type TaskCloseTransactionMode = 'dry-run' | 'execute' | 'execute-refused';

export interface TaskCloseTransactionOptions {
  dryRun?: boolean;
  executeRequested?: boolean;
  planHash?: string;
  actor?: HadaraActorContext;
  onProgress?: (event: TaskFinalizeProgressEvent) => void;
}

export interface TaskCloseTransactionReport {
  schemaVersion: 'hadara.task.close.v2';
  command: 'task.close';
  ok: boolean;
  mode: TaskCloseTransactionMode;
  taskId: string;
  generatedAt: string;
  actor: HadaraActorContext;
  closeState: TaskFinalizeReport['state'];
  planStatus: TaskFinalizeReport['planStatus'];
  readOnly: boolean;
  transaction: {
    strategy: 'finalize-auto' | 'finalize-reviewed-plan' | 'review-only';
    internalReview: boolean;
    planHash?: string;
    proofLast: true;
    stalePlanGuard: true;
  };
  writeSummary: {
    plannedWrites: number;
    executedWrites: number;
    executedSteps: string[];
    stoppedAt?: string;
    closeProofAppended: boolean;
    idempotentNoop: boolean;
  };
  recovery?: {
    required: boolean;
    action: HadaraNextAction;
  };
  primaryNextAction?: HadaraNextAction;
  nextActions: HadaraNextAction[];
  source: {
    finalize: TaskFinalizeReport;
  };
  diagnostics?: { generatedBy: 'cli'; commandPath: string; durationMs: number; slowThresholdMs: number; slow: boolean; note?: string };
  issues: TaskFinalizeReport['issues'];
}

export function createTaskCloseTransactionReport(
  projectRoot: string,
  taskId: string,
  options: TaskCloseTransactionOptions = {}
): TaskCloseTransactionReport {
  const actor = options.actor ?? defaultTaskLifecycleActor();
  if (options.dryRun) {
    return fromFinalizeReport(taskId, createTaskFinalizeReport(projectRoot, taskId, { actor }), {
      mode: 'dry-run',
      strategy: 'review-only',
      internalReview: false
    });
  }

  const finalizeOptions: TaskFinalizeOptions = {
    executeRequested: true,
    actor,
    recordReadinessEvidence: true,
    onProgress: options.onProgress
  };
  const strategy = options.planHash ? 'finalize-reviewed-plan' : 'finalize-auto';
  if (options.planHash) {
    finalizeOptions.planHash = options.planHash;
  } else {
    finalizeOptions.auto = true;
  }

  const finalize = createTaskFinalizeReport(projectRoot, taskId, finalizeOptions);
  return fromFinalizeReport(taskId, finalize, {
    mode: finalize.mode === 'execute-refused' ? 'execute-refused' : finalize.readOnly ? 'dry-run' : 'execute',
    strategy,
    internalReview: strategy === 'finalize-auto'
  });
}

export function formatTaskCloseTransactionReport(report: TaskCloseTransactionReport): string {
  const lines = [
    `[HADARA] task close ${report.taskId}: ${report.ok ? 'ok' : 'blocked'}`,
    `state\t${report.closeState}`,
    `mode\t${report.mode}`,
    `strategy\t${report.transaction.strategy}`,
    `writes\tplanned=${report.writeSummary.plannedWrites} executed=${report.writeSummary.executedWrites}`,
    `closeProofAppended\t${report.writeSummary.closeProofAppended}`,
    ''
  ];
  if (report.recovery?.action.command) {
    lines.push(`next\t${report.recovery.action.command}`);
  } else if (report.primaryNextAction?.command) {
    lines.push(`next\t${report.primaryNextAction.command}`);
  }
  if (report.issues.length > 0) {
    lines.push('', 'Issues:');
    for (const issue of report.issues) lines.push(`- [${issue.severity}] ${issue.code}: ${issue.message}`);
  }
  lines.push('', 'Finalize source:', formatTaskFinalizeReport(report.source.finalize));
  return lines.join('\n');
}

function fromFinalizeReport(
  taskId: string,
  finalize: TaskFinalizeReport,
  options: {
    mode: TaskCloseTransactionMode;
    strategy: TaskCloseTransactionReport['transaction']['strategy'];
    internalReview: boolean;
  }
): TaskCloseTransactionReport {
  const executedSteps = finalize.execution?.executedSteps ?? [];
  const executedWrites = executedSteps.filter((step) => step.writeBoundary !== 'read-only' && step.status === 'executed').length;
  const closeProofAppended = executedSteps.some((step) => step.id === 'close' && step.status === 'executed' && step.ok);
  const idempotentNoop = finalize.ok && finalize.state === 'closed-valid' && executedWrites === 0 && finalize.pendingWrites.length === 0;
  const recoveryAction = finalize.ok ? undefined : normalizeCloseNextAction(taskId, finalize.primaryNextAction ?? finalize.nextActions.find((action) => action.required));
  const transactionPlanHash = finalize.execution?.requestedPlanHash ?? finalize.planHash ?? hashObject({ taskId, state: finalize.state, issues: finalize.issues });
  const nextActions = finalize.nextActions.map((action) => normalizeCloseNextAction(taskId, action) ?? action);

  return {
    schemaVersion: 'hadara.task.close.v2',
    command: 'task.close',
    ok: finalize.ok,
    mode: options.mode,
    taskId,
    generatedAt: finalize.generatedAt,
    actor: finalize.actor,
    closeState: finalize.state,
    planStatus: finalize.planStatus,
    readOnly: finalize.readOnly,
    transaction: {
      strategy: options.strategy,
      internalReview: options.internalReview,
      planHash: transactionPlanHash,
      proofLast: true,
      stalePlanGuard: true
    },
    writeSummary: {
      plannedWrites: finalize.pendingWrites.length,
      executedWrites,
      executedSteps: executedSteps.map((step) => step.id),
      ...(finalize.execution?.stoppedAt ? { stoppedAt: finalize.execution.stoppedAt } : {}),
      closeProofAppended,
      idempotentNoop
    },
    ...(recoveryAction ? { recovery: { required: true, action: recoveryAction }, primaryNextAction: recoveryAction } : finalize.primaryNextAction ? { primaryNextAction: finalize.primaryNextAction } : {}),
    nextActions,
    source: { finalize },
    issues: finalize.issues
  };
}

function normalizeCloseNextAction(taskId: string, action: HadaraNextAction | undefined): HadaraNextAction | undefined {
  if (!action) return undefined;
  if (!action.command) return action;
  let command = action.command;
  command = command.replace(`hadara task finalize --task ${taskId} --execute --auto --json`, `hadara task close --task ${taskId} --json`);
  command = command.replace(`hadara task finalize --task ${taskId} --json`, `hadara task close --task ${taskId} --dry-run --json`);
  command = command.replace(`hadara task finalize --task ${taskId} --execute --plan-hash`, `hadara task close --task ${taskId} --execute --plan-hash`);
  if (command === action.command) return action;
  return {
    ...action,
    command,
    summary: action.summary.replace(/\bfinalize\b/gi, 'task close')
  };
}

function hashObject(value: unknown): string {
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex')}`;
}
