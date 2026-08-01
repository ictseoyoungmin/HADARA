import type { HadaraActorContext } from '../../core/actor-context';
import type { HadaraNextAction } from '../../core/next-action';
import type { CloseGuardedWrite } from './guardedWrites';
import type { TaskClosePlanReport } from './plan';
import type { TaskCloseIssue, TaskCloseReport } from './proof';

export type TaskCloseExecutionStepId = 'ready' | 'close' | 'audit-close' | 'guarded-writes';
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

export interface TaskCloseExpectedWrite {
  step: TaskCloseExecutionStepId;
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
  step: TaskCloseExecutionStepId;
  phase: 'intent' | 'outcome';
  status: 'start' | 'executed' | 'satisfied' | 'blocked' | 'skipped';
  writeBoundary: 'read-only' | 'task-local' | 'evidence-append';
  writeOutcome?: 'appended' | 'existing-noop' | 'blocked';
  mutated: boolean;
  fileWrites?: number;
  at: string;
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

export interface TaskCloseRecoveryWrite {
  step: TaskCloseExecutionStepId;
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

export interface TaskCloseTransactionReport {
  schemaVersion: 'hadara.task.close.v3';
  command: 'task.close';
  ok: boolean;
  mode: 'dry-run' | 'execute' | 'execute-refused';
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
  source: { closePlan: TaskClosePlanReport };
  diagnostics?: { generatedBy: 'cli'; commandPath: string; durationMs: number; slowThresholdMs: number; slow: boolean; note?: string };
  issues: TaskCloseIssue[];
}
