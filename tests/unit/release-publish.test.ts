import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { handleReleasePublishCommand } from '../../tools/dev-surface-handlers';
import { resolveHadaraPaths } from '../../src/core/paths';
import { createReleasePublishReport } from '../../tools/dev-surface/release-publish';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-release-publish-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify({
      name: 'hadara',
      version: '0.0.0-bootstrap',
      private: true
    }),
    'utf8'
  );
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('release publish', () => {
  it('reports approval-gated publish readiness without token values or release mutation', () => {
    const root = tempProject();
    const report = createReleasePublishReport({
      projectRoot: root,
      env: {
        NPM_TOKEN: 'npm_secret_value',
        HADARA_GITHUB_RELEASE_TOKEN: 'github_secret_value'
      }
    });

    expect(report.schemaVersion).toBe('hadara.releasePublish.v1');
    expect(report.ok).toBe(false);
    expect(report.current).toMatchObject({
      packageName: 'hadara',
      packageVersion: '0.0.0-bootstrap',
      private: true
    });
    expect(report.releaseTargets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'npm-publish',
          tokenName: 'NPM_TOKEN',
          tokenPresent: true,
          willExecute: false
        }),
        expect.objectContaining({
          id: 'github-release',
          tokenName: 'HADARA_GITHUB_RELEASE_TOKEN',
          tokenPresent: true,
          willExecute: false
        })
      ])
    );
    expect(JSON.stringify(report)).not.toContain('npm_secret_value');
    expect(JSON.stringify(report)).not.toContain('github_secret_value');
    expect(report.privacy).toMatchObject({
      tokenValuesIncluded: false,
      publishExecuted: false,
      githubReleaseCreated: false,
      dockerImageBuilt: false
    });
    expect(validateSchema('hadara.releasePublish.v1', report).ok).toBe(true);
  });

  it('privately audits blocked execute requests without performing release mutation', () => {
    const root = tempProject();
    const auditDir = path.join(root, '.hadara', 'local', 'portable', 'data', 'audit');
    const report = createReleasePublishReport({
      projectRoot: root,
      auditDir,
      mode: 'execute',
      approvalActor: 'release-owner',
      approvalReason: 'release candidate validation',
      confirm: 'publish-deploy',
      env: {
        NPM_TOKEN: 'npm_secret_value',
        GITHUB_TOKEN: 'github_secret_value'
      }
    });

    expect(report.ok).toBe(false);
    expect(report.audit).toEqual({ attempted: true, written: true });
    expect(report.privacy.publishExecuted).toBe(false);
    const auditFiles = fs.readdirSync(auditDir);
    expect(auditFiles.length).toBe(1);
    const auditText = fs.readFileSync(path.join(auditDir, auditFiles[0]), 'utf8');
    expect(auditText).toContain('release.publish.execute.requested');
    expect(auditText).not.toContain('npm_secret_value');
    expect(auditText).not.toContain('github_secret_value');
  });

  it('accepts stable 0.x.y package metadata as publishable', () => {
    const root = tempProject();
    fs.writeFileSync(
      path.join(root, 'package.json'),
      JSON.stringify({
        name: 'hadara',
        version: '0.3.1',
        private: false
      }),
      'utf8'
    );

    const report = createReleasePublishReport({ projectRoot: root });

    expect(report.checks).toContainEqual({
      code: 'PACKAGE_PUBLISHABLE_METADATA',
      name: 'Package publishable metadata',
      status: 'passed',
      summary: 'Package metadata is in publishable version mode.'
    });
  });

  it('accepts patch release-candidate metadata as publishable', () => {
    const root = tempProject();
    fs.writeFileSync(
      path.join(root, 'package.json'),
      JSON.stringify({
        name: 'hadara',
        version: '0.3.1-rc.1',
        private: false
      }),
      'utf8'
    );

    const report = createReleasePublishReport({ projectRoot: root });

    expect(report.checks).toContainEqual({
      code: 'PACKAGE_PUBLISHABLE_METADATA',
      name: 'Package publishable metadata',
      status: 'passed',
      summary: 'Package metadata is in publishable version mode.'
    });
  });

  it('prints JSON through the release publish CLI handler', () => {
    const root = tempProject();
    const output: string[] = [];
    const originalLog = console.log;
    const originalExitCode = process.exitCode;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };

    try {
      expect(
        handleReleasePublishCommand({
          args: ['release', 'publish', '--mode', 'dry-run', '--json'],
          paths: resolveHadaraPaths({ projectRoot: root }),
          jsonOutput: true
        })
      ).toBe(true);
    } finally {
      console.log = originalLog;
      process.exitCode = originalExitCode;
    }

    expect(JSON.parse(output.join('\n'))).toMatchObject({
      schemaVersion: 'hadara.releasePublish.v1',
      command: 'release.publish',
      mode: 'dry-run'
    });
  });
});
