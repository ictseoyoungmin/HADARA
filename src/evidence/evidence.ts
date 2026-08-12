import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ensureDir } from '../core/fs';
import { createRedactionReport, hasBlockingRedactionFinding, redactSecrets, RedactionPattern, RedactionReport } from '../core/redaction';
import { startMonotonicTimer } from '../core/timing';
import { resolveProjectFile } from '../core/workspace';
import type { HadaraActorContext } from '../core/actor-context';
import type { ResolvedEvidenceReference } from './reference-resolver';
import { writePrivateEvidenceManifest } from './private-manifest';
import { normalizeEvidenceRecordsInMemoryOrder } from './normalizer';
import { resolveNegativeEvidence } from './semantics';

export interface EvidenceRecord {
  time: string;
  taskId: string;
  kind: 'test-log' | 'command-log' | 'diff-summary' | 'screenshot' | 'note';
  path?: string;
  summary: string;
  result: 'passed' | 'failed' | 'blocked' | 'unknown';
  visibility?: 'public' | 'private';
  category?: EvidenceCategory;
  outcome?: EvidenceOutcome;
  tags?: string[];
  idempotencyKey?: string;
  actor?: HadaraActorContext;
  closeEvidenceSnapshot?: CloseEvidenceSnapshot;
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
  /** Present on artifacts created by the byte-binding writer; omitted on legacy refs. */
  sha256?: string;
  /** Present on artifacts created by the byte-binding writer; omitted on legacy refs. */
  byteLength?: number;
}

export interface EvidenceArtifactBinding {
  path: string;
  visibility: 'public';
  artifactType: EvidenceRecord['kind'];
  sha256: string;
  byteLength: number;
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
  idempotencyKey?: string;
  actor?: HadaraActorContext;
  closeEvidenceSnapshot?: CloseEvidenceSnapshot;
  legacy: {
    kind: EvidenceRecord['kind'];
    result: EvidenceRecord['result'];
    evidencePath?: string;
  };
}

export interface CloseEvidenceSnapshot {
  requiredAcceptanceIds: string[];
  evidenceRefsUsedForReadiness: string[];
  evidenceReferenceSources?: Array<Omit<ResolvedEvidenceReference, 'resolved' | 'syntaxValid' | 'evidenceTaskId' | 'evidenceSourceLine'>>;
  unresolvedEvidenceRefs?: ResolvedEvidenceReference[];
  latestFailedOrBlockedEvidenceRefs: string[];
  unresolvedEvidenceClassifications: Array<{
    evidenceRef: string;
    outcome: Extract<EvidenceOutcome, 'failed' | 'blocked'>;
    summary: string;
  }>;
  evidenceSummaryHash: string;
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
  markdownAppended: boolean;
  jsonlAppended: boolean;
  existing: boolean;
  appendLock: EvidenceAppendLockDiagnostics;
}

export interface EvidenceAppendLockDiagnostics {
  path: string;
  waitedMs: number;
  contended: boolean;
  timeoutMs: number;
}

export interface EvidenceProjectionReport {
  schemaVersion: 'hadara.evidence.projection.v1';
  command: 'evidence.project';
  ok: boolean;
  taskId: string;
  mode: 'dry-run' | 'execute';
  source: string;
  target: string;
  wouldChange: boolean;
  generatedSlots: string[];
  beforeHash?: string;
  afterHash: string;
  issues: Array<{
    severity: 'error';
    code: string;
    message: string;
  }>;
}

export type EvidenceArtifactPolicyErrorCode = 'PUBLIC_ARTIFACT_BINARY_REJECTED' | 'PUBLIC_ARTIFACT_SECRET_DETECTED';
export type EvidenceAppendErrorCode =
  | 'EVIDENCE_APPEND_LOCK_TIMEOUT'
  | 'EVIDENCE_RESULT_OUTCOME_MISMATCH'
  | 'EVIDENCE_IDEMPOTENCY_ARTIFACT_CONFLICT'
  | 'TASK_NOT_FOUND'
  | 'TASK_CAPSULE_AMBIGUOUS';

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

