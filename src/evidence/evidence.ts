import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ensureDir } from '../core/fs';
import { createRedactionReport, hasBlockingRedactionFinding, redactSecrets, RedactionPattern, RedactionReport } from '../core/redaction';
import { resolveProjectFile } from '../core/workspace';
import { writePrivateEvidenceManifest } from './private-manifest';

export interface EvidenceRecord {
  time: string;
  taskId: string;
  kind: 'test-log' | 'command-log' | 'diff-summary' | 'screenshot' | 'note';
  path?: string;
  summary: string;
  result: 'passed' | 'failed' | 'blocked' | 'unknown';
  visibility?: 'public' | 'private';
}

export interface EvidenceIndexRecord {
  schemaVersion: 'hadara.evidence.v1';
  time: string;
  taskId: string;
  kind: EvidenceRecord['kind'];
  summary: string;
  result: EvidenceRecord['result'];
  visibility: NonNullable<EvidenceRecord['visibility']>;
  evidencePath?: string;
}

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

export interface EvidenceV2ArtifactRef {
  path: string;
  visibility: 'public';
  artifactType: EvidenceRecord['kind'];
}

export interface EvidenceV2IndexRecord {
  schemaVersion: 'hadara.evidence.v2';
  id: string;
  sourceLine?: number;
  fingerprint: string;
  idSource: 'persisted';
  idStability: 'durable';
  time: string;
  taskId: string;
  category: EvidenceCategory;
  outcome: EvidenceOutcome;
  visibility: NonNullable<EvidenceRecord['visibility']>;
  summary: string;
  artifacts: EvidenceV2ArtifactRef[];
  tags: string[];
  legacy: {
    kind: EvidenceRecord['kind'];
    result: EvidenceRecord['result'];
    evidencePath?: string;
  };
}

export type PersistedEvidenceRecord = EvidenceIndexRecord | EvidenceV2IndexRecord;

export function persistedEvidenceKind(record: PersistedEvidenceRecord): EvidenceRecord['kind'] {
  return record.schemaVersion === 'hadara.evidence.v2' ? record.legacy.kind : record.kind;
}

export function persistedEvidenceResult(record: PersistedEvidenceRecord): EvidenceRecord['result'] {
  return record.schemaVersion === 'hadara.evidence.v2' ? record.legacy.result : record.result;
}

export function persistedEvidencePath(record: PersistedEvidenceRecord): string | undefined {
  return record.schemaVersion === 'hadara.evidence.v2' ? record.legacy.evidencePath : record.evidencePath;
}

export interface EvidenceAppendResult {
  markdownPath: string;
  evidence: PersistedEvidenceRecord;
}

export type EvidenceArtifactPolicyErrorCode = 'PUBLIC_ARTIFACT_BINARY_REJECTED' | 'PUBLIC_ARTIFACT_SECRET_DETECTED';

export interface PublicEvidenceArtifactPolicyReport {
  schemaVersion: 'hadara.evidence_artifact_policy.v1';
  command: 'evidence.artifactPolicy';
  ok: boolean;
  blocking: boolean;
  redaction: RedactionReport;
  issues: Array<{
    severity: 'error';
    code: EvidenceArtifactPolicyErrorCode;
    message: string;
  }>;
}

export interface PublicEvidenceArtifactPolicyOptions {
  redactionPatterns?: RedactionPattern[];
}

export class EvidenceArtifactPolicyError extends Error {
  constructor(
    public readonly code: EvidenceArtifactPolicyErrorCode,
    message: string,
    public readonly redactionReport?: RedactionReport
  ) {
    super(message);
    this.name = 'EvidenceArtifactPolicyError';
  }
}

export function appendEvidence(projectRoot: string, record: Omit<EvidenceRecord, 'time'>): string {
  const taskDir = findTaskDir(projectRoot, record.taskId);
  if (!taskDir) {
    throw new Error(`Task capsule not found: ${record.taskId}`);
  }

  const time = new Date().toISOString();
  const visibility = record.visibility ?? 'public';
  const attachedPath = copyPublicEvidenceArtifact({ projectRoot, taskDir, kind: record.kind, sourcePath: record.path, time, visibility });
  return appendEvidenceRecord({ projectRoot, taskDir, time, record, visibility, attachedPath }).markdownPath;
}

export function appendEvidenceTextArtifact(
  projectRoot: string,
  record: Omit<EvidenceRecord, 'time' | 'path'>,
  artifact: { fileName: string; content: string },
  options: PublicEvidenceArtifactPolicyOptions = {}
): EvidenceAppendResult {
  const taskDir = findTaskDir(projectRoot, record.taskId);
  if (!taskDir) {
    throw new Error(`Task capsule not found: ${record.taskId}`);
  }

  const time = new Date().toISOString();
  const visibility = record.visibility ?? 'public';
  const attachedPath =
    visibility === 'public'
      ? writePublicEvidenceTextArtifact({
          taskDir,
          kind: record.kind,
          time,
          fileName: artifact.fileName,
          content: artifact.content,
          policyOptions: options
        })
      : undefined;
  return appendEvidenceRecord({ projectRoot, taskDir, time, record, visibility, attachedPath });
}

