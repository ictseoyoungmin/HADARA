import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { HadaraActorContext } from '../../core/actor-context';
import type { HadaraNextAction } from '../../core/next-action';
import { ensureDir } from '../../core/fs';
import { isInside } from '../../core/paths';
import { startMonotonicTimer } from '../../core/timing';
import { createReviewedTaskClosePlan, createTaskClosePlanReport, didClosePlanExecutedStepMutate, formatTaskClosePlanReport, type ReviewedTaskClosePlan, type TaskClosePlanExecutedStep, type TaskClosePlanExecutionStepId, type TaskClosePlanOptions, type TaskClosePlanProgressEvent, type TaskClosePlanReport, type TaskClosePlanStepId } from './plan';
import { defaultTaskLifecycleActor } from '../lifecycle-next-actions';
import type { CloseGuardedWrite } from './guardedWrites';
import type { TaskCloseProofAppendGuard, TaskCloseReport } from './proof';

export type TaskCloseTransactionMode = 'dry-run' | 'execute' | 'execute-refused';

export interface TaskCloseTransactionOptions {
  dryRun?: boolean;
  planHash?: string;
  actor?: HadaraActorContext;
  onProgress?: (event: TaskClosePlanProgressEvent) => void;
  faultHooks?: TaskCloseFaultHooks;
  lockTimeoutMs?: number;
  onAutoReview?: (review: TaskClosePlanReport) => void;
}

export interface TaskCloseFaultHooks {
  afterLocksAcquired?: () => void;
  afterPlanCreated?: () => void;
  afterOperationPrepared?: () => void;
  beforeWrite?: (index: number, write: unknown) => void;
  afterWrite?: (index: number, write: unknown) => void;
  afterWritesPersisted?: () => void;
  beforeFinalVerification?: () => void;
  afterFinalVerification?: () => void;
  afterProofIntent?: (closeReport: TaskCloseReport) => void;
  afterReadinessEvidenceAppend?: () => void;
  afterCloseProofAppend?: () => void;
  beforeTerminalCleanup?: () => void;
}

const TASK_CLOSE_LOCK_STALE_MS = 5 * 60 * 1000;
const TASK_CLOSE_LOCK_METADATA_GRACE_MS = 2000;

export type TaskCloseOperationPhase = 'planned' | 'applying' | 'verifying' | 'proof-pending' | 'closed-valid' | 'blocked' | 'recovery-required';

export interface TaskCloseTransactionLockDiagnostics {
  name: 'project-lifecycle' | 'task-board' | 'task-scoped';
  path: string;
  waitedMs: number;
  contended: boolean;
  timeoutMs: number;
  staleReclaimed?: boolean;
  staleReason?: 'owner-dead' | 'metadata-invalid';
  ownerPid?: number;
  ownerAgeMs?: number;
}

export interface TaskCloseOperationState {
  operationId: string;
  taskId: string;
  idempotencyKey: string;
  intendedFinalState: 'closed-valid';
  phase: TaskCloseOperationPhase;
  closeBasisHash: string;
  /** @deprecated Use closeBasisHash for operation identity and finalSourceHash for proof-stage state. */
  closeSourceHash: string;
  planFingerprint?: string;
  planHash: string;
  writeSetHash: string;
  expectedWrites: TaskCloseExpectedWrite[];
  completedSteps: string[];
  pendingSteps: string[];
  stepJournal?: TaskCloseOperationStepJournalEntry[];
  mutationSummary?: {
    executedWrites: number;
    plannedMutationSteps?: number;
    executedMutationSteps?: number;
    plannedFileWrites?: number;
    executedFileWrites?: number;
    evidenceAppends?: number;
    recoveredWrites?: number;
    closeProofAppended: boolean;
    idempotentNoop: boolean;
  };
  attempts?: TaskCloseOperationAttempt[];
  path: string;
  persisted: boolean;
  resumedFromOperation?: boolean;
  finalSourceHash?: string;
  proof?: {
    idempotencyKey: string;
    outcome: 'pending' | 'appended' | 'existing-noop';
  };
  createdAt: string;
  updatedAt: string;
}

export interface TaskCloseExpectedWrite {
  step: TaskClosePlanExecutionStepId;
  path: string;
  writeBoundary: 'task-local' | 'evidence-append';
  action?: CloseGuardedWrite['action'];
  field?: CloseGuardedWrite['field'];
  expectedBeforeExists?: boolean;
  expectedBeforeHash?: string;
  afterHash?: string;
  appendKind?: 'readiness-evidence' | 'close-proof';
  appendOrder?: number;
  idempotencyKey?: string;
  recordHash?: string;
}

export interface TaskCloseOperationAttempt {
  attemptNumber: number;
  startedAt: string;
  completedAt?: string;
  phase: TaskCloseOperationPhase | 'applying';
  stepJournal: TaskCloseOperationStepJournalEntry[];
  mutationSummary: {
    executedWrites: number;
    plannedMutationSteps?: number;
    executedMutationSteps?: number;
    plannedFileWrites?: number;
    executedFileWrites?: number;
    evidenceAppends?: number;
    recoveredWrites?: number;
    closeProofAppended: boolean;
    idempotentNoop: boolean;
  };
}

export interface TaskCloseOperationStepJournalEntry {
  seq: number;
  step: TaskClosePlanExecutionStepId;
  phase: 'intent' | 'outcome';
  status: 'start' | 'executed' | 'satisfied' | 'blocked' | 'skipped';
  writeBoundary: 'read-only' | 'task-local' | 'evidence-append';
  writeOutcome?: 'appended' | 'existing-noop' | 'blocked';
  mutated: boolean;
  fileWrites?: number;
  at: string;
}

export interface TaskCloseTransactionReport {
  schemaVersion: 'hadara.task.close.v3';
  command: 'task.close';
  ok: boolean;
  mode: TaskCloseTransactionMode;
  taskId: string;
  generatedAt: string;
  actor: HadaraActorContext;
  closeState: TaskClosePlanReport['state'];
  planStatus: TaskClosePlanReport['planStatus'];
  terminal: boolean;
  operatorGuidance: string;
  readOnly: boolean;
  transaction: {
    strategy: 'close-auto' | 'close-reviewed-plan' | 'review-only';
    internalReview: boolean;
    planHash?: string;
    proofLast: true;
    stalePlanGuard: true;
    lockOrder: ['project-lifecycle', 'task-board', 'task-scoped', 'evidence-append'];
    locks: TaskCloseTransactionLockDiagnostics[];
    markerPersistence: TaskCloseMarkerPersistenceSummary;
    operation?: TaskCloseOperationState;
  };
  writeSummary: {
    plannedWrites: number;
    executedWrites: number;
    plannedMutationSteps: number;
    executedMutationSteps: number;
    plannedFileWrites: number;
    executedFileWrites: number;
    evidenceAppends: number;
    executedSteps: string[];
    stoppedAt?: string;
    closeProofAppended: boolean;
    idempotentNoop: boolean;
  };
  recovery?: {
    required: boolean;
    operationId?: string;
    phase?: TaskCloseOperationPhase;
    resumable?: boolean;
    classificationAvailable?: boolean;
    completedWrites?: TaskCloseRecoveryWrite[];
    pendingWrites?: TaskCloseRecoveryWrite[];
    conflictingWrites?: TaskCloseRecoveryWrite[];
    primaryAction?: HadaraNextAction;
    action: HadaraNextAction;
  };
  primaryNextAction?: HadaraNextAction;
  nextActions: HadaraNextAction[];
  source: {
    closePlan: TaskClosePlanReport;
  };
  diagnostics?: { generatedBy: 'cli'; commandPath: string; durationMs: number; slowThresholdMs: number; slow: boolean; note?: string };
  issues: TaskClosePlanReport['issues'];
}

export interface TaskCloseRecoveryWrite {
  step: TaskClosePlanExecutionStepId;
  path: string;
  writeBoundary: 'task-local' | 'evidence-append';
  status: 'before' | 'after' | 'conflict' | 'missing-conflict' | 'pending';
  sequence: number;
}

export interface TaskCloseMarkerPersistenceSummary {
  contentWrites: number;
  cleanupWrites: number;
  progressWrites: number;
  fileFsyncs: number;
  directoryFsyncs: number;
  unchangedSkips: number;
}

