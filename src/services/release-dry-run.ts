import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { assertSchema } from '../core/schema';
import { createReleaseGateReport } from './operational-debt';
import { isStrictReleaseEvidenceProof, readReleaseEvidenceRecords, ReleaseEvidenceRecord, validateReleaseEvidenceArtifact } from './release-evidence';
import { createReleaseTargetModel, ReleaseProviderCapabilities, ReleaseTargetDescriptor } from './release-targets';

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
    descriptors?: ReleaseTargetDescriptor[];
  };
  providerCapabilities: Record<string, ReleaseProviderCapabilities>;
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

interface EvidenceRequirement {
  code: ReleaseDryRunReport['evidence'][number]['code'];
  name: string;
  category: 'package-smoke' | 'clean-checkout-smoke' | 'release-artifact';
  mode: string;
}

export function createReleaseDryRunReport(projectRoot: string): ReleaseDryRunReport {
  const startedAt = Date.now();
  const generatedAt = new Date().toISOString();
  const timings: ReleaseDryRunReport['diagnostics']['stageTimings'] = [];
  const targetModel = timeStage(timings, 'release-targets', () => createReleaseTargetModel(projectRoot));
  const packageMetadata = {
    name: targetModel.primary.packageName ?? 'unknown',
    version: targetModel.primary.version ?? 'unknown'
  };
  const gitCommit = timeStage(timings, 'git-commit', () => readCurrentGitCommit(projectRoot));
  const releaseGate = timeStage(timings, 'strict-release-gate', () => createReleaseGateReport(projectRoot, 'strict'));
  const evidenceRecords = timeStage(timings, 'release-evidence-scan', () => readReleaseEvidenceRecords(projectRoot));
  const evidence = timeStage(timings, 'release-evidence-validation', () => evidenceRequirements().map((requirement) => validateEvidenceRequirement(evidenceRecords, requirement)));
  const gitFreshness = createGitFreshnessChecker(projectRoot, gitCommit);
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
      status: evidenceCheckPassed(item, packageMetadata.version, gitCommit, gitFreshness) ? ('passed' as const) : ('error' as const),
      summary: evidenceSummary(item, packageMetadata.version, gitCommit, gitFreshness)
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
  applyStageStatuses(timings, releaseGate.ok, checks);
  const readiness = createReadinessSummary(checks, evidence, packageMetadata.version, gitCommit, gitFreshness);
  const diagnostics = createDiagnostics(generatedAt, startedAt, timings);

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
      dockerImage: 'deferred',
      descriptors: targetModel.descriptors
    },
    providerCapabilities: targetModel.providerCapabilities,
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

function timeStage<T>(timings: ReleaseDryRunReport['diagnostics']['stageTimings'], stage: string, fn: () => T): T {
  const startedAt = Date.now();
  try {
    return fn();
  } finally {
    timings.push({
      stage,
      durationMs: Date.now() - startedAt,
      status: 'passed',
      summary: `${stage} completed.`
    });
  }
}

function applyStageStatuses(timings: ReleaseDryRunReport['diagnostics']['stageTimings'], releaseGateOk: boolean, checks: ReleaseDryRunReport['checks']): void {
  const evidenceOk = checks.filter((check) => check.code.endsWith('_EVIDENCE')).every((check) => check.status === 'passed');
  for (const timing of timings) {
    if (timing.stage === 'strict-release-gate' && !releaseGateOk) {
      timing.status = 'error';
      timing.summary = 'Strict release gate completed with blocking checks.';
    } else if (timing.stage === 'release-evidence-validation' && !evidenceOk) {
      timing.status = 'error';
      timing.summary = 'Release evidence validation completed with blocking checks.';
    }
  }
}

