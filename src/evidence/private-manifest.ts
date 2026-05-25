import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { writeAuditEvent } from '../core/audit';
import { ensureDir, writeJsonl } from '../core/fs';
import { redactSecrets } from '../core/redaction';
import { resolveHadaraPaths } from '../core/paths';
import { resolveProjectFile, WorkspaceFileError } from '../core/workspace';
import type { EvidenceRecord } from './evidence';

export interface PrivateEvidenceManifestRecord {
  schemaVersion: 'hadara.privateEvidence.v1';
  taskId: string;
  evidenceId: string;
  kind: EvidenceRecord['kind'];
  summary: string;
  result: EvidenceRecord['result'];
  storage: {
    kind: 'portable-store';
    relativePath: string;
    encrypted: false;
    hash: string;
    byteLength: number;
  };
  createdAt: string;
  retention: {
    policy: 'local-only';
    includeInContextExport: false;
  };
  encryption: {
    status: 'deferred';
    reason: string;
  };
}

export interface PrivateEvidenceManifestInput {
  projectRoot: string;
  taskId: string;
  kind: EvidenceRecord['kind'];
  summary: string;
  result: EvidenceRecord['result'];
  sourcePath?: string;
  time: string;
}

export function writePrivateEvidenceManifest(input: PrivateEvidenceManifestInput): PrivateEvidenceManifestRecord | null {
  const source = readPrivateEvidenceSource(input.projectRoot, input.sourcePath);
  if (!source) return null;

  const paths = resolveHadaraPaths({ projectRoot: input.projectRoot });
  const evidenceId = createEvidenceId(input.time);
  const privateDir = path.join(paths.dataRoot, 'private-evidence', input.taskId);
  ensureDir(privateDir);

  const artifactPath = path.join(privateDir, `${evidenceId}.bin`);
  fs.writeFileSync(artifactPath, source);

  const manifest: PrivateEvidenceManifestRecord = {
    schemaVersion: 'hadara.privateEvidence.v1',
    taskId: input.taskId,
    evidenceId,
    kind: input.kind,
    summary: redactSecrets(input.summary),
    result: input.result,
    storage: {
      kind: 'portable-store',
      relativePath: toPortablePath(path.relative(paths.portableRoot, artifactPath)),
      encrypted: false,
      hash: `sha256:${crypto.createHash('sha256').update(source).digest('hex')}`,
      byteLength: source.byteLength
    },
    createdAt: input.time,
    retention: {
      policy: 'local-only',
      includeInContextExport: false
    },
    encryption: {
      status: 'deferred',
      reason: 'Private evidence encryption is deferred; content remains in the private portable store and is excluded from committed project context.'
    }
  };

  writeJsonl(path.join(privateDir, 'manifest.jsonl'), manifest);
  writeAuditEvent(paths.auditDir, {
    actor: 'system',
    task_id: input.taskId,
    event_type: 'evidence.private_manifest.created',
    risk: 'medium',
    summary: `Private evidence manifest created for ${input.taskId}`,
    payload: {
      evidenceId,
      kind: input.kind,
      result: input.result,
      hash: manifest.storage.hash,
      byteLength: manifest.storage.byteLength,
      includeInContextExport: false,
      encrypted: false
    }
  });

  return manifest;
}

export function listPrivateEvidenceManifests(projectRoot: string, taskId: string): PrivateEvidenceManifestRecord[] {
  const paths = resolveHadaraPaths({ projectRoot });
  const manifestPath = path.join(paths.dataRoot, 'private-evidence', taskId, 'manifest.jsonl');
  if (!fs.existsSync(manifestPath)) return [];
  return fs
    .readFileSync(manifestPath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as PrivateEvidenceManifestRecord);
}

function readPrivateEvidenceSource(projectRoot: string, sourcePath?: string): Buffer | null {
  if (!sourcePath) return null;
  try {
    const sourceFile = resolveProjectFile(projectRoot, sourcePath);
    return fs.readFileSync(sourceFile.absolutePath);
  } catch (error) {
    if (error instanceof WorkspaceFileError) return null;
    return null;
  }
}

function createEvidenceId(time: string): string {
  return `ev_${safeFilePart(time)}_${crypto.randomBytes(4).toString('hex')}`;
}

function safeFilePart(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'evidence';
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