export function createTaskCloseTransactionReport(
  projectRoot: string,
  taskId: string,
  options: TaskCloseTransactionOptions = {}
): TaskCloseTransactionReport {
  const actor = options.actor ?? defaultTaskLifecycleActor();
  const run = (): TaskCloseTransactionReport => {
    if (options.dryRun) {
      return fromClosePlanReport(projectRoot, taskId, createTaskClosePlanReport(projectRoot, taskId, { actor }), {
        mode: 'dry-run',
        strategy: 'review-only',
        internalReview: false
      });
    }

    let operation: TaskCloseOperationState;
    const markerPersistence: TaskCloseMarkerPersistenceSummary = {
      contentWrites: 0,
      cleanupWrites: 0,
      progressWrites: 0,
      fileFsyncs: 0,
      directoryFsyncs: 0,
      unchangedSkips: 0
    };
    const persistOperation = (next: TaskCloseOperationState): TaskCloseOperationState => {
      const result = persistCloseOperation(projectRoot, next);
      markerPersistence.contentWrites += result.persistence.contentWrites;
      markerPersistence.fileFsyncs += result.persistence.fileFsyncs;
      markerPersistence.directoryFsyncs += result.persistence.directoryFsyncs;
      markerPersistence.unchangedSkips += result.persistence.unchangedSkips;
      return result.operation;
    };
    const progressWrapper = (event: TaskClosePlanProgressEvent): void => {
      if (event.step !== 'refresh') {
        operation = updateCloseOperationFromProgress(operation, event);
        if (event.step === 'close' && event.phase === 'executed' && event.writeOutcome === 'appended') {
          options.faultHooks?.afterCloseProofAppend?.();
        }
      }
      options.onProgress?.(event);
    };
    const closePlanOptions: TaskClosePlanOptions = {
      executeRequested: true,
      actor,
      recordReadinessEvidence: true,
      onProgress: progressWrapper,
      onAutoReview: options.onAutoReview,
      proofAppendGuard: () => createProofAppendGuardFromOperation(operation),
      faultHooks: {
        ...options.faultHooks,
        afterWritesPersisted: () => {
          operation = persistOperation(markOperationVerifying(operation));
          options.faultHooks?.afterWritesPersisted?.();
        },
        afterProofIntent: (closeReport) => {
          operation = persistOperation(markOperationProofPending(operation, closeReport));
          options.faultHooks?.afterProofIntent?.(closeReport);
        }
      }
    };
    const markerProblem = inspectCloseOperationMarker(projectRoot, taskId);
    if (markerProblem) {
      return createCloseOperationMarkerBlockedReport(projectRoot, taskId, actor, markerProblem, markerPersistence);
    }
    const strategy = options.planHash ? 'close-reviewed-plan' : 'close-auto';
    const reviewedPlan = options.planHash ? undefined : createReviewedTaskClosePlan(projectRoot, taskId, actor);
    if (reviewedPlan) options.faultHooks?.afterPlanCreated?.();
    if (reviewedPlan && !reviewedPlan.review.summary.executeSupported) {
      return fromClosePlanReport(projectRoot, taskId, reviewedPlan.review, {
        mode: 'dry-run',
        strategy,
        internalReview: true,
        markerPersistence
      });
    }
    if (options.planHash) {
      closePlanOptions.planHash = options.planHash;
    } else {
      closePlanOptions.auto = true;
      closePlanOptions.reviewedPlan = reviewedPlan;
    }
    const operationReview = reviewedPlan ?? createReviewedTaskClosePlan(projectRoot, taskId, actor);
    const operationPlanHash = options.planHash ?? operationReview.planHash;
    const operationBasis = createCloseOperationBasis(operationReview);
    const previousOperation = readCloseOperation(projectRoot, taskId);
    const markerReconciliation = reconcileCloseOperationMarker(
      projectRoot,
      taskId,
      operationPlanHash ?? hashObject({ taskId, phase: 'applying' }),
      operationBasis,
      previousOperation
    );
    if (markerReconciliation.issue) {
      return createCloseOperationMarkerBlockedReport(projectRoot, taskId, actor, markerReconciliation.issue, markerPersistence, markerReconciliation);
    }
    const initialPhase = markerReconciliation.startPhase ?? 'applying';
    if (markerReconciliation.resumeKind === 'proof-pending') closePlanOptions.recordReadinessEvidence = false;
    operation = createCloseOperation(
      taskId,
      operationPlanHash ?? hashObject({ taskId, phase: initialPhase }),
      initialPhase,
      operationReview,
      operationBasis,
      previousOperation,
      markerReconciliation
    );
    operation = persistOperation(operation);
    options.faultHooks?.afterOperationPrepared?.();
    const closePlan = createTaskClosePlanReport(projectRoot, taskId, closePlanOptions);
    let updatedOperation = updateCloseOperationFromClosePlan(operation, closePlan);
    // Durably persist the terminal operation state (including closed-valid) before any
    // marker cleanup, so a crash between these two steps still leaves an authoritative record.
    if (updatedOperation.persisted || closePlan.ok) updatedOperation = persistOperation(updatedOperation);
    if (closePlan.ok || countMutatingExecutedSteps(closePlan.execution?.executedSteps ?? []) === 0) {
      options.faultHooks?.beforeTerminalCleanup?.();
      const cleanup = removeCloseOperation(projectRoot, operation.path);
      if (cleanup.removed) markerPersistence.cleanupWrites += 1;
      markerPersistence.directoryFsyncs += cleanup.directoryFsyncs;
    }
    const report = fromClosePlanReport(projectRoot, taskId, closePlan, {
      mode: closePlan.mode === 'execute-refused' ? 'execute-refused' : closePlan.readOnly ? 'dry-run' : 'execute',
      strategy,
      internalReview: strategy === 'close-auto',
      markerPersistence,
      operation: updatedOperation
    });
    return report;
  };

  return withTaskCloseTransactionLocks(projectRoot, taskId, run, options.lockTimeoutMs, options.faultHooks);
}

