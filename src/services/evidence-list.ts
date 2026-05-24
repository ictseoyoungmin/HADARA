import fs from 'node:fs';
import path from 'node:path';
import { redactSecrets } from '../core/redaction';
import { EvidenceIndexRecord } from '../evidence/evidence';
import { listTaskCapsules } from '../task/task-capsule';

export interface EvidenceListInput {
  taskId: string;
  limit?: number;
  includePrivate?: boolean;
}

export interface EvidenceListIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
}

export interface EvidenceListReport {
  schemaVersion: 'hadara.evidence.list.v1';
  command: 'evidence.list';
  ok: boolean;
  taskId: string;
  count: number;
  records: EvidenceIndexRecord[];
  issues: EvidenceListIssue[];
}

const DEFAULT_LIMIT = 50;

export function createEvidenceListReport(projectRoot: string, input: EvidenceListInput): EvidenceListReport {
  const task = listTaskCapsules(projectRoot).find((item) => item.id === input.taskId);
  if (!task) {
    return {
      schemaVersion: 'hadara.evidence.list.v1',
      command: 'evidence.list',
      ok: false,
      taskId: input.taskId,
      count: 0,
      records: [],
      issues: [
        {
          severity: 'error',
          code: 'TASK_NOT_FOUND',
          message: `Task Capsule not found: ${input.taskId}`
        }
      ]
    };
  }

  const parsed = parseEvidenceIndexFile(path.join(task.dir, 'evidence.jsonl'), input.taskId);
  const limit = normalizeLimit(input.limit);
  const includePrivate = input.includePrivate === true;
  const records = parsed.records.filter((record) => includePrivate || record.visibility !== 'private').slice(0, limit);

  return {
    schemaVersion: 'hadara.evidence.list.v1',
    command: 'evidence.list',
    ok: !parsed.issues.some((issue) => issue.severity === 'error'),
    taskId: input.taskId,
    count: records.length,
    records,
    issues: parsed.issues
  };
}

function parseEvidenceIndexFile(indexPath: string, taskId: string): {
  records: EvidenceIndexRecord[];
  issues: EvidenceListIssue[];
} {
  if (!fs.existsSync(indexPath)) {
    return {
      records: [],
      issues: [
        {
          severity: 'warning',
          code: 'EVIDENCE_INDEX_MISSING',
          message: 'evidence.jsonl is missing.'
        }
      ]
    };
  }

  const content = fs.readFileSync(indexPath, 'utf8').trim();
  if (!content) return { records: [], issues: [] };

  const records: EvidenceIndexRecord[] = [];
  const issues: EvidenceListIssue[] = [];
  content.split(/\r?\n/).forEach((line, index) => {
    try {
      const record = JSON.parse(line);
      if (isEvidenceIndexRecord(record)) {
        if (record.taskId !== taskId) {
          issues.push({
            severity: 'warning',
            code: 'EVIDENCE_RECORD_TASK_MISMATCH',
            message: `evidence.jsonl line ${index + 1} has taskId ${record.taskId}, expected ${taskId}.`
          });
          return;
        }
        records.push(normalizeEvidenceIndexRecord(record));
        return;
      }
      issues.push({
        severity: 'warning',
        code: 'EVIDENCE_RECORD_INVALID',
        message: `evidence.jsonl line ${index + 1} is not a supported evidence record.`
      });
    } catch {
      issues.push({
        severity: 'warning',
        code: 'EVIDENCE_INDEX_JSON_INVALID',
        message: `evidence.jsonl line ${index + 1} is not valid JSON.`
      });
    }
  });
  return { records, issues };
}

function isEvidenceIndexRecord(value: unknown): value is EvidenceIndexRecord {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Partial<EvidenceIndexRecord>;
  return (
    record.schemaVersion === 'hadara.evidence.v1' &&
    typeof record.time === 'string' &&
    typeof record.taskId === 'string' &&
    isEvidenceKind(record.kind) &&
    typeof record.summary === 'string' &&
    isEvidenceResult(record.result) &&
    isEvidenceVisibility(record.visibility) &&
    (record.evidencePath === undefined || typeof record.evidencePath === 'string')
  );
}

function normalizeEvidenceIndexRecord(record: EvidenceIndexRecord): EvidenceIndexRecord {
  const normalized: EvidenceIndexRecord = {
    schemaVersion: 'hadara.evidence.v1',
    time: record.time,
    taskId: record.taskId,
    kind: record.kind,
    summary: redactSecrets(record.summary),
    result: record.result,
    visibility: record.visibility
  };
  if (record.visibility === 'public' && record.evidencePath) {
    normalized.evidencePath = record.evidencePath;
  }
  return normalized;
}

function isEvidenceKind(value: unknown): value is EvidenceIndexRecord['kind'] {
  return value === 'test-log' || value === 'command-log' || value === 'diff-summary' || value === 'screenshot' || value === 'note';
}

function isEvidenceResult(value: unknown): value is EvidenceIndexRecord['result'] {
  return value === 'passed' || value === 'failed' || value === 'blocked' || value === 'unknown';
}

function isEvidenceVisibility(value: unknown): value is EvidenceIndexRecord['visibility'] {
  return value === 'public' || value === 'private';
}

function normalizeLimit(value: number | undefined): number {
  if (value === undefined) return DEFAULT_LIMIT;
  return Math.max(0, Math.floor(value));
}
