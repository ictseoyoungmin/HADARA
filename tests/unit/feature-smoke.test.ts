import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveHadaraPaths } from '../../src/core/paths';
import { validateSchema } from '../../src/core/schema';
import { handleSmokeCommand } from '../../src/cli/smoke';
import { createFeatureSmokeReport } from '../../src/services/feature-smoke';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-feature-smoke-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.mkdirSync(path.join(root, 'tasks'), { recursive: true });
  fs.mkdirSync(path.join(root, '.hadara', 'context'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Current Phase\n\nPhase 0 / Phase 1 boundary.\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\n## Current State\n\n- Test state.\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n', 'utf8');
  fs.writeFileSync(path.join(root, '.hadara', 'context', 'HADARA_CONTEXT.md'), '# HADARA Context\n', 'utf8');
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = undefined;
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('major feature smoke runner', () => {
  it('runs the core profile as a reduced read-only report', () => {
    const root = tempProject();
    const report = createFeatureSmokeReport({ paths: resolveHadaraPaths({ projectRoot: root }) });

    expect(report).toMatchObject({
      schemaVersion: 'hadara.featureSmoke.v1',
      command: 'feature-smoke.run',
      ok: true,
      profile: 'core',
      readOnly: true,
      executionMode: 'service-read-model',
      binaryExecuted: false,
      launcherChecked: false,
      packageInstallChecked: false,
      issues: []
    });
    expect(report.steps.every((step) => step.executionMode === 'service-read-model')).toBe(true);
    expect(report.steps.filter((step) => step.schemaStatus === 'validated').map((step) => step.command)).toEqual([
      'hadara task status --json',
      'hadara tools list --json',
      'hadara release gate --mode advisory --json'
    ]);
    expect(report.steps.map((step) => step.command)).toEqual([
      'hadara doctor --json',
      'hadara task status --json',
      'hadara task list --json',
      'hadara tools list --json',
      'hadara tui --snapshot --json',
      'hadara release gate --mode advisory --json'
    ]);
    expect(report.steps.every((step) => step.status === 'passed')).toBe(true);
    expect(JSON.stringify(report)).not.toContain(root);
    expect(validateSchema('hadara.featureSmoke.v1', report).ok).toBe(true);
  });

  it('keeps release-readiness profile deferred', () => {
    const root = tempProject();
    const report = createFeatureSmokeReport({ profile: 'release-readiness', paths: resolveHadaraPaths({ projectRoot: root }) });

    expect(report.ok).toBe(false);
    expect(report.profile).toBe('release-readiness');
    expect(report.steps).toEqual([]);
    expect(report.issues).toContainEqual({
      severity: 'error',
      code: 'FEATURE_SMOKE_PROFILE_DEFERRED',
      message: 'The release-readiness smoke profile is deferred until package, install matrix, and release artifact evidence exist.'
    });
  });

  it('prints JSON through the smoke CLI handler', () => {
    const root = tempProject();
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    expect(
      handleSmokeCommand({
        args: ['smoke', 'run', '--profile', 'core', '--json'],
        paths: resolveHadaraPaths({ projectRoot: root }),
        jsonOutput: true
      })
    ).toBe(true);

    const report = JSON.parse(spy.mock.calls[0]?.[0] ?? '{}');
    expect(report).toMatchObject({
      schemaVersion: 'hadara.featureSmoke.v1',
      command: 'feature-smoke.run',
      ok: true,
      profile: 'core',
      executionMode: 'service-read-model',
      binaryExecuted: false
    });
  });
});
