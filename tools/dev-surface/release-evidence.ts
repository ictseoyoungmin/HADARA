import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { validateSchema } from '../../src/core/schema';
import { EvidenceIndexRecord, EvidenceV2IndexRecord, PersistedEvidenceRecord, persistedEvidencePath } from '../../src/evidence/evidence';
import { normalizeEvidenceRecord, NormalizedEvidenceRecord } from '../../src/evidence/normalizer';
import { isReleaseProofEvidence } from '../../src/evidence/semantics';

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
  persisted: PersistedEvidenceRecord;
}

export interface ReleaseEvidenceArtifactValidation {
  exists: boolean;
  schemaVersion?: string;
  schemaValid?: boolean;
  sourceOk?: boolean;
  category?: string;
  mode?: string;
  providerEcosystem?: string;
  packageVersion?: string;
  gitCommit?: string;
  releaseInputHash?: string;
  manifestHash?: string;
  issues: string[];
}

export interface StrictReleaseEvidenceExpectation {
  category: 'package-smoke' | 'clean-checkout-smoke' | 'release-artifact';
  mode?: string;
  providerEcosystem?: string;
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
        providerEcosystem: readProviderEcosystem(sourceReport),
        packageVersion: readOptionalString(parsed.packageVersion) ?? readOptionalString(sourceReport.packageVersion),
        gitCommit: readOptionalString(parsed.gitCommit) ?? readOptionalString(sourceReport.gitCommit),
        releaseInputHash: readNestedString(sourceReport, 'releaseInputHash'),
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
        releaseInputHash: isRecord(parsed.source) ? readOptionalString(parsed.source.releaseInputHash) : undefined,
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
  const normalized = normalizeEvidenceRecord(record.persisted, { taskDir: record.taskDir, lineNumber: record.sourceLine });
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
  if (expectation.providerEcosystem && !providerMatchesExpectation(artifact.providerEcosystem, expectation.providerEcosystem)) return false;

  const normalized = normalizeReleaseEvidenceRecord(record);
  return normalized !== null && typeof normalized.legacy.kind === 'string' && isReleaseCompatibleKind(normalized.legacy.kind) && isReleaseProofEvidence(normalized);
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
        return toReleaseEvidenceRecord(parsed, taskDir, index + 1);
      } catch {
        return null;
      }
    })
    .filter((record): record is ReleaseEvidenceRecord => record !== null);
}

function toReleaseEvidenceRecord(parsed: Record<string, unknown>, taskDir: string, sourceLine: number): ReleaseEvidenceRecord | null {
  if (parsed.schemaVersion === 'hadara.evidence.v1') return toReleaseEvidenceV1Record(parsed, taskDir, sourceLine);
  if (parsed.schemaVersion === 'hadara.evidence.v2') return toReleaseEvidenceV2Record(parsed, taskDir, sourceLine);
  return null;
}

function toReleaseEvidenceV1Record(parsed: Record<string, unknown>, taskDir: string, sourceLine: number): ReleaseEvidenceRecord | null {
  if (typeof parsed.time !== 'string' || typeof parsed.summary !== 'string') return null;
  if (typeof parsed.taskId !== 'string' || typeof parsed.kind !== 'string') return null;
  if (typeof parsed.result !== 'string' || typeof parsed.visibility !== 'string') return null;
  if (!isEvidenceKind(parsed.kind) || !isEvidenceResult(parsed.result) || !isEvidenceVisibility(parsed.visibility)) return null;
  const persisted: EvidenceIndexRecord = {
    schemaVersion: 'hadara.evidence.v1',
    time: parsed.time,
    taskId: parsed.taskId,
    kind: parsed.kind,
    summary: parsed.summary,
    result: parsed.result,
    visibility: parsed.visibility,
    ...(typeof parsed.evidencePath === 'string' ? { evidencePath: parsed.evidencePath } : {})
  };
  return {
    taskId: persisted.taskId,
    taskDir,
    sourceLine,
    time: persisted.time,
    kind: persisted.kind,
    summary: persisted.summary,
    result: persisted.result,
    visibility: persisted.visibility,
    ...(persisted.evidencePath ? { evidencePath: persisted.evidencePath } : {}),
    persisted
  };
}