export class EvidenceIdempotencyArtifactConflictError extends Error {
  public readonly code: EvidenceAppendErrorCode = 'EVIDENCE_IDEMPOTENCY_ARTIFACT_CONFLICT';

  constructor(message: string) {
    super(message);
    this.name = 'EvidenceIdempotencyArtifactConflictError';
  }
}

export class EvidenceAppendLockError extends Error {
  public readonly code: EvidenceAppendErrorCode = 'EVIDENCE_APPEND_LOCK_TIMEOUT';

  constructor(message: string) {
    super(message);
    this.name = 'EvidenceAppendLockError';
  }
}

export interface EvidenceResultOutcomeCompatibilityIssue {
  severity: 'error';
  code: 'EVIDENCE_RESULT_OUTCOME_MISMATCH';
  message: string;
}

export class EvidenceResultOutcomeMismatchError extends Error {
  public readonly code: EvidenceAppendErrorCode = 'EVIDENCE_RESULT_OUTCOME_MISMATCH';

  constructor(public readonly issue: EvidenceResultOutcomeCompatibilityIssue) {
    super(issue.message);
    this.name = 'EvidenceResultOutcomeMismatchError';
  }
}

export class EvidenceTaskDirectoryError extends Error {
  constructor(
    public readonly code: Extract<EvidenceAppendErrorCode, 'TASK_NOT_FOUND' | 'TASK_CAPSULE_AMBIGUOUS'>,
    message: string
  ) {
    super(message);
    this.name = 'EvidenceTaskDirectoryError';
  }
}

export function validateEvidenceResultOutcomeCompatibility(input: {
  result: EvidenceRecord['result'];
  outcome: EvidenceOutcome | undefined;
}): EvidenceResultOutcomeCompatibilityIssue | undefined {
  if (!input.outcome) return undefined;
  if (input.outcome === 'passed' || input.outcome === 'failed' || input.outcome === 'blocked' || input.outcome === 'unknown') {
    if (input.result === input.outcome) return undefined;
    return {
      severity: 'error',
      code: 'EVIDENCE_RESULT_OUTCOME_MISMATCH',
      message: `Evidence result ${input.result} conflicts with outcome ${input.outcome}; matching evidence outcomes must use the same legacy result.`
    };
  }
  if ((input.outcome === 'recorded' || input.outcome === 'not-applicable') && input.result !== 'unknown') {
    return {
      severity: 'error',
      code: 'EVIDENCE_RESULT_OUTCOME_MISMATCH',
      message: `Evidence outcome ${input.outcome} is record-only/non-applicable evidence and requires legacy result unknown.`
    };
  }
  return undefined;
}

export function appendEvidence(projectRoot: string, record: Omit<EvidenceRecord, 'time'>): string {
  return appendEvidenceWithResult(projectRoot, record).markdownPath;
}

export function appendEvidenceWithResult(projectRoot: string, record: Omit<EvidenceRecord, 'time'>): EvidenceAppendResult {
  const taskDir = findTaskDir(projectRoot, record.taskId);
  if (!taskDir) {
    throw new EvidenceTaskDirectoryError('TASK_NOT_FOUND', `Task Capsule not found: ${record.taskId}`);
  }

  const time = new Date().toISOString();
  const visibility = record.visibility ?? 'public';
  return appendEvidenceRecord({
    projectRoot,
    taskDir,
    time,
    record,
    visibility,
    createAttachedPath: () => copyPublicEvidenceArtifact({ projectRoot, taskDir, kind: record.kind, sourcePath: record.path, time, visibility })
  });
}

