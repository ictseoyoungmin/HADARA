import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { redactSecrets } from '../core/redaction';
import { EvidenceIndexRecord, EvidenceV2IndexRecord } from '../evidence/evidence';
import { createLegacyEvidenceFingerprint, deriveEvidenceCategoryFromV1 } from '../evidence/normalizer';
import { listTaskCapsules } from '../task/task-capsule';

export interface EvidenceMigrationIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
  line?: number;
}

export interface EvidenceMigrationTransform {
  line: number;
  action: 'convert-v1-to-v2';
  fromSchemaVersion: 'hadara.evidence.v1';
  toSchemaVersion: 'hadara.evidence.v2';
  plannedId: string;
  plannedFingerprint: string;
  plannedRecord: EvidenceV2IndexRecord;
}

export interface EvidenceMigrationSkippedRecord {
  line: number;
  reason: 'already-v2' | 'invalid-json' | 'unsupported-schema' | 'invalid-v1' | 'task-mismatch';
  message: string;
}

export interface EvidenceMigrationPreviewReport {
  schemaVersion: 'hadara.evidence.migration_preview.v1';
  command: 'evidence.migrate';
  ok: boolean;
  mode: 'dry-run' | 'execute';
  executeSupported: boolean;
  taskId: string;
  projectRoot: string;
  targetVersion: 'hadara.evidence.v2';
  evidencePath?: string;
  beforeHash?: string;
  afterHash?: string;
  execution: {
    requested: boolean;
    writePlanned: boolean;
    applied: boolean;
    beforeHashExpected?: string;
    beforeHashActual?: string;
    afterHash?: string;
    rewrittenRecords: number;
    preservedRecords: number;
  };
  summary: {
    totalLines: number;
    v1Records: number;
    v2Records: number;
    plannedTransforms: number;
    skippedRecords: number;
  };
  transforms: EvidenceMigrationTransform[];
  skipped: EvidenceMigrationSkippedRecord[];
  issues: EvidenceMigrationIssue[];
}

