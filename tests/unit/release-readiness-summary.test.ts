import { describe, expect, it } from 'vitest';
import { createReadinessSummary } from '../../src/services/release-readiness-summary';
import type { ReleaseDryRunReport } from '../../src/services/release-dry-run';

describe('release readiness summary service', () => {
  it('returns review-publish-dry-run when all checks and evidence pass', () => {
    const readiness = createReadinessSummary(passedChecks(), passedEvidence(), '0.1.0-rc.0', '0123456789abcdef0123456789abcdef01234567', () => true);

    expect(readiness).toEqual({
      status: 'ready',
      blockers: 0,
      warnings: 0,
      nextActions: [
        {
          id: 'review-publish-dry-run',
          required: false,
          command: 'hadara release publish --mode dry-run --json',
          reason: 'RELEASE_DRY_RUN_READY',
          summary: 'Release dry-run is ready; review publish/deploy dry-run gates without executing release mutation.'
        }
      ]
    });
  });

  it('keeps warning checks non-blocking but counted', () => {
    const readiness = createReadinessSummary(
      [...passedChecks(), { code: 'RELEASE_TARGET_CONFIGURATION', name: 'Release target configuration', status: 'warning', summary: 'advisory' }],
      passedEvidence(),
      '0.1.0-rc.0',
      undefined,
      () => true
    );

    expect(readiness).toMatchObject({
      status: 'ready',
      blockers: 0,
      warnings: 1
    });
    expect(readiness.nextActions).toContainEqual(expect.objectContaining({ id: 'review-publish-dry-run', required: false }));
  });

  it('points at release artifact refresh when artifact freshness fails', () => {
    const evidence = passedEvidence().map((item) =>
      item.code === 'RELEASE_ARTIFACT_EVIDENCE'
        ? {
            ...item,
            gitCommit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
          }
        : item
    );

    const readiness = createReadinessSummary(passedChecks(), evidence, '0.1.0-rc.0', '0123456789abcdef0123456789abcdef01234567', () => false);

    expect(readiness.nextActions).toContainEqual(
      expect.objectContaining({
        id: 'refresh-release-artifact-evidence',
        required: true,
        reason: 'RELEASE_ARTIFACT_EVIDENCE_NOT_READY'
      })
    );
  });
});

function passedChecks(): ReleaseDryRunReport['checks'] {
  return [
    {
      code: 'STRICT_RELEASE_GATE',
      name: 'Strict release gate',
      status: 'passed',
      summary: 'passed'
    },
    {
      code: 'RELEASE_TARGETS',
      name: 'Release target plan',
      status: 'passed',
      summary: 'passed'
    }
  ];
}

function passedEvidence(): ReleaseDryRunReport['evidence'] {
  return [
    {
      code: 'PACKAGE_SMOKE_EVIDENCE',
      artifactExists: true,
      artifactSchemaValid: true,
      sourceOk: true,
      result: 'passed',
      category: 'package-smoke',
      mode: 'local',
      providerEcosystem: 'npm'
    },
    {
      code: 'CLEAN_CHECKOUT_SMOKE_EVIDENCE',
      artifactExists: true,
      artifactSchemaValid: true,
      sourceOk: true,
      result: 'passed',
      category: 'clean-checkout-smoke',
      mode: 'execute'
    },
    {
      code: 'RELEASE_ARTIFACT_EVIDENCE',
      artifactExists: true,
      artifactSchemaValid: true,
      sourceOk: true,
      result: 'passed',
      category: 'release-artifact',
      mode: 'execute',
      packageVersion: '0.1.0-rc.0',
      gitCommit: '0123456789abcdef0123456789abcdef01234567',
      manifestHash: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    }
  ];
}
