import fs from 'node:fs';
import path from 'node:path';
import { assertSchema } from '../core/schema';
import { createReleaseGateReport } from './operational-debt';
import { readReleaseEvidenceRecords, ReleaseEvidenceRecord, validateReleaseEvidenceArtifact } from './release-evidence';

export interface ReleaseDryRunReport {
  schemaVersion: 'hadara.releaseDryRun.v1';
  command: 'release.dryRun';
  mode: 'dry-run';
  ok: boolean;
  current: {
    packageName: string;
    packageVersion: string;
    gitCommit?: string;
  };
  releaseTargets: {
    primary: 'npm-package';
    secondary: 'github-release';
    dockerImage: 'deferred';
  };
  checks: Array<{
    code: string;
    name: string;
    status: 'passed' | 'warning' | 'error';
    summary: string;
  }>;
  evidence: Array<{
    code: 'PACKAGE_SMOKE_EVIDENCE' | 'CLEAN_CHECKOUT_SMOKE_EVIDENCE' | 'RELEASE_ARTIFACT_EVIDENCE';
    taskId?: string;
    time?: string;
    evidencePath?: string;
    artifactExists: boolean;
    artifactSchemaValid?: boolean;
    sourceOk?: boolean;
    category?: string;
    mode?: string;
    result?: string;
    packageVersion?: string;
    gitCommit?: string;
    manifestHash?: string;
  }>;
  plannedSteps: Array<{
    id: string;
    target: 'npm-package' | 'github-release' | 'docker-image';
    willExecute: false;
    requiresApproval: boolean;
    summary: string;
  }>;
  privacy: {
    tokenValuesIncluded: false;
    rawLogsIncluded: false;
    privatePathsIncluded: false;
    publishExecuted: false;
    githubReleaseCreated: false;
    dockerImageBuilt: false;
  };
  issues: Array<{
    severity: 'warning' | 'error';
    code: string;
    message: string;
  }>;
}

interface EvidenceRequirement {
  code: ReleaseDryRunReport['evidence'][number]['code'];
  name: string;
  category: 'package-smoke' | 'clean-checkout-smoke' | 'release-artifact';
  mode: string;
  predicate: (record: ReleaseEvidenceRecord) => boolean;
}

export function createReleaseDryRunReport(projectRoot: string): ReleaseDryRunReport {
  const packageMetadata = readPackageMetadata(projectRoot);
  const gitCommit = readCurrentGitCommit(projectRoot);
  const releaseGate = createReleaseGateReport(projectRoot, 'strict');
  const evidenceRecords = readReleaseEvidenceRecords(projectRoot);
  const evidence = evidenceRequirements().map((requirement) => validateEvidenceRequirement(evidenceRecords, requirement));
  const checks = [
    {
      code: 'STRICT_RELEASE_GATE',
      name: 'Strict release gate',
      status: releaseGate.ok ? ('passed' as const) : ('error' as const),
      summary: releaseGate.ok ? 'Strict read-only release gate passes before release dry-run planning.' : 'Strict read-only release gate must pass before release dry-run planning.'
    },
    ...evidence.map((item) => ({
      code: item.code,
      name: evidenceName(item.code),
      status: evidenceCheckPassed(item, packageMetadata.version, gitCommit) ? ('passed' as const) : ('error' as const),
      summary: evidenceSummary(item, packageMetadata.version, gitCommit)
    })),
    {
      code: 'RELEASE_TARGETS',
      name: 'Release target plan',
      status: 'passed' as const,
      summary: 'Dry-run plans npm package first, GitHub Release second, and keeps Docker image publishing deferred.'
    }
  ];
  const issues: ReleaseDryRunReport['issues'] = checks
    .filter((check) => check.status !== 'passed')
    .map((check) => ({
      severity: check.status === 'error' ? ('error' as const) : ('warning' as const),
      code: `${check.code}_NOT_READY`,
      message: `${check.name}: ${check.summary}`
    }));

  const report: ReleaseDryRunReport = {
    schemaVersion: 'hadara.releaseDryRun.v1',
    command: 'release.dryRun',
    mode: 'dry-run',
    ok: checks.every((check) => check.status !== 'error'),
    current: {
      packageName: packageMetadata.name,
      packageVersion: packageMetadata.version,
      ...(gitCommit ? { gitCommit } : {})
    },
    releaseTargets: {
      primary: 'npm-package',
      secondary: 'github-release',
      dockerImage: 'deferred'
    },
    checks,
    evidence,
    plannedSteps: [
      {
        id: 'npm-publish',
        target: 'npm-package',
        willExecute: false,
        requiresApproval: true,
        summary: 'Would publish the package only in a later approval-gated release command with NPM_TOKEN presence checks.'
      },
      {
        id: 'github-release',
        target: 'github-release',
        willExecute: false,
        requiresApproval: true,
        summary: 'Would create a GitHub Release with tarball, checksum, and manifest only in a later approval-gated release command.'
      },
      {
        id: 'docker-image',
        target: 'docker-image',
        willExecute: false,
        requiresApproval: true,
        summary: 'Docker image publishing remains deferred unless the product/server runtime surface changes.'
      }
    ],
    privacy: {
      tokenValuesIncluded: false,
      rawLogsIncluded: false,
      privatePathsIncluded: false,
      publishExecuted: false,
      githubReleaseCreated: false,
      dockerImageBuilt: false
    },
    issues
  };

  assertSchema('hadara.releaseDryRun.v1', report);
  return report;
}