export function createEvidenceMigrationPreviewReport(input: {
  projectRoot: string;
  taskId: string;
  toVersion?: string;
  execute?: boolean;
  beforeHash?: string;
}): EvidenceMigrationPreviewReport {
  const mode = input.execute ? 'execute' : 'dry-run';
  const unsupportedTarget = input.toVersion && input.toVersion !== 'v2' && input.toVersion !== 'hadara.evidence.v2';
  const task = listTaskCapsules(input.projectRoot).find((candidate) => candidate.id === input.taskId);
  const baseReport: EvidenceMigrationPreviewReport = {
    schemaVersion: 'hadara.evidence.migration_preview.v1',
    command: 'evidence.migrate',
    ok: false,
    mode,
    executeSupported: true,
    taskId: input.taskId,
    projectRoot: input.projectRoot,
    targetVersion: 'hadara.evidence.v2',
    execution: {
      requested: mode === 'execute',
      writePlanned: false,
      applied: false,
      rewrittenRecords: 0,
      preservedRecords: 0
    },
    summary: { totalLines: 0, v1Records: 0, v2Records: 0, plannedTransforms: 0, skippedRecords: 0 },
    transforms: [],
    skipped: [],
    issues: []
  };
  if (input.beforeHash) baseReport.execution.beforeHashExpected = input.beforeHash;

  if (unsupportedTarget) {
    baseReport.issues.push({
      severity: 'error',
      code: 'EVIDENCE_MIGRATION_TARGET_UNSUPPORTED',
      message: `Unsupported evidence migration target: ${input.toVersion}.`
    });
    return baseReport;
  }

  if (!task) {
    baseReport.issues.push({
      severity: 'error',
      code: 'TASK_NOT_FOUND',
      message: `Task Capsule not found: ${input.taskId}`
    });
    return baseReport;
  }

  const evidencePath = path.join(task.dir, 'evidence.jsonl');
  baseReport.evidencePath = toPortablePath(path.relative(input.projectRoot, evidencePath));
  if (!fs.existsSync(evidencePath)) {
    baseReport.issues.push({
      severity: 'warning',
      code: 'EVIDENCE_INDEX_MISSING',
      message: 'evidence.jsonl is missing.'
    });
    if (input.execute) {
      baseReport.issues.push({
        severity: 'error',
        code: 'EVIDENCE_MIGRATION_EVIDENCE_INDEX_MISSING',
        message: 'Execute mode requires an existing evidence.jsonl file.'
      });
    }
    baseReport.ok = baseReport.issues.every((issue) => issue.severity !== 'error');
    return baseReport;
  }

  const content = fs.readFileSync(evidencePath, 'utf8');
  baseReport.beforeHash = `sha256:${sha256(content)}`;
  baseReport.execution.beforeHashActual = baseReport.beforeHash;
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== '');
  baseReport.summary.totalLines = lines.length;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    try {
      const parsed: unknown = JSON.parse(line);
      if (!isRecord(parsed)) {
        skip(baseReport, lineNumber, 'unsupported-schema', 'Evidence record is not an object.');
        return;
      }
      if (parsed.schemaVersion === 'hadara.evidence.v2') {
        baseReport.summary.v2Records += 1;
        skip(baseReport, lineNumber, 'already-v2', 'Record is already hadara.evidence.v2.');
        return;
      }
      if (parsed.schemaVersion !== 'hadara.evidence.v1') {
        skip(baseReport, lineNumber, 'unsupported-schema', `Unsupported evidence schemaVersion: ${String(parsed.schemaVersion ?? 'missing')}.`);
        return;
      }
      const v1 = parseV1Record(parsed);
      if (!v1) {
        skip(baseReport, lineNumber, 'invalid-v1', 'Record is missing required v1 evidence fields.');
        return;
      }
      if (v1.taskId !== input.taskId) {
        skip(baseReport, lineNumber, 'task-mismatch', `Record taskId ${v1.taskId} does not match ${input.taskId}.`);
        return;
      }
      baseReport.summary.v1Records += 1;
      const plannedRecord = createPlannedV2Record(v1, lineNumber);
      baseReport.transforms.push({
        line: lineNumber,
        action: 'convert-v1-to-v2',
        fromSchemaVersion: 'hadara.evidence.v1',
        toSchemaVersion: 'hadara.evidence.v2',
        plannedId: plannedRecord.id,
        plannedFingerprint: plannedRecord.fingerprint,
        plannedRecord
      });
    } catch {
      skip(baseReport, lineNumber, 'invalid-json', 'Line is not valid JSON.');
    }
  });

  baseReport.summary.plannedTransforms = baseReport.transforms.length;
  baseReport.summary.skippedRecords = baseReport.skipped.length;

  if (input.execute) {
    executeMigration({ report: baseReport, evidencePath, lines, expectedBeforeHash: input.beforeHash });
  }

  baseReport.ok = baseReport.issues.every((issue) => issue.severity !== 'error');
  return baseReport;
}

