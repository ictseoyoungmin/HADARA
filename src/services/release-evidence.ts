import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { validateSchema } from '../core/schema';
import { EvidenceIndexRecord } from '../evidence/evidence';
import { normalizeEvidenceRecord, NormalizedEvidenceRecord } from '../evidence/normalizer';
import { isLegacyReleaseProofEvidence } from '../evidence/semantics';

export interface ReleaseEvidenceRecord {
  taskId: string;
  taskDir: string;
  sourceLine?: number;
  time: string;
  kind: string;
  summary: string;
  result: string;
  visibility: string;
  evidencePath?: string;
}

export interface ReleaseEvidenceArtifactValidation {
  exists: boolean;
  schemaVersion?: string;
  schemaValid?: boolean;
  sourceOk?: boolean;
  category?: string;
  mode?: string;
  packageVersion?: string;
  gitCommit?: string;
  manifestHash?: string;
  issues: string[];
}

export interface StrictReleaseEvidenceExpectation {
  category: 'package-smoke' | 'clean-checkout-smoke' | 'release-artifact';
  mode?: string;
}

export function readReleaseEvidenceRecords(projectRoot: string): ReleaseEvidenceRecord[] {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return [];
  return fs
    .readdirSync(tasksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^T-\d{4}-/.test(entry.name))
    .flatMap((entry) => readTaskEvidenceRecords(path.join(tasksDir, entry.name)));
}

export function validateReleaseEvidenceArtifact(record: ReleaseEvidenceRecord): ReleaseEvidenceArtifactValidation {
  if (!record.evidencePath) return { exists: false, issues: ['EVIDENCE_ARTIFACT_PATH_MISSING'] };
  const taskRoot = path.resolve(record.taskDir);
  const artifactPath = path.resolve(record.taskDir, record.evidencePath);
  if (!artifactPath.startsWith(`${taskRoot}${path.sep}`)) return { exists: false, issues: ['EVIDENCE_ARTIFACT_OUTSIDE_TASK'] };
  if (!fs.existsSync(artifactPath)) return { exists: false, issues: ['EVIDENCE_ARTIFACT_MISSING'] };

  try {
    const content = fs.readFileSync(artifactPath, 'utf8');
    const parsed: unknown = JSON.parse(content);
    if (!isRecord(parsed) || typeof parsed.schemaVersion !== 'string') {
      return { exists: true, schemaValid: false, issues: ['EVIDENCE_ARTIFACT_SCHEMA_MISSING'] };
    }

    if (parsed.schemaVersion === 'hadara.smokeEvidenceSummary.v1') {
      const sourceReport = isRecord(parsed.sourceReport) ? parsed.sourceReport : {};
      return {
        exists: true,
        schemaVersion: parsed.schemaVersion,
        schemaValid: validateSchema('hadara.smokeEvidenceSummary.v1', parsed).ok,
        sourceOk: sourceReport.ok === true,
        category: typeof parsed.category === 'string' ? parsed.category : undefined,
        mode: typeof sourceReport.mode === 'string' ? sourceReport.mode : undefined,
        packageVersion: readOptionalString(parsed.packageVersion) ?? readOptionalString(sourceReport.packageVersion),
        gitCommit: readOptionalString(parsed.gitCommit) ?? readOptionalString(sourceReport.gitCommit),
        issues: []
      };
    }

    if (parsed.schemaVersion === 'hadara.releaseArtifact.v1') {
      const artifacts = Array.isArray(parsed.artifacts) ? parsed.artifacts : [];
      const manifest = artifacts.find((artifact): artifact is Record<string, unknown> => isRecord(artifact) && artifact.kind === 'manifest');
      const evidence = isRecord(parsed.evidence) ? parsed.evidence : {};
      return {
        exists: true,
        schemaVersion: parsed.schemaVersion,
        schemaValid: validateSchema('hadara.releaseArtifact.v1', parsed).ok,
        sourceOk: parsed.ok === true,
        category: 'release-artifact',
        mode: typeof parsed.mode === 'string' ? parsed.mode : undefined,
        packageVersion: isRecord(parsed.package) ? readOptionalString(parsed.package.version) : undefined,
        gitCommit: readOptionalString(evidence.gitCommit) ?? readOptionalString(parsed.gitCommit),
        manifestHash: readOptionalString(manifest?.hash),
        issues: []
      };
    }

    if (parsed.schemaVersion === 'hadara.releaseArtifact.manifest.v1') {
      return {
        exists: true,
        schemaVersion: parsed.schemaVersion,
        schemaValid: validateSchema('hadara.releaseArtifact.manifest.v1', parsed).ok,
        sourceOk: true,
        category: 'release-artifact',
        mode: 'execute',
        packageVersion: isRecord(parsed.package) ? readOptionalString(parsed.package.version) : undefined,
        manifestHash: `sha256:${sha256(content)}`,
        issues: []
      };
    }

    return {
      exists: true,
      schemaVersion: parsed.schemaVersion,
      schemaValid: false,
      issues: ['EVIDENCE_ARTIFACT_SCHEMA_UNSUPPORTED']
    };
  } catch {
    return { exists: true, schemaValid: false, issues: ['EVIDENCE_ARTIFACT_INVALID_JSON'] };
  }
}

