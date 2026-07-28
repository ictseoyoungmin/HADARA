import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { HadaraActorContext } from '../core/actor-context';
import type { HadaraNextAction } from '../core/next-action';
import { ensureDir } from '../core/fs';
import { startMonotonicTimer } from '../core/timing';
import { createTaskFinalizeReport, formatTaskFinalizeReport, type TaskFinalizeOptions, type TaskFinalizeProgressEvent, type TaskFinalizeReport, type TaskFinalizeStepId } from './task-finalize';
import { defaultTaskLifecycleActor } from './lifecycle-next-actions';

export type TaskCloseTransactionMode = 'dry-run' | 'execute' | 'execute-refused';

export interface TaskCloseTransactionOptions {
  dryRun?: boolean;
  executeRequested?: boolean;
  planHash?: string;
  actor?: HadaraActorContext;
  onProgress?: (event: TaskFinalizeProgressEvent) => void;
  lockTimeoutMs?: number;
}

const TASK_CLOSE_LOCK_STALE_MS = 5 * 60 * 1000;
const TASK_CLOSE_LOCK_METADATA_GRACE_MS = 2000;

export type TaskCloseOperationPhase = 'preflight' | 'applying' | 'closed-valid' | 'blocked' | 'recovery-required';

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
  phase: TaskCloseOperationPhase;
  planHash: string;
  completedSteps: string[];
  pendingSteps: string[];
  path: string;
  persisted: boolean;
  resumedFromOperation?: boolean;
  createdAt: string;
  updatedAt: string;
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
  terminal: boolean;
  operatorGuidance: string;
  readOnly: boolean;
  transaction: {
    strategy: 'finalize-auto' | 'finalize-reviewed-plan' | 'review-only';
    internalReview: boolean;
    planHash?: string;
    proofLast: true;
    stalePlanGuard: true;
    lockOrder: ['project-lifecycle', 'task-board', 'task-scoped', 'evidence-append'];
    locks: TaskCloseTransactionLockDiagnostics[];
    operation?: TaskCloseOperationState;
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
  const run = (): TaskCloseTransactionReport => {
    if (options.dryRun) {
      return fromFinalizeReport(projectRoot, taskId, createTaskFinalizeReport(projectRoot, taskId, { actor }), {
        mode: 'dry-run',
        strategy: 'review-only',
        internalReview: false
      });
    }

    let operation: TaskCloseOperationState;
    const progressWrapper = (event: TaskFinalizeProgressEvent): void => {
      if (event.phase === 'executed' || event.phase === 'satisfied' || event.phase === 'blocked') {
        operation = persistCloseOperation(projectRoot, updateCloseOperationFromProgress(operation, event));
      }
      options.onProgress?.(event);
    };
    const finalizeOptions: TaskFinalizeOptions = {
      executeRequested: true,
      actor,
      recordReadinessEvidence: true,
      onProgress: progressWrapper
    };
    const strategy = options.planHash ? 'finalize-reviewed-plan' : 'finalize-auto';
    if (options.planHash) {
      finalizeOptions.planHash = options.planHash;
    } else {
      finalizeOptions.auto = true;
    }

    const review = createTaskFinalizeReport(projectRoot, taskId, { actor });
    operation = createCloseOperation(projectRoot, taskId, review.planHash ?? hashObject({ taskId, state: review.state }), 'applying');
    operation = persistCloseOperation(projectRoot, operation);
    const finalize = createTaskFinalizeReport(projectRoot, taskId, finalizeOptions);
    const updatedOperation = updateCloseOperationFromFinalize(projectRoot, operation, finalize);
    if (finalize.ok || (finalize.execution?.executedSteps ?? []).filter((step) => step.status === 'executed' && step.writeBoundary !== 'read-only').length === 0) {
      removeCloseOperation(projectRoot, operation.path);
    }
    const report = fromFinalizeReport(projectRoot, taskId, finalize, {
      mode: finalize.mode === 'execute-refused' ? 'execute-refused' : finalize.readOnly ? 'dry-run' : 'execute',
      strategy,
      internalReview: strategy === 'finalize-auto',
      operation: updatedOperation
    });
    return report;
  };

  return withTaskCloseTransactionLocks(projectRoot, taskId, run, options.lockTimeoutMs);
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
  if (options.detail === 'full') lines.push('', 'Finalize source:', formatTaskFinalizeReport(report.source.finalize));
  return lines.join('\n');
}

