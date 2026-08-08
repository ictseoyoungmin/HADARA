import type { HadaraActorContext } from '../../core/actor-context';
import type { HadaraNextAction } from '../../core/next-action';
import type { RemediationHint } from '../../services/task-validation';
import type { TaskAuthoringGuidance } from '../authoring-guidance';
import type { CloseGuardedWritePlan } from './guardedWrites';

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
  action?: 'update' | 'insert';
  field?: 'task-status' | 'task-handoff-identity' | 'task-board-row';
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

export type TaskClosePlanMode = 'dry-run' | 'execute' | 'execute-refused';
export type TaskClosePlanStepId = 'ready' | 'close' | 'audit-close';
export type TaskClosePlanExecutionStepId = TaskClosePlanStepId | 'guarded-writes';
export type TaskClosePlanStepStatus = 'satisfied' | 'required' | 'blocked' | 'pending' | 'unknown';

export interface TaskClosePlanIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
  fixHint?: string;
  example?: string;
}

export interface TaskClosePlanStep {
  id: TaskClosePlanStepId;
  status: TaskClosePlanStepStatus;
  summary: string;
  command: string;
  mode: 'dry-run' | 'execute' | 'read-only';
  writeBoundary: 'read-only' | 'task-local' | 'evidence-append';
  expectedWritePaths: string[];
  alreadySatisfied: boolean;
  sourceReport: string;
}

export interface TaskClosePlanExecution {
  requestedPlanHash?: string;
  currentPlanHash?: string;
  planHashMatched: boolean;
  executedSteps: TaskClosePlanExecutedStep[];
  stoppedAt?: TaskClosePlanExecutionStepId;
}

export interface TaskClosePlanReadinessEvidence {
  attempted: boolean;
  reason: 'close-required' | 'blocked';
  id?: string;
  existing?: boolean;
  jsonlAppended?: boolean;
  markdownAppended?: boolean;
  summary?: string;
}

export interface TaskClosePlanExecutedStep {
  id: TaskClosePlanExecutionStepId;
  status: 'executed' | 'satisfied' | 'blocked' | 'skipped';
  command: string;
  ok: boolean;
  reportHash: string;
  summary: string;
  writeBoundary: 'read-only' | 'task-local' | 'evidence-append';
  fileWrites?: number;
  writeOutcome?: 'appended' | 'existing-noop' | 'blocked';
}

export interface TaskClosePlanReport {
  schemaVersion: 'hadara.task.close_plan.v1';
  command: 'task.close-plan';
  ok: boolean;
  state: 'blocked' | 'ready-to-close' | 'closed-valid' | 'closed-stale' | 'in-progress';
  planStatus: 'blocked' | 'executable' | 'executable-with-deferred-checks' | 'satisfied' | 'pending';
  blockingIssues: TaskClosePlanIssue[];
  deferredChecks: TaskClosePlanStepId[];
  partialExecutionRisk: boolean;
  pendingWrites: Array<{
    step: TaskClosePlanExecutionStepId;
    writeBoundary: TaskClosePlanStep['writeBoundary'];
    paths: string[];
  }>;
  readOnly: boolean;
  mode: TaskClosePlanMode;
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
    deferredChecks?: TaskClosePlanStepId[];
    partialExecutionRisk?: boolean;
    evaluatedReports?: string[];
    skippedReports?: string[];
  };
  writeSetHash: string;
  writes: CloseGuardedWritePlan['writes'];
  steps: TaskClosePlanStep[];
  execution?: TaskClosePlanExecution;
  readinessEvidence?: TaskClosePlanReadinessEvidence;
  authoringGuidance: TaskAuthoringGuidance;
  diagnostics?: { generatedBy: 'cli'; commandPath: string; durationMs: number; slowThresholdMs: number; slow: boolean; note?: string };
  primaryNextAction?: HadaraNextAction;
  nextActions: HadaraNextAction[];
  issues: TaskClosePlanIssue[];
}

export interface TaskCloseIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
  heading?: string;
  fixHint?: string;
  example?: string;
  remediationHint?: RemediationHint;
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