export function formatTaskCloseTransactionReport(
  report: TaskCloseTransactionReport,
  options: { detail?: 'compact' | 'full' } = {}
): string {
  const lines = [
    `[HADARA] task close ${report.taskId}: ${report.ok ? 'ok' : 'blocked'}`,
    `state\t${report.closeState}`,
    `terminal\t${report.terminal}`,
    `guidance\t${report.operatorGuidance}`,
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
  if (options.detail === 'full') lines.push('', 'Close plan source:', formatTaskClosePlanReport(report.source.closePlan));
  return lines.join('\n');
}

function fromClosePlanReport(
  projectRoot: string,
  taskId: string,
  closePlan: TaskClosePlanReport,
  options: {
    mode: TaskCloseTransactionMode;
    strategy: TaskCloseTransactionReport['transaction']['strategy'];
    internalReview: boolean;
    locks?: TaskCloseTransactionLockDiagnostics[];
    markerPersistence?: TaskCloseMarkerPersistenceSummary;
    operation?: TaskCloseOperationState;
  }
): TaskCloseTransactionReport {
  const executedSteps = closePlan.execution?.executedSteps ?? [];
  const executedWrites = countMutatingExecutedSteps(executedSteps);
  const executedFileWrites = countExecutedTargetFileWrites(executedSteps);
  const plannedWrites = closePlan.pendingWrites.length;
  const plannedFileWrites = closePlan.pendingWrites
    .filter((write) => write.writeBoundary === 'task-local')
    .reduce((count, write) => count + write.paths.length, 0);
  const closeProofAppended = executedSteps.some(
    (step) => step.id === 'close' && step.status === 'executed' && step.writeOutcome === 'appended'
  );
  const evidenceAppends = (closeProofAppended ? 1 : 0) + (closePlan.readinessEvidence?.jsonlAppended ? 1 : 0);
  const idempotentNoop = closePlan.ok && closePlan.state === 'closed-valid' && executedWrites === 0 && closePlan.pendingWrites.length === 0;
  const recoveryAction = closePlan.ok ? undefined : normalizeCloseNextAction(taskId, closePlan.primaryNextAction ?? closePlan.nextActions.find((action) => action.required));
  const transactionPlanHash = closePlan.execution?.requestedPlanHash ?? closePlan.planHash ?? hashObject({ taskId, state: closePlan.state, issues: closePlan.issues });
  const nextActions = closePlan.ok
    ? []
    : closePlan.nextActions.map((action) => normalizeCloseNextAction(taskId, action) ?? action);

  return {
    schemaVersion: 'hadara.task.close.v3',
    command: 'task.close',
    ok: closePlan.ok,
    mode: options.mode,
    taskId,
    generatedAt: closePlan.generatedAt,
    actor: closePlan.actor,
    closeState: closePlan.state,
    planStatus: closePlan.planStatus,
    terminal: closePlan.ok && closePlan.state === 'closed-valid',
    operatorGuidance: closePlan.ok && closePlan.state === 'closed-valid'
      ? 'Close is complete. Report closed-valid and stop; do not run task status to reconfirm or discover follow-up work unless the current human/reviewer instruction explicitly requires continuation.'
      : 'Resolve the reported blocker or recovery action before treating this capsule as closed.',
    readOnly: closePlan.readOnly,
    transaction: {
      strategy: options.strategy,
      internalReview: options.internalReview,
      planHash: transactionPlanHash,
      proofLast: true,
      stalePlanGuard: true,
      lockOrder: ['project-lifecycle', 'task-board', 'task-scoped', 'evidence-append'],
      locks: options.locks ?? [],
      markerPersistence: options.markerPersistence ?? emptyMarkerPersistenceSummary(),
      ...(options.operation ? { operation: normalizeOperationForReport(projectRoot, options.operation) } : {})
    },
    writeSummary: {
      plannedWrites,
      executedWrites,
      plannedMutationSteps: plannedWrites,
      executedMutationSteps: executedWrites,
      plannedFileWrites,
      executedFileWrites,
      evidenceAppends,
      executedSteps: executedSteps.map((step) => step.id),
      ...(closePlan.execution?.stoppedAt ? { stoppedAt: closePlan.execution.stoppedAt } : {}),
      closeProofAppended,
      idempotentNoop
    },
    ...(recoveryAction ? {
      recovery: createRecoveryReport(options.operation, recoveryAction),
      primaryNextAction: recoveryAction
    } : {}),
    nextActions,
    source: { closePlan },
    issues: closePlan.issues
  };
}

function createRecoveryReport(
  operation: TaskCloseOperationState | undefined,
  action: HadaraNextAction,
  reconciliation?: CloseOperationMarkerReconciliation,
  resumable = true
): NonNullable<TaskCloseTransactionReport['recovery']> {
  const classificationAvailable = Boolean(reconciliation);
  const completedWrites = reconciliation?.completedWrites ?? [];
  const pendingWrites = reconciliation?.pendingWrites ?? [];
  const conflictingWrites = reconciliation?.conflictingWrites ?? [];
  return {
    required: true,
    ...(operation?.operationId ? { operationId: operation.operationId } : {}),
    ...(operation?.phase ? { phase: operation.phase } : {}),
    resumable,
    classificationAvailable,
    completedWrites,
    pendingWrites,
    conflictingWrites,
    primaryAction: action,
    action
  };
}

function withTaskCloseTransactionLocks<T>(
  projectRoot: string,
  taskId: string,
  fn: () => T,
  timeoutMs = 5000,
  faultHooks?: TaskCloseFaultHooks
): T {
  const acquired: Array<{ path: string; name: TaskCloseTransactionLockDiagnostics['name']; token: string | null; diagnostic: TaskCloseTransactionLockDiagnostics }> = [];
  const lockSpecs: Array<{ name: TaskCloseTransactionLockDiagnostics['name']; pathParts: string[] }> = [
    { name: 'project-lifecycle', pathParts: ['project-lifecycle.lock'] },
    { name: 'task-board', pathParts: ['task-board.lock'] },
    { name: 'task-scoped', pathParts: ['task-close', `${safeFilePart(taskId)}.lock`] }
  ];
  try {
    for (const spec of lockSpecs) acquired.push(acquireCloseLock(projectRoot, taskId, spec.name, spec.pathParts, timeoutMs));
    faultHooks?.afterLocksAcquired?.();
    const report = fn();
    if (isTaskCloseReport(report)) {
      report.transaction.locks = acquired.map((entry) => entry.diagnostic);
    }
    return report;
  } catch (error) {
    if (error instanceof TaskCloseLockError) {
      const report = createTaskCloseLockBlockedReport(projectRoot, taskId, error, acquired.map((entry) => entry.diagnostic));
      return report as T;
    }
    throw error;
  } finally {
    for (const lock of acquired.reverse()) {
      try {
        if (lock.token && !lockMetadataTokenMatches(lock.path, lock.token)) continue;
        fs.rmSync(lock.path, { recursive: true, force: true });
      } catch {
        // Directory ownership is the lock; stale locks fail closed on the next run.
      }
    }
  }
}

class TaskCloseLockError extends Error {
  constructor(
    public readonly lockName: TaskCloseTransactionLockDiagnostics['name'],
    public readonly lockPath: string,
    public readonly waitedMs: number,
    public readonly timeoutMs: number
  ) {
    super(`Timed out waiting for task close ${lockName} lock at ${lockPath}.`);
    this.name = 'TaskCloseLockError';
  }
}

function acquireCloseLock(
  projectRoot: string,
  taskId: string,
  name: TaskCloseTransactionLockDiagnostics['name'],
  pathParts: string[],
  timeoutMs: number
): { path: string; name: TaskCloseTransactionLockDiagnostics['name']; token: string | null; diagnostic: TaskCloseTransactionLockDiagnostics } {
  const lockDir = path.join(projectRoot, '.hadara', 'local', 'locks', ...pathParts);
  ensureDir(path.dirname(lockDir));
  const portablePath = toPortablePath(path.relative(projectRoot, lockDir));
  const timer = startMonotonicTimer();
  let contended = false;
  let staleReclaimed = false;
  let staleReason: TaskCloseTransactionLockDiagnostics['staleReason'] | undefined;
  let ownerPid: number | undefined;
  let ownerAgeMs: number | undefined;
  while (true) {
    try {
      fs.mkdirSync(lockDir);
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      contended = true;
      const stale = tryReclaimStaleCloseLock(lockDir);
      if (stale.reclaimed) {
        staleReclaimed = true;
        staleReason = stale.reason;
        ownerPid = stale.ownerPid;
        ownerAgeMs = stale.ownerAgeMs;
        continue;
      }
      if (timer.elapsedMs() >= timeoutMs) throw new TaskCloseLockError(name, portablePath, timer.elapsedMs(), timeoutMs);
      sleepSync(25);
    }
  }
  const token = crypto.randomUUID();
  try {
    fs.writeFileSync(path.join(lockDir, 'lock.json'), `${JSON.stringify({ pid: process.pid, token, command: 'task.close', taskId, lock: name, createdAt: new Date().toISOString(), staleMs: TASK_CLOSE_LOCK_STALE_MS })}\n`, { encoding: 'utf8', flag: 'wx' });
  } catch {
    // Ownership metadata is part of the lock contract. Without it, fail closed
    // by leaving the directory for the next caller's stale-lock handling.
    throw new TaskCloseLockError(name, portablePath, timer.elapsedMs(), timeoutMs);
  }
  return {
    path: lockDir,
    name,
    token,
    diagnostic: {
      name,
      path: portablePath,
      waitedMs: timer.elapsedMs(),
      contended,
      timeoutMs,
      ...(staleReclaimed ? { staleReclaimed } : {}),
      ...(staleReason ? { staleReason } : {}),
      ...(typeof ownerPid === 'number' ? { ownerPid } : {}),
      ...(typeof ownerAgeMs === 'number' ? { ownerAgeMs } : {})
    }
  };
}

function createTaskCloseLockBlockedReport(
  projectRoot: string,
  taskId: string,
  error: TaskCloseLockError,
  locks: TaskCloseTransactionLockDiagnostics[]
): TaskCloseTransactionReport {
  const actor = defaultTaskLifecycleActor();
  const fallback = createTaskClosePlanReport(projectRoot, taskId, { actor });
  const report = fromClosePlanReport(projectRoot, taskId, fallback, {
    mode: 'execute-refused',
    strategy: 'close-auto',
    internalReview: true,
    locks,
    markerPersistence: emptyMarkerPersistenceSummary()
  });
  return {
    ...report,
    ok: false,
    mode: 'execute-refused',
    readOnly: true,
    closeState: 'blocked',
    planStatus: 'blocked',
    writeSummary: {
      plannedWrites: 0,
      executedWrites: 0,
      plannedMutationSteps: 0,
      executedMutationSteps: 0,
      plannedFileWrites: 0,
      executedFileWrites: 0,
      evidenceAppends: 0,
      executedSteps: [],
      closeProofAppended: false,
      idempotentNoop: false
    },
    recovery: {
      required: true,
      action: {
        id: 'task-close-lock-retry',
        required: true,
        command: `hadara task close --task ${taskId} --json`,
        summary: `Task close could not acquire the ${error.lockName} lock. Retry after the active close operation finishes, or inspect stale local lock metadata if no close is running.`,
        writeBoundary: 'task-close-transaction',
        recommendedActorRole: 'worker',
        requiresBeforeHash: false,
        stalePlanRisk: 'low'
      }
    },
    primaryNextAction: {
      id: 'task-close-lock-retry',
      required: true,
      command: `hadara task close --task ${taskId} --json`,
      summary: `Task close could not acquire the ${error.lockName} lock. Retry after the active close operation finishes, or inspect stale local lock metadata if no close is running.`,
      writeBoundary: 'task-close-transaction',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'low'
    },
    nextActions: [],
    issues: [
      ...report.issues,
      {
        severity: 'error',
        code: 'TASK_CLOSE_TRANSACTION_LOCK_TIMEOUT',
        message: `Timed out waiting ${error.waitedMs}ms for ${error.lockName} lock ${error.lockPath}.`,
        fixHint: 'Serialize task close operations. If no HADARA process is closing a task, inspect the local lock metadata and remove the stale lock directory before retrying.',
        example: `hadara task close --task ${taskId} --json`
      }
    ]
  };
}

function tryReclaimStaleCloseLock(lockDir: string): { reclaimed: boolean; reason?: TaskCloseTransactionLockDiagnostics['staleReason']; ownerPid?: number; ownerAgeMs?: number } {
  let metadata: { pid?: number; createdAt?: string } | null = null;
  try {
    metadata = JSON.parse(fs.readFileSync(path.join(lockDir, 'lock.json'), 'utf8')) as { pid?: number; createdAt?: string };
  } catch {
    const ownerAgeMs = lockDirectoryAgeMs(lockDir);
    if (typeof ownerAgeMs !== 'number' || ownerAgeMs < TASK_CLOSE_LOCK_METADATA_GRACE_MS) {
      return { reclaimed: false, ownerAgeMs };
    }
    return quarantineAndRemoveLock(lockDir, 'metadata-invalid', undefined, ownerAgeMs);
  }
  const ownerPid = typeof metadata.pid === 'number' ? metadata.pid : undefined;
  const createdAtMs = metadata.createdAt ? Date.parse(metadata.createdAt) : Number.NaN;
  const ownerAgeMs = Number.isFinite(createdAtMs) ? Math.max(0, Date.now() - createdAtMs) : undefined;
  const ownerDead = typeof ownerPid === 'number' && !isProcessAlive(ownerPid);
  if (!ownerDead) return { reclaimed: false, ownerPid, ownerAgeMs };
  return quarantineAndRemoveLock(lockDir, 'owner-dead', ownerPid, ownerAgeMs);
}

function lockDirectoryAgeMs(lockDir: string): number | undefined {
  try {
    return Math.max(0, Date.now() - fs.statSync(lockDir).mtimeMs);
  } catch {
    return undefined;
  }
}

function quarantineAndRemoveLock(
  lockDir: string,
  reason: TaskCloseTransactionLockDiagnostics['staleReason'],
  ownerPid: number | undefined,
  ownerAgeMs: number | undefined
): { reclaimed: boolean; reason?: TaskCloseTransactionLockDiagnostics['staleReason']; ownerPid?: number; ownerAgeMs?: number } {
  const quarantinePath = `${lockDir}.stale.${process.pid}.${Date.now()}.${crypto.randomUUID()}`;
  try {
    fs.renameSync(lockDir, quarantinePath);
    fs.rmSync(quarantinePath, { recursive: true, force: true });
    return { reclaimed: true, reason, ownerPid, ownerAgeMs };
  } catch {
    return { reclaimed: false, ownerPid, ownerAgeMs };
  }
}

function isProcessAlive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'EPERM';
  }
}

function lockMetadataTokenMatches(lockDir: string, token: string): boolean {
  try {
    const metadata = JSON.parse(fs.readFileSync(path.join(lockDir, 'lock.json'), 'utf8')) as { token?: string };
    return metadata.token === token;
  } catch {
    return false;
  }
}