export function readCurrentGitCommit(projectRoot: string): string | undefined {
  const gitDir = path.join(projectRoot, '.git');
  try {
    const head = fs.readFileSync(path.join(gitDir, 'HEAD'), 'utf8').trim();
    if (/^[a-f0-9]{40}$/.test(head)) return head;
    const match = /^ref:\s*(.+)$/.exec(head);
    if (!match) return undefined;
    const refPath = path.join(gitDir, match[1]);
    const ref = fs.readFileSync(refPath, 'utf8').trim();
    return /^[a-f0-9]{40}$/.test(ref) ? ref : undefined;
  } catch {
    return undefined;
  }
}

function validateEvidenceRequirement(records: ReleaseEvidenceRecord[], requirement: EvidenceRequirement) {
  const record = records.filter(requirement.predicate).sort((a, b) => b.time.localeCompare(a.time))[0];
  if (!record) {
    return {
      code: requirement.code,
      artifactExists: false
    };
  }
  const artifact = validateReleaseEvidenceArtifact(record);
  return {
    code: requirement.code,
    taskId: record.taskId,
    time: record.time,
    artifactExists: artifact.exists,
    result: record.result,
    ...(record.evidencePath ? { evidencePath: record.evidencePath } : {}),
    ...(artifact.schemaValid === undefined ? {} : { artifactSchemaValid: artifact.schemaValid }),
    ...(artifact.sourceOk === undefined ? {} : { sourceOk: artifact.sourceOk }),
    ...(artifact.category ? { category: artifact.category } : {}),
    ...(artifact.mode ? { mode: artifact.mode } : {}),
    ...(artifact.packageVersion ? { packageVersion: artifact.packageVersion } : {}),
    ...(artifact.gitCommit ? { gitCommit: artifact.gitCommit } : {}),
    ...(artifact.manifestHash ? { manifestHash: artifact.manifestHash } : {})
  };
}

function evidenceCheckPassed(item: ReleaseDryRunReport['evidence'][number], packageVersion: string, gitCommit: string | undefined): boolean {
  if (item.result !== 'passed') return false;
  if (item.artifactExists !== true || item.artifactSchemaValid !== true || item.sourceOk !== true) return false;
  if (item.code === 'PACKAGE_SMOKE_EVIDENCE' && (item.category !== 'package-smoke' || item.mode !== 'local')) return false;
  if (item.code === 'CLEAN_CHECKOUT_SMOKE_EVIDENCE' && (item.category !== 'clean-checkout-smoke' || item.mode !== 'execute')) return false;
  if (item.code === 'RELEASE_ARTIFACT_EVIDENCE') {
    if (item.category !== 'release-artifact' || item.mode !== 'execute') return false;
    if (item.packageVersion !== packageVersion) return false;
    if (!item.manifestHash) return false;
  }
  if (gitCommit && item.gitCommit && item.gitCommit !== gitCommit) return false;
  return true;
}