function fromFinalizeReport(
  projectRoot: string,
  taskId: string,
  finalize: TaskFinalizeReport,
  options: {
    mode: TaskCloseTransactionMode;
    strategy: TaskCloseTransactionReport['transaction']['strategy'];
    internalReview: boolean;
    locks?: TaskCloseTransactionLockDiagnostics[];
    operation?: TaskCloseOperationState;
  }
): TaskCloseTransactionReport {
  const executedSteps = finalize.execution?.executedSteps ?? [];
  const executedWrites = executedSteps.filter((step) => step.writeBoundary !== 'read-only' && step.status === 'executed').length;
  const closeProofAppended = executedSteps.some(
    (step) => step.id === 'close' && step.status === 'executed' && step.writeOutcome === 'appended'
  );
  const idempotentNoop = finalize.ok && finalize.state === 'closed-valid' && executedWrites === 0 && finalize.pendingWrites.length === 0;
  const recoveryAction = finalize.ok ? undefined : normalizeCloseNextAction(taskId, finalize.primaryNextAction ?? finalize.nextActions.find((action) => action.required));
  const transactionPlanHash = finalize.execution?.requestedPlanHash ?? finalize.planHash ?? hashObject({ taskId, state: finalize.state, issues: finalize.issues });
  const nextActions = finalize.ok
    ? []
    : finalize.nextActions.map((action) => normalizeCloseNextAction(taskId, action) ?? action);

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
    terminal: finalize.ok && finalize.state === 'closed-valid',
    operatorGuidance: finalize.ok && finalize.state === 'closed-valid'
      ? 'Close is complete. Report closed-valid and stop; do not run task status to reconfirm or discover follow-up work unless the current human/reviewer instruction explicitly requires continuation.'
      : 'Resolve the reported blocker or recovery action before treating this capsule as closed.',
    readOnly: finalize.readOnly,
    transaction: {
      strategy: options.strategy,
      internalReview: options.internalReview,
      planHash: transactionPlanHash,
      proofLast: true,
      stalePlanGuard: true,
      lockOrder: ['project-lifecycle', 'task-board', 'task-scoped', 'evidence-append'],
      locks: options.locks ?? [],
      ...(options.operation ? { operation: normalizeOperationForReport(projectRoot, options.operation) } : {})
    },
    writeSummary: {
      plannedWrites: finalize.pendingWrites.length,
      executedWrites,
      executedSteps: executedSteps.map((step) => step.id),
      ...(finalize.execution?.stoppedAt ? { stoppedAt: finalize.execution.stoppedAt } : {}),
      closeProofAppended,
      idempotentNoop
    },
    ...(recoveryAction ? { recovery: { required: true, action: recoveryAction }, primaryNextAction: recoveryAction } : {}),
    nextActions,
    source: { finalize },
    issues: finalize.issues
  };
}