function inspectCloseOperationMarker(projectRoot: string, taskId: string): TaskClosePlanReport['issues'][number] | null {
  const absolutePath = path.join(projectRoot, '.hadara', 'local', 'task-close', `${safeFilePart(taskId)}.json`);
  if (!fs.existsSync(absolutePath)) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch {
    return {
      severity: 'error',
      code: 'TASK_CLOSE_OPERATION_MARKER_MALFORMED',
      message: 'Task close recovery marker is malformed; refusing to start a new close transaction until recovery metadata is inspected.',
      path: toPortablePath(path.relative(projectRoot, absolutePath)),
      fixHint: 'Inspect the local recovery marker and current close-source files before retrying task close.',
      example: `hadara task close --task ${taskId} --dry-run --json`
    };
  }
  if (!parsed || typeof parsed !== 'object') {
    return {
      severity: 'error',
      code: 'TASK_CLOSE_OPERATION_MARKER_INVALID',
      message: 'Task close recovery marker is not an object; refusing to start a new close transaction.',
      path: toPortablePath(path.relative(projectRoot, absolutePath))
    };
  }
  const state = parsed as Partial<TaskCloseOperationState>;
  if (state.taskId !== taskId) {
    return {
      severity: 'error',
      code: 'TASK_CLOSE_OPERATION_MARKER_TASK_MISMATCH',
      message: `Task close recovery marker belongs to ${String(state.taskId ?? 'unknown')}, not ${taskId}.`,
      path: toPortablePath(path.relative(projectRoot, absolutePath)),
      fixHint: 'Do not ignore mismatched recovery metadata; inspect the marker before retrying close.'
    };
  }
  const shapeProblem = validateCloseOperationMarkerShape(state);
  if (shapeProblem) {
    return {
      severity: 'error',
      code: 'TASK_CLOSE_OPERATION_MARKER_INVALID',
      message: `Task close recovery marker is invalid: ${shapeProblem}.`,
      path: toPortablePath(path.relative(projectRoot, absolutePath)),
      fixHint: 'Inspect the local recovery marker and current close-source files before retrying task close.'
    };
  }
  return null;
}

function validateCloseOperationMarkerShape(state: Partial<TaskCloseOperationState>): string | null {
  const unknown = unknownKeys(state, [
    'operationId',
    'taskId',
    'idempotencyKey',
    'intendedFinalState',
    'phase',
    'closeBasisHash',
    'closeSourceHash',
    'planFingerprint',
    'planHash',
    'writeSetHash',
    'expectedWrites',
    'completedSteps',
    'pendingSteps',
    'stepJournal',
    'mutationSummary',
    'attempts',
    'path',
    'persisted',
    'resumedFromOperation',
    'finalSourceHash',
    'proof',
    'createdAt',
    'updatedAt'
  ]);
  if (unknown.length > 0) return `unknown property ${unknown[0]}`;
  const stringFields: Array<keyof TaskCloseOperationState> = ['operationId', 'taskId', 'idempotencyKey', 'closeBasisHash', 'closeSourceHash', 'planHash', 'writeSetHash', 'path', 'createdAt', 'updatedAt'];
  for (const field of stringFields) {
    if (typeof state[field] !== 'string') return `missing string field ${field}`;
  }
  const hashFields: Array<keyof TaskCloseOperationState> = ['closeBasisHash', 'closeSourceHash', 'planHash', 'writeSetHash'];
  for (const field of hashFields) {
    if (!isSha256Hash(state[field])) return `${field} must be a sha256 hash`;
  }
  if (state.planFingerprint !== undefined && typeof state.planFingerprint !== 'string') return 'planFingerprint must be a string';
  if (state.intendedFinalState !== 'closed-valid') return 'intendedFinalState must be closed-valid';
  if (!isCloseOperationPhase(state.phase)) return 'phase is not a known close operation phase';
  if (!Array.isArray(state.expectedWrites)) return 'expectedWrites must be an array';
  for (const [index, write] of state.expectedWrites.entries()) {
    const problem = validateExpectedWriteShape(write);
    if (problem) return `expectedWrites[${index}] ${problem}`;
  }
  if (hashObject(state.expectedWrites) !== state.writeSetHash) return 'writeSetHash does not match expectedWrites';
  const completedStepsProblem = validateStepArray(state.completedSteps, 'completedSteps');
  if (completedStepsProblem) return completedStepsProblem;
  const pendingStepsProblem = validateStepArray(state.pendingSteps, 'pendingSteps');
  if (pendingStepsProblem) return pendingStepsProblem;
  if (state.stepJournal !== undefined) {
    const journalProblem = validateStepJournal(state.stepJournal, 'stepJournal');
    if (journalProblem) return journalProblem;
  }
  if (state.mutationSummary !== undefined) {
    const mutationProblem = validateMutationSummary(state.mutationSummary, 'mutationSummary');
    if (mutationProblem) return mutationProblem;
  }
  if (!Array.isArray(state.attempts)) return 'attempts must be an array';
  for (const [index, attempt] of state.attempts.entries()) {
    const problem = validateOperationAttempt(attempt, `attempts[${index}]`);
    if (problem) return problem;
  }
  if (typeof state.persisted !== 'boolean') return 'persisted must be a boolean';
  if (state.resumedFromOperation !== undefined && typeof state.resumedFromOperation !== 'boolean') return 'resumedFromOperation must be a boolean';
  if (state.finalSourceHash !== undefined && !isSha256Hash(state.finalSourceHash)) return 'finalSourceHash must be a sha256 hash';
  if (state.proof) {
    const proofUnknown = unknownKeys(state.proof, ['idempotencyKey', 'outcome']);
    if (proofUnknown.length > 0) return `proof unknown property ${proofUnknown[0]}`;
    if (typeof state.proof.idempotencyKey !== 'string') return 'proof.idempotencyKey must be a string';
    if (!['pending', 'appended', 'existing-noop'].includes(state.proof.outcome)) return 'proof.outcome is invalid';
  }
  return null;
}

function validateExpectedWriteShape(value: unknown): string | null {
  if (!value || typeof value !== 'object') return 'must be an object';
  const write = value as Partial<TaskCloseExpectedWrite>;
  const unknown = unknownKeys(write, [
    'step',
    'path',
    'writeBoundary',
    'action',
    'field',
    'expectedBeforeExists',
    'expectedBeforeHash',
    'afterHash',
    'appendKind',
    'appendOrder',
    'idempotencyKey',
    'recordHash'
  ]);
  if (unknown.length > 0) return `unknown property ${unknown[0]}`;
  if (!['guarded-writes', 'ready', 'close', 'audit-close'].includes(String(write.step))) return 'step is invalid';
  if (typeof write.path !== 'string') return 'path must be a string';
  if (write.action !== undefined && !['update', 'insert'].includes(String(write.action))) return 'action is invalid';
  if (write.field !== undefined && !['task-status', 'task-handoff-identity', 'task-board-row', 'current-state', 'project-state-projection', 'handoff-projection'].includes(String(write.field))) return 'field is invalid';
  if (write.writeBoundary === 'task-local') {
    if (typeof write.expectedBeforeExists !== 'boolean') return 'task-local write requires expectedBeforeExists';
    if (typeof write.expectedBeforeHash !== 'string') return 'task-local write requires expectedBeforeHash';
    if (typeof write.afterHash !== 'string') return 'task-local write requires afterHash';
    return null;
  }
  if (write.writeBoundary === 'evidence-append') {
    if (!['readiness-evidence', 'close-proof'].includes(String(write.appendKind))) return 'evidence append requires appendKind';
    if (!isNonNegativeInteger(write.appendOrder) || (write.appendOrder ?? 0) < 1) return 'evidence append requires positive appendOrder';
    if (typeof write.idempotencyKey !== 'string') return 'evidence append requires idempotencyKey';
    if (typeof write.recordHash !== 'string') return 'evidence append requires recordHash';
    return null;
  }
  return 'writeBoundary is invalid';
}

function validateStepArray(value: unknown, label: string): string | null {
  if (!Array.isArray(value)) return `${label} must be an array`;
  for (const [index, step] of value.entries()) {
    if (!['guarded-writes', 'ready', 'close', 'audit-close'].includes(String(step))) return `${label}[${index}] is invalid`;
  }
  return null;
}

function validateOperationAttempt(value: unknown, label: string): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return `${label} must be an object`;
  const attempt = value as Partial<TaskCloseOperationAttempt>;
  const unknown = unknownKeys(attempt, ['attemptNumber', 'startedAt', 'completedAt', 'phase', 'stepJournal', 'mutationSummary']);
  if (unknown.length > 0) return `${label} unknown property ${unknown[0]}`;
  if (!isNonNegativeInteger(attempt.attemptNumber) || (attempt.attemptNumber ?? 0) < 1) return `${label}.attemptNumber must be a positive integer`;
  if (typeof attempt.startedAt !== 'string') return `${label}.startedAt must be a string`;
  if (attempt.completedAt !== undefined && typeof attempt.completedAt !== 'string') return `${label}.completedAt must be a string`;
  if (!isCloseOperationPhase(attempt.phase)) return `${label}.phase is invalid`;
  const journalProblem = validateStepJournal(attempt.stepJournal, `${label}.stepJournal`);
  if (journalProblem) return journalProblem;
  return validateMutationSummary(attempt.mutationSummary, `${label}.mutationSummary`);
}

function validateStepJournal(value: unknown, label: string): string | null {
  if (!Array.isArray(value)) return `${label} must be an array`;
  for (const [index, entry] of value.entries()) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return `${label}[${index}] must be an object`;
    const journal = entry as Partial<TaskCloseOperationStepJournalEntry>;
    const unknown = unknownKeys(journal, ['seq', 'step', 'phase', 'status', 'writeBoundary', 'writeOutcome', 'mutated', 'fileWrites', 'at']);
    if (unknown.length > 0) return `${label}[${index}] unknown property ${unknown[0]}`;
    if (!isNonNegativeInteger(journal.seq) || (journal.seq ?? 0) < 1) return `${label}[${index}].seq must be a positive integer`;
    if (!['guarded-writes', 'ready', 'close', 'audit-close'].includes(String(journal.step))) return `${label}[${index}].step is invalid`;
    if (!['intent', 'outcome'].includes(String(journal.phase))) return `${label}[${index}].phase is invalid`;
    if (!['start', 'executed', 'satisfied', 'blocked', 'skipped'].includes(String(journal.status))) return `${label}[${index}].status is invalid`;
    if (!['read-only', 'task-local', 'evidence-append'].includes(String(journal.writeBoundary))) return `${label}[${index}].writeBoundary is invalid`;
    if (journal.writeOutcome !== undefined && !['appended', 'existing-noop', 'blocked'].includes(String(journal.writeOutcome))) return `${label}[${index}].writeOutcome is invalid`;
    if (typeof journal.mutated !== 'boolean') return `${label}[${index}].mutated must be a boolean`;
    if (journal.fileWrites !== undefined && !isNonNegativeInteger(journal.fileWrites)) return `${label}[${index}].fileWrites must be a non-negative integer`;
    if (typeof journal.at !== 'string') return `${label}[${index}].at must be a string`;
  }
  return null;
}