function createDiagnostics(
  generatedAt: string,
  startedAt: number,
  stageTimings: ReleaseDryRunReport['diagnostics']['stageTimings']
): ReleaseDryRunReport['diagnostics'] {
  const thresholdMs = 5000;
  return {
    generatedAt,
    durationMs: Date.now() - startedAt,
    stageTimings,
    slowStageWarnings: stageTimings
      .filter((timing) => timing.durationMs >= thresholdMs)
      .map((timing) => ({
        stage: timing.stage,
        durationMs: timing.durationMs,
        thresholdMs,
        summary: `${timing.stage} took ${timing.durationMs}ms; inspect this stage before treating release dry-run latency as a packaging problem.`
      }))
  };
}

function createReadinessSummary(
  checks: ReleaseDryRunReport['checks'],
  evidence: ReleaseDryRunReport['evidence'],
  packageVersion: string,
  gitCommit: string | undefined,
  gitFreshness: GitFreshnessChecker
): ReleaseDryRunReport['readiness'] {
  const blockers = checks.filter((check) => check.status === 'error').length;
  const warnings = checks.filter((check) => check.status === 'warning').length;
  return {
    status: blockers === 0 ? 'ready' : 'blocked',
    blockers,
    warnings,
    nextActions: createNextActions(checks, evidence, packageVersion, gitCommit, gitFreshness)
  };
}

function createNextActions(
  checks: ReleaseDryRunReport['checks'],
  evidence: ReleaseDryRunReport['evidence'],
  packageVersion: string,
  gitCommit: string | undefined,
  gitFreshness: GitFreshnessChecker
): ReleaseDryRunReport['readiness']['nextActions'] {
  const actions: ReleaseDryRunReport['readiness']['nextActions'] = [];
  if (checks.some((check) => check.code === 'STRICT_RELEASE_GATE' && check.status === 'error')) {
    actions.push({
      id: 'resolve-strict-release-gate',
      required: true,
      command: 'hadara release gate --mode strict --json',
      reason: 'STRICT_RELEASE_GATE_NOT_READY',
      summary: 'Run the strict release gate and resolve its blocking checks before release planning.'
    });
  }

  const packageSmoke = evidence.find((item) => item.code === 'PACKAGE_SMOKE_EVIDENCE');
  if (!evidenceCheckPassed(packageSmoke ?? { code: 'PACKAGE_SMOKE_EVIDENCE', artifactExists: false }, packageVersion, gitCommit, gitFreshness)) {
    actions.push({
      id: 'refresh-package-smoke-evidence',
      required: true,
      command: 'hadara package smoke --execute --attach-evidence --task <task-id> --json',
      reason: 'PACKAGE_SMOKE_EVIDENCE_NOT_READY',
      summary: 'Refresh package smoke evidence with a schema-valid public reduced artifact.'
    });
  }

  const cleanCheckout = evidence.find((item) => item.code === 'CLEAN_CHECKOUT_SMOKE_EVIDENCE');
  if (!evidenceCheckPassed(cleanCheckout ?? { code: 'CLEAN_CHECKOUT_SMOKE_EVIDENCE', artifactExists: false }, packageVersion, gitCommit, gitFreshness)) {
    actions.push({
      id: 'refresh-clean-checkout-smoke-evidence',
      required: true,
      command: 'hadara smoke clean-checkout --execute --attach-evidence --task <task-id> --json',
      reason: 'CLEAN_CHECKOUT_SMOKE_EVIDENCE_NOT_READY',
      summary: 'Refresh clean-checkout smoke evidence with a schema-valid public reduced artifact.'
    });
  }

  const releaseArtifact = evidence.find((item) => item.code === 'RELEASE_ARTIFACT_EVIDENCE');
  if (!evidenceCheckPassed(releaseArtifact ?? { code: 'RELEASE_ARTIFACT_EVIDENCE', artifactExists: false }, packageVersion, gitCommit, gitFreshness)) {
    actions.push({
      id: 'refresh-release-artifact-evidence',
      required: true,
      command: 'hadara release artifact --execute --json --output dist-release --attach-evidence --task <task-id>',
      reason: 'RELEASE_ARTIFACT_EVIDENCE_NOT_READY',
      summary: 'Refresh release artifact evidence for the current package version and git commit before publish/deploy planning.'
    });
  }

  if (actions.length === 0) {
    actions.push({
      id: 'review-publish-dry-run',
      required: false,
      command: 'hadara release publish --mode dry-run --json',
      reason: 'RELEASE_DRY_RUN_READY',
      summary: 'Release dry-run is ready; review publish/deploy dry-run gates without executing release mutation.'
    });
  }
  return actions;
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
  const record = records
    .filter((candidate) => isStrictReleaseEvidenceProof(candidate, { category: requirement.category, mode: requirement.mode }))
    .sort((a, b) => b.time.localeCompare(a.time))[0];
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

type GitFreshnessChecker = (item: ReleaseDryRunReport['evidence'][number]) => boolean;

function evidenceCheckPassed(item: ReleaseDryRunReport['evidence'][number], packageVersion: string, gitCommit: string | undefined, gitFreshness: GitFreshnessChecker): boolean {
  if (item.result !== 'passed') return false;
  if (item.artifactExists !== true || item.artifactSchemaValid !== true || item.sourceOk !== true) return false;
  if (item.code === 'PACKAGE_SMOKE_EVIDENCE' && (item.category !== 'package-smoke' || item.mode !== 'local')) return false;
  if (item.code === 'CLEAN_CHECKOUT_SMOKE_EVIDENCE' && (item.category !== 'clean-checkout-smoke' || item.mode !== 'execute')) return false;
  if (item.code === 'RELEASE_ARTIFACT_EVIDENCE') {
    if (item.category !== 'release-artifact' || item.mode !== 'execute') return false;
    if (item.packageVersion !== packageVersion) return false;
    if (!item.manifestHash) return false;
    if (gitCommit && item.gitCommit && item.gitCommit !== gitCommit && !gitFreshness(item)) return false;
  }
  return true;
}

function evidenceSummary(item: ReleaseDryRunReport['evidence'][number], packageVersion: string, gitCommit: string | undefined, gitFreshness: GitFreshnessChecker): string {
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
    if (gitCommit && item.gitCommit && item.gitCommit !== gitCommit && !gitFreshness(item)) return `${item.taskId} at ${item.time} git commit ${item.gitCommit} does not match current ${gitCommit}.`;
  }
  return `${item.taskId} at ${item.time} has a current schema-valid public artifact.`;
}

