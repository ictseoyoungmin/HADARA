import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import { createReleaseDryRunReport } from '../../tools/dev-surface/release-dry-run';
import { validateSchema } from '../../src/core/schema';
import { readPythonProjectPreview } from '../../tools/dev-surface/release-targets';
import { computeReleaseInputHash } from '../../tools/dev-surface/release-input';
import { packageTarballMatchesReleaseArtifact } from '../../tools/dev-surface/release-evidence-validation';

const roots: string[] = [];
const commit = '0123456789abcdef0123456789abcdef01234567';

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-release-dry-run-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.mkdirSync(path.join(root, 'src', 'task'), { recursive: true });
  fs.writeFileSync(path.join(root, 'src', 'task', 'task-capsule.ts'), 'export const capsule = "fixture";\n', 'utf8');
  fs.mkdirSync(path.join(root, '.git', 'refs', 'heads'), { recursive: true });
  fs.writeFileSync(path.join(root, '.git', 'HEAD'), 'ref: refs/heads/main\n', 'utf8');
  fs.writeFileSync(path.join(root, '.git', 'refs', 'heads', 'main'), `${commit}\n`, 'utf8');
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('release dry-run', () => {
  it('requires tarball package smoke provenance to match the release artifact', () => {
    const packageSmoke = {
      code: 'PACKAGE_SMOKE_EVIDENCE' as const,
      artifactExists: true,
      sourceKind: 'tarball',
      tarballSha256: 'sha256:' + 'a'.repeat(64)
    };
    const releaseArtifact = {
      code: 'RELEASE_ARTIFACT_EVIDENCE' as const,
      artifactExists: true,
      tarballSha256: 'sha256:' + 'b'.repeat(64)
    };

    expect(packageTarballMatchesReleaseArtifact(packageSmoke, releaseArtifact)).toBe(false);
    expect(packageTarballMatchesReleaseArtifact(packageSmoke, { ...releaseArtifact, tarballSha256: packageSmoke.tarballSha256 })).toBe(true);
  });

  it('cross-checks linked evidence artifacts before reporting release readiness', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    writeStrongEvidence(root);

    const report = createReleaseDryRunReport(root);

    expect(report.ok).toBe(true);
    expect(report.schemaVersion).toBe('hadara.releaseDryRun.v1');
    expect(report.current.gitCommit).toBe(commit);
    expect(report.releaseTargets).toMatchObject({
      primary: 'npm-package',
      secondary: 'github-release',
      dockerImage: 'deferred'
    });
    expect(report.releaseTargetConfiguration).toMatchObject({
      source: 'default',
      configPath: '.hadara/release-targets.json',
      effectivePrimaryTarget: 'npm-package',
      autoPromotion: false,
      supported: true,
      targets: [
        { id: 'npm-package', role: 'primary', status: 'active' },
        { id: 'python-package-preview', role: 'preview', status: 'preview' },
        { id: 'docker-image', role: 'deferred', status: 'deferred' }
      ],
      issues: []
    });
    expect(report.releaseTargets.descriptors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'npm-package',
          ecosystem: 'npm',
          role: 'primary',
          manifestPath: 'package.json',
          packageName: 'hadara',
          version: '0.1.0-rc.0',
          smokeProfile: 'npm-package-smoke',
          publishProvider: 'npm',
          publishDeferred: false
        }),
        expect.objectContaining({
          id: 'github-release',
          ecosystem: 'github-release',
          role: 'secondary',
          status: 'active'
        }),
        expect.objectContaining({
          id: 'docker-image',
          ecosystem: 'docker',
          role: 'deferred',
          status: 'deferred',
          publishDeferred: true
        })
      ])
    );
    expect(report.providerCapabilities).toMatchObject({
      'npm-package': {
        detect: 'supported',
        buildPlan: 'supported',
        smokePlan: 'supported',
        artifactPlan: 'supported',
        publishPlan: 'supported'
      },
      'python-package-preview': {
        detect: 'unsupported',
        buildPlan: 'unsupported',
        smokePlan: 'unsupported',
        artifactPlan: 'unsupported',
        publishPlan: 'unsupported'
      }
    });
    expect(report.providerAdvisories).toContainEqual(
      expect.objectContaining({
        provider: 'python',
        status: 'preview',
        smokeEvidence: 'missing',
        blocking: false,
        summary: expect.stringContaining('advisory because npm remains the active primary release target')
      })
    );
    expect(report.evidence).toContainEqual(
      expect.objectContaining({
        code: 'RELEASE_ARTIFACT_EVIDENCE',
        artifactExists: true,
        artifactSchemaValid: true,
        sourceOk: true,
        category: 'release-artifact',
        mode: 'execute',
        packageVersion: '0.1.0-rc.0',
        gitCommit: commit,
        manifestHash: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      })
    );
    expect(report.readiness).toMatchObject({
      status: 'ready',
      blockers: 0,
      warnings: 0
    });
    expect(report.diagnostics.advisories).toEqual([]);
    expect(report.readiness.nextActions).toContainEqual(
      expect.objectContaining({
        id: 'review-publish-dry-run',
        command: 'node --import tsx tools/dev-surfaces.ts release publish --mode dry-run --json'
      })
    );
    expect(report.diagnostics.stageTimings.map((timing) => timing.stage)).toEqual([
      'release-targets',
      'release-target-configuration',
      'git-commit',
      'release-input-hash',
      'strict-release-gate',
      'release-evidence-scan',
      'release-evidence-validation',
      'provider-advisories'
    ]);
    expect(report.privacy).toMatchObject({
      tokenValuesIncluded: false,
      publishExecuted: false,
      githubReleaseCreated: false,
      dockerImageBuilt: false
    });
    expect(validateSchema('hadara.releaseDryRun.v1', report).ok).toBe(true);
  });

  it('accepts v2 release evidence records with persisted ids', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    writeStrongEvidence(root, { schemaVersion: 'hadara.evidence.v2' });

    const report = createReleaseDryRunReport(root);

    expect(report.ok).toBe(true);
    expect(report.evidence).toContainEqual(
      expect.objectContaining({
        code: 'PACKAGE_SMOKE_EVIDENCE',
        artifactExists: true,
        artifactSchemaValid: true,
        sourceOk: true,
        category: 'package-smoke',
        mode: 'local',
        providerEcosystem: 'npm'
      })
    );
    expect(report.evidence).toContainEqual(
      expect.objectContaining({
        code: 'RELEASE_ARTIFACT_EVIDENCE',
        artifactExists: true,
        artifactSchemaValid: true,
        sourceOk: true,
        category: 'release-artifact',
        mode: 'execute'
      })
    );
  });

  it('does not let Python package-smoke evidence satisfy the npm release gate', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    writeStrongEvidence(root, { packageSmokeProvider: 'python' });

    const report = createReleaseDryRunReport(root);

    expect(report.ok).toBe(false);
    expect(report.providerAdvisories).toContainEqual(
      expect.objectContaining({
        provider: 'python',
        status: 'preview',
        smokeEvidence: 'present',
        blocking: false,
        taskId: 'T-0001',
        evidencePath: 'artifacts/package-smoke/summary.json'
      })
    );
    expect(report.evidence).toContainEqual(
      expect.objectContaining({
        code: 'PACKAGE_SMOKE_EVIDENCE',
        artifactExists: false
      })
    );
    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: 'PACKAGE_SMOKE_EVIDENCE_NOT_READY'
      })
    );
    expect(report.readiness.nextActions).toContainEqual(
      expect.objectContaining({
        id: 'refresh-package-smoke-evidence',
        command: 'node --import tsx tools/dev-surfaces.ts smoke package --execute --attach-evidence --task <task-id> --json'
      })
    );
  });

  it('reports stale Python package-smoke evidence as advisory only', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    writeStrongEvidence(root);
    writePythonSmokeEvidence(root, { result: 'failed' });

    const report = createReleaseDryRunReport(root);

    expect(report.ok).toBe(true);
    expect(report.providerAdvisories).toContainEqual(
      expect.objectContaining({
        provider: 'python',
        status: 'preview',
        smokeEvidence: 'stale',
        blocking: false,
        taskId: 'T-0002',
        summary: expect.stringContaining('advisory because npm remains the active primary release target')
      })
    );
    expect(report.issues).not.toContainEqual(expect.objectContaining({ code: expect.stringContaining('PYTHON') }));
  });

  it('fails when release evidence records do not link schema-valid artifacts', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);

    const taskDir = path.join(root, 'tasks', 'T-0001-weak-evidence');
    fs.mkdirSync(taskDir, { recursive: true });
    fs.writeFileSync(
      path.join(taskDir, 'evidence.jsonl'),
      JSON.stringify({
        schemaVersion: 'hadara.evidence.v1',
        time: '2026-05-28T10:00:00Z',
        taskId: 'T-0001',
        kind: 'command-log',
        summary: 'node --import tsx tools/dev-surfaces.ts smoke package --execute --attach-evidence hadara.packageSmoke.v1',
        result: 'passed',
        visibility: 'public'
      }) + '\n',
      'utf8'
    );

    const report = createReleaseDryRunReport(root);

    expect(report.ok).toBe(false);
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: 'PACKAGE_SMOKE_EVIDENCE',
        status: 'error',
        summary: 'No matching passed public evidence record was found.'
      })
    );
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'PACKAGE_SMOKE_EVIDENCE_NOT_READY', severity: 'error' }));
    expect(report.readiness).toMatchObject({
      status: 'blocked',
      blockers: expect.any(Number)
    });
    expect(report.readiness.nextActions).toContainEqual(
      expect.objectContaining({
        id: 'refresh-package-smoke-evidence',
        command: 'node --import tsx tools/dev-surfaces.ts smoke package --execute --attach-evidence --task <task-id> --json'
      })
    );
  });

  it('points operators at release artifact refresh when commit freshness is stale', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    writeStrongEvidence(root, {
      artifactGitCommit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      releaseInputHash: 'sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
    });

    const report = createReleaseDryRunReport(root);

    expect(report.ok).toBe(false);
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: 'RELEASE_ARTIFACT_EVIDENCE',
        status: 'error',
        summary: expect.stringContaining('does not match current')
      })
    );
    expect(report.readiness.nextActions).toContainEqual(
      expect.objectContaining({
        id: 'refresh-release-artifact-evidence',
        reason: 'RELEASE_ARTIFACT_EVIDENCE_NOT_READY',
        command:
          'node --import tsx tools/dev-surfaces.ts release artifact --execute --source-root <clean-source> --output <artifact-output> --journal <journal.json> --json'
      })
    );
  });

  it('keeps release artifact evidence fresh across evidence-only commits', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-release-dry-run-git-'));
    roots.push(root);
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    writeReleaseReadinessFiles(root);
    runGit(root, ['init']);
    runGit(root, ['config', 'user.email', 'hadara@example.test']);
    runGit(root, ['config', 'user.name', 'HADARA Test']);
    runGit(root, ['add', 'package.json', 'LICENSE', 'docs']);
    runGit(root, ['commit', '-m', 'package inputs']);
    const artifactCommit = gitOutput(root, ['rev-parse', 'HEAD']);
    writeStrongEvidence(root, { artifactGitCommit: artifactCommit });
    runGit(root, ['add', 'tasks']);
    runGit(root, ['commit', '-m', 'release evidence']);

    const report = createReleaseDryRunReport(root);

    expect(report.ok).toBe(true);
    expect(report.current.gitCommit).not.toBe(artifactCommit);
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: 'RELEASE_ARTIFACT_EVIDENCE',
        status: 'passed'
      })
    );
    expect(report.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'PACKAGE_SMOKE_EVIDENCE', status: 'passed' }),
        expect.objectContaining({ code: 'CLEAN_CHECKOUT_SMOKE_EVIDENCE', status: 'passed' })
      ])
    );
    expect(report.readiness).toMatchObject({
      status: 'ready',
      blockers: 0
    });
  });

  it('rejects release evidence after a release input source change', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-release-dry-run-source-drift-'));
    roots.push(root);
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    writeReleaseReadinessFiles(root);
    fs.mkdirSync(path.join(root, 'src', 'task'), { recursive: true });
    fs.writeFileSync(path.join(root, 'src', 'task', 'task-capsule.ts'), 'export const capsule = "fixture";\n', 'utf8');
    runGit(root, ['init']);
    runGit(root, ['config', 'user.email', 'hadara@example.test']);
    runGit(root, ['config', 'user.name', 'HADARA Test']);
    runGit(root, ['add', 'package.json', 'LICENSE', 'docs', 'src']);
    runGit(root, ['commit', '-m', 'package inputs']);
    const inputHash = computeReleaseInputHash(root);
    writeStrongEvidence(root, { artifactGitCommit: gitOutput(root, ['rev-parse', 'HEAD']), releaseInputHash: inputHash });
    fs.writeFileSync(path.join(root, 'src', 'task', 'task-capsule.ts'), 'export const capsule = "changed";\n', 'utf8');
    runGit(root, ['add', 'src']);
    runGit(root, ['commit', '-m', 'source change']);

    const report = createReleaseDryRunReport(root);

    expect(report.ok).toBe(false);
    expect(report.checks.filter((check) => check.code.endsWith('_EVIDENCE'))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'PACKAGE_SMOKE_EVIDENCE', status: 'error' }),
        expect.objectContaining({ code: 'CLEAN_CHECKOUT_SMOKE_EVIDENCE', status: 'error' }),
        expect.objectContaining({ code: 'RELEASE_ARTIFACT_EVIDENCE', status: 'error' })
      ])
    );
  });

  it('detects pyproject.toml as a read-only Python release target preview', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    writeStrongEvidence(root);
    fs.writeFileSync(
      path.join(root, 'pyproject.toml'),
      ['[project]', 'name = "hadara-python-tools"', 'version = "0.0.1"', ''].join('\n'),
      'utf8'
    );

    const report = createReleaseDryRunReport(root);

    expect(report.ok).toBe(true);
    expect(report.releaseTargetConfiguration).toMatchObject({
      effectivePrimaryTarget: 'npm-package',
      autoPromotion: false,
      supported: true
    });
    expect(report.releaseTargets.descriptors).toContainEqual(
      expect.objectContaining({
        id: 'python-package-preview',
        ecosystem: 'python',
        role: 'preview',
        status: 'preview',
        manifestPath: 'pyproject.toml',
        packageName: 'hadara-python-tools',
        version: '0.0.1',
        publishProvider: 'pypi',
        publishDeferred: true,
        smokeProfile: 'python-package-preview',
        buildBackend: 'unknown',
        plannedCommands: [
          expect.objectContaining({ command: 'python -m build', willExecute: false, purpose: 'build' }),
          expect.objectContaining({ command: 'twine check', willExecute: false, purpose: 'check' }),
          expect.objectContaining({ command: 'pip install wheel', willExecute: false, purpose: 'smoke' })
        ]
      })
    );
    expect(report.providerCapabilities['python-package-preview']).toMatchObject({
      detect: 'preview',
      buildPlan: 'preview',
      smokePlan: 'preview',
      artifactPlan: 'preview',
      publishPlan: 'unsupported'
    });
    expect(report.providerCapabilities['python-package-preview'].notes.join('\n')).toContain('Planned Python commands are preview-only');
    expect(report.releaseTargets.primary).toBe('npm-package');
    expect(report.plannedSteps.some((step) => step.target === 'npm-package')).toBe(true);
    expect(report.privacy.publishExecuted).toBe(false);
  });

  it('previews release target config requests without promoting Python primary', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    writeStrongEvidence(root);
    fs.mkdirSync(path.join(root, '.hadara'), { recursive: true });
    fs.writeFileSync(
      path.join(root, '.hadara', 'release-targets.json'),
      JSON.stringify({ primaryTarget: 'python-package-preview', targets: [{ id: 'python-package-preview', role: 'primary' }] }, null, 2),
      'utf8'
    );

    const report = createReleaseDryRunReport(root);

    expect(report.ok).toBe(true);
    expect(report.releaseTargets.primary).toBe('npm-package');
    expect(report.releaseTargetConfiguration).toMatchObject({
      source: 'project-file',
      configPath: '.hadara/release-targets.json',
      requestedPrimaryTarget: 'python-package-preview',
      effectivePrimaryTarget: 'npm-package',
      autoPromotion: false,
      supported: false,
      issues: [
        expect.objectContaining({
          severity: 'warning',
          code: 'RELEASE_TARGET_PRIMARY_UNSUPPORTED'
        })
      ]
    });
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: 'RELEASE_TARGET_CONFIGURATION',
        status: 'warning',
        summary: expect.stringContaining('effective primary remains npm-package')
      })
    );
    expect(report.readiness).toMatchObject({
      status: 'ready',
      blockers: 0,
      warnings: 1
    });
    expect(report.diagnostics.advisories).toContainEqual(
      expect.objectContaining({
        area: 'release-target-configuration',
        severity: 'warning',
        code: 'RELEASE_TARGET_PRIMARY_UNSUPPORTED',
        blocking: false,
        message: expect.stringContaining('effective primary remains npm-package')
      })
    );
    expect(report.issues).toContainEqual(
      expect.objectContaining({
        severity: 'warning',
        code: 'RELEASE_TARGET_CONFIGURATION_NOT_READY'
      })
    );
    expect(report.issues).not.toContainEqual(expect.objectContaining({ code: 'RELEASE_TARGET_PRIMARY_UNSUPPORTED' }));
    expect(report.readiness.nextActions).toContainEqual(
      expect.objectContaining({
        id: 'review-publish-dry-run',
        required: false
      })
    );
    expect(validateSchema('hadara.releaseDryRun.v1', report).ok).toBe(true);
  });

  it('surfaces invalid release target config JSON as a non-blocking diagnostic advisory', () => {
    const root = tempProject();
    writeReleaseReadinessFiles(root);
    writeStrongEvidence(root);
    fs.mkdirSync(path.join(root, '.hadara'), { recursive: true });
    fs.writeFileSync(path.join(root, '.hadara', 'release-targets.json'), '{ "primaryTarget": ', 'utf8');

    const report = createReleaseDryRunReport(root);

    expect(report.ok).toBe(true);
    expect(report.releaseTargets.primary).toBe('npm-package');
    expect(report.releaseTargetConfiguration).toMatchObject({
      source: 'project-file',
      effectivePrimaryTarget: 'npm-package',
      autoPromotion: false,
      supported: false,
      issues: [
        expect.objectContaining({
          severity: 'warning',
          code: 'RELEASE_TARGET_CONFIG_INVALID_JSON'
        })
      ]
    });
    expect(report.checks).toContainEqual(
      expect.objectContaining({
        code: 'RELEASE_TARGET_CONFIGURATION',
        status: 'warning'
      })
    );
    expect(report.readiness).toMatchObject({
      status: 'ready',
      blockers: 0,
      warnings: 1
    });
    expect(report.diagnostics.advisories).toContainEqual(
      expect.objectContaining({
        area: 'release-target-configuration',
        code: 'RELEASE_TARGET_CONFIG_INVALID_JSON',
        blocking: false
      })
    );
    expect(validateSchema('hadara.releaseDryRun.v1', report).ok).toBe(true);
  });

  it('parses Python project metadata and common build backends without executing tooling', () => {
    const cases = [
      {
        text: ['[project]', 'name = "setuptools-pkg"', 'version = "1.2.3"', '[build-system]', 'requires = ["setuptools>=68", "wheel"]', ''].join('\n'),
        expectedName: 'setuptools-pkg',
        expectedVersion: '1.2.3',
        expectedBackend: 'setuptools'
      },
      {
        text: ['[tool.poetry]', 'name = "poetry-pkg"', 'version = "2.0.0"', '[build-system]', 'build-backend = "poetry.core.masonry.api"', ''].join('\n'),
        expectedName: 'poetry-pkg',
        expectedVersion: '2.0.0',
        expectedBackend: 'poetry'
      },
      {
        text: ['[project]', 'name = "hatch-pkg"', '[build-system]', 'requires = ["hatchling"]', ''].join('\n'),
        expectedName: 'hatch-pkg',
        expectedBackend: 'hatch'
      },
      {
        text: ['[project]', 'name = "flit-pkg"', '[build-system]', 'build-backend = "flit_core.buildapi"', ''].join('\n'),
        expectedName: 'flit-pkg',
        expectedBackend: 'flit'
      }
    ];

    for (const item of cases) {
      const root = tempProject();
      fs.writeFileSync(path.join(root, 'pyproject.toml'), item.text, 'utf8');

      expect(readPythonProjectPreview(root)).toMatchObject({
        detected: true,
        packageName: item.expectedName,
        ...(item.expectedVersion ? { version: item.expectedVersion } : {}),
        buildBackend: item.expectedBackend
      });
    }
  });
});

