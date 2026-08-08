import fs from 'node:fs';
import path from 'node:path';
import { assertSchema } from '../../src/core/schema';
import { startMonotonicTimer } from '../../src/core/timing';
import { createReleaseGateReport } from './operational-debt';
import { createDiagnostics, applyStageStatuses, timeStage } from './release-diagnostics';
import {
  createGitFreshnessChecker,
  evidenceCheckPassed,
  evidenceName,
  evidenceRequirements,
  evidenceSummary,
  packageTarballMatchesReleaseArtifact,
  validateEvidenceRequirement
} from './release-evidence-validation';
import { createProviderAdvisories } from './release-provider-advisories';
import { createReadinessSummary } from './release-readiness-summary';
import { createReleaseTargetConfigurationCheck, readReleaseTargetConfiguration } from './release-target-configuration';
import { readReleaseEvidenceRecords } from './release-evidence';
import { createReleaseTargetModel, ReleaseProviderCapabilities, ReleaseTargetDescriptor } from './release-targets';
import { computeReleaseInputHash } from './release-input';

export interface ReleaseDryRunReport {
  schemaVersion: 'hadara.releaseDryRun.v1';
  command: 'release.dryRun';
  mode: 'dry-run';
  ok: boolean;
  current: {
    packageName: string;
    packageVersion: string;
    gitCommit?: string;
    releaseInputHash?: string;
  };
  releaseTargets: {
    primary: 'npm-package';
    secondary: 'github-release';
    dockerImage: 'deferred';
    descriptors?: ReleaseTargetDescriptor[];
  };
  releaseTargetConfiguration: {
    source: 'default' | 'project-file';
    configPath: '.hadara/release-targets.json';
    effectivePrimaryTarget: 'npm-package';
    requestedPrimaryTarget?: string;
    autoPromotion: false;
    supported: boolean;
    targets: Array<{
      id: 'npm-package' | 'python-package-preview' | 'docker-image';
      role: 'primary' | 'preview' | 'deferred';
      status: 'active' | 'preview' | 'deferred';
    }>;
    issues: Array<{
      severity: 'warning' | 'error';
      code: string;
      message: string;
    }>;
  };
  providerCapabilities: Record<string, ReleaseProviderCapabilities>;
  providerAdvisories: Array<{
    provider: 'python';
    status: 'preview';
    smokeEvidence: 'present' | 'missing' | 'stale';
    blocking: false;
    taskId?: string;
    time?: string;
    evidencePath?: string;
    summary: string;
  }>;
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
    providerEcosystem?: string;
    sourceKind?: string;
    result?: string;
    packageVersion?: string;
    gitCommit?: string;
    releaseInputHash?: string;
    manifestHash?: string;
    tarballSha256?: string;
  }>;
  plannedSteps: Array<{
    id: string;
    target: 'npm-package' | 'github-release' | 'docker-image';
    willExecute: false;
    requiresApproval: boolean;
    summary: string;
  }>;
  readiness: {
    status: 'ready' | 'blocked';
    blockers: number;
    warnings: number;
    nextActions: Array<{
      id: string;
      required: boolean;
      command?: string;
      reason: string;
      summary: string;
    }>;
  };
  diagnostics: {
    generatedAt: string;
    durationMs: number;
    advisories: Array<{
      area: 'release-target-configuration';
      severity: 'warning';
      code: string;
      message: string;
      blocking: false;
    }>;
    stageTimings: Array<{
      stage: string;
      durationMs: number;
      status: 'passed' | 'warning' | 'error';
      summary: string;
    }>;
    slowStageWarnings: Array<{
      stage: string;
      durationMs: number;
      thresholdMs: number;
      summary: string;
    }>;
  };
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

