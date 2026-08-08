import { spawnSync } from 'node:child_process';
import type { ReleaseDryRunReport } from './release-dry-run';
import type { ReleaseEvidenceRecord } from './release-evidence';
import { isStrictReleaseEvidenceProof, validateReleaseEvidenceArtifact } from './release-evidence';

export interface EvidenceRequirement {
  code: ReleaseDryRunReport['evidence'][number]['code'];
  name: string;
  category: 'package-smoke' | 'clean-checkout-smoke' | 'release-artifact';
  mode: string;
  providerEcosystem?: string;
}

export type GitFreshnessChecker = (item: ReleaseDryRunReport['evidence'][number]) => boolean;

export function validateEvidenceRequirement(records: ReleaseEvidenceRecord[], requirement: EvidenceRequirement): ReleaseDryRunReport['evidence'][number] {
  const record = records
    .filter((candidate) => isStrictReleaseEvidenceProof(candidate, { category: requirement.category, mode: requirement.mode, providerEcosystem: requirement.providerEcosystem }))
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
    ...(artifact.providerEcosystem ? { providerEcosystem: artifact.providerEcosystem } : {}),
    ...(artifact.sourceKind ? { sourceKind: artifact.sourceKind } : {}),
    ...(artifact.packageVersion ? { packageVersion: artifact.packageVersion } : {}),
    ...(artifact.gitCommit ? { gitCommit: artifact.gitCommit } : {}),
    ...(artifact.releaseInputHash ? { releaseInputHash: artifact.releaseInputHash } : {}),
    ...(artifact.manifestHash ? { manifestHash: artifact.manifestHash } : {}),
    ...(artifact.tarballSha256 ? { tarballSha256: artifact.tarballSha256 } : {})
  };
}

export function evidenceCheckPassed(
  item: ReleaseDryRunReport['evidence'][number],
  packageVersion: string,
  gitCommit: string | undefined,
  gitFreshness: GitFreshnessChecker,
  releaseInputHash: string | undefined
): boolean {
  if (item.result !== 'passed') return false;
  if (item.artifactExists !== true || item.artifactSchemaValid !== true || item.sourceOk !== true) return false;
  if (!releaseInputHash || item.releaseInputHash !== releaseInputHash) return false;
  if (item.code === 'PACKAGE_SMOKE_EVIDENCE' && (item.category !== 'package-smoke' || item.mode !== 'local' || !npmProviderEvidenceCompatible(item.providerEcosystem))) return false;
  if (item.code === 'CLEAN_CHECKOUT_SMOKE_EVIDENCE' && (item.category !== 'clean-checkout-smoke' || item.mode !== 'execute')) return false;
  if (item.code === 'RELEASE_ARTIFACT_EVIDENCE') {
    if (item.category !== 'release-artifact' || item.mode !== 'execute') return false;
    if (item.packageVersion !== packageVersion) return false;
    if (!item.manifestHash) return false;
    if (gitCommit && item.gitCommit && item.gitCommit !== gitCommit && !gitFreshness(item)) return false;
  }
  return true;
}

export function packageTarballMatchesReleaseArtifact(
  packageSmoke: ReleaseDryRunReport['evidence'][number] | undefined,
  releaseArtifact: ReleaseDryRunReport['evidence'][number] | undefined
): boolean {
  if (!packageSmoke || packageSmoke.sourceKind !== 'tarball') return false;
  return Boolean(packageSmoke.tarballSha256 && releaseArtifact?.tarballSha256 && packageSmoke.tarballSha256 === releaseArtifact.tarballSha256);
}

export function evidenceSummary(
  item: ReleaseDryRunReport['evidence'][number],
  packageVersion: string,
  gitCommit: string | undefined,
  gitFreshness: GitFreshnessChecker,
  releaseInputHash: string | undefined
): string {
  if (!item.taskId) return 'No matching passed public evidence record was found.';
  if (!item.artifactExists) return `${item.taskId} at ${item.time} has no linked public evidence artifact.`;
  if (item.artifactSchemaValid !== true) return `${item.taskId} at ${item.time} has a linked artifact, but schema validation failed.`;
  if (item.sourceOk !== true) return `${item.taskId} at ${item.time} has a linked artifact, but source report ok is not true.`;
  if (item.result !== 'passed') return `${item.taskId} at ${item.time} is not a passed evidence record.`;
  if (!releaseInputHash || item.releaseInputHash !== releaseInputHash) return `${item.taskId} at ${item.time} release input hash does not match current source inputs.`;
  if (item.code === 'PACKAGE_SMOKE_EVIDENCE' && (item.category !== 'package-smoke' || item.mode !== 'local' || !npmProviderEvidenceCompatible(item.providerEcosystem))) {
    return `${item.taskId} at ${item.time} does not match expected npm package-smoke category/mode/provider.`;
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
  if (!item.releaseInputHash) return `${item.taskId} at ${item.time} does not expose a release input hash.`;
  return `${item.taskId} at ${item.time} has a current schema-valid public artifact.`;
}

export function createGitFreshnessChecker(projectRoot: string, currentGitCommit: string | undefined): GitFreshnessChecker {
  return (item) => {
    if (!currentGitCommit || !item.gitCommit || item.gitCommit === currentGitCommit) return true;
    if (item.code !== 'RELEASE_ARTIFACT_EVIDENCE') return false;
    return releaseArtifactInputsUnchangedSince(projectRoot, item.gitCommit, currentGitCommit);
  };
}

export function evidenceRequirements(): EvidenceRequirement[] {
  return [
    {
      code: 'PACKAGE_SMOKE_EVIDENCE',
      name: 'Package smoke evidence',
      category: 'package-smoke',
      mode: 'local',
      providerEcosystem: 'npm'
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

export function evidenceName(code: string): string {
  return evidenceRequirements().find((requirement) => requirement.code === code)?.name ?? code;
}

function npmProviderEvidenceCompatible(providerEcosystem: string | undefined): boolean {
  return providerEcosystem === 'npm' || providerEcosystem === undefined;
}

function releaseArtifactInputsUnchangedSince(projectRoot: string, artifactGitCommit: string, currentGitCommit: string): boolean {
  const result = spawnSync('git', ['diff', '--name-only', `${artifactGitCommit}..${currentGitCommit}`, '--', 'dist', 'README.md', 'LICENSE', 'package.json'], {
    cwd: projectRoot,
    encoding: 'utf8',
    timeout: 10_000
  });
  return result.status === 0 && result.stdout.trim().length === 0;
}