export function appendEvidenceTextArtifact(
  projectRoot: string,
  record: Omit<EvidenceRecord, 'time' | 'path'>,
  artifact: { fileName: string; content: string; artifactDirName?: string },
  options: PublicEvidenceArtifactPolicyOptions = {}
): EvidenceAppendResult {
  const taskDir = findTaskDir(projectRoot, record.taskId);
  if (!taskDir) {
    throw new EvidenceTaskDirectoryError('TASK_NOT_FOUND', `Task Capsule not found: ${record.taskId}`);
  }

  const time = new Date().toISOString();
  const visibility = record.visibility ?? 'public';
  return appendEvidenceRecord({
    projectRoot,
    taskDir,
    time,
    record,
    visibility,
    createAttachedPath: () =>
      visibility === 'public'
        ? writePublicEvidenceTextArtifact({
            taskDir,
            kind: record.kind,
            time,
            fileName: artifact.fileName,
            content: artifact.content,
            artifactDirName: artifact.artifactDirName,
            policyOptions: options
          })
        : undefined
  });
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

function readEvidenceIndex(taskDir: string): PersistedEvidenceRecord[] {
  const indexPath = path.join(taskDir, 'evidence.jsonl');
  if (!fs.existsSync(indexPath)) return [];
  return fs
    .readFileSync(indexPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line) as PersistedEvidenceRecord);
}

export function persistedEvidenceIdempotencyKey(record: PersistedEvidenceRecord): string | undefined {
  if (record.schemaVersion !== 'hadara.evidence.v2') return undefined;
  if (record.idempotencyKey) return record.idempotencyKey;
  const tag = record.tags.find((item) => item.startsWith('idempotency:'));
  return tag ? tag.replace(/^idempotency:/, '') : undefined;
}

function withEvidenceAppendLock<T>(projectRoot: string, taskId: string, fn: () => T): { value: T; appendLock: EvidenceAppendLockDiagnostics } {
  const lockRoot = path.join(projectRoot, '.hadara', 'local', 'locks', 'evidence');
  ensureDir(lockRoot);
  const lockDir = path.join(lockRoot, `${safeFilePart(taskId)}.lock`);
  const lockPortablePath = toPortablePath(path.relative(projectRoot, lockDir));
  const timer = startMonotonicTimer();
  const timeoutMs = 5000;
  let contended = false;

  while (true) {
    try {
      fs.mkdirSync(lockDir);
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      contended = true;
      if (timer.elapsedMs() >= timeoutMs) {
        throw new EvidenceAppendLockError(
          `Timed out waiting for the evidence append lock for ${taskId}. Lock directory: ${lockPortablePath}. ` +
            `If no HADARA process is writing evidence, the lock is stale (inspect ${lockPortablePath}/lock.json for the owning pid); remove the lock directory and retry.`
        );
      }
      sleepSync(25);
    }
  }

  writeLockMetadata(lockDir, taskId);
  const appendLock = {
    path: lockPortablePath,
    waitedMs: timer.elapsedMs(),
    contended,
    timeoutMs
  };
  try {
    return { value: fn(), appendLock };
  } finally {
    try {
      fs.rmSync(lockDir, { recursive: true, force: true });
    } catch {
      // Best-effort cleanup; later writers fail closed through the timeout.
    }
  }
}

function writeLockMetadata(lockDir: string, taskId: string): void {
  try {
    fs.writeFileSync(
      path.join(lockDir, 'lock.json'),
      `${JSON.stringify({ pid: process.pid, taskId, command: 'evidence.append', createdAt: new Date().toISOString() })}\n`,
      'utf8'
    );
  } catch {
    // Lock ownership is held by the directory; metadata is a best-effort diagnostic aid only.
  }
}

function sleepSync(ms: number): void {
  const signal = new Int32Array(new SharedArrayBuffer(4));
  Atomics.wait(signal, 0, 0, ms);
}