function withTaskCloseTransactionLocks<T>(
  projectRoot: string,
  taskId: string,
  fn: () => T,
  timeoutMs = 5000
): T {
  const acquired: Array<{ path: string; name: TaskCloseTransactionLockDiagnostics['name']; token: string | null; diagnostic: TaskCloseTransactionLockDiagnostics }> = [];
  const lockSpecs: Array<{ name: TaskCloseTransactionLockDiagnostics['name']; pathParts: string[] }> = [
    { name: 'project-lifecycle', pathParts: ['project-lifecycle.lock'] },
    { name: 'task-board', pathParts: ['task-board.lock'] },
    { name: 'task-scoped', pathParts: ['task-close', `${safeFilePart(taskId)}.lock`] }
  ];
  try {
    for (const spec of lockSpecs) acquired.push(acquireCloseLock(projectRoot, taskId, spec.name, spec.pathParts, timeoutMs));
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
  const fallback = createTaskFinalizeReport(projectRoot, taskId, { actor });
  const report = fromFinalizeReport(projectRoot, taskId, fallback, {
    mode: 'execute-refused',
    strategy: 'finalize-auto',
    internalReview: true,
    locks
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

function createCloseOperation(projectRoot: string, taskId: string, planHash: string, phase: TaskCloseOperationPhase): TaskCloseOperationState {
  const previous = readCloseOperation(projectRoot, taskId);
  const reusePrevious = previous?.planHash === planHash;
  const operationId = hashObject({ taskId, planHash }).replace(/^sha256:/, '');
  const now = new Date().toISOString();
  return {
    operationId: reusePrevious ? previous.operationId : operationId,
    taskId,
    idempotencyKey: `task-close:${taskId}:${planHash}`,
    phase,
    planHash,
    completedSteps: reusePrevious ? previous.completedSteps : [],
    pendingSteps: reusePrevious ? previous.pendingSteps : ['finish', 'ready', 'close', 'audit-close'],
    path: toPortablePath(path.join('.hadara', 'local', 'task-close', `${safeFilePart(taskId)}.json`)),
    persisted: false,
    ...(reusePrevious ? { resumedFromOperation: true } : {}),
    createdAt: reusePrevious ? previous.createdAt : now,
    updatedAt: now
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

function persistCloseOperation(projectRoot: string, operation: TaskCloseOperationState): TaskCloseOperationState {
  const absolutePath = path.join(projectRoot, operation.path);
  ensureDir(path.dirname(absolutePath));
  const persisted = { ...operation, persisted: true, updatedAt: new Date().toISOString() };
  writeJsonAtomic(absolutePath, persisted);
  return persisted;
}

function updateCloseOperationFromFinalize(projectRoot: string, operation: TaskCloseOperationState, finalize: TaskFinalizeReport): TaskCloseOperationState {
  const completedSteps = (finalize.execution?.executedSteps ?? []).filter((step) => step.status === 'executed' || step.status === 'satisfied').map((step) => step.id);
  const allSteps: TaskFinalizeStepId[] = ['finish', 'ready', 'close', 'audit-close'];
  const pendingSteps = allSteps.filter((step) => !completedSteps.includes(step));
  const executedWrites = (finalize.execution?.executedSteps ?? []).filter((step) => step.status === 'executed' && step.writeBoundary !== 'read-only').length;
  const phase: TaskCloseOperationPhase = finalize.ok ? 'closed-valid' : executedWrites > 0 ? 'recovery-required' : 'blocked';
  const updated = {
    ...operation,
    phase,
    completedSteps,
    pendingSteps,
    persisted: executedWrites > 0 && !finalize.ok,
    updatedAt: new Date().toISOString()
  };
  if (updated.persisted) return persistCloseOperation(projectRoot, updated);
  return updated;
}

function updateCloseOperationFromProgress(operation: TaskCloseOperationState, event: TaskFinalizeProgressEvent): TaskCloseOperationState {
  const allSteps: TaskFinalizeStepId[] = ['finish', 'ready', 'close', 'audit-close'];
  const completed = new Set(operation.completedSteps);
  if (event.phase === 'executed' || event.phase === 'satisfied') completed.add(event.step);
  const completedSteps = allSteps.filter((step) => completed.has(step));
  return {
    ...operation,
    phase: event.phase === 'blocked' ? 'recovery-required' : 'applying',
    completedSteps,
    pendingSteps: allSteps.filter((step) => !completed.has(step)),
    persisted: true,
    updatedAt: new Date().toISOString()
  };
}

function removeCloseOperation(projectRoot: string, portablePath: string): void {
  try {
    fs.rmSync(path.join(projectRoot, portablePath), { force: true });
  } catch {
    // Recovery state is best-effort local metadata; close proof remains canonical.
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
  return Boolean(value && typeof value === 'object' && (value as TaskCloseTransactionReport).schemaVersion === 'hadara.task.close.v2');
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
  command = command.replace(`hadara task finalize --task ${taskId} --execute --auto --json`, `hadara task close --task ${taskId} --json`);
  command = command.replace(`hadara task finalize --task ${taskId} --json`, `hadara task close --task ${taskId} --dry-run --json`);
  command = command.replace(`hadara task finalize --task ${taskId} --execute --plan-hash`, `hadara task close --task ${taskId} --execute --plan-hash`);
  const publicCloseWrite = /\bhadara\s+task\s+close\b/.test(command) && command.includes(taskId) && !command.includes('--dry-run');
  if (command === action.command && (!publicCloseWrite || action.writeBoundary === 'task-close-transaction')) return action;
  return {
    ...action,
    command,
    summary: action.summary.replace(/\bfinalize\b/gi, 'task close'),
    ...(publicCloseWrite ? { writeBoundary: 'task-close-transaction' as const } : {})
  };
}

function hashObject(value: unknown): string {
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex')}`;
}

function writeJsonAtomic(absolutePath: string, value: unknown): void {
  const tempPath = `${absolutePath}.${process.pid}.${Date.now()}.${crypto.randomUUID()}.tmp`;
  const payload = `${JSON.stringify(value, null, 2)}\n`;
  const fd = fs.openSync(tempPath, 'wx');
  try {
    fs.writeFileSync(fd, payload, 'utf8');
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(tempPath, absolutePath);
  try {
    const dirFd = fs.openSync(path.dirname(absolutePath), 'r');
    try {
      fs.fsyncSync(dirFd);
    } finally {
      fs.closeSync(dirFd);
    }
  } catch {
    // Directory fsync is best-effort across platforms/filesystems.
  }
}
