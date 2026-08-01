import type { HadaraNextAction } from '../../core/next-action';
import type {
  TaskCloseOperationState,
  TaskCloseRecoveryWrite,
  TaskCloseTransactionReport
} from './execute';

export interface CloseRecoveryClassification {
  completedWrites: TaskCloseRecoveryWrite[];
  pendingWrites: TaskCloseRecoveryWrite[];
  conflictingWrites: TaskCloseRecoveryWrite[];
}

/** Recovery metadata projection; it does not format or write the transaction report. */
export function createRecoveryReport(
  operation: TaskCloseOperationState | undefined,
  action: HadaraNextAction,
  classification?: CloseRecoveryClassification,
  resumable = true
): NonNullable<TaskCloseTransactionReport['recovery']> {
  return {
    required: true,
    ...(operation?.operationId ? { operationId: operation.operationId } : {}),
    ...(operation?.phase ? { phase: operation.phase } : {}),
    resumable,
    classificationAvailable: Boolean(classification),
    completedWrites: classification?.completedWrites ?? [],
    pendingWrites: classification?.pendingWrites ?? [],
    conflictingWrites: classification?.conflictingWrites ?? [],
    primaryAction: action,
    action
  };
}
