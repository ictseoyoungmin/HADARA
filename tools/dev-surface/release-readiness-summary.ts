import type { ReleaseDryRunReport } from './release-dry-run';
import type { GitFreshnessChecker } from './release-evidence-validation';
import { evidenceCheckPassed } from './release-evidence-validation';

export function createReadinessSummary(
  checks: ReleaseDryRunReport['checks'],
  evidence: ReleaseDryRunReport['evidence'],
  packageVersion: string,
  gitCommit: string | undefined,
  gitFreshness: GitFreshnessChecker,
  releaseInputHash: string | undefined
): ReleaseDryRunReport['readiness'] {
  const blockers = checks.filter((check) => check.status === 'error').length;
  const warnings = checks.filter((check) => check.status === 'warning').length;
  return {
    status: blockers === 0 ? 'ready' : 'blocked',
    blockers,
    warnings,
    nextActions: createNextActions(checks, evidence, packageVersion, gitCommit, gitFreshness, releaseInputHash)
  };
}

function createNextActions(
  checks: ReleaseDryRunReport['checks'],
  evidence: ReleaseDryRunReport['evidence'],
  packageVersion: string,
  gitCommit: string | undefined,
  gitFreshness: GitFreshnessChecker,
  releaseInputHash: string | undefined
): ReleaseDryRunReport['readiness']['nextActions'] {
  const actions: ReleaseDryRunReport['readiness']['nextActions'] = [];
  if (checks.some((check) => check.code === 'STRICT_RELEASE_GATE' && check.status === 'error')) {
    actions.push({
      id: 'resolve-strict-release-gate',
      required: true,
      command: 'node --import tsx tools/dev-surfaces.ts release gate --mode strict --json',
      reason: 'STRICT_RELEASE_GATE_NOT_READY',
      summary: 'Run the strict release gate and resolve its blocking checks before release planning.'
    });
  }

  const packageSmoke = evidence.find((item) => item.code === 'PACKAGE_SMOKE_EVIDENCE');
  if (!evidenceCheckPassed(packageSmoke ?? { code: 'PACKAGE_SMOKE_EVIDENCE', artifactExists: false }, packageVersion, gitCommit, gitFreshness, releaseInputHash)) {
    actions.push({
      id: 'refresh-package-smoke-evidence',
      required: true,
      command: 'node --import tsx tools/dev-surfaces.ts smoke package --execute --attach-evidence --task <task-id> --json',
      reason: 'PACKAGE_SMOKE_EVIDENCE_NOT_READY',
      summary: 'Refresh package smoke evidence with a schema-valid public reduced artifact.'
    });
  }

  const cleanCheckout = evidence.find((item) => item.code === 'CLEAN_CHECKOUT_SMOKE_EVIDENCE');
  if (!evidenceCheckPassed(cleanCheckout ?? { code: 'CLEAN_CHECKOUT_SMOKE_EVIDENCE', artifactExists: false }, packageVersion, gitCommit, gitFreshness, releaseInputHash)) {
    actions.push({
      id: 'refresh-clean-checkout-smoke-evidence',
      required: true,
      command: 'node --import tsx tools/dev-surfaces.ts smoke clean-checkout --execute --attach-evidence --task <task-id> --json',
      reason: 'CLEAN_CHECKOUT_SMOKE_EVIDENCE_NOT_READY',
      summary: 'Refresh clean-checkout smoke evidence with a schema-valid public reduced artifact.'
    });
  }

  const releaseArtifact = evidence.find((item) => item.code === 'RELEASE_ARTIFACT_EVIDENCE');
  if (!evidenceCheckPassed(releaseArtifact ?? { code: 'RELEASE_ARTIFACT_EVIDENCE', artifactExists: false }, packageVersion, gitCommit, gitFreshness, releaseInputHash)) {
    actions.push({
      id: 'refresh-release-artifact-evidence',
      required: true,
      command: 'node --import tsx tools/dev-surfaces.ts release artifact --execute --source-root <clean-source> --output <artifact-output> --journal <journal.json> --json',
      reason: 'RELEASE_ARTIFACT_EVIDENCE_NOT_READY',
      summary: 'Build a fresh artifact from clean source, then attach its journal from the evidence root before publish/deploy planning.'
    });
  }

  if (actions.length === 0) {
    actions.push({
      id: 'review-publish-dry-run',
      required: false,
      command: 'node --import tsx tools/dev-surfaces.ts release publish --mode dry-run --json',
      reason: 'RELEASE_DRY_RUN_READY',
      summary: 'Release dry-run is ready; review publish/deploy dry-run gates without executing release mutation.'
    });
  }
  return actions;
}