function validateMutationSummary(value: unknown, label: string): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return `${label} must be an object`;
  const summary = value as Partial<NonNullable<TaskCloseOperationState['mutationSummary']>>;
  const unknown = unknownKeys(summary, [
    'executedWrites',
    'plannedMutationSteps',
    'executedMutationSteps',
    'plannedFileWrites',
    'executedFileWrites',
    'evidenceAppends',
    'recoveredWrites',
    'closeProofAppended',
    'idempotentNoop'
  ]);
  if (unknown.length > 0) return `${label} unknown property ${unknown[0]}`;
  for (const field of ['executedWrites', 'plannedMutationSteps', 'executedMutationSteps', 'plannedFileWrites', 'executedFileWrites', 'evidenceAppends', 'recoveredWrites'] as const) {
    if (summary[field] !== undefined && !isNonNegativeInteger(summary[field])) return `${label}.${field} must be a non-negative integer`;
  }
  if (!isNonNegativeInteger(summary.executedWrites)) return `${label}.executedWrites must be a non-negative integer`;
  if (typeof summary.closeProofAppended !== 'boolean') return `${label}.closeProofAppended must be a boolean`;
  if (typeof summary.idempotentNoop !== 'boolean') return `${label}.idempotentNoop must be a boolean`;
  return null;
}

function unknownKeys(value: object, allowed: string[]): string[] {
  const allowedSet = new Set(allowed);
  return Object.keys(value).filter((key) => !allowedSet.has(key));
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 0;
}

const SHA256_HASH_PATTERN = /^sha256:[a-f0-9]{64}$/;

function isSha256Hash(value: unknown): value is string {
  return typeof value === 'string' && SHA256_HASH_PATTERN.test(value);
}

function isCloseOperationPhase(value: unknown): value is TaskCloseOperationPhase {
  return ['planned', 'applying', 'verifying', 'proof-pending', 'closed-valid', 'blocked', 'recovery-required'].includes(String(value));
}

function createCloseOperationMarkerBlockedReport(
  projectRoot: string,
  taskId: string,
  actor: HadaraActorContext,
  issue: TaskClosePlanReport['issues'][number],
  markerPersistence: TaskCloseMarkerPersistenceSummary,
  reconciliation?: CloseOperationMarkerReconciliation
): TaskCloseTransactionReport {
  const fallback = createTaskClosePlanReport(projectRoot, taskId, { actor });
  const action: HadaraNextAction = {
    id: 'task-close-recovery-marker-inspect',
    required: true,
    command: `hadara task close --task ${taskId} --dry-run --json`,
    summary: 'Inspect the stale or malformed task-close recovery marker before retrying any write-capable close transaction.',
    writeBoundary: 'read-only',
    recommendedActorRole: 'worker',
    requiresBeforeHash: false,
    stalePlanRisk: 'none'
  };
  const report = fromClosePlanReport(projectRoot, taskId, fallback, {
    mode: 'execute-refused',
    strategy: 'close-auto',
    internalReview: true,
    markerPersistence
  });
  return {
    ...report,
    ok: false,
    mode: 'execute-refused',
    readOnly: true,
    closeState: 'blocked',
    planStatus: 'blocked',
    terminal: false,
    operatorGuidance: 'Resolve the task-close recovery marker issue before running a write-capable close transaction.',
    writeSummary: {
      plannedWrites: 0,
      executedWrites: 0,
      plannedMutationSteps: 0,
      executedMutationSteps: 0,
      plannedFileWrites: 0,
      executedFileWrites: 0,
      evidenceAppends: 0,
      executedSteps: [],
      closeProofAppended: false,
      idempotentNoop: false
    },
    recovery: createRecoveryReport(reconciliation?.operation, action, reconciliation, false),
    primaryNextAction: action,
    nextActions: [],
    issues: [issue]
  };
}

interface CloseOperationBasis {
  expectedWrites: TaskCloseExpectedWrite[];
  writeSetHash: string;
  closeBasisHash: string;
  planFingerprint: string;
}

interface CloseOperationMarkerReconciliation {
  issue: TaskClosePlanReport['issues'][number] | null;
  operation?: TaskCloseOperationState;
  resumeKind?: 'reuse' | 'all-before' | 'prefix-partial' | 'all-after' | 'proof-pending';
  startPhase?: TaskCloseOperationPhase;
  preservePreviousIdentity: boolean;
  completedWrites: TaskCloseRecoveryWrite[];
  pendingWrites: TaskCloseRecoveryWrite[];
  conflictingWrites: TaskCloseRecoveryWrite[];
}

function createCloseOperationBasis(reviewedPlan: ReviewedTaskClosePlan): CloseOperationBasis {
  const expectedWrites = createExpectedWrites(reviewedPlan);
  const writeSetHash = hashObject(expectedWrites);
  const planFingerprint = hashObject({
    taskId: reviewedPlan.review.taskId,
    steps: reviewedPlan.steps.map((step) => ({ id: step.id, status: step.status, expectedWritePaths: step.expectedWritePaths })),
    issues: reviewedPlan.issues.map((issue) => ({ severity: issue.severity, code: issue.code, path: issue.path ?? null })),
    writeSetHash
  });
  return {
    expectedWrites,
    writeSetHash,
    closeBasisHash: reviewedPlan.reports.close?.validation.validatedBeforeCloseEvidenceSourceHash ?? planFingerprint,
    planFingerprint
  };
}

function reconcileCloseOperationMarker(
  projectRoot: string,
  taskId: string,
  planHash: string,
  basis: CloseOperationBasis,
  previous: TaskCloseOperationState | null
): CloseOperationMarkerReconciliation {
  const empty = (): CloseOperationMarkerReconciliation => ({
    issue: null,
    preservePreviousIdentity: false,
    completedWrites: [],
    pendingWrites: [],
    conflictingWrites: []
  });
  if (!previous) return empty();
  const writeState = reconcileExpectedTaskLocalWrites(projectRoot, previous.expectedWrites);
  const base: CloseOperationMarkerReconciliation = {
    issue: null,
    operation: previous,
    preservePreviousIdentity: false,
    completedWrites: writeState.completedWrites,
    pendingWrites: writeState.pendingWrites,
    conflictingWrites: writeState.conflictingWrites
  };
  if (previous.phase === 'closed-valid') return { ...base, resumeKind: 'reuse', preservePreviousIdentity: true };
  if (writeState.conflictingWrites.length > 0 || writeState.nonPrefix) {
    return {
      ...base,
      issue: createOperationRecoveryIssue(taskId, previous, writeState.nonPrefix ? 'non-prefix task-local writes were detected' : 'conflicting task-local writes were detected')
    };
  }
  // Close-source drift must fail closed before any phase-specific resume decision,
  // including proof-pending; otherwise a proof-pending retry can skip drift detection.
  if (operationCloseBasisHash(previous) !== basis.closeBasisHash) {
    return {
      ...base,
      issue: createOperationRecoveryIssue(taskId, previous, 'close source hash changed')
    };
  }
  // The regenerated write set must exactly match the still-pending portion of the persisted
  // write set before resuming. Bookkeeping's plan is diff-based, so already-applied task-local
  // writes legitimately drop out of the regenerated plan; comparing against the full original
  // writeSetHash would reject every legitimate prefix-partial/all-after resume. Comparing
  // against the pending remainder still fails closed if the executor would run a different
  // plan than the one recorded (tampering, code drift, or a stale/mismatched marker).
  if (hashObject(pendingExpectedWrites(previous.expectedWrites, writeState.completedWrites)) !== basis.writeSetHash) {
    return {
      ...base,
      issue: createOperationRecoveryIssue(taskId, previous, 'expected write set changed')
    };
  }
  if (previous.phase === 'proof-pending') {
    if (writeState.kind === 'all-after' || writeState.kind === 'none') {
      return { ...base, resumeKind: 'proof-pending', startPhase: 'proof-pending', preservePreviousIdentity: true };
    }
    return {
      ...base,
      issue: createOperationRecoveryIssue(taskId, previous, 'proof-pending writes are not fully applied')
    };
  }
  if (canReuseCloseOperation(previous, planHash, basis)) {
    return { ...base, resumeKind: 'reuse', preservePreviousIdentity: true };
  }
  if (writeState.kind === 'all-before') {
    return { ...base, resumeKind: 'all-before', startPhase: 'applying', preservePreviousIdentity: true };
  }
  if (writeState.kind === 'prefix-partial') {
    return { ...base, resumeKind: 'prefix-partial', startPhase: 'applying', preservePreviousIdentity: true };
  }
  if (writeState.kind === 'all-after') {
    return { ...base, resumeKind: 'all-after', startPhase: 'verifying', preservePreviousIdentity: true };
  }
  return {
    ...base,
    issue: createOperationRecoveryIssue(taskId, previous, 'operation marker does not match the current close basis')
  };
}

function createOperationRecoveryIssue(
  taskId: string,
  previous: TaskCloseOperationState,
  reason: string
): TaskClosePlanReport['issues'][number] {
  return {
    severity: 'error',
    code: 'TASK_CLOSE_OPERATION_RECOVERY_REQUIRED',
    message: `Existing task close recovery marker cannot be resumed safely: ${reason}; refusing to overwrite valid recovery metadata.`,
    path: previous.path,
    fixHint: 'Inspect the marker, expected writes, and close-source files before retrying a write-capable close transaction.',
    example: `hadara task close --task ${taskId} --dry-run --json`
  };
}