export function createPublicEvidenceArtifactPolicyReport(
  content: string,
  options: PublicEvidenceArtifactPolicyOptions = {}
): PublicEvidenceArtifactPolicyReport {
  const redaction = createRedactionReport(content, { patterns: options.redactionPatterns });
  const blocking = hasBlockingRedactionFinding(redaction, 'high');
  return {
    schemaVersion: 'hadara.evidence_artifact_policy.v1',
    command: 'evidence.artifactPolicy',
    ok: !blocking,
    blocking,
    redaction,
    issues: blocking
      ? [
          {
            severity: 'error',
            code: 'PUBLIC_ARTIFACT_SECRET_DETECTED',
            message: 'Public evidence artifact contains secret-like content; collect it as private evidence or redact the source file first.'
          }
        ]
      : []
  };
}

function appendEvidenceIndex(taskDir: string, record: PersistedEvidenceRecord): void {
  fs.appendFileSync(path.join(taskDir, 'evidence.jsonl'), `${JSON.stringify(record)}\n`, 'utf8');
}

function appendEvidenceRecord(input: {
  projectRoot: string;
  taskDir: string;
  time: string;
  record: Omit<EvidenceRecord, 'time'>;
  visibility: NonNullable<EvidenceRecord['visibility']>;
  attachedPath?: string;
}): EvidenceAppendResult {
  const summary = redactSecrets(input.record.summary.replace(/\|/g, '/'));
  const markdownPath = path.join(input.taskDir, 'EVIDENCE.md');
  const rowSummary = input.visibility === 'private' || !input.attachedPath ? summary : `${summary} (${input.attachedPath})`;
  const jsonlMarker = input.visibility === 'public' && input.attachedPath ? input.attachedPath : 'evidence.jsonl';
  const row = `| ${input.time} | ${input.record.kind} | ${rowSummary} | ${input.record.result} | ${input.visibility} | ${jsonlMarker} |\n`;

  if (!fs.existsSync(markdownPath)) {
    fs.writeFileSync(markdownPath, '# Evidence\n\n| Time | Kind | Summary | Result | Visibility | JSONL |\n|---|---|---|---|---|---|\n', 'utf8');
  }
  fs.appendFileSync(markdownPath, row, 'utf8');

  const evidence = createEvidenceV2Record({
    time: input.time,
    taskId: input.record.taskId,
    kind: input.record.kind,
    summary,
    result: input.record.result,
    visibility: input.visibility,
    attachedPath: input.attachedPath
  });
  appendEvidenceIndex(input.taskDir, evidence);
  if (input.visibility === 'private') {
    writePrivateEvidenceManifest({
      projectRoot: input.projectRoot,
      taskId: input.record.taskId,
      kind: input.record.kind,
      summary,
      result: input.record.result,
      sourcePath: input.record.path,
      time: input.time
    });
  }

  return { markdownPath, evidence };
}

function createEvidenceV2Record(input: {
  time: string;
  taskId: string;
  kind: EvidenceRecord['kind'];
  summary: string;
  result: EvidenceRecord['result'];
  visibility: NonNullable<EvidenceRecord['visibility']>;
  attachedPath?: string;
}): EvidenceV2IndexRecord {
  const legacy = {
    kind: input.kind,
    result: input.result,
    ...(input.visibility === 'public' && input.attachedPath ? { evidencePath: input.attachedPath } : {})
  };
  const recordWithoutIdentity = {
    schemaVersion: 'hadara.evidence.v2' as const,
    time: input.time,
    taskId: input.taskId,
    category: deriveEvidenceCategory(input.kind, input.summary),
    outcome: normalizeEvidenceOutcome(input.result),
    visibility: input.visibility,
    summary: input.summary,
    artifacts:
      input.visibility === 'public' && input.attachedPath
        ? [
            {
              path: input.attachedPath,
              visibility: 'public' as const,
              artifactType: input.kind
            }
          ]
        : [],
    tags: extractEvidenceTags(input.summary),
    legacy
  };
  const fingerprint = createEvidenceV2Fingerprint(recordWithoutIdentity);
  return {
    ...recordWithoutIdentity,
    id: createEvidenceV2Id(input.taskId),
    fingerprint,
    idSource: 'persisted',
    idStability: 'durable'
  };
}

function createEvidenceV2Id(taskId: string): string {
  const random = crypto.randomUUID().replace(/-/g, '').slice(0, 24);
  return `ev:${taskId}:${random}`;
}

function createEvidenceV2Fingerprint(record: Omit<EvidenceV2IndexRecord, 'id' | 'fingerprint' | 'idSource' | 'idStability'>): string {
  const hash = crypto
    .createHash('sha256')
    .update(
      JSON.stringify({
        time: record.time,
        taskId: record.taskId,
        category: record.category,
        outcome: record.outcome,
        visibility: record.visibility,
        summary: redactSecrets(record.summary),
        artifacts: record.artifacts,
        tags: record.tags,
        legacy: record.legacy
      }),
      'utf8'
    )
    .digest('hex');
  return `sha256:${hash}`;
}