function appendEvidenceRecord(input: {
  projectRoot: string;
  taskDir: string;
  time: string;
  record: Omit<EvidenceRecord, 'time'>;
  visibility: NonNullable<EvidenceRecord['visibility']>;
  createAttachedPath: () => EvidenceArtifactBinding | undefined;
}): EvidenceAppendResult {
  const resultOutcomeIssue = validateEvidenceResultOutcomeCompatibility({
    result: input.record.result,
    outcome: input.record.outcome
  });
  if (resultOutcomeIssue) {
    throw new EvidenceResultOutcomeMismatchError(resultOutcomeIssue);
  }

  const summary = redactSecrets(input.record.summary.replace(/\|/g, '/'));
  const markdownPath = path.join(input.taskDir, 'EVIDENCE.md');

  const locked = withEvidenceAppendLock(input.projectRoot, input.record.taskId, () => {
    const idempotencyKey = input.record.idempotencyKey;
    if (idempotencyKey) {
      const existing = readEvidenceIndex(input.taskDir).find((record) => persistedEvidenceIdempotencyKey(record) === idempotencyKey);
      if (existing) {
        if (input.record.path && input.visibility === 'public') {
          const incoming = readPublicEvidenceSource(input.projectRoot, input.record.path);
          const existingArtifact = existing.schemaVersion === 'hadara.evidence.v2' ? existing.artifacts[0] : undefined;
          if (
            !existingArtifact ||
            existingArtifact.sha256 !== incoming.sha256 ||
            existingArtifact.byteLength !== incoming.byteLength
          ) {
            throw new EvidenceIdempotencyArtifactConflictError(
              `Evidence idempotency key ${idempotencyKey} already exists with different or legacy artifact bytes; use a new key or the original artifact.`
            );
          }
        }
        return {
          markdownPath,
          evidence: existing,
          markdownAppended: false,
          jsonlAppended: false,
          existing: true
        };
      }
    }

    const attachedArtifact = input.createAttachedPath();
    const evidence = createEvidenceV2Record({
      time: input.time,
      taskId: input.record.taskId,
      kind: input.record.kind,
      summary,
      result: input.record.result,
      category: input.record.category,
      outcome: input.record.outcome,
      visibility: input.visibility,
      attachedArtifact,
      tags: input.record.tags,
      idempotencyKey: input.record.idempotencyKey,
      actor: input.record.actor,
      closeEvidenceSnapshot: input.record.closeEvidenceSnapshot
    });
    appendEvidenceIndex(input.taskDir, evidence);
    const projection = projectEvidenceMarkdown(input.taskDir, input.record.taskId, true);
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

    return {
      markdownPath,
      evidence,
      markdownAppended: projection.wouldChange,
      jsonlAppended: true,
      existing: false
    };
  });

  return { ...locked.value, appendLock: locked.appendLock };
}

export function createEvidenceProjectionReport(projectRoot: string, taskId: string, execute = false): EvidenceProjectionReport {
  const taskDir = findTaskDir(projectRoot, taskId);
  if (!taskDir) {
    return {
      schemaVersion: 'hadara.evidence.projection.v1',
      command: 'evidence.project',
      ok: false,
      taskId,
      mode: execute ? 'execute' : 'dry-run',
      source: `tasks/${taskId}/evidence.jsonl`,
      target: `tasks/${taskId}/EVIDENCE.md`,
      wouldChange: false,
      generatedSlots: evidenceProjectionSlots(),
      afterHash: hashText(''),
      issues: [{ severity: 'error', code: 'TASK_NOT_FOUND', message: `Task Capsule not found: ${taskId}` }]
    };
  }
  const report = projectEvidenceMarkdown(taskDir, taskId, execute);
  const source = toPortablePath(path.relative(projectRoot, path.join(taskDir, 'evidence.jsonl')));
  const target = toPortablePath(path.relative(projectRoot, path.join(taskDir, 'EVIDENCE.md')));
  return { ...report, source, target };
}

function projectEvidenceMarkdown(taskDir: string, taskId: string, execute: boolean): EvidenceProjectionReport {
  const source = path.join(taskDir, 'evidence.jsonl');
  const target = path.join(taskDir, 'EVIDENCE.md');
  const records = readEvidenceIndex(taskDir);
  const next = renderEvidenceProjection(records, readProjectionTaskDocs(taskDir));
  const previous = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  const wouldChange = previous !== next;
  if (execute && wouldChange) fs.writeFileSync(target, next, 'utf8');
  return {
    schemaVersion: 'hadara.evidence.projection.v1',
    command: 'evidence.project',
    ok: true,
    taskId,
    mode: execute ? 'execute' : 'dry-run',
    source,
    target,
    wouldChange,
    generatedSlots: evidenceProjectionSlots(),
    ...(previous ? { beforeHash: hashText(previous) } : {}),
    afterHash: hashText(next),
    issues: []
  };
}