function writeStrongEvidence(
  root: string,
  options: { schemaVersion?: 'hadara.evidence.v1' | 'hadara.evidence.v2'; artifactGitCommit?: string; releaseInputHash?: string; packageSmokeProvider?: 'npm' | 'python' } = {}
): void {
  const taskDir = path.join(root, 'tasks', 'T-0001-release-evidence');
  const artifactDir = path.join(taskDir, 'artifacts');
  fs.mkdirSync(path.join(artifactDir, 'package-smoke'), { recursive: true });
  fs.mkdirSync(path.join(artifactDir, 'clean-checkout-smoke'), { recursive: true });
  fs.mkdirSync(path.join(artifactDir, 'release-artifact'), { recursive: true });
  const releaseInputHash = options.releaseInputHash ?? computeReleaseInputHash(root) ?? 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

  writeJson(path.join(artifactDir, 'package-smoke', 'summary.json'), smokeSummary('package-smoke', 'package.smoke', 'local', options.packageSmokeProvider ?? 'npm', releaseInputHash));
  writeJson(path.join(artifactDir, 'clean-checkout-smoke', 'summary.json'), smokeSummary('clean-checkout-smoke', 'smoke.clean-checkout', 'execute', undefined, releaseInputHash));
  writeJson(path.join(artifactDir, 'release-artifact', 'report.json'), releaseArtifactReport(options.artifactGitCommit, releaseInputHash));

  const records = [
    evidenceRecord(
      '2026-05-28T10:00:00Z',
      'Reduced public evidence attached for release readiness.',
      'artifacts/package-smoke/summary.json',
      options.schemaVersion
    ),
    evidenceRecord(
      '2026-05-28T10:01:00Z',
      'Reduced public evidence attached for release readiness.',
      'artifacts/clean-checkout-smoke/summary.json',
      options.schemaVersion
    ),
    evidenceRecord(
      '2026-05-28T10:02:00Z',
      'Reduced public evidence attached for release readiness.',
      'artifacts/release-artifact/report.json',
      options.schemaVersion
    )
  ];
  fs.writeFileSync(path.join(taskDir, 'evidence.jsonl'), records.map((record) => JSON.stringify(record)).join('\n') + '\n', 'utf8');
}