function pendingExpectedWrites(expectedWrites: TaskCloseExpectedWrite[], completedWrites: TaskCloseRecoveryWrite[]): TaskCloseExpectedWrite[] {
  const completedSequences = new Set(completedWrites.map((write) => write.sequence));
  return expectedWrites.filter((_, index) => !completedSequences.has(index + 1));
}

function reconcileExpectedTaskLocalWrites(
  projectRoot: string,
  expectedWrites: TaskCloseExpectedWrite[]
): {
  kind: 'none' | 'all-before' | 'prefix-partial' | 'all-after' | 'non-prefix';
  completedWrites: TaskCloseRecoveryWrite[];
  pendingWrites: TaskCloseRecoveryWrite[];
  conflictingWrites: TaskCloseRecoveryWrite[];
  nonPrefix: boolean;
} {
  const taskLocalWrites = expectedWrites
    .map((write, index) => ({ write, sequence: index + 1 }))
    .filter((entry) => entry.write.writeBoundary === 'task-local');
  if (taskLocalWrites.length === 0) {
    return { kind: 'none', completedWrites: [], pendingWrites: [], conflictingWrites: [], nonPrefix: false };
  }

  const classified = taskLocalWrites.map(({ write, sequence }) => classifyTaskLocalExpectedWrite(projectRoot, write, sequence));
  const completedWrites = classified.filter((entry) => entry.status === 'after');
  const pendingWrites = classified.filter((entry) => entry.status === 'before');
  const conflictingWrites = classified.filter((entry) => entry.status === 'conflict' || entry.status === 'missing-conflict');
  if (conflictingWrites.length > 0) {
    return { kind: 'non-prefix', completedWrites, pendingWrites, conflictingWrites, nonPrefix: false };
  }

  let seenBefore = false;
  let nonPrefix = false;
  for (const entry of classified) {
    if (entry.status === 'before') {
      seenBefore = true;
      continue;
    }
    if (entry.status === 'after' && seenBefore) nonPrefix = true;
  }
  if (nonPrefix) return { kind: 'non-prefix', completedWrites, pendingWrites, conflictingWrites, nonPrefix: true };
  if (completedWrites.length === 0) return { kind: 'all-before', completedWrites, pendingWrites, conflictingWrites, nonPrefix: false };
  if (pendingWrites.length === 0) return { kind: 'all-after', completedWrites, pendingWrites, conflictingWrites, nonPrefix: false };
  return { kind: 'prefix-partial', completedWrites, pendingWrites, conflictingWrites, nonPrefix: false };
}

function classifyTaskLocalExpectedWrite(
  projectRoot: string,
  write: TaskCloseExpectedWrite,
  sequence: number
): TaskCloseRecoveryWrite {
  const status = classifyTaskLocalExpectedWriteStatus(projectRoot, write);
  return {
    step: write.step,
    path: write.path,
    writeBoundary: 'task-local',
    status,
    sequence
  };
}

function classifyTaskLocalExpectedWriteStatus(
  projectRoot: string,
  write: TaskCloseExpectedWrite
): 'before' | 'after' | 'conflict' | 'missing-conflict' {
  const absolutePath = path.resolve(projectRoot, write.path);
  if (!isInside(projectRoot, absolutePath)) return 'conflict';
  const exists = fs.existsSync(absolutePath);
  if (!exists && write.expectedBeforeExists) return 'missing-conflict';
  const content = exists ? fs.readFileSync(absolutePath, 'utf8') : '';
  const currentHash = hashContent(content);
  if (currentHash === write.afterHash) return 'after';
  if (exists === write.expectedBeforeExists && currentHash === write.expectedBeforeHash) return 'before';
  return exists ? 'conflict' : 'missing-conflict';
}

function canReuseCloseOperation(previous: TaskCloseOperationState, planHash: string, basis: CloseOperationBasis): boolean {
  return hashObject(previous.expectedWrites) === previous.writeSetHash
    && previous.planHash === planHash
    && previous.writeSetHash === basis.writeSetHash
    && operationCloseBasisHash(previous) === basis.closeBasisHash;
}

function canContinueCloseOperation(previous: TaskCloseOperationState, planHash: string, basis: CloseOperationBasis): boolean {
  if (canReuseCloseOperation(previous, planHash, basis)) return true;
  return operationCloseBasisHash(previous) === basis.closeBasisHash && (previous.phase === 'proof-pending' || previous.phase === 'recovery-required');
}

function operationCloseBasisHash(operation: TaskCloseOperationState): string {
  return operation.closeBasisHash ?? operation.closeSourceHash;
}

function createCloseOperation(
  taskId: string,
  planHash: string,
  phase: TaskCloseOperationPhase,
  reviewedPlan: ReviewedTaskClosePlan,
  basis: CloseOperationBasis,
  previous: TaskCloseOperationState | null,
  reconciliation?: CloseOperationMarkerReconciliation
): TaskCloseOperationState {
  const { expectedWrites, writeSetHash, closeBasisHash, planFingerprint } = basis;
  const idempotencyKey = hashObject({ taskId, closeBasisHash, intendedFinalState: 'closed-valid' });
  const reusePrevious = Boolean(previous && reconciliation?.preservePreviousIdentity && !reconciliation.issue);
  const previousState = reusePrevious ? previous : null;
  const operationId = hashObject({ taskId, planHash, writeSetHash }).replace(/^sha256:/, '');
  const now = new Date().toISOString();
  const previousAttempts = previousState?.attempts ?? [];
  const plannedFileWrites = expectedWrites.filter((write) => write.writeBoundary === 'task-local').length;
  const recoveredWrites = reusePrevious ? reconciliation?.completedWrites.length ?? 0 : 0;
  const nextAttempt: TaskCloseOperationAttempt = {
    attemptNumber: previousAttempts.length + 1,
    startedAt: now,
    phase,
    stepJournal: [],
    mutationSummary: {
      executedWrites: 0,
      plannedMutationSteps: reviewedPlan.review.pendingWrites.length,
      executedMutationSteps: 0,
      plannedFileWrites,
      executedFileWrites: 0,
      evidenceAppends: 0,
      recoveredWrites,
      closeProofAppended: false,
      idempotentNoop: false
    }
  };
  return {
    operationId: previousState?.operationId ?? operationId,
    taskId,
    idempotencyKey: previousState?.idempotencyKey ?? idempotencyKey,
    intendedFinalState: 'closed-valid',
    phase,
    closeBasisHash: previousState?.closeBasisHash ?? previousState?.closeSourceHash ?? closeBasisHash,
    closeSourceHash: previousState?.closeSourceHash ?? closeBasisHash,
    planFingerprint: previousState?.planFingerprint ?? planFingerprint,
    planHash: previousState?.planHash ?? planHash,
    writeSetHash: previousState?.writeSetHash ?? writeSetHash,
    expectedWrites: previousState?.expectedWrites ?? expectedWrites,
    completedSteps: previousState?.completedSteps ?? [],
    pendingSteps: previousState?.pendingSteps ?? ['guarded-writes', 'ready', 'close', 'audit-close'],
    stepJournal: [],
    mutationSummary: nextAttempt.mutationSummary,
    attempts: [...previousAttempts, nextAttempt],
    path: toPortablePath(path.join('.hadara', 'local', 'task-close', `${safeFilePart(taskId)}.json`)),
    persisted: false,
    ...(previousState ? { resumedFromOperation: true } : {}),
    ...(previousState?.finalSourceHash ? { finalSourceHash: previousState.finalSourceHash } : {}),
    ...(previousState?.proof ? { proof: previousState.proof } : {}),
    createdAt: previousState?.createdAt ?? now,
    updatedAt: now
  };
}

function createProofAppendGuardFromOperation(operation: TaskCloseOperationState | undefined): TaskCloseProofAppendGuard | undefined {
  if (!operation) return undefined;
  return {
    markerPath: operation.path,
    taskId: operation.taskId,
    operationId: operation.operationId,
    operationIdempotencyKey: operation.idempotencyKey,
    closeBasisHash: operation.closeBasisHash,
    planHash: operation.planHash,
    writeSetHash: operation.writeSetHash,
    expectedWrites: operation.expectedWrites.map((write) => ({ ...write })),
    proofIdempotencyKey: operation.proof?.idempotencyKey
  };
}

function createExpectedWrites(reviewedPlan: ReviewedTaskClosePlan): TaskCloseExpectedWrite[] {
  const guardedWritesWrites: TaskCloseExpectedWrite[] = reviewedPlan.reports.guardedWrites.writes.map((write) => ({
    step: 'guarded-writes',
    path: write.path,
    writeBoundary: 'task-local',
    action: write.action,
    field: write.field,
    expectedBeforeExists: write.expectedBeforeExists,
    expectedBeforeHash: write.expectedBeforeHash,
    afterHash: write.afterHash
  }));
  const closeReport = reviewedPlan.reports.close;
  const evidencePath = reviewedPlan.reports.guardedWrites.task?.capsule
    ? `${reviewedPlan.reports.guardedWrites.task.capsule}/evidence.jsonl`
    : reviewedPlan.review.pendingWrites.find((write) => write.step === 'close' && write.writeBoundary === 'evidence-append')?.paths[0];
  const evidenceWrites: TaskCloseExpectedWrite[] = closeReport?.ok && evidencePath
    ? [
        createReadinessEvidenceExpectedWrite(evidencePath, closeReport),
        createCloseProofExpectedWrite(evidencePath, closeReport)
      ]
    : [];
  return [...guardedWritesWrites, ...evidenceWrites];
}

