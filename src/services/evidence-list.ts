import fs from 'node:fs';
import path from 'node:path';
import { redactSecrets } from '../core/redaction';
import { EvidenceIndexRecord, EvidenceV2IndexRecord, PersistedEvidenceRecord } from '../evidence/evidence';
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
  records: PersistedEvidenceRecord[];
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

export function parseEvidenceIndexFile(indexPath: string, taskId: string): {
  records: PersistedEvidenceRecord[];
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

  const records: PersistedEvidenceRecord[] = [];
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

function isEvidenceIndexRecord(value: unknown): value is PersistedEvidenceRecord {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Partial<PersistedEvidenceRecord>;
  if (isEvidenceV2IndexRecord(value)) return true;
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

function isEvidenceV2IndexRecord(value: unknown): value is EvidenceV2IndexRecord {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Partial<EvidenceV2IndexRecord>;
  return (
    record.schemaVersion === 'hadara.evidence.v2' &&
    typeof record.id === 'string' &&
    typeof record.fingerprint === 'string' &&
    record.idSource === 'persisted' &&
    record.idStability === 'durable' &&
    typeof record.time === 'string' &&
    typeof record.taskId === 'string' &&
    isEvidenceCategory(record.category) &&
    isEvidenceOutcome(record.outcome) &&
    isEvidenceVisibility(record.visibility) &&
    typeof record.summary === 'string' &&
    Array.isArray(record.artifacts) &&
    record.artifacts.every(isEvidenceV2ArtifactRef) &&
    Array.isArray(record.tags) &&
    record.tags.every((tag) => typeof tag === 'string') &&
    typeof record.legacy === 'object' &&
    record.legacy !== null &&
    isEvidenceKind(record.legacy.kind) &&
    isEvidenceResult(record.legacy.result) &&
    (record.legacy.evidencePath === undefined || typeof record.legacy.evidencePath === 'string')
  );
}

function normalizeEvidenceIndexRecord(record: PersistedEvidenceRecord): PersistedEvidenceRecord {
  if (record.schemaVersion === 'hadara.evidence.v2') return normalizeEvidenceV2IndexRecord(record);
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

function normalizeEvidenceV2IndexRecord(record: EvidenceV2IndexRecord): EvidenceV2IndexRecord {
  return {
    schemaVersion: 'hadara.evidence.v2',
    id: record.id,
    ...(record.sourceLine ? { sourceLine: record.sourceLine } : {}),
    fingerprint: record.fingerprint,
    idSource: 'persisted',
    idStability: 'durable',
    time: record.time,
    taskId: record.taskId,
    category: record.category,
    outcome: record.outcome,
    visibility: record.visibility,
    summary: redactSecrets(record.summary),
    artifacts: record.visibility === 'public' ? record.artifacts.map((artifact) => ({ ...artifact })) : [],
    tags: record.tags.map(String),
    legacy: {
      kind: record.legacy.kind,
      result: record.legacy.result,
      ...(record.visibility === 'public' && record.legacy.evidencePath ? { evidencePath: record.legacy.evidencePath } : {})
    }
  };
}

function isEvidenceKind(value: unknown): value is EvidenceIndexRecord['kind'] {
  return value === 'test-log' || value === 'command-log' || value === 'diff-summary' || value === 'screenshot' || value === 'note';
}

function isEvidenceResult(value: unknown): value is EvidenceIndexRecord['result'] {
  return value === 'passed' || value === 'failed' || value === 'blocked' || value === 'unknown';
}

function isEvidenceOutcome(value: unknown): boolean {
  return value === 'passed' || value === 'failed' || value === 'blocked' || value === 'unknown' || value === 'recorded' || value === 'not-applicable';
}

function isEvidenceCategory(value: unknown): boolean {
  return (
    value === 'validation' ||
    value === 'implementation' ||
    value === 'release' ||
    value === 'security' ||
    value === 'policy' ||
    value === 'operation' ||
    value === 'decision' ||
    value === 'handoff' ||
    value === 'audit' ||
    value === 'note' ||
    value === 'observation'
  );
}

function isEvidenceVisibility(value: unknown): value is EvidenceIndexRecord['visibility'] {
  return value === 'public' || value === 'private';
}

function isEvidenceV2ArtifactRef(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const artifact = value as Partial<EvidenceV2IndexRecord['artifacts'][number]>;
  return typeof artifact.path === 'string' && artifact.visibility === 'public' && isEvidenceKind(artifact.artifactType);
}

function normalizeLimit(value: number | undefined): number {
  if (value === undefined) return DEFAULT_LIMIT;
  return Math.max(0, Math.floor(value));
}
