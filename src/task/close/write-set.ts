import { hashObject } from './filesystem-adapter';
import type { ReviewedTaskClosePlan } from './plan';
import type { TaskCloseExpectedWrite } from './execute';
import type { TaskCloseReport } from './proof';

export interface CloseOperationBasis {
  expectedWrites: TaskCloseExpectedWrite[];
  writeSetHash: string;
  closeBasisHash: string;
  finalSourceHash: string;
  planFingerprint: string;
}

/** Builds the immutable operation identity and expected write set for close. */
export function createCloseOperationBasis(reviewedPlan: ReviewedTaskClosePlan): CloseOperationBasis {
  const expectedWrites = createExpectedWrites(reviewedPlan);
  const writeSetHash = hashObject(expectedWrites);
  const planFingerprint = hashObject({
    taskId: reviewedPlan.review.taskId,
    steps: reviewedPlan.steps.map((step) => ({ id: step.id, status: step.status, expectedWritePaths: step.expectedWritePaths })),
    issues: reviewedPlan.issues.map((issue) => ({ severity: issue.severity, code: issue.code, path: issue.path ?? null })),
    writeSetHash
  });
  const finalSourceHash = reviewedPlan.reports.close?.validation.validatedBeforeCloseEvidenceSourceHash ?? planFingerprint;
  return {
    expectedWrites,
    writeSetHash,
    closeBasisHash: hashObject({
      kind: 'task-close-operation-basis.v1',
      taskId: reviewedPlan.review.taskId,
      finalSourceHash,
      readinessReportHash: reviewedPlan.reports.close?.validation.validatedBeforeCloseEvidenceReportHash ?? null
    }),
    finalSourceHash,
    planFingerprint
  };
}

export function createExpectedWrites(reviewedPlan: ReviewedTaskClosePlan): TaskCloseExpectedWrite[] {
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
    recordHash: hashObject({ kind: 'readiness-evidence', taskId: closeReport.taskId, validationHash, sourceHash, idempotencyKey })
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
