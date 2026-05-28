import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handlePackageCommand } from '../../src/cli/package-smoke';
import { resolveHadaraPaths } from '../../src/core/paths';
import { validateSchema } from '../../src/core/schema';
import { createPackageSmokeDryRunReport } from '../../src/services/package-smoke';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-package-smoke-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'tasks', 'T-0133-package-smoke-dry-run-implementation'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(
      {
        name: 'hadara',
        version: '0.0.0-bootstrap',
        private: true,
        bin: {
          hadara: './dist/cli/main.js'
        }
      },
      null,
      2
    ),
    'utf8'
  );
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = undefined;
  for (const root of roots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('package smoke dry-run', () => {
  it('creates a schema-valid dry-run report without package execution', () => {
    const root = tempProject();
    const report = createPackageSmokeDryRunReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      taskId: 'T-0133',
      attachEvidence: true,
      workspace: 'tmp/package-smoke',
      timeoutSeconds: 60
    });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.packageSmoke.v1',
      command: 'package.smoke',
      ok: true,
      mode: 'dry-run',
      readOnly: true,
      execution: {
        npmPackExecuted: false,
        packageInstallExecuted: false,
        featureSmokeExecuted: false,
        releaseMutationExecuted: false,
        publishExecuted: false
      },
      workspace: {
        kind: 'disposable',
        displayPath: './tmp/package-smoke',
        relativePath: 'tmp/package-smoke',
        pathRedacted: true,
        retention: 'deleted'
      },
      source: {
        kind: 'source-checkout',
        displayPath: '.',
        relativePath: '.',
        pathRedacted: true
      },
      privacy: {
        rawLogsIncluded: false,
        rawPackageContentsIncluded: false,
        privatePathsIncluded: false,
        environmentSecretsIncluded: false,
        privateStorePathsIncluded: false
      },
      issues: []
    });
    expect(report.steps.map((step) => step.id)).toEqual([
      'validate-source',
      'plan-workspace',
      'npm-pack',
      'install-cli',
      'feature-smoke-core',
      'evidence'
    ]);
    expect(report.steps.every((step) => step.status === 'planned' || step.status === 'skipped')).toBe(true);
    expect(report.artifacts).toContainEqual(
      expect.objectContaining({
        kind: 'summary',
        visibility: 'public',
        evidencePath: 'tasks/T-0133-package-smoke-dry-run-implementation/artifacts/package-smoke/dry-run-summary.json',
        rawContentIncluded: false
      })
    );
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('redacts absolute package source and workspace paths from public output', () => {
    const root = tempProject();
    const source = path.join(root, 'dist-release', 'hadara-0.1.0-rc.0.tgz');
    fs.mkdirSync(path.dirname(source), { recursive: true });
    fs.writeFileSync(source, 'placeholder tarball bytes', 'utf8');

    const report = createPackageSmokeDryRunReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      from: source,
      workspace: path.join(root, 'tmp', 'package-smoke'),
      keepTemp: true,
      privateLogs: true
    });
    const encoded = JSON.stringify(report);

    expect(report.ok).toBe(true);
    expect(report.source).toMatchObject({
      kind: 'tarball',
      displayPath: '<redacted-package-source>',
      pathRedacted: true
    });
    expect(report.workspace).toMatchObject({
      displayPath: '<redacted-disposable-workspace>',
      pathRedacted: true,
      retention: 'kept-temporary'
    });
    expect(report.artifacts).toContainEqual(
      expect.objectContaining({
        kind: 'command-log',
        visibility: 'private',
        pathRedacted: true,
        rawContentIncluded: false
      })
    );
    expect(encoded).not.toContain(root);
    expect(encoded).not.toContain('placeholder tarball bytes');
  });

  it('lets --no-evidence override --attach-evidence in both steps and artifacts', () => {
    const root = tempProject();
    const report = createPackageSmokeDryRunReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      taskId: 'T-0133',
      attachEvidence: true,
      noEvidence: true
    });

    expect(report.steps).toContainEqual(
      expect.objectContaining({
        id: 'evidence',
        status: 'skipped',
        summary: 'No public evidence attachment is planned by default.'
      })
    );
    expect(report.artifacts).not.toContainEqual(expect.objectContaining({ visibility: 'public' }));
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('reports missing sources without leaking the missing path', () => {
    const root = tempProject();
    const report = createPackageSmokeDryRunReport({
      paths: resolveHadaraPaths({ projectRoot: root }),
      from: '/home/alice/private/hadara-0.1.0-rc.0.tgz'
    });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual({
      severity: 'error',
      code: 'PACKAGE_SMOKE_SOURCE_MISSING',
      message: 'Package-smoke source path does not exist.'
    });
    expect(JSON.stringify(report)).not.toContain('/home/alice');
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });

  it('prints JSON through the package smoke CLI handler', () => {
    const root = tempProject();
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    const handled = handlePackageCommand({
      args: ['package', 'smoke', '--dry-run', '--task', 'T-0133', '--json'],
      paths: resolveHadaraPaths({ projectRoot: root }),
      jsonOutput: true
    });

    expect(handled).toBe(true);
    const report = JSON.parse(spy.mock.calls[0]?.[0] ?? '{}');
    expect(report).toMatchObject({
      schemaVersion: 'hadara.packageSmoke.v1',
      command: 'package.smoke',
      mode: 'dry-run',
      readOnly: true
    });
    expect(validateSchema('hadara.packageSmoke.v1', report).ok).toBe(true);
  });
});
