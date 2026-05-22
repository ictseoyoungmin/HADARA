import fs from 'node:fs';
import path from 'node:path';
import { ensureDir } from '../core/fs';
import { redactSecrets } from '../core/redaction';
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

export function appendEvidence(projectRoot: string, record: Omit<EvidenceRecord, 'time'>): string {
  const taskDir = findTaskDir(projectRoot, record.taskId);
  if (!taskDir) {
    throw new Error(`Task capsule not found: ${record.taskId}`);
  }

  const time = new Date().toISOString();
  const visibility = record.visibility ?? 'public';
  const summary = redactSecrets(record.summary.replace(/\|/g, '/'));
  const attachedPath = copyPublicEvidenceArtifact({ projectRoot, taskDir, kind: record.kind, sourcePath: record.path, time, visibility });
  const markdownPath = path.join(taskDir, 'EVIDENCE.md');
  const rowSummary = visibility === 'private' || !attachedPath ? summary : `${summary} (${attachedPath})`;
  const row = `| ${time} | ${record.kind} | ${rowSummary} | ${record.result} |\n`;

  if (!fs.existsSync(markdownPath)) {
    fs.writeFileSync(markdownPath, '# Evidence\n\n| Time | Kind | Summary | Result |\n|---|---|---|---|\n', 'utf8');
  }
  fs.appendFileSync(markdownPath, row, 'utf8');
  appendEvidenceIndex(taskDir, {
    schemaVersion: 'hadara.evidence.v1',
    time,
    taskId: record.taskId,
    kind: record.kind,
    summary,
    result: record.result,
    visibility,
    ...(visibility === 'public' && attachedPath ? { evidencePath: attachedPath } : {})
  });
  return markdownPath;
}

function appendEvidenceIndex(taskDir: string, record: EvidenceIndexRecord): void {
  fs.appendFileSync(path.join(taskDir, 'evidence.jsonl'), `${JSON.stringify(record)}\n`, 'utf8');
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

  const artifactsDir = path.join(input.taskDir, 'artifacts', input.kind);
  ensureDir(artifactsDir);
  const targetPath = path.join(artifactsDir, `${safeFilePart(input.time)}-${safeFilePart(path.basename(sourceFile.absolutePath))}`);
  fs.copyFileSync(sourceFile.absolutePath, targetPath);
  return toPortablePath(path.relative(input.taskDir, targetPath));
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