export function createReleaseDryRunReport(projectRoot: string): ReleaseDryRunReport {
  const timer = startMonotonicTimer();
  const generatedAt = new Date().toISOString();
  const timings: ReleaseDryRunReport['diagnostics']['stageTimings'] = [];
  const targetModel = timeStage(timings, 'release-targets', () => createReleaseTargetModel(projectRoot));
  const releaseTargetConfiguration = timeStage(timings, 'release-target-configuration', () => readReleaseTargetConfiguration(projectRoot));
  const packageMetadata = {
    name: targetModel.primary.packageName ?? 'unknown',
    version: targetModel.primary.version ?? 'unknown'
  };
  const gitCommit = timeStage(timings, 'git-commit', () => readCurrentGitCommit(projectRoot));
  const releaseInputHash = timeStage(timings, 'release-input-hash', () => computeReleaseInputHash(projectRoot));
  const releaseGate = timeStage(timings, 'strict-release-gate', () => createReleaseGateReport(projectRoot, 'strict'));
  const evidenceRecords = timeStage(timings, 'release-evidence-scan', () => readReleaseEvidenceRecords(projectRoot));
  const evidence = timeStage(timings, 'release-evidence-validation', () => evidenceRequirements().map((requirement) => validateEvidenceRequirement(evidenceRecords, requirement)));
  const packageSmokeEvidence = evidence.find((item) => item.code === 'PACKAGE_SMOKE_EVIDENCE');
  const releaseArtifactEvidence = evidence.find((item) => item.code === 'RELEASE_ARTIFACT_EVIDENCE');
  const tarballProvenanceCheck = {
    code: 'PACKAGE_TARBALL_PROVENANCE',
    name: 'Package tarball provenance',
    status: packageTarballMatchesReleaseArtifact(packageSmokeEvidence, releaseArtifactEvidence) ? ('passed' as const) : ('error' as const),
    summary: packageTarballMatchesReleaseArtifact(packageSmokeEvidence, releaseArtifactEvidence)
      ? 'Package smoke tarball SHA-256 matches the release artifact tarball SHA-256.'
      : 'Package smoke must expose a tarball SHA-256 matching the release artifact tarball SHA-256.'
  };
  const providerAdvisories = timeStage(timings, 'provider-advisories', () => createProviderAdvisories(evidenceRecords));
  const gitFreshness = createGitFreshnessChecker(projectRoot, gitCommit);
  const releaseTargetConfigurationCheck = createReleaseTargetConfigurationCheck(releaseTargetConfiguration);
  const checks = [
    {
      code: 'STRICT_RELEASE_GATE',
      name: 'Strict release gate',
      status: releaseGate.ok ? ('passed' as const) : ('error' as const),
      summary: releaseGate.ok ? 'Strict read-only release gate passes before release dry-run planning.' : 'Strict read-only release gate must pass before release dry-run planning.'
    },
    ...(releaseTargetConfigurationCheck ? [releaseTargetConfigurationCheck] : []),
    ...evidence.map((item) => ({
      code: item.code,
      name: evidenceName(item.code),
      status: evidenceCheckPassed(item, packageMetadata.version, gitCommit, gitFreshness, releaseInputHash) ? ('passed' as const) : ('error' as const),
      summary: evidenceSummary(item, packageMetadata.version, gitCommit, gitFreshness, releaseInputHash)
    })),
    tarballProvenanceCheck,
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
  applyStageStatuses(timings, releaseGate.ok, checks);
  const readiness = createReadinessSummary(checks, evidence, packageMetadata.version, gitCommit, gitFreshness, releaseInputHash);
  const diagnostics = createDiagnostics(generatedAt, timer, timings, releaseTargetConfiguration);

  const report: ReleaseDryRunReport = {
    schemaVersion: 'hadara.releaseDryRun.v1',
    command: 'release.dryRun',
    mode: 'dry-run',
    ok: checks.every((check) => check.status !== 'error'),
    current: {
      packageName: packageMetadata.name,
      packageVersion: packageMetadata.version,
      ...(gitCommit ? { gitCommit } : {}),
      ...(releaseInputHash ? { releaseInputHash } : {})
    },
    releaseTargets: {
      primary: 'npm-package',
      secondary: 'github-release',
      dockerImage: 'deferred',
      descriptors: targetModel.descriptors
    },
    releaseTargetConfiguration,
    providerCapabilities: targetModel.providerCapabilities,
    providerAdvisories,
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
    readiness,
    diagnostics,
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