function renderEvidenceProjection(
  records: PersistedEvidenceRecord[],
  taskDocs: { risks?: string; handoff?: string } = {}
): string {
  const validationRows = records.filter((record) => !isCloseProofRecord(record) && !isResidualRecord(record));
  const closeRows = records.filter(isCloseProofRecord);
  const residualRows = records.filter(isResidualRecord);
  return [
    '# EVIDENCE',
    '',
    'This file is a human-readable projection from `evidence.jsonl`.',
    '',
    'Do not hand-edit this file.',
    '',
    '## Validation Evidence',
    '',
    '<!-- hadara:slot evidence.validation-summary -->',
    '| Evidence ID | Outcome | Category | Summary |',
    '|---|---|---|---|',
    ...validationRows.map((record) => `| ${evidenceProjectionId(record)} | ${evidenceProjectionOutcome(record)} | ${evidenceProjectionCategory(record)} | ${evidenceProjectionSummary(record)} |`),
    '<!-- /hadara:slot -->',
    '',
    '## Close Proof',
    '',
    '<!-- hadara:slot evidence.close-proof -->',
    '| Check | Result | Evidence |',
    '|---|---|---|',
    ...closeRows.map((record) => `| close evidence | ${evidenceProjectionOutcome(record)} | ${evidenceProjectionId(record)} |`),
    '<!-- /hadara:slot -->',
    '',
    '## Failed / Blocked / Residual Evidence',
    '',
    '<!-- hadara:slot evidence.residuals -->',
    '| Evidence ID | Outcome | Summary | Disposition | Reference |',
    '|---|---|---|---|---|',
    ...residualRows.map((record) => {
      const resolution = findResidualResolution(record, records, taskDocs);
      return `| ${evidenceProjectionId(record)} | ${evidenceProjectionOutcome(record)} | ${evidenceProjectionSummary(record)} | ${resolution.disposition} | ${resolution.reference} |`;
    }),
    '<!-- /hadara:slot -->',
    ''
  ].join('\n');
}

export function countEvidenceProjectionRows(records: PersistedEvidenceRecord[]): number {
  const validationRows = records.filter((record) => !isCloseProofRecord(record) && !isResidualRecord(record));
  const closeRows = records.filter(isCloseProofRecord);
  const residualRows = records.filter(isResidualRecord);
  return validationRows.length + closeRows.length + residualRows.length;
}

function evidenceProjectionSlots(): string[] {
  return ['evidence.validation-summary', 'evidence.close-proof', 'evidence.residuals'];
}

function evidenceProjectionId(record: PersistedEvidenceRecord): string {
  return record.schemaVersion === 'hadara.evidence.v2' ? record.id : 'evidence.jsonl';
}

function evidenceProjectionOutcome(record: PersistedEvidenceRecord): EvidenceOutcome {
  return record.schemaVersion === 'hadara.evidence.v2' ? record.outcome : normalizeEvidenceOutcome(record.result);
}

function evidenceProjectionCategory(record: PersistedEvidenceRecord): EvidenceCategory {
  return record.schemaVersion === 'hadara.evidence.v2' ? record.category : deriveEvidenceCategory(record.kind, record.summary);
}

function evidenceProjectionSummary(record: PersistedEvidenceRecord): string {
  return record.summary.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').replace(/\|/g, '/').trim();
}

function isCloseProofRecord(record: PersistedEvidenceRecord): boolean {
  return record.schemaVersion === 'hadara.evidence.v2' && record.tags.includes('close-proof');
}

function isResidualRecord(record: PersistedEvidenceRecord): boolean {
  const outcome = evidenceProjectionOutcome(record);
  return outcome === 'failed' || outcome === 'blocked';
}