function createGitFreshnessChecker(projectRoot: string, currentGitCommit: string | undefined): GitFreshnessChecker {
  return (item) => {
    if (!currentGitCommit || !item.gitCommit || item.gitCommit === currentGitCommit) return true;
    if (item.code !== 'RELEASE_ARTIFACT_EVIDENCE') return false;
    return releaseArtifactInputsUnchangedSince(projectRoot, item.gitCommit, currentGitCommit);
  };
}

function releaseArtifactInputsUnchangedSince(projectRoot: string, artifactGitCommit: string, currentGitCommit: string): boolean {
  const result = spawnSync('git', ['diff', '--name-only', `${artifactGitCommit}..${currentGitCommit}`, '--', 'dist', 'README.md', 'LICENSE', 'package.json'], {
    cwd: projectRoot,
    encoding: 'utf8',
    timeout: 10_000
  });
  return result.status === 0 && result.stdout.trim().length === 0;
}

function evidenceRequirements(): EvidenceRequirement[] {
  return [
    {
      code: 'PACKAGE_SMOKE_EVIDENCE',
      name: 'Package smoke evidence',
      category: 'package-smoke',
      mode: 'local'
    },
    {
      code: 'CLEAN_CHECKOUT_SMOKE_EVIDENCE',
      name: 'Clean checkout smoke evidence',
      category: 'clean-checkout-smoke',
      mode: 'execute'
    },
    {
      code: 'RELEASE_ARTIFACT_EVIDENCE',
      name: 'Release artifact evidence',
      category: 'release-artifact',
      mode: 'execute'
    }
  ];
}

function evidenceName(code: string): string {
  return evidenceRequirements().find((requirement) => requirement.code === code)?.name ?? code;
}
