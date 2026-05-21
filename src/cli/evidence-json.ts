import fs from 'node:fs';
import path from 'node:path';
import { appendEvidence, EvidenceIndexRecord, EvidenceRecord } from '../evidence/evidence';
import { listTaskCapsules } from '../task/task-capsule';

export interface EvidenceCollectInput {
  taskId: string;
  kind: EvidenceRecord['kind'];
  path?: string;
  summary: string;
  result: EvidenceRecord['result'];
  visibility: NonNullable<EvidenceRecord['visibility']>;
}

export interface EvidenceCollectReport {
  schemaVersion: 'hadara.evidence.collect.v1';
  command: 'evidence.collect';
  ok: boolean;
  evidence?: EvidenceIndexRecord & {
    markdownPath: string;
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

  const markdownPath = appendEvidence(projectRoot, {
    taskId: input.taskId,
    kind: input.kind,
    path: input.path,
    summary: input.summary,
    result: input.result,
    visibility: input.visibility
  });
  const indexRecord = readLastEvidenceIndexRecord(task.dir);

  return {
    schemaVersion: 'hadara.evidence.collect.v1',
    command: 'evidence.collect',
    ok: true,
    evidence: {
      ...indexRecord,
      markdownPath: toPortablePath(path.relative(projectRoot, markdownPath))
    },
    issues: []
  };
}

function readLastEvidenceIndexRecord(taskDir: string): EvidenceIndexRecord {
  const indexPath = path.join(taskDir, 'evidence.jsonl');
  const lines = fs.readFileSync(indexPath, 'utf8').trim().split(/\r?\n/);
  return JSON.parse(lines.at(-1) ?? '{}') as EvidenceIndexRecord;
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}