function createReadinessEvidenceExpectedWrite(evidencePath: string, closeReport: TaskCloseReport): TaskCloseExpectedWrite {
  const validationHash = closeReport.validation.validatedBeforeCloseEvidenceReportHash;
  const sourceHash = closeReport.validation.validatedBeforeCloseEvidenceSourceHash;
  const idempotencyKey = `task-close-plan-readiness:${closeReport.taskId}:${validationHash}:${sourceHash}`;
  return {
    step: 'close',
    path: evidencePath,
    writeBoundary: 'evidence-append',
    appendKind: 'readiness-evidence',
    appendOrder: 1,
    idempotencyKey,
    recordHash: hashObject({
      kind: 'readiness-evidence',
      taskId: closeReport.taskId,
      validationHash,
      sourceHash,
      idempotencyKey
    })
  };
}

function createCloseProofExpectedWrite(evidencePath: string, closeReport: TaskCloseReport): TaskCloseExpectedWrite {
  const validationHash = closeReport.validation.validatedBeforeCloseEvidenceReportHash;
  const sourceHash = closeReport.validation.validatedBeforeCloseEvidenceSourceHash;
  const idempotencyKey = closeReport.closeEvidenceWrite?.idempotencyKey ?? hashObject({ taskId: closeReport.taskId, validationHash, sourceHash });
  return {
    step: 'close',
    path: evidencePath,
    writeBoundary: 'evidence-append',
    appendKind: 'close-proof',
    appendOrder: 2,
    idempotencyKey,
    recordHash: hashObject({
      kind: 'close-proof',
      taskId: closeReport.taskId,
      validationHash,
      sourceHash,
      idempotencyKey,
      result: closeReport.closeEvidence.result
    })
  };
}

function markOperationVerifying(operation: TaskCloseOperationState): TaskCloseOperationState {
  return {
    ...operation,
    phase: 'verifying',
    updatedAt: new Date().toISOString()
  };
}

function markOperationProofPending(operation: TaskCloseOperationState, closeReport: TaskCloseReport): TaskCloseOperationState {
  return {
    ...operation,
    phase: 'proof-pending',
    finalSourceHash: closeReport.validation.validatedBeforeCloseEvidenceSourceHash,
    proof: {
      idempotencyKey: closeReport.closeEvidenceWrite?.idempotencyKey ?? hashObject({
        taskId: operation.taskId,
        sourceHash: closeReport.validation.validatedBeforeCloseEvidenceSourceHash,
        reportHash: closeReport.validation.validatedBeforeCloseEvidenceReportHash
      }),
      outcome: closeReport.closeEvidenceWrite?.duplicateAction === 'no-op' ? 'existing-noop' : 'pending'
    },
    updatedAt: new Date().toISOString()
  };
}

function readCloseOperation(projectRoot: string, taskId: string): TaskCloseOperationState | null {
  const absolutePath = path.join(projectRoot, '.hadara', 'local', 'task-close', `${safeFilePart(taskId)}.json`);
  try {
    const parsed = JSON.parse(fs.readFileSync(absolutePath, 'utf8')) as TaskCloseOperationState;
    if (parsed.taskId !== taskId) return null;
    return { ...parsed, path: toPortablePath(path.relative(projectRoot, absolutePath)), persisted: true };
  } catch {
    return null;
  }
}

function persistCloseOperation(projectRoot: string, operation: TaskCloseOperationState): { operation: TaskCloseOperationState; persistence: Pick<TaskCloseMarkerPersistenceSummary, 'contentWrites' | 'fileFsyncs' | 'directoryFsyncs' | 'unchangedSkips'> } {
  const absolutePath = path.join(projectRoot, operation.path);
  ensureDir(path.dirname(absolutePath));
  const existing = readJsonObject(absolutePath);
  const semanticCandidate = { ...operation, persisted: true };
  if (existing && jsonSemanticallyEqualIgnoringUpdatedAt(existing, semanticCandidate)) {
    return {
      operation: { ...semanticCandidate, updatedAt: typeof existing.updatedAt === 'string' ? existing.updatedAt : operation.updatedAt },
      persistence: { contentWrites: 0, fileFsyncs: 0, directoryFsyncs: 0, unchangedSkips: 1 }
    };
  }
  const persisted = { ...semanticCandidate, updatedAt: new Date().toISOString() };
  const persistence = writeJsonAtomic(absolutePath, persisted);
  return { operation: persisted, persistence };
}

function updateCloseOperationFromClosePlan(operation: TaskCloseOperationState, closePlan: TaskClosePlanReport): TaskCloseOperationState {
  const completedSteps = (closePlan.execution?.executedSteps ?? []).filter((step) => step.status === 'executed' || step.status === 'satisfied').map((step) => step.id);
  const guardedWritesParticipated = completedSteps.includes('guarded-writes') || closePlan.guardedWrites.summary.plannedWrites > 0;
  const allSteps: TaskClosePlanExecutionStepId[] = [
    ...(guardedWritesParticipated ? ['guarded-writes' as const] : []),
    'ready',
    'close',
    'audit-close'
  ];
  const pendingSteps = allSteps.filter((step) => !completedSteps.includes(step));
  const attempts = syncOperationAttemptsFromClosePlan(operation.attempts ?? [], closePlan);
  const activeAttempt = attempts.at(-1);
  const executedWrites = activeAttempt?.mutationSummary.executedWrites ?? 0;
  const executedFileWrites = countExecutedTargetFileWrites(closePlan.execution?.executedSteps ?? []);
  const closeProofAppended = activeAttempt?.mutationSummary.closeProofAppended ?? false;
  const idempotentNoop = closePlan.ok && closePlan.state === 'closed-valid' && executedWrites === 0 && closePlan.pendingWrites.length === 0;
  const phase: TaskCloseOperationPhase = closePlan.ok ? 'closed-valid' : executedWrites > 0 ? 'recovery-required' : 'blocked';
  const proofOutcome = closeProofAppended ? 'appended' : idempotentNoop ? 'existing-noop' : operation.proof?.outcome;
  const updated = {
    ...operation,
    phase,
    completedSteps,
    pendingSteps,
    stepJournal: activeAttempt?.stepJournal ?? [],
    mutationSummary: {
      executedWrites,
      plannedMutationSteps: closePlan.pendingWrites.length,
      executedMutationSteps: executedWrites,
      plannedFileWrites: closePlan.pendingWrites.filter((write) => write.writeBoundary === 'task-local').reduce((count, write) => count + write.paths.length, 0),
      executedFileWrites,
      evidenceAppends: (closeProofAppended ? 1 : 0) + (closePlan.readinessEvidence?.jsonlAppended ? 1 : 0),
      recoveredWrites: activeAttempt?.mutationSummary.recoveredWrites ?? 0,
      closeProofAppended,
      idempotentNoop
    },
    attempts: activeAttempt
      ? [...attempts.slice(0, -1), { ...activeAttempt, completedAt: new Date().toISOString(), phase, mutationSummary: { ...activeAttempt.mutationSummary, idempotentNoop } }]
      : attempts,
    ...(proofOutcome && operation.proof ? { proof: { ...operation.proof, outcome: proofOutcome } } : {}),
    persisted: executedWrites > 0 && !closePlan.ok,
    updatedAt: new Date().toISOString()
  };
  return updated;
}

function updateCloseOperationFromProgress(operation: TaskCloseOperationState, event: TaskClosePlanProgressEvent): TaskCloseOperationState {
  const allSteps: TaskClosePlanExecutionStepId[] = ['guarded-writes', 'ready', 'close', 'audit-close'];
  const completed = new Set(operation.completedSteps);
  if (event.phase === 'executed' || event.phase === 'satisfied') completed.add(event.step);
  const completedSteps = allSteps.filter((step) => completed.has(step));
  const attempts = appendProgressToOperationAttempts(operation.attempts ?? [], event);
  const activeAttempt = attempts.at(-1);
  const stepJournal = activeAttempt?.stepJournal ?? [];
  const executedWrites = activeAttempt?.mutationSummary.executedWrites ?? 0;
  const closeProofAppended = activeAttempt?.mutationSummary.closeProofAppended ?? false;
  const phase = nextProgressOperationPhase(operation, event.phase, executedWrites);
  return {
    ...operation,
    phase,
    completedSteps,
    pendingSteps: allSteps.filter((step) => !completed.has(step)),
    stepJournal,
    mutationSummary: {
      executedWrites,
      plannedMutationSteps: activeAttempt?.mutationSummary.plannedMutationSteps,
      executedMutationSteps: executedWrites,
      plannedFileWrites: activeAttempt?.mutationSummary.plannedFileWrites,
      executedFileWrites: activeAttempt?.mutationSummary.executedFileWrites,
      evidenceAppends: activeAttempt?.mutationSummary.evidenceAppends,
      recoveredWrites: activeAttempt?.mutationSummary.recoveredWrites,
      closeProofAppended,
      idempotentNoop: executedWrites === 0 && event.phase !== 'blocked' && stepJournal.some((entry) => entry.phase === 'outcome')
    },
    attempts,
    persisted: true,
    updatedAt: new Date().toISOString()
  };
}

function nextProgressOperationPhase(
  operation: TaskCloseOperationState,
  eventPhase: TaskClosePlanProgressEvent['phase'],
  executedWrites: number
): TaskCloseOperationPhase {
  if (operation.phase === 'proof-pending' || operation.phase === 'closed-valid') return operation.phase;
  if (eventPhase === 'blocked') return executedWrites > 0 ? 'recovery-required' : 'blocked';
  return 'applying';
}

function countMutatingExecutedSteps(steps: TaskClosePlanExecutedStep[]): number {
  return steps.filter((step) => didClosePlanExecutedStepMutate(step)).length;
}

function countExecutedTargetFileWrites(steps: TaskClosePlanExecutedStep[]): number {
  return steps.reduce((count, step) => count + (step.writeBoundary === 'task-local' ? step.fileWrites ?? 0 : 0), 0);
}

function createOperationStepJournal(steps: TaskClosePlanExecutedStep[]): TaskCloseOperationStepJournalEntry[] {
  const now = new Date().toISOString();
  return steps.map((step, index) => ({
    seq: index + 1,
    step: step.id,
    phase: 'outcome',
    status: step.status,
    writeBoundary: step.writeBoundary,
    ...(step.writeOutcome ? { writeOutcome: step.writeOutcome } : {}),
    mutated: didClosePlanExecutedStepMutate(step),
    ...(step.fileWrites ? { fileWrites: step.fileWrites } : {}),
    at: now
  }));
}