function executeMigration(input: { report: EvidenceMigrationPreviewReport; evidencePath: string; lines: string[]; expectedBeforeHash?: string }): void {
  const { report, evidencePath, lines, expectedBeforeHash } = input;
  if (!expectedBeforeHash) {
    report.issues.push({
      severity: 'error',
      code: 'EVIDENCE_MIGRATION_BEFORE_HASH_REQUIRED',
      message: 'Execute mode requires --before-hash from a current dry-run preview.'
    });
    return;
  }
  if (expectedBeforeHash !== report.beforeHash) {
    report.issues.push({
      severity: 'error',
      code: 'EVIDENCE_MIGRATION_BEFORE_HASH_MISMATCH',
      message: `Current evidence hash ${report.beforeHash ?? 'missing'} does not match expected ${expectedBeforeHash}.`
    });
    return;
  }
  const blockingSkipped = report.skipped.filter((record) => record.reason !== 'already-v2');
  if (blockingSkipped.length > 0) {
    report.issues.push({
      severity: 'error',
      code: 'EVIDENCE_MIGRATION_SKIPPED_RECORDS_BLOCK_EXECUTE',
      message: `Execute mode refused because ${blockingSkipped.length} skipped record(s) require manual review.`
    });
    return;
  }

  const transformByLine = new Map(report.transforms.map((transform) => [transform.line, transform]));
  const rewrittenLines = lines.map((line, index) => {
    const transform = transformByLine.get(index + 1);
    return transform ? JSON.stringify(transform.plannedRecord) : line;
  });
  const nextContent = rewrittenLines.length > 0 ? `${rewrittenLines.join('\n')}\n` : '';
  const afterHash = `sha256:${sha256(nextContent)}`;
  report.afterHash = afterHash;
  report.execution.afterHash = afterHash;
  report.execution.writePlanned = report.transforms.length > 0;
  report.execution.rewrittenRecords = report.transforms.length;
  report.execution.preservedRecords = lines.length - report.transforms.length;
  if (nextContent === fs.readFileSync(evidencePath, 'utf8')) {
    report.execution.applied = false;
    return;
  }

  const tempPath = `${evidencePath}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tempPath, nextContent, 'utf8');
  fs.renameSync(tempPath, evidencePath);
  report.execution.applied = true;
}

function parseV1Record(value: Record<string, unknown>): EvidenceIndexRecord | null {
  if (typeof value.time !== 'string' || typeof value.taskId !== 'string' || typeof value.kind !== 'string') return null;
  if (typeof value.summary !== 'string' || typeof value.result !== 'string' || typeof value.visibility !== 'string') return null;
  if (!isEvidenceKind(value.kind) || !isEvidenceResult(value.result) || !isEvidenceVisibility(value.visibility)) return null;
  return {
    schemaVersion: 'hadara.evidence.v1',
    time: value.time,
    taskId: value.taskId,
    kind: value.kind,
    summary: value.summary,
    result: value.result,
    visibility: value.visibility,
    ...(typeof value.evidencePath === 'string' && value.evidencePath.trim() !== '' ? { evidencePath: value.evidencePath } : {})
  };
}

function createPlannedV2Record(record: EvidenceIndexRecord, lineNumber: number): EvidenceV2IndexRecord {
  const summary = redactSecrets(record.summary);
  const legacyFingerprint = createLegacyEvidenceFingerprint({ ...record, summary });
  const legacy = {
    kind: record.kind,
    result: record.result,
    ...(record.evidencePath ? { evidencePath: record.evidencePath } : {})
  };
  const plannedBase = {
    time: record.time,
    taskId: record.taskId,
    category: deriveEvidenceCategoryFromV1(record),
    outcome: normalizeOutcome(record.result),
    visibility: record.visibility,
    summary,
    artifacts:
      record.visibility === 'public' && record.evidencePath
        ? [
            {
              path: record.evidencePath,
              visibility: 'public' as const,
              artifactType: record.kind
            }
          ]
        : [],
    tags: extractEvidenceTags(summary),
    legacy
  };
  const fingerprint = `sha256:${sha256(JSON.stringify(plannedBase))}`;
  return {
    schemaVersion: 'hadara.evidence.v2',
    id: createPlannedId(record.taskId, lineNumber, legacyFingerprint),
    sourceLine: lineNumber,
    fingerprint,
    idSource: 'persisted',
    idStability: 'durable',
    ...plannedBase
  };
}

function skip(report: EvidenceMigrationPreviewReport, line: number, reason: EvidenceMigrationSkippedRecord['reason'], message: string): void {
  report.skipped.push({ line, reason, message });
  if (reason === 'already-v2') return;
  report.issues.push({
    severity: 'warning',
    code: `EVIDENCE_MIGRATION_SKIPPED_${reason.toUpperCase().replace(/-/g, '_')}`,
    message,
    line
  });
}

function createPlannedId(taskId: string, lineNumber: number, fingerprint: string): string {
  return `ev:${taskId}:${sha256(`${taskId}\n${lineNumber}\n${fingerprint}`).slice(0, 24)}`;
}

function normalizeOutcome(result: EvidenceIndexRecord['result']): EvidenceV2IndexRecord['outcome'] {
  return result;
}

function extractEvidenceTags(summary: string): string[] {
  const tags = new Set<string>();
  const markerPattern = /\b(?:supersedes|resolves):[^\s,;|]+/g;
  for (const match of summary.matchAll(markerPattern)) tags.add(match[0]);
  return Array.from(tags);
}

function isEvidenceKind(value: string): value is EvidenceIndexRecord['kind'] {
  return value === 'test-log' || value === 'command-log' || value === 'diff-summary' || value === 'screenshot' || value === 'note';
}

function isEvidenceResult(value: string): value is EvidenceIndexRecord['result'] {
  return value === 'passed' || value === 'failed' || value === 'blocked' || value === 'unknown';
}

function isEvidenceVisibility(value: string): value is EvidenceIndexRecord['visibility'] {
  return value === 'public' || value === 'private';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sha256(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