function evidenceRecord(time: string, summary: string, evidencePath: string, schemaVersion: 'hadara.evidence.v1' | 'hadara.evidence.v2' = 'hadara.evidence.v1'): Record<string, unknown> {
  if (schemaVersion === 'hadara.evidence.v2') {
    return {
      schemaVersion: 'hadara.evidence.v2',
      id: `ev:T-0001:${evidencePath.replace(/[^a-z0-9]/gi, '').slice(0, 24).padEnd(24, '0')}`,
      fingerprint: 'sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      idSource: 'persisted',
      idStability: 'durable',
      time,
      taskId: 'T-0001',
      category: 'release',
      outcome: 'passed',
      visibility: 'public',
      summary,
      artifacts: [{ path: evidencePath, visibility: 'public', artifactType: 'command-log' }],
      tags: [],
      legacy: {
        kind: 'command-log',
        result: 'passed',
        evidencePath
      }
    };
  }
  return {
    schemaVersion: 'hadara.evidence.v1',
    time,
    taskId: 'T-0001',
    kind: 'command-log',
    summary,
    result: 'passed',
    visibility: 'public',
    evidencePath
  };
}

function writePythonSmokeEvidence(root: string, options: { result: 'passed' | 'failed' }): void {
  const taskDir = path.join(root, 'tasks', 'T-0002-python-smoke-evidence');
  const artifactDir = path.join(taskDir, 'artifacts', 'package-smoke');
  fs.mkdirSync(artifactDir, { recursive: true });
  writeJson(path.join(artifactDir, 'summary.json'), smokeSummary('package-smoke', 'package.smoke', 'local', 'python'));
  fs.writeFileSync(
    path.join(taskDir, 'evidence.jsonl'),
    JSON.stringify({
      schemaVersion: 'hadara.evidence.v1',
      time: '2026-05-28T11:00:00Z',
      taskId: 'T-0002',
      kind: 'command-log',
      summary: 'Python package smoke advisory evidence.',
      result: options.result,
      visibility: 'public',
      evidencePath: 'artifacts/package-smoke/summary.json'
    }) + '\n',
    'utf8'
  );
}