function appendProgressToOperationAttempts(
  attempts: TaskCloseOperationAttempt[],
  event: TaskClosePlanProgressEvent
): TaskCloseOperationAttempt[] {
  if (event.step === 'refresh') return attempts;
  const current = attempts.at(-1);
  if (!current) return attempts;
  const phase: TaskCloseOperationStepJournalEntry['phase'] = event.phase === 'start' ? 'intent' : 'outcome';
  const nextStepJournal = [
    ...current.stepJournal,
    {
      seq: current.stepJournal.length + 1,
      step: event.step,
      phase,
      status: event.phase,
      writeBoundary: event.writeBoundary ?? 'read-only',
      ...(event.writeOutcome ? { writeOutcome: event.writeOutcome } : {}),
      mutated: event.mutated ?? false,
      ...(event.fileWrites ? { fileWrites: event.fileWrites } : {}),
      at: new Date().toISOString()
    }
  ];
  const mutationSummary = { ...summarizeAttemptJournal(nextStepJournal, event.phase === 'blocked'), recoveredWrites: current.mutationSummary.recoveredWrites };
  const updatedCurrent: TaskCloseOperationAttempt = {
    ...current,
    phase: event.phase === 'blocked' ? (mutationSummary.executedWrites > 0 ? 'recovery-required' : 'blocked') : 'applying',
    stepJournal: nextStepJournal,
    mutationSummary
  };
  return [...attempts.slice(0, -1), updatedCurrent];
}

function summarizeAttemptJournal(
  journal: TaskCloseOperationStepJournalEntry[],
  blocked = false
): TaskCloseOperationAttempt['mutationSummary'] {
  const latestOutcomes = new Map<TaskClosePlanExecutionStepId, TaskCloseOperationStepJournalEntry>();
  for (const entry of journal) {
    if (entry.phase !== 'outcome') continue;
    latestOutcomes.set(entry.step, entry);
  }
  const outcomes = [...latestOutcomes.values()];
  const executedWrites = outcomes.filter((entry) => entry.mutated).length;
  const executedFileWrites = journal.reduce((count, entry) =>
    count + (entry.phase === 'outcome' && entry.status === 'executed' && entry.writeBoundary === 'task-local' ? entry.fileWrites ?? 0 : 0), 0);
  return {
    executedWrites,
    executedMutationSteps: executedWrites,
    executedFileWrites,
    evidenceAppends: outcomes.filter((entry) => entry.step === 'close' && entry.status === 'executed' && entry.writeOutcome === 'appended').length,
    recoveredWrites: 0,
    closeProofAppended: outcomes.some((entry) => entry.step === 'close' && entry.status === 'executed' && entry.writeOutcome === 'appended'),
    idempotentNoop: !blocked && executedWrites === 0 && outcomes.length > 0
  };
}

function syncOperationAttemptsFromClosePlan(
  attempts: TaskCloseOperationAttempt[],
  closePlan: TaskClosePlanReport
): TaskCloseOperationAttempt[] {
  const current = attempts.at(-1);
  if (!current) return attempts;
  const syncedJournal = syncOutcomeEntries(current.stepJournal, closePlan.execution?.executedSteps ?? []);
  const updatedCurrent: TaskCloseOperationAttempt = {
    ...current,
    phase: closePlan.ok ? 'closed-valid' : summarizeAttemptJournal(syncedJournal).executedWrites > 0 ? 'recovery-required' : 'blocked',
    stepJournal: syncedJournal,
    mutationSummary: {
      ...summarizeAttemptJournal(syncedJournal, !closePlan.ok),
      recoveredWrites: current.mutationSummary.recoveredWrites,
      idempotentNoop: closePlan.ok && closePlan.state === 'closed-valid' && countMutatingExecutedSteps(closePlan.execution?.executedSteps ?? []) === 0 && closePlan.pendingWrites.length === 0
    }
  };
  return [...attempts.slice(0, -1), updatedCurrent];
}

function syncOutcomeEntries(
  journal: TaskCloseOperationStepJournalEntry[],
  steps: TaskClosePlanExecutedStep[]
): TaskCloseOperationStepJournalEntry[] {
  const next = [...journal];
  for (const step of steps) {
    const hasOutcome = next.some((entry) =>
      entry.step === step.id &&
      entry.phase === 'outcome' &&
      entry.status === step.status &&
      entry.writeBoundary === step.writeBoundary &&
      entry.writeOutcome === step.writeOutcome &&
      entry.mutated === didClosePlanExecutedStepMutate(step)
    );
    if (hasOutcome) continue;
    next.push({
      seq: next.length + 1,
      step: step.id,
      phase: 'outcome',
      status: step.status,
      writeBoundary: step.writeBoundary,
      ...(step.writeOutcome ? { writeOutcome: step.writeOutcome } : {}),
      mutated: didClosePlanExecutedStepMutate(step),
      at: new Date().toISOString()
    });
  }
  return next;
}

function shouldPersistCloseOperationProgress(operation: TaskCloseOperationState, event: TaskClosePlanProgressEvent): boolean {
  if (event.phase === 'start') return false;
  if (event.mutated) return true;
  return event.phase === 'blocked' && (operation.mutationSummary?.executedWrites ?? 0) > 0;
}

function emptyMarkerPersistenceSummary(): TaskCloseMarkerPersistenceSummary {
  return {
    contentWrites: 0,
    cleanupWrites: 0,
    progressWrites: 0,
    fileFsyncs: 0,
    directoryFsyncs: 0,
    unchangedSkips: 0
  };
}

function removeCloseOperation(projectRoot: string, portablePath: string): { removed: boolean; directoryFsyncs: number } {
  try {
    const absolutePath = path.join(projectRoot, portablePath);
    const existed = fs.existsSync(absolutePath);
    fs.rmSync(absolutePath, { force: true });
    if (existed) {
      fsyncDirectoryBestEffort(path.dirname(absolutePath));
      return { removed: true, directoryFsyncs: 1 };
    }
    return { removed: false, directoryFsyncs: 0 };
  } catch {
    // Recovery state is best-effort local metadata; close proof remains canonical.
    return { removed: false, directoryFsyncs: 0 };
  }
}

function normalizeOperationForReport(projectRoot: string, operation: TaskCloseOperationState): TaskCloseOperationState {
  const absolutePath = path.join(projectRoot, operation.path);
  return {
    ...operation,
    persisted: fs.existsSync(absolutePath)
  };
}

function isTaskCloseReport(value: unknown): value is TaskCloseTransactionReport {
  return Boolean(value && typeof value === 'object' && (value as TaskCloseTransactionReport).schemaVersion === 'hadara.task.close.v3');
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}

function safeFilePart(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]/g, '_');
}

function sleepSync(ms: number): void {
  const signal = new Int32Array(new SharedArrayBuffer(4));
  Atomics.wait(signal, 0, 0, ms);
}

function normalizeCloseNextAction(taskId: string, action: HadaraNextAction | undefined): HadaraNextAction | undefined {
  if (!action) return undefined;
  if (!action.command) return action;
  let command = action.command;
  command = command.replace(`hadara task close --task ${taskId} --execute --auto --json`, `hadara task close --task ${taskId} --json`);
  command = command.replace(`hadara task close --task ${taskId} --json`, `hadara task close --task ${taskId} --dry-run --json`);
  command = command.replace(`hadara task close --task ${taskId} --execute --plan-hash`, `hadara task close --task ${taskId} --execute --plan-hash`);
  const publicCloseWrite = /\bhadara\s+task\s+close\b/.test(command) && command.includes(taskId) && !command.includes('--dry-run');
  if (command === action.command && (!publicCloseWrite || action.writeBoundary === 'task-close-transaction')) return action;
  return {
    ...action,
    command,
    summary: action.summary.replace(/\bclosePlan\b/gi, 'task close'),
    ...(publicCloseWrite ? { writeBoundary: 'task-close-transaction' as const } : {})
  };
}

function hashObject(value: unknown): string {
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex')}`;
}

function hashContent(value: string): string {
  return `sha256:${crypto.createHash('sha256').update(value, 'utf8').digest('hex')}`;
}

function readJsonObject(absolutePath: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function jsonSemanticallyEqualIgnoringUpdatedAt(left: Record<string, unknown>, right: Record<string, unknown>): boolean {
  return JSON.stringify({ ...left, updatedAt: '' }) === JSON.stringify({ ...right, updatedAt: '' });
}

function writeJsonAtomic(absolutePath: string, value: unknown): Pick<TaskCloseMarkerPersistenceSummary, 'contentWrites' | 'fileFsyncs' | 'directoryFsyncs' | 'unchangedSkips'> {
  const tempPath = `${absolutePath}.${process.pid}.${Date.now()}.${crypto.randomUUID()}.tmp`;
  const payload = `${JSON.stringify(value, null, 2)}\n`;
  if (fs.existsSync(absolutePath) && fs.readFileSync(absolutePath, 'utf8') === payload) {
    return { contentWrites: 0, fileFsyncs: 0, directoryFsyncs: 0, unchangedSkips: 1 };
  }
  const fd = fs.openSync(tempPath, 'wx');
  try {
    fs.writeFileSync(fd, payload, 'utf8');
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(tempPath, absolutePath);
  let directoryFsyncs = 0;
  try {
    fsyncDirectoryBestEffort(path.dirname(absolutePath));
    directoryFsyncs = 1;
  } catch {
    // Directory fsync is best-effort across platforms/filesystems.
  }
  return { contentWrites: 1, fileFsyncs: 1, directoryFsyncs, unchangedSkips: 0 };
}

function fsyncDirectoryBestEffort(dirPath: string): void {
  const dirFd = fs.openSync(dirPath, 'r');
  try {
    fs.fsyncSync(dirFd);
  } finally {
    fs.closeSync(dirFd);
  }
}