function toReleaseEvidenceV2Record(parsed: Record<string, unknown>, taskDir: string, sourceLine: number): ReleaseEvidenceRecord | null {
  if (typeof parsed.time !== 'string' || typeof parsed.summary !== 'string') return null;
  if (typeof parsed.taskId !== 'string' || typeof parsed.visibility !== 'string') return null;
  const legacy = isRecord(parsed.legacy) ? parsed.legacy : null;
  if (!legacy || typeof legacy.kind !== 'string' || typeof legacy.result !== 'string') return null;
  if (!isEvidenceKind(legacy.kind) || !isEvidenceResult(legacy.result) || !isEvidenceVisibility(parsed.visibility)) return null;
  if (typeof parsed.id !== 'string' || typeof parsed.fingerprint !== 'string') return null;
  const category = isEvidenceV2Category(parsed.category) ? parsed.category : 'release';
  const outcome = isEvidenceV2Outcome(parsed.outcome) ? parsed.outcome : 'unknown';
  const artifacts = Array.isArray(parsed.artifacts) ? parsed.artifacts.filter(isV2ArtifactRef) : [];
  const tags = Array.isArray(parsed.tags) ? parsed.tags.filter((tag): tag is string => typeof tag === 'string') : [];
  const persisted: EvidenceV2IndexRecord = {
    schemaVersion: 'hadara.evidence.v2',
    id: parsed.id,
    fingerprint: parsed.fingerprint,
    idSource: parsed.idSource === 'persisted' ? 'persisted' : 'persisted',
    idStability: parsed.idStability === 'durable' ? 'durable' : 'durable',
    sourceLine,
    time: parsed.time,
    taskId: parsed.taskId,
    category,
    outcome,
    visibility: parsed.visibility,
    summary: parsed.summary,
    artifacts,
    tags,
    legacy: {
      kind: legacy.kind,
      result: legacy.result,
      ...(typeof legacy.evidencePath === 'string' ? { evidencePath: legacy.evidencePath } : {})
    }
  };
  const evidencePath = persistedEvidencePath(persisted) ?? persisted.artifacts.find((artifact) => artifact.visibility === 'public')?.path;
  return {
    taskId: persisted.taskId,
    taskDir,
    sourceLine,
    time: persisted.time,
    kind: persisted.legacy.kind,
    summary: persisted.summary,
    result: persisted.legacy.result,
    visibility: persisted.visibility,
    ...(evidencePath ? { evidencePath } : {}),
    persisted
  };
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function readProviderEcosystem(sourceReport: Record<string, unknown>): string | undefined {
  const provider = isRecord(sourceReport.provider) ? sourceReport.provider : undefined;
  return readOptionalString(provider?.ecosystem);
}

function readNestedString(record: Record<string, unknown>, key: string): string | undefined {
  const source = isRecord(record.source) ? record.source : undefined;
  return source ? readOptionalString(source[key]) : undefined;
}

function providerMatchesExpectation(actual: string | undefined, expected: string): boolean {
  if (actual === expected) return true;
  return expected === 'npm' && actual === undefined;
}

function sha256(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isV2ArtifactRef(value: unknown): value is EvidenceV2IndexRecord['artifacts'][number] {
  return (
    isRecord(value) &&
    typeof value.path === 'string' &&
    value.visibility === 'public' &&
    (value.artifactType === 'test-log' || value.artifactType === 'command-log' || value.artifactType === 'diff-summary' || value.artifactType === 'screenshot' || value.artifactType === 'note')
  );
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

function isReleaseCompatibleKind(value: string): boolean {
  return value === 'command-log' || value === 'test-log';
}

function isEvidenceV2Category(value: unknown): value is EvidenceV2IndexRecord['category'] {
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

function isEvidenceV2Outcome(value: unknown): value is EvidenceV2IndexRecord['outcome'] {
  return value === 'passed' || value === 'failed' || value === 'blocked' || value === 'unknown' || value === 'recorded' || value === 'not-applicable';
}
