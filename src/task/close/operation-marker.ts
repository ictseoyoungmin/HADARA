import fs from 'node:fs';
import path from 'node:path';
import { ensureDir } from '../../core/fs';
import type { TaskCloseProofAppendGuard } from './proof';
import type { TaskCloseMarkerPersistenceSummary, TaskCloseOperationState } from './model';
import {
  jsonSemanticallyEqualIgnoringUpdatedAt,
  readJsonObject,
  safeFilePart,
  toPortablePath,
  writeJsonAtomic
} from './filesystem-adapter';

/** Persistence and proof-authority projection for the task-local operation marker. */
export function readCloseOperation(projectRoot: string, taskId: string): TaskCloseOperationState | null {
  const absolutePath = path.join(projectRoot, '.hadara', 'local', 'task-close', `${safeFilePart(taskId)}.json`);
  try {
    const parsed = JSON.parse(fs.readFileSync(absolutePath, 'utf8')) as TaskCloseOperationState;
    if (parsed.taskId !== taskId) return null;
    return { ...parsed, path: toPortablePath(path.relative(projectRoot, absolutePath)), persisted: true };
  } catch {
    return null;
  }
}

export function persistCloseOperation(projectRoot: string, operation: TaskCloseOperationState): {
  operation: TaskCloseOperationState;
  persistence: Pick<TaskCloseMarkerPersistenceSummary, 'contentWrites' | 'fileFsyncs' | 'directoryFsyncs' | 'unchangedSkips'>;
} {
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

export function createProofAppendGuardFromOperation(operation: TaskCloseOperationState | undefined): TaskCloseProofAppendGuard | undefined {
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