function evidenceSummary(item: ReleaseDryRunReport['evidence'][number], packageVersion: string, gitCommit: string | undefined): string {
  if (!item.taskId) return 'No matching passed public evidence record was found.';
  if (!item.artifactExists) return `${item.taskId} at ${item.time} has no linked public evidence artifact.`;
  if (item.artifactSchemaValid !== true) return `${item.taskId} at ${item.time} has a linked artifact, but schema validation failed.`;
  if (item.sourceOk !== true) return `${item.taskId} at ${item.time} has a linked artifact, but source report ok is not true.`;
  if (item.result !== 'passed') return `${item.taskId} at ${item.time} is not a passed evidence record.`;
  if (item.code === 'PACKAGE_SMOKE_EVIDENCE' && (item.category !== 'package-smoke' || item.mode !== 'local')) {
    return `${item.taskId} at ${item.time} does not match expected package-smoke category/mode.`;
  }
  if (item.code === 'CLEAN_CHECKOUT_SMOKE_EVIDENCE' && (item.category !== 'clean-checkout-smoke' || item.mode !== 'execute')) {
    return `${item.taskId} at ${item.time} does not match expected clean-checkout category/mode.`;
  }
  if (item.code === 'RELEASE_ARTIFACT_EVIDENCE') {
    if (item.category !== 'release-artifact' || item.mode !== 'execute') return `${item.taskId} at ${item.time} does not match expected release-artifact category/mode.`;
    if (item.packageVersion !== packageVersion) return `${item.taskId} at ${item.time} package version ${item.packageVersion ?? 'unknown'} does not match current ${packageVersion}.`;
    if (!item.manifestHash) return `${item.taskId} at ${item.time} does not expose a release artifact manifest hash.`;
  }
  if (gitCommit && item.gitCommit && item.gitCommit !== gitCommit) return `${item.taskId} at ${item.time} git commit ${item.gitCommit} does not match current ${gitCommit}.`;
  return `${item.taskId} at ${item.time} has a current schema-valid public artifact.`;
}

function evidenceRequirements(): EvidenceRequirement[] {
  return [
    {
      code: 'PACKAGE_SMOKE_EVIDENCE',
      name: 'Package smoke evidence',
      category: 'package-smoke',
      mode: 'local',
      predicate: (record) =>
        record.result === 'passed' &&
        record.visibility === 'public' &&
        record.evidencePath !== undefined &&
        (includesAll(record.summary, ['package smoke', '--execute']) || includesAny(record.evidencePath, ['artifacts/package-smoke'])) &&
        includesAny(`${record.summary}\n${record.evidencePath}`, ['--attach-evidence', 'artifacts/package-smoke', 'hadara.packageSmoke.v1'])
    },
    {
      code: 'CLEAN_CHECKOUT_SMOKE_EVIDENCE',
      name: 'Clean checkout smoke evidence',
      category: 'clean-checkout-smoke',
      mode: 'execute',
      predicate: (record) =>
        record.result === 'passed' &&
        record.visibility === 'public' &&
        record.evidencePath !== undefined &&
        (includesAll(record.summary, ['smoke clean-checkout', '--execute']) || includesAny(record.evidencePath, ['artifacts/clean-checkout-smoke'])) &&
        includesAny(`${record.summary}\n${record.evidencePath}`, ['--attach-evidence', 'artifacts/clean-checkout-smoke', 'hadara.cleanCheckoutSmoke.v1'])
    },
    {
      code: 'RELEASE_ARTIFACT_EVIDENCE',
      name: 'Release artifact evidence',
      category: 'release-artifact',
      mode: 'execute',
      predicate: (record) =>
        record.result === 'passed' &&
        record.visibility === 'public' &&
        record.evidencePath !== undefined &&
        includesAll(record.summary, ['release artifact', '--execute']) &&
        includesAny(record.summary, ['artifacts/release-artifact', 'hadara.releaseArtifact.v1', 'generated tarball/checksum/manifest'])
    }
  ];
}

function evidenceName(code: string): string {
  return evidenceRequirements().find((requirement) => requirement.code === code)?.name ?? code;
}

function readPackageMetadata(projectRoot: string): { name: string; version: string } {
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
    if (!isRecord(parsed)) return { name: 'unknown', version: 'unknown' };
    return {
      name: typeof parsed.name === 'string' ? parsed.name : 'unknown',
      version: typeof parsed.version === 'string' ? parsed.version : 'unknown'
    };
  } catch {
    return { name: 'unknown', version: 'unknown' };
  }
}

function includesAll(text: string, needles: string[]): boolean {
  return needles.every((needle) => text.includes(needle));
}

function includesAny(text: string, needles: string[]): boolean {
  return needles.some((needle) => text.includes(needle));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