function findResidualResolution(
  record: PersistedEvidenceRecord,
  records: PersistedEvidenceRecord[],
  taskDocs: { risks?: string; handoff?: string } = {}
): { disposition: 'Resolved' | 'Unresolved'; reference: string } {
  const id = evidenceProjectionId(record);
  if (!id.startsWith('ev:')) return { disposition: 'Unresolved', reference: 'evidence.jsonl' };
  const normalized = normalizeEvidenceRecordsInMemoryOrder(records, { taskDir: undefined });
  const recordIndex = normalized.findIndex((candidate) => candidate.id === id);
  if (recordIndex < 0) return { disposition: 'Unresolved', reference: 'evidence.jsonl' };
  const resolution = resolveNegativeEvidence(recordIndex >= 0 ? normalized[recordIndex] : normalized[0], normalized.slice(recordIndex + 1), taskDocs);
  return resolution.resolved
    ? { disposition: 'Resolved', reference: resolution.reference ?? 'evidence.jsonl' }
    : { disposition: 'Unresolved', reference: 'evidence.jsonl' };
}

function readProjectionTaskDocs(taskDir: string): { risks?: string; handoff?: string } {
  const taskPath = path.join(taskDir, 'TASK.md');
  const handoffPath = path.join(taskDir, 'HANDOFF.md');
  return {
    ...(fs.existsSync(taskPath) ? { risks: fs.readFileSync(taskPath, 'utf8') } : {}),
    ...(fs.existsSync(handoffPath) ? { handoff: fs.readFileSync(handoffPath, 'utf8') } : {})
  };
}

function hashText(content: string): string {
  return `sha256:${crypto.createHash('sha256').update(content, 'utf8').digest('hex')}`;
}

