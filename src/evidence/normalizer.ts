import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { redactSecrets } from '../core/redaction';
import { EvidenceIndexRecord } from './evidence';

export type PersistedEvidenceSchemaVersion = 'hadara.evidence.v1';

export type EvidenceCategory =
  | 'validation'
  | 'implementation'
  | 'release'
  | 'security'
  | 'policy'
  | 'operation'
  | 'decision'
  | 'handoff'
  | 'audit'
  | 'note'
  | 'observation';

export type EvidenceOutcome = 'passed' | 'failed' | 'blocked' | 'unknown' | 'recorded' | 'not-applicable';

export type EvidenceArtifactType = 'test-log' | 'command-log' | 'diff-summary' | 'screenshot' | 'note' | 'unknown';

export type EvidenceVisibility = 'public' | 'private';

export interface EvidenceArtifactRef {
  path: string;
  visibility: EvidenceVisibility;
  artifactType: EvidenceArtifactType;
  exists?: boolean;
  schemaVersion?: string;
}

export interface EvidenceRecordIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
}

export interface NormalizedEvidenceRecord {
  schemaVersion: 'hadara.evidence.normalized.v1';
  persistedSchemaVersion: PersistedEvidenceSchemaVersion;
  id: string;
  idSource: 'persisted' | 'content-fingerprint' | 'line-fallback';
  idStability: 'durable' | 'stable-unless-edited' | 'unstable-on-reorder';
  sourceLine?: number;
  fingerprint: string;
  time: string;
  taskId: string;
  category: EvidenceCategory;
  artifactType: EvidenceArtifactType;
  outcome: EvidenceOutcome;
  visibility: EvidenceVisibility;
  summary: string;
  artifacts: EvidenceArtifactRef[];
  issues: EvidenceRecordIssue[];
  tags: string[];
  legacy: {
    kind?: string;
    result?: string;
    evidencePath?: string;
  };
}

export interface NormalizeEvidenceRecordContext {
  lineNumber?: number;
  taskDir?: string;
}

export interface EvidenceIndexRecordWithSourceLine {
  record: EvidenceIndexRecord;
  lineNumber: number;
}

export function normalizeEvidenceRecord(
  record: EvidenceIndexRecord,
  context: NormalizeEvidenceRecordContext = {}
): NormalizedEvidenceRecord {
  const summary = redactSecrets(record.summary);
  const artifactType = normalizeArtifactType(record.kind);
  const sourceLine = context.lineNumber;
  return {
    schemaVersion: 'hadara.evidence.normalized.v1',
    persistedSchemaVersion: record.schemaVersion,
    id: createLegacyEvidenceId(record, sourceLine ?? 1),
    idSource: 'line-fallback',
    idStability: 'unstable-on-reorder',
    ...(sourceLine ? { sourceLine } : {}),
    fingerprint: createLegacyEvidenceFingerprint(record),
    time: record.time,
    taskId: record.taskId,
    category: deriveEvidenceCategoryFromV1(record),
    artifactType,
    outcome: normalizeEvidenceOutcome(record.result),
    visibility: record.visibility,
    summary,
    artifacts: normalizeArtifactRefs(record, artifactType, context.taskDir),
    issues: [],
    tags: extractEvidenceTags(summary),
    legacy: {
      kind: record.kind,
      result: record.result,
      ...(record.evidencePath ? { evidencePath: record.evidencePath } : {})
    }
  };
}

export function normalizeEvidenceRecordsWithSourceLines(
  entries: EvidenceIndexRecordWithSourceLine[],
  context: { taskDir?: string } = {}
): NormalizedEvidenceRecord[] {
  return entries.map((entry) =>
    normalizeEvidenceRecord(entry.record, {
      taskDir: context.taskDir,
      lineNumber: entry.lineNumber
    })
  );
}

/**
 * Use only for tests, synthetic records, or records that do not come from JSONL.
 * This does not preserve actual source-line identity.
 */
export function normalizeEvidenceRecordsInMemoryOrder(records: EvidenceIndexRecord[], context: { taskDir?: string } = {}): NormalizedEvidenceRecord[] {
  return records.map((record, index) =>
    normalizeEvidenceRecord(record, {
      taskDir: context.taskDir,
      lineNumber: index + 1
    })
  );
}

/** @deprecated Use normalizeEvidenceRecordsWithSourceLines for JSONL records. */
export const normalizeEvidenceRecords = normalizeEvidenceRecordsInMemoryOrder;

export function deriveEvidenceCategoryFromV1(record: EvidenceIndexRecord): EvidenceCategory {
  if (record.kind === 'test-log') return 'validation';
  if (record.kind === 'diff-summary') return 'implementation';
  if (record.kind === 'screenshot') return 'observation';
  if (record.kind === 'note') return 'note';

  const summary = record.summary.toLowerCase();
  if (/\b(release|package|artifact|publish|install|clean-checkout)\b/.test(summary)) return 'release';
  if (/\b(npm run check|test|vitest|harness validate|doctor|smoke|dev:docker-sync-build|docker sync-build)\b/.test(summary)) {
    return 'validation';
  }
  return 'operation';
}

export function createLegacyEvidenceId(record: EvidenceIndexRecord, lineNumber: number): string {
  const hash = createLegacyEvidenceFingerprint(record).replace(/^sha256:/, '').slice(0, 12);
  return `legacy:${record.taskId}:${lineNumber}:${hash}`;
}

export function createLegacyEvidenceFingerprint(record: EvidenceIndexRecord): string {
  const hash = crypto
    .createHash('sha256')
    .update([record.time, record.taskId, record.kind, record.result, redactSecrets(record.summary)].join('\n'), 'utf8')
    .digest('hex');
  return `sha256:${hash}`;
}

function normalizeArtifactType(kind: EvidenceIndexRecord['kind']): EvidenceArtifactType {
  if (kind === 'test-log' || kind === 'command-log' || kind === 'diff-summary' || kind === 'screenshot' || kind === 'note') return kind;
  return 'unknown';
}

function normalizeEvidenceOutcome(result: EvidenceIndexRecord['result']): EvidenceOutcome {
  return result;
}

function normalizeArtifactRefs(
  record: EvidenceIndexRecord,
  artifactType: EvidenceArtifactType,
  taskDir: string | undefined
): EvidenceArtifactRef[] {
  if (record.visibility !== 'public' || !record.evidencePath) return [];
  const artifact: EvidenceArtifactRef = {
    path: record.evidencePath,
    visibility: 'public',
    artifactType
  };
  if (taskDir) {
    const absolutePath = path.resolve(taskDir, record.evidencePath);
    const taskRoot = path.resolve(taskDir);
    artifact.exists = absolutePath.startsWith(taskRoot + path.sep) && fs.existsSync(absolutePath);
  }
  return [artifact];
}

function extractEvidenceTags(summary: string): string[] {
  const tags = new Set<string>();
  const markerPattern = /\b(?:supersedes|resolves):[^\s,;|]+/g;
  for (const match of summary.matchAll(markerPattern)) tags.add(match[0]);
  return Array.from(tags);
}
