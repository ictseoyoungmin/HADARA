import fs from 'node:fs';
import path from 'node:path';
import { ensureDir } from '../core/fs';
import { containsSecret, redactSecrets } from '../core/redaction';
import { resolveProjectFile } from '../core/workspace';

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

export interface EvidenceAppendResult {
  markdownPath: string;
  evidence: EvidenceIndexRecord;
}

export type EvidenceArtifactPolicyErrorCode = 'PUBLIC_ARTIFACT_BINARY_REJECTED' | 'PUBLIC_ARTIFACT_SECRET_DETECTED';

export class EvidenceArtifactPolicyError extends Error {
  constructor(public readonly code: EvidenceArtifactPolicyErrorCode, message: string) {
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
  return appendEvidenceRecord({ taskDir, time, record, visibility, attachedPath }).markdownPath;
}

export function appendEvidenceTextArtifact(
  projectRoot: string,
  record: Omit<EvidenceRecord, 'time' | 'path'>,
  artifact: { fileName: string; content: string }
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
          content: artifact.content
        })
      : undefined;
  return appendEvidenceRecord({ taskDir, time, record, visibility, attachedPath });
}

function appendEvidenceIndex(taskDir: string, record: EvidenceIndexRecord): void {
  fs.appendFileSync(path.join(taskDir, 'evidence.jsonl'), `${JSON.stringify(record)}\n`, 'utf8');
}

function appendEvidenceRecord(input: {
  taskDir: string;
  time: string;
  record: Omit<EvidenceRecord, 'time'>;
  visibility: NonNullable<EvidenceRecord['visibility']>;
  attachedPath?: string;
}): EvidenceAppendResult {
  const summary = redactSecrets(input.record.summary.replace(/\|/g, '/'));
  const markdownPath = path.join(input.taskDir, 'EVIDENCE.md');
  const rowSummary = input.visibility === 'private' || !input.attachedPath ? summary : `${summary} (${input.attachedPath})`;
  const row = `| ${input.time} | ${input.record.kind} | ${rowSummary} | ${input.record.result} |\n`;

  if (!fs.existsSync(markdownPath)) {
    fs.writeFileSync(markdownPath, '# Evidence\n\n| Time | Kind | Summary | Result |\n|---|---|---|---|\n', 'utf8');
  }
  fs.appendFileSync(markdownPath, row, 'utf8');

  const evidence: EvidenceIndexRecord = {
    schemaVersion: 'hadara.evidence.v1',
    time: input.time,
    taskId: input.record.taskId,
    kind: input.record.kind,
    summary,
    result: input.record.result,
    visibility: input.visibility,
    ...(input.visibility === 'public' && input.attachedPath ? { evidencePath: input.attachedPath } : {})
  };
  appendEvidenceIndex(input.taskDir, evidence);

  return { markdownPath, evidence };
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
  if (containsSecret(artifactText)) {
    throw new EvidenceArtifactPolicyError(
      'PUBLIC_ARTIFACT_SECRET_DETECTED',
      'Public evidence artifact contains secret-like content; collect it as private evidence or redact the source file first.'
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
}): string {
  if (containsSecret(input.content)) {
    throw new EvidenceArtifactPolicyError(
      'PUBLIC_ARTIFACT_SECRET_DETECTED',
      'Public evidence artifact contains secret-like content; collect it as private evidence or redact the source file first.'
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