function createEvidenceV2Record(input: {
  time: string;
  taskId: string;
  kind: EvidenceRecord['kind'];
  summary: string;
  result: EvidenceRecord['result'];
  category?: EvidenceCategory;
  outcome?: EvidenceOutcome;
  visibility: NonNullable<EvidenceRecord['visibility']>;
  attachedArtifact?: EvidenceArtifactBinding;
  tags?: string[];
  idempotencyKey?: string;
  actor?: HadaraActorContext;
  closeEvidenceSnapshot?: CloseEvidenceSnapshot;
}): EvidenceV2IndexRecord {
  const legacy = {
    kind: input.kind,
    result: input.result,
    ...(input.visibility === 'public' && input.attachedArtifact ? { evidencePath: input.attachedArtifact.path } : {})
  };
  const tags = Array.from(new Set([...extractEvidenceTags(input.summary), ...(input.tags ?? [])]));
  const recordWithoutIdentity = {
    schemaVersion: 'hadara.evidence.v2' as const,
    time: input.time,
    taskId: input.taskId,
    category: input.category ?? deriveEvidenceCategory(input.kind, input.summary),
    outcome: input.outcome ?? normalizeEvidenceOutcome(input.result),
    visibility: input.visibility,
    summary: input.summary,
    artifacts:
      input.visibility === 'public' && input.attachedArtifact
        ? [
            {
              ...input.attachedArtifact,
            }
          ]
        : [],
    tags,
    ...(input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : {}),
    ...(input.actor ? { actor: input.actor } : {}),
    ...(input.closeEvidenceSnapshot ? { closeEvidenceSnapshot: input.closeEvidenceSnapshot } : {}),
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
        idempotencyKey: record.idempotencyKey,
        actor: record.actor,
        closeEvidenceSnapshot: record.closeEvidenceSnapshot,
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
  if (/\b(npm run check|test|vitest|doctor|smoke|dev:docker-sync-build|docker sync-build)\b/.test(lowered)) {
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
}): EvidenceArtifactBinding | undefined {
  if (!input.sourcePath || input.visibility === 'private') return undefined;

  const source = readPublicEvidenceSource(input.projectRoot, input.sourcePath);

  const artifactsDir = path.join(input.taskDir, 'artifacts', input.kind);
  ensureDir(artifactsDir);
  const targetPath = path.join(artifactsDir, `${safeFilePart(input.time)}-${safeFilePart(path.basename(source.absolutePath))}`);
  fs.writeFileSync(targetPath, source.bytes);
  return createArtifactBinding(input.taskDir, targetPath, input.kind, source.bytes);
}

function writePublicEvidenceTextArtifact(input: {
  taskDir: string;
  kind: EvidenceRecord['kind'];
  time: string;
  fileName: string;
  content: string;
  artifactDirName?: string;
  policyOptions?: PublicEvidenceArtifactPolicyOptions;
}): EvidenceArtifactBinding {
  const policy = createPublicEvidenceArtifactPolicyReport(input.content, input.policyOptions);
  if (policy.blocking) {
    throw new EvidenceArtifactPolicyError(
      'PUBLIC_ARTIFACT_SECRET_DETECTED',
      'Public evidence artifact contains secret-like content; collect it as private evidence or redact the source file first.',
      policy.redaction
    );
  }

  const artifactsDir = path.join(input.taskDir, 'artifacts', safeFilePart(input.artifactDirName ?? input.kind));
  ensureDir(artifactsDir);
  const targetPath = path.join(artifactsDir, `${safeFilePart(input.time)}-${safeFilePart(input.fileName)}`);
  const bytes = Buffer.from(input.content, 'utf8');
  fs.writeFileSync(targetPath, bytes);
  return createArtifactBinding(input.taskDir, targetPath, input.kind, bytes);
}

function readPublicEvidenceSource(projectRoot: string, sourcePath: string): { absolutePath: string; bytes: Buffer; text: string; sha256: string; byteLength: number } {
  const sourceFile = resolveProjectFile(projectRoot, sourcePath);
  const bytes = fs.readFileSync(sourceFile.absolutePath);
  if (!isTextBuffer(bytes)) {
    throw new EvidenceArtifactPolicyError(
      'PUBLIC_ARTIFACT_BINARY_REJECTED',
      'Public evidence artifacts must be UTF-8 text; collect binary evidence as private evidence until binary policy is implemented.'
    );
  }
  const text = bytes.toString('utf8');
  const policy = createPublicEvidenceArtifactPolicyReport(text);
  if (policy.blocking) {
    throw new EvidenceArtifactPolicyError(
      'PUBLIC_ARTIFACT_SECRET_DETECTED',
      'Public evidence artifact contains secret-like content; collect it as private evidence or redact the source file first.',
      policy.redaction
    );
  }
  return {
    absolutePath: sourceFile.absolutePath,
    bytes,
    text,
    sha256: hashBuffer(bytes),
    byteLength: bytes.byteLength
  };
}

function createArtifactBinding(taskDir: string, targetPath: string, kind: EvidenceRecord['kind'], bytes: Buffer): EvidenceArtifactBinding {
  return {
    path: toPortablePath(path.relative(taskDir, targetPath)),
    visibility: 'public',
    artifactType: kind,
    sha256: hashBuffer(bytes),
    byteLength: bytes.byteLength
  };
}

function hashBuffer(content: Buffer): string {
  return `sha256:${crypto.createHash('sha256').update(content).digest('hex')}`;
}

function isTextBuffer(content: Buffer): boolean {
  if (content.includes(0)) return false;
  return !content.toString('utf8').includes('\uFFFD');
}

function findTaskDir(projectRoot: string, taskId: string): string | null {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return null;
  const entries = fs
    .readdirSync(tasksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(`${taskId}-`) && fs.existsSync(path.join(tasksDir, entry.name, 'TASK.md')));
  if (entries.length > 1) {
    throw new EvidenceTaskDirectoryError(
      'TASK_CAPSULE_AMBIGUOUS',
      `Multiple Task Capsules found for ${taskId}; remove or repair duplicate TASK.md-bearing directories before recording evidence.`
    );
  }
  return entries[0] ? path.join(tasksDir, entries[0].name) : null;
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
