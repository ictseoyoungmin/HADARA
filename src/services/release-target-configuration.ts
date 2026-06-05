import fs from 'node:fs';
import path from 'node:path';
import type { ReleaseDryRunReport } from './release-dry-run';

export function readReleaseTargetConfiguration(projectRoot: string): ReleaseDryRunReport['releaseTargetConfiguration'] {
  const configPath = path.join(projectRoot, '.hadara', 'release-targets.json');
  const base = {
    configPath: '.hadara/release-targets.json' as const,
    effectivePrimaryTarget: 'npm-package' as const,
    autoPromotion: false as const,
    targets: [
      { id: 'npm-package' as const, role: 'primary' as const, status: 'active' as const },
      { id: 'python-package-preview' as const, role: 'preview' as const, status: 'preview' as const },
      { id: 'docker-image' as const, role: 'deferred' as const, status: 'deferred' as const }
    ]
  };
  if (!fs.existsSync(configPath)) {
    return {
      ...base,
      source: 'default',
      supported: true,
      issues: []
    };
  }

  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const requestedPrimaryTarget = isRecord(parsed) && typeof parsed.primaryTarget === 'string' ? parsed.primaryTarget : undefined;
    const issues: ReleaseDryRunReport['releaseTargetConfiguration']['issues'] = [];
    if (requestedPrimaryTarget && requestedPrimaryTarget !== 'npm-package') {
      issues.push({
        severity: 'warning',
        code: 'RELEASE_TARGET_PRIMARY_UNSUPPORTED',
        message: 'Requested release primary target is not supported in preview; effective primary remains npm-package.'
      });
    }
    return {
      ...base,
      source: 'project-file',
      ...(requestedPrimaryTarget ? { requestedPrimaryTarget } : {}),
      supported: issues.length === 0,
      issues
    };
  } catch {
    return {
      ...base,
      source: 'project-file',
      supported: false,
      issues: [
        {
          severity: 'warning',
          code: 'RELEASE_TARGET_CONFIG_INVALID_JSON',
          message: 'Release target configuration preview could not parse .hadara/release-targets.json; effective primary remains npm-package.'
        }
      ]
    };
  }
}

export function createReleaseTargetConfigurationCheck(
  releaseTargetConfiguration: ReleaseDryRunReport['releaseTargetConfiguration']
): ReleaseDryRunReport['checks'][number] | null {
  if (releaseTargetConfiguration.issues.length === 0) return null;
  const plural = releaseTargetConfiguration.issues.length === 1 ? 'advisory' : 'advisories';
  return {
    code: 'RELEASE_TARGET_CONFIGURATION',
    name: 'Release target configuration',
    status: 'warning',
    summary: `${releaseTargetConfiguration.issues.length} non-blocking release target configuration ${plural}; effective primary remains npm-package.`
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
