import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';

const fixtureDir = path.join(process.cwd(), 'tests', 'fixtures', 'package-smoke');
const fixtureNames = ['success', 'step-failure', 'redacted-path', 'private-raw-omitted', 'public-reduced-evidence'];
const bannedPublicFragments = [
  '/home/',
  '/Users/',
  'C:\\',
  'PRIVATE',
  'BEGIN PRIVATE KEY',
  'npm ERR!',
  '_authToken',
  'HADARA_PRIVATE',
  '.hadara/private',
  'node_modules/'
];

function readFixture(name: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(fixtureDir, `${name}.json`), 'utf8'));
}

function stringify(value: unknown): string {
  return JSON.stringify(value);
}

describe('package smoke schema fixtures', () => {
  it.each(fixtureNames)('validates %s fixture against hadara.packageSmoke.v1', (name) => {
    const fixture = readFixture(name);
    expect(validateSchema('hadara.packageSmoke.v1', fixture)).toEqual({
      ok: true,
      schemaId: 'hadara.packageSmoke.v1',
      issues: []
    });
  });

  it('keeps deterministic fixtures reduced and free of raw private details', () => {
    for (const name of fixtureNames) {
      const fixture = readFixture(name);
      const text = stringify(fixture);
      for (const fragment of bannedPublicFragments) {
        expect(text.includes(fragment), `${name} should not include ${fragment}`).toBe(false);
      }
      expect(text).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
      expect(text).not.toMatch(/npm_[A-Za-z0-9]{16,}/);
      expect(text).not.toMatch(/gh[pousr]_[A-Za-z0-9]{16,}/);
    }
  });

  it('models dry-run without package execution', () => {
    expect(readFixture('redacted-path')).toMatchObject({
      mode: 'dry-run',
      readOnly: true,
      execution: {
        npmPackExecuted: false,
        packageInstallExecuted: false,
        featureSmokeExecuted: false,
        releaseMutationExecuted: false,
        publishExecuted: false
      }
    });
  });

  it('models public evidence as a reduced Task Capsule artifact only', () => {
    expect(readFixture('public-reduced-evidence')).toMatchObject({
      artifacts: [
        {
          kind: 'summary',
          visibility: 'public',
          evidencePath: 'tasks/T-0136-smoke-evidence-integration/artifacts/package-smoke/2026-05-28T00-00-00Z-summary.json',
          rawContentIncluded: false
        }
      ],
      privacy: {
        rawLogsIncluded: false,
        rawPackageContentsIncluded: false,
        privatePathsIncluded: false,
        environmentSecretsIncluded: false,
        privateStorePathsIncluded: false
      }
    });
  });
});