function smokeSummary(category: 'package-smoke' | 'clean-checkout-smoke', command: string, mode: string, providerEcosystem?: 'npm' | 'python', releaseInputHash = 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'): Record<string, unknown> {
  return {
    schemaVersion: 'hadara.smokeEvidenceSummary.v1',
    time: '2026-05-28T10:00:00Z',
    taskId: 'T-0001',
    category,
    gitCommit: commit,
    sourceReport: {
      schemaVersion: category === 'package-smoke' ? 'hadara.packageSmoke.v1' : 'hadara.cleanCheckoutSmoke.v1',
      command,
      mode,
      ok: true,
      source: { releaseInputHash },
      ...(providerEcosystem
        ? {
            provider: {
              ecosystem: providerEcosystem,
              smokeProfile: providerEcosystem === 'python' ? 'python-package-smoke' : 'npm-package-smoke',
              command: 'package.smoke'
            }
          }
        : {})
    },
    execution: {},
    steps: [{ id: 'step', label: 'Step', status: 'passed', summary: 'passed' }],
    privacy: {
      rawLogsIncluded: false,
      rawPackageContentsIncluded: false,
      privatePathsIncluded: false,
      environmentSecretsIncluded: false,
      privateStorePathsIncluded: false
    },
    issues: [],
    rawLogsIncluded: false,
    privatePathsIncluded: false,
    rawPackageContentsIncluded: false
  };
}

