import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createProviderAdvisories } from '../../tools/dev-surface/release-provider-advisories';
import type { ReleaseEvidenceRecord } from '../../tools/dev-surface/release-evidence';

const roots: string[] = [];

function tempTaskDir(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-release-provider-advisory-'));
  roots.push(root);
  const taskDir = path.join(root, 'tasks', 'T-0001-python-smoke');
  fs.mkdirSync(path.join(taskDir, 'artifacts', 'package-smoke'), { recursive: true });
  return taskDir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('release provider advisories service', () => {
  it('reports missing Python package-smoke evidence as advisory-only', () => {
    expect(createProviderAdvisories([])).toEqual([
      expect.objectContaining({
        provider: 'python',
        status: 'preview',
        smokeEvidence: 'missing',
        blocking: false
      })
    ]);
  });

  it('reports valid Python package-smoke evidence as present and non-blocking', () => {
    const taskDir = tempTaskDir();
    fs.writeFileSync(path.join(taskDir, 'artifacts', 'package-smoke', 'summary.json'), JSON.stringify(smokeSummary('python'), null, 2), 'utf8');

    const advisories = createProviderAdvisories([record(taskDir, { result: 'passed' })]);

    expect(advisories).toEqual([
      expect.objectContaining({
        provider: 'python',
        status: 'preview',
        smokeEvidence: 'present',
        blocking: false,
        taskId: 'T-0001',
        evidencePath: 'artifacts/package-smoke/summary.json'
      })
    ]);
  });

  it('reports failed Python package-smoke evidence as stale and non-blocking', () => {
    const taskDir = tempTaskDir();
    fs.writeFileSync(path.join(taskDir, 'artifacts', 'package-smoke', 'summary.json'), JSON.stringify(smokeSummary('python'), null, 2), 'utf8');

    const advisories = createProviderAdvisories([record(taskDir, { result: 'failed' })]);

    expect(advisories).toEqual([
      expect.objectContaining({
        smokeEvidence: 'stale',
        blocking: false,
        taskId: 'T-0001'
      })
    ]);
  });
});

function record(taskDir: string, options: { result: 'passed' | 'failed' }): ReleaseEvidenceRecord {
  return {
    taskId: 'T-0001',
    taskDir,
    time: '2026-05-28T10:00:00Z',
    kind: 'command-log',
    summary: 'Python package smoke evidence.',
    result: options.result,
    visibility: 'public',
    evidencePath: 'artifacts/package-smoke/summary.json',
    persisted: {
      schemaVersion: 'hadara.evidence.v1',
      time: '2026-05-28T10:00:00Z',
      taskId: 'T-0001',
      kind: 'command-log',
      summary: 'Python package smoke evidence.',
      result: options.result,
      visibility: 'public',
      evidencePath: 'artifacts/package-smoke/summary.json'
    }
  };
}

function smokeSummary(providerEcosystem: 'python'): Record<string, unknown> {
  return {
    schemaVersion: 'hadara.smokeEvidenceSummary.v1',
    time: '2026-05-28T10:00:00Z',
    taskId: 'T-0001',
    category: 'package-smoke',
    sourceReport: {
      schemaVersion: 'hadara.packageSmoke.v1',
      command: 'package.smoke',
      mode: 'local',
      ok: true,
      provider: {
        ecosystem: providerEcosystem,
        smokeProfile: 'python-package-smoke',
        command: 'package.smoke'
      }
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