export function normalizeReleaseEvidenceRecord(record: ReleaseEvidenceRecord): NormalizedEvidenceRecord | null {
  if (!isEvidenceKind(record.kind) || !isEvidenceResult(record.result) || !isEvidenceVisibility(record.visibility)) return null;
  const normalized = normalizeEvidenceRecord(
    {
      schemaVersion: 'hadara.evidence.v1',
      time: record.time,
      taskId: record.taskId,
      kind: record.kind,
      summary: record.summary,
      result: record.result,
      visibility: record.visibility,
      ...(record.evidencePath ? { evidencePath: record.evidencePath } : {})
    },
    { taskDir: record.taskDir, lineNumber: record.sourceLine }
  );
  const validation = validateReleaseEvidenceArtifact(record);
  if (validation.schemaVersion && normalized.artifacts.length > 0) {
    return {
      ...normalized,
      artifacts: normalized.artifacts.map((artifact) => ({
        ...artifact,
        schemaVersion: validation.schemaVersion
      }))
    };
  }
  return normalized;
}

export function isStrictReleaseEvidenceProof(record: ReleaseEvidenceRecord, expectation: StrictReleaseEvidenceExpectation): boolean {
  const artifact = validateReleaseEvidenceArtifact(record);
  if (!artifact.exists || artifact.schemaValid !== true || artifact.sourceOk !== true) return false;
  if (artifact.category !== expectation.category) return false;
  if (expectation.mode && artifact.mode !== expectation.mode) return false;

  const normalized = normalizeReleaseEvidenceRecord(record);
  return normalized !== null && isLegacyReleaseProofEvidence(normalized);
}

function readTaskEvidenceRecords(taskDir: string): ReleaseEvidenceRecord[] {
  const evidencePath = path.join(taskDir, 'evidence.jsonl');
  if (!fs.existsSync(evidencePath)) return [];
  return fs
    .readFileSync(evidencePath, 'utf8')
    .split(/\r?\n/)
    .map((line, index): ReleaseEvidenceRecord | null => {
      if (line.trim() === '') return null;
      try {
        const parsed: unknown = JSON.parse(line);
        if (!isRecord(parsed)) return null;
        if (parsed.schemaVersion !== 'hadara.evidence.v1') return null;
        if (typeof parsed.time !== 'string' || typeof parsed.summary !== 'string') return null;
        if (typeof parsed.taskId !== 'string' || typeof parsed.kind !== 'string') return null;
        if (typeof parsed.result !== 'string' || typeof parsed.visibility !== 'string') return null;
        return {
          taskId: parsed.taskId,
          taskDir,
          sourceLine: index + 1,
          time: parsed.time,
          kind: parsed.kind,
          summary: parsed.summary,
          result: parsed.result,
          visibility: parsed.visibility,
          ...(typeof parsed.evidencePath === 'string' ? { evidencePath: parsed.evidencePath } : {})
        };
      } catch {
        return null;
      }
    })
    .filter((record): record is ReleaseEvidenceRecord => record !== null);
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function sha256(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
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