function releaseArtifactReport(gitCommit = commit, releaseInputHash = 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'): Record<string, unknown> {
  return {
    schemaVersion: 'hadara.releaseArtifact.v1',
    command: 'release.artifact',
    ok: true,
    mode: 'execute',
    execution: {
      sourceBuildExecuted: true,
      builtCliVersionVerified: true,
      stagingCreated: true,
      npmPackExecuted: true,
      checksumGenerated: true,
      manifestGenerated: true,
      packageContentsVerified: true,
      publishExecuted: false,
      githubReleaseCreated: false,
      dockerImageBuilt: false
    },
    output: {
      kind: 'explicit',
      displayPath: './dist-release',
      pathRedacted: true,
      relativePath: 'dist-release',
      retention: 'explicit-output'
    },
    package: {
      name: 'hadara',
      version: '0.1.0-rc.0',
      private: false,
      filesWhitelistApplied: true
    },
    artifacts: [
      {
        kind: 'manifest',
        visibility: 'local',
        fileName: 'hadara.tgz.manifest.json',
        relativePath: 'dist-release/hadara.tgz.manifest.json',
        pathRedacted: true,
        byteLength: 100,
        hash: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        rawContentIncluded: false
      }
    ],
    packageContents: {
      verified: true,
      fileCount: 4,
      allowedRoots: ['dist/', 'README.md', 'LICENSE', 'package.json'],
      requiredFiles: ['package.json', 'README.md', 'LICENSE', 'dist/cli/main.js'],
      forbiddenMatches: []
    },
    privacy: {
      rawLogsIncluded: false,
      packageContentsIncluded: false,
      privatePathsIncluded: false,
      environmentSecretsIncluded: false,
      privateStorePathsIncluded: false
    },
    source: {
      gitCommit,
      releaseInputHash,
      pathRedacted: true
    },
    evidence: {
      gitCommit
    },
    issues: []
  };
}