function deriveEvidenceCategory(kind: EvidenceRecord['kind'], summary: string): EvidenceCategory {
  if (kind === 'test-log') return 'validation';
  if (kind === 'diff-summary') return 'implementation';
  if (kind === 'screenshot') return 'observation';
  if (kind === 'note') return 'note';

  const lowered = summary.toLowerCase();
  if (/\b(release|package|artifact|publish|install|clean-checkout)\b/.test(lowered)) return 'release';
  if (/\b(npm run check|test|vitest|harness validate|doctor|smoke|dev:docker-sync-build|docker sync-build)\b/.test(lowered)) {
    return 'validation';
  }
  if (/\b(policy|preflight|permission)\b/.test(lowered)) return 'policy';
  if (/\b(handoff|agent_handoff)\b/.test(lowered)) return 'handoff';
  if (/\b(close validation|audit-close|audit)\b/.test(lowered)) return 'audit';
  return 'operation';
}

function normalizeEvidenceOutcome(result: EvidenceRecord['result']): EvidenceOutcome {
  return result;
}

function extractEvidenceTags(summary: string): string[] {
  const tags = new Set<string>();
  const markerPattern = /\b(?:supersedes|resolves):[^\s,;|]+/g;
  for (const match of summary.matchAll(markerPattern)) tags.add(match[0]);
  return Array.from(tags);
}

function copyPublicEvidenceArtifact(input: {
  projectRoot: string;
  taskDir: string;
  kind: EvidenceRecord['kind'];
  sourcePath?: string;
  time: string;
  visibility: NonNullable<EvidenceRecord['visibility']>;
}): string | undefined {
  if (!input.sourcePath || input.visibility === 'private') return undefined;

  const sourceFile = resolveProjectFile(input.projectRoot, input.sourcePath);
  const artifactText = readPublicTextArtifact(sourceFile.absolutePath);
  const policy = createPublicEvidenceArtifactPolicyReport(artifactText);
  if (policy.blocking) {
    throw new EvidenceArtifactPolicyError(
      'PUBLIC_ARTIFACT_SECRET_DETECTED',
      'Public evidence artifact contains secret-like content; collect it as private evidence or redact the source file first.',
      policy.redaction
    );
  }

  const artifactsDir = path.join(input.taskDir, 'artifacts', input.kind);
  ensureDir(artifactsDir);
  const targetPath = path.join(artifactsDir, `${safeFilePart(input.time)}-${safeFilePart(path.basename(sourceFile.absolutePath))}`);
  fs.writeFileSync(targetPath, artifactText, 'utf8');
  return toPortablePath(path.relative(input.taskDir, targetPath));
}

function writePublicEvidenceTextArtifact(input: {
  taskDir: string;
  kind: EvidenceRecord['kind'];
  time: string;
  fileName: string;
  content: string;
  policyOptions?: PublicEvidenceArtifactPolicyOptions;
}): string {
  const policy = createPublicEvidenceArtifactPolicyReport(input.content, input.policyOptions);
  if (policy.blocking) {
    throw new EvidenceArtifactPolicyError(
      'PUBLIC_ARTIFACT_SECRET_DETECTED',
      'Public evidence artifact contains secret-like content; collect it as private evidence or redact the source file first.',
      policy.redaction
    );
  }

  const artifactsDir = path.join(input.taskDir, 'artifacts', input.kind);
  ensureDir(artifactsDir);
  const targetPath = path.join(artifactsDir, `${safeFilePart(input.time)}-${safeFilePart(input.fileName)}`);
  fs.writeFileSync(targetPath, input.content, 'utf8');
  return toPortablePath(path.relative(input.taskDir, targetPath));
}

function readPublicTextArtifact(filePath: string): string {
  const content = fs.readFileSync(filePath);
  if (!isTextBuffer(content)) {
    throw new EvidenceArtifactPolicyError(
      'PUBLIC_ARTIFACT_BINARY_REJECTED',
      'Public evidence artifacts must be UTF-8 text; collect binary evidence as private evidence until binary policy is implemented.'
    );
  }
  return content.toString('utf8');
}

function isTextBuffer(content: Buffer): boolean {
  if (content.includes(0)) return false;
  return !content.toString('utf8').includes('\uFFFD');
}

function findTaskDir(projectRoot: string, taskId: string): string | null {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return null;
  const entry = fs.readdirSync(tasksDir).find((name) => name.startsWith(`${taskId}-`));
  return entry ? path.join(tasksDir, entry) : null;
}

export function createSessionEvidenceDirs(dataRoot: string, sessionId: string): string {
  const evidenceDir = path.join(dataRoot, 'sessions', sessionId, 'evidence');
  for (const child of ['command-logs', 'test-results', 'diff-summary', 'screenshots', 'release-smoke']) {
    ensureDir(path.join(evidenceDir, child));
  }
  return evidenceDir;
}

function safeFilePart(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'artifact';
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
