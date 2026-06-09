import path from 'node:path';
import { appendEvidenceWithResult, EvidenceAppendLockError, EvidenceArtifactPolicyError, EvidenceRecord, PersistedEvidenceRecord } from '../evidence/evidence';
import { listTaskCapsules } from '../task/task-capsule';
import { WorkspaceFileError } from '../core/workspace';

export interface EvidenceCollectInput {
  taskId: string;
  kind: EvidenceRecord['kind'];
  path?: string;
  summary: string;
  result: EvidenceRecord['result'];
  visibility: NonNullable<EvidenceRecord['visibility']>;
  idempotencyKey?: string;
}

export interface EvidenceCollectReport {
  schemaVersion: 'hadara.evidence.collect.v1';
  command: 'evidence.collect';
  ok: boolean;
  evidence?: PersistedEvidenceRecord & {
    markdownPath: string;
    markdownAppended: boolean;
    jsonlAppended: boolean;
    existing: boolean;
  };
  issues: Array<{
    severity: 'error';
    code: string;
    message: string;
  }>;
}

export function createEvidenceCollectReport(projectRoot: string, input: EvidenceCollectInput): EvidenceCollectReport {
  const task = listTaskCapsules(projectRoot).find((item) => item.id === input.taskId);
  if (!task) {
    return {
      schemaVersion: 'hadara.evidence.collect.v1',
      command: 'evidence.collect',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: 'TASK_NOT_FOUND',
          message: `Task Capsule not found: ${input.taskId}`
        }
      ]
    };
  }

  let appendResult: ReturnType<typeof appendEvidenceWithResult>;
  try {
    appendResult = appendEvidenceWithResult(projectRoot, {
      taskId: input.taskId,
      kind: input.kind,
      path: input.path,
      summary: input.summary,
      result: input.result,
      visibility: input.visibility,
      idempotencyKey: input.idempotencyKey
    });
  } catch (error) {
    if (error instanceof WorkspaceFileError || error instanceof EvidenceArtifactPolicyError || error instanceof EvidenceAppendLockError) {
      return {
        schemaVersion: 'hadara.evidence.collect.v1',
        command: 'evidence.collect',
        ok: false,
        issues: [
          {
            severity: 'error',
            code: error.code,
            message: error.message
          }
        ]
      };
    }
    throw error;
  }

  return {
    schemaVersion: 'hadara.evidence.collect.v1',
    command: 'evidence.collect',
    ok: true,
    evidence: {
      ...appendResult.evidence,
      markdownPath: toPortablePath(path.relative(projectRoot, appendResult.markdownPath)),
      markdownAppended: appendResult.markdownAppended,
      jsonlAppended: appendResult.jsonlAppended,
      existing: appendResult.existing
    },
    issues: []
  };
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