function writeJson(filePath: string, value: Record<string, unknown>): void {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function runGit(root: string, args: string[]): void {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  }
}

function gitOutput(root: string, args: string[]): string {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}

function writeReleaseReadinessFiles(root: string): void {
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify({
      name: 'hadara',
      version: '0.1.0-rc.0',
      private: false,
      license: 'MIT',
      bin: { hadara: './dist/cli/main.js' },
      files: ['dist/', 'README.md', 'LICENSE', 'package.json'],
      scripts: {
        build: 'tsc -p tsconfig.json',
        test: 'vitest run',
        'test:contract': 'vitest run tests/contract',
        'test:harness': 'vitest run tests/harness',
        check: 'npm run build && npm test'
      },
      devDependencies: { '@types/node': '^22.10.2' }
    }),
    'utf8'
  );
  fs.mkdirSync(path.join(root, '.github', 'workflows'), { recursive: true });
  fs.writeFileSync(path.join(root, '.github', 'workflows', 'ci.yml'), 'uses: actions/setup-node@v4\nnode-version: 22\nrun: npm ci\nrun: npm run check\n', 'utf8');
  fs.writeFileSync(path.join(root, 'LICENSE'), 'MIT\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), 'clean checkout smoke\ncontextPath: null\nwithout writing generated context files\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'ARCHITECTURE.md'), 'TUI cache is ignored machine-local state under .hadara/local/tui/.\n', 'utf8');
  fs.mkdirSync(path.join(root, 'docs', 'design'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'docs', 'design', 'TUI_DESIGN_NOTES.md'),
    'TUI cache is machine-local and ignored state under .hadara/local/tui/.\n',
    'utf8'
  );
  fs.writeFileSync(
    path.join(root, 'docs', 'RELEASE_READINESS.md'),
    [
      'Clean Checkout Package Smoke Plan',
      'npm ci',
      'npm run build',
      'npm run check',
      'node dist/cli/main.js doctor --json',
      'node dist/cli/main.js task status --json',
      'node dist/cli/main.js release gate --mode strict --json',
      'no packaging or release execution',
      'Executable Package Smoke Artifact Boundary',
      'Allowed workspace',
      '/tmp/hadara-package-smoke/<run-id>',
      'Package artifact paths',
      'tasks/<task-id>/artifacts/package-smoke/',
      'Redaction and audit handling',
      'Evidence/report shape',
      'hadara.packageSmoke.v1',
      'performs no package-smoke execution',
      'Package Smoke Command Surface',
      'node --import tsx tools/dev-surfaces.ts smoke package --dry-run --json',
      'node --import tsx tools/dev-surfaces.ts smoke package --task <task-id> --json',
      'node --import tsx tools/dev-surfaces.ts smoke package --workspace /tmp/hadara-package-smoke/<run-id> --json',
      'node --import tsx tools/dev-surfaces.ts smoke package --from ./dist-release/hadara-0.1.0-rc.0.tgz --json',
      'node --import tsx tools/dev-surfaces.ts smoke package --keep-temp --json',
      'Do not use `release smoke` as the primary command surface',
      '`--timeout <seconds>`',
      '`--attach-evidence`',
      '`--private-logs`',
      'Package smoke must not be callable from MCP by default',
      'The release gate must not call `node --import tsx tools/dev-surfaces.ts smoke package`',
      'Remote CI observation',
      'local Docker validation remains the primary reproducible check',
      'GitHub Actions CI run succeeded: https://github.com/example/project/actions/runs/123',
      'actions/runs/123',
      'Package Metadata Release Readiness',
      'Package name decision: `hadara`',
      'npm registry observation:',
      'Current version is `0.1.0-rc.0`',
      'Current package is `private: false`',
      'Current binary remains `bin.hadara` at `./dist/cli/main.js`',
      'Current `files` whitelist is `dist/`, `README.md`, `LICENSE`, and `package.json`',
      'Bootstrap metadata mode: version `0.0.0-bootstrap`, `private: true`, no package publishability',
      'Release-candidate metadata mode: version `0.x.y-rc.N`, `private: false`, `files` whitelist present, `LICENSE` present, package smoke evidence present',
      'Scoped fallback decision: do not silently switch names',
      'Version policy:',
      'T-0142 transitions `private` to false only after the package files whitelist, root README, license decision, and package-smoke evidence gates exist',
      'Final `files` whitelist target: `dist/`, `README.md`, `LICENSE`, `package.json`, plus installer and portable files only after those files exist',
      'Do not add `files` entries for missing installer or portable paths in T-0127',
      'MIT license decision: adopt MIT; `LICENSE` exists and is included in the package whitelist',
      'Publish target decision: npm package first, GitHub Release second, Docker image deferred',
      'Installed CLI verification must use `hadara doctor --json`',
      'T-0142 performs no publish, no GitHub Release creation, no Docker image build, and no registry mutation; it transitions metadata and regenerates reduced release evidence only',
      'Before adding more T-0128+ release/install/package-smoke readiness markers, prefer moving the structured readiness source to `docs/RELEASE_READINESS.md` or `docs/release-readiness.json`',
      'CI Release Workflow Target Decision',
      'Primary release target: npm package',
      'Secondary release target: GitHub Release with tarball, checksum, and manifest',
      'Deferred release target: Docker image',
      'npm publish token name: `NPM_TOKEN`',
      'GitHub Release token name: `GITHUB_TOKEN` or `HADARA_GITHUB_RELEASE_TOKEN`',
      'Token values must never be written to repository files, public evidence, release artifacts, logs, manifests, or context export',
      'Publish/deploy remains explicit approval only',
      'T-0139 performs no publish, no GitHub Release creation, no Docker image build, no registry mutation, no GitHub API call, and no token loading',
      'Evidence freshness must compare evidence to the release candidate window',
      'Evidence cross-check should follow this order: record exists, artifact exists, artifact schema valid, `sourceReport.ok` true when present, category/mode/result match the expected check',
      'Release artifact evidence flow must be explicit: run `hadara release artifact --execute --json --output dist-release`',
      'Installer Script Surface and Schema',
      '`scripts/install.sh`',
      '`scripts/install.ps1`',
      '`portable/bin/hadara`',
      '`portable/bin/hadara.cmd`',
      '`portable/bin/hadara.ps1`',
      'Installer scripts install or plan installation from a tarball or directory',
      'Installer scripts must support dry-run planning before mutation',
      'Installer scripts must emit `hadara.install.plan.v1` JSON for dry-run planning',
      'Installer scripts must not use `sudo` by default',
      'Installer scripts must not force `npm install -g`',
      'Installer scripts must not mutate shell profiles or PATH by default',
      'Portable launchers invoke an installed or portable HADARA bundle',
      'Portable launchers do not install dependencies',
      'Portable launchers do not mutate PATH',
      'Portable launchers do not modify project files',
      'Linux/POSIX/WSL prefix suggestion: `~/.local/share/hadara`',
      'Linux/POSIX/WSL bin link suggestion: `~/.local/bin/hadara`',
      'Windows prefix suggestion: `%LOCALAPPDATA%\\HADARA`',
      'Windows cmd launcher suggestion: `%LOCALAPPDATA%\\HADARA\\bin\\hadara.cmd`',
      'Windows PowerShell launcher suggestion: `%LOCALAPPDATA%\\HADARA\\bin\\hadara.ps1`',
      'Default POSIX/WSL/Windows install paths are suggestions, not silent decisions',
      'Windows USB portable root: user-selected removable drive, for example `L:\\HADARA`',
      'WSL USB portable root for `--platform usb`: user-selected mounted removable drive, for example `/mnt/l/HADARA`',
      'The drive letter or mount path must not be assumed',
      'USB install roots must be explicitly provided',
      '`--platform wsl` uses Linux-style default install suggestions',
      'Installer plans must validate Node 22',
      'WSL install plans must reject Windows `node.exe` shims',
      'Schema id: `hadara.install.plan.v1`',
      'Target paths must be public path references, not raw absolute path strings',
      '`target.prefix.pathRedacted: true` is required for public install-plan output',
      '`target.launcher.pathRedacted: true` is required for public install-plan output',
      '`source.pathRedacted: true` is required when source path details appear in public install-plan output',
      '`execution.executeEnabled` must state whether mutation is available to the current command implementation',
      '`mode: execute` is schema-reserved only until an explicit later capsule implements mutation',
      'T-0129 dry-run implementation must reject execute mode or return `INSTALL_EXECUTION_DISABLED`',
      'The schema fixture documents a future execute mode but does not authorize installer execution',
      'The release gate checks installer surface and schema markers only',
      'The release gate must not execute `scripts/install.sh`',
      'The release gate must not execute `scripts/install.ps1`',
      'Install Matrix Smoke Plan',
      'T-0130 defines install-matrix smoke planning only',
      'Matrix row: Linux source checkout',
      'Matrix row: Linux package install',
      'Matrix row: WSL source checkout',
      'Matrix row: Windows source checkout',
      'Matrix row: Windows package install',
      'Matrix row: USB portable on Windows',
      'Matrix row: USB portable on WSL',
      'Matrix row: installed CLI major-feature smoke',
      'Docker/Linux validation does not replace real Windows validation',
      'USB rows must require explicit user-selected USB roots',
      'Package-install rows are blocked until package smoke and release artifacts exist',
      'Matrix evidence must record platform, source kind, installer/package form, command form, and reduced public result',
      'Raw logs and private paths must stay temporary or private/local',
      'The release gate must not execute install matrix smoke'
    ].join('\n'),
    'utf8'
  );
}
