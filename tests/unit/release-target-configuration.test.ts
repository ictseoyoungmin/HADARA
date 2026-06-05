import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createReleaseTargetConfigurationCheck, readReleaseTargetConfiguration } from '../../src/services/release-target-configuration';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-release-target-config-'));
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('release target configuration service', () => {
  it('returns the default npm-primary preview model when no project config exists', () => {
    const config = readReleaseTargetConfiguration(tempProject());

    expect(config).toMatchObject({
      source: 'default',
      configPath: '.hadara/release-targets.json',
      effectivePrimaryTarget: 'npm-package',
      autoPromotion: false,
      supported: true,
      issues: []
    });
    expect(createReleaseTargetConfigurationCheck(config)).toBeNull();
  });

  it('surfaces unsupported primary requests as non-blocking preview warnings', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, '.hadara'), { recursive: true });
    fs.writeFileSync(path.join(root, '.hadara', 'release-targets.json'), JSON.stringify({ primaryTarget: 'python-package-preview' }), 'utf8');

    const config = readReleaseTargetConfiguration(root);
    const check = createReleaseTargetConfigurationCheck(config);

    expect(config).toMatchObject({
      source: 'project-file',
      requestedPrimaryTarget: 'python-package-preview',
      effectivePrimaryTarget: 'npm-package',
      autoPromotion: false,
      supported: false
    });
    expect(config.issues).toContainEqual(
      expect.objectContaining({
        severity: 'warning',
        code: 'RELEASE_TARGET_PRIMARY_UNSUPPORTED'
      })
    );
    expect(check).toMatchObject({
      code: 'RELEASE_TARGET_CONFIGURATION',
      status: 'warning',
      summary: expect.stringContaining('effective primary remains npm-package')
    });
  });

  it('keeps invalid JSON advisory-only and npm-primary', () => {
    const root = tempProject();
    fs.mkdirSync(path.join(root, '.hadara'), { recursive: true });
    fs.writeFileSync(path.join(root, '.hadara', 'release-targets.json'), '{ "primaryTarget": ', 'utf8');

    const config = readReleaseTargetConfiguration(root);

    expect(config).toMatchObject({
      source: 'project-file',
      effectivePrimaryTarget: 'npm-package',
      autoPromotion: false,
      supported: false
    });
    expect(config.issues).toContainEqual(expect.objectContaining({ code: 'RELEASE_TARGET_CONFIG_INVALID_JSON' }));
  });
});
