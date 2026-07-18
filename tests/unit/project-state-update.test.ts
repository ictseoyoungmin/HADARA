import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { initProject } from '../../src/cli/init';
import { createProjectStateUpdateReport } from '../../src/services/project-state-update';
import { HADARA_COMMAND_REGISTRY } from '../../src/services/capability-registry';

const roots: string[] = [];

function tempProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-project-state-update-'));
  roots.push(root);
  return root;
}

function read(root: string, file: string): string {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
  process.exitCode = undefined;
});

describe('project-state update', () => {
  it('previews and executes product metadata managed-section updates with before-hash protection', () => {
    const root = tempProject();
    initProject(root, 'governed', { silent: true });

    const dryRun = createProjectStateUpdateReport(root, {
      name: 'Quant Battle Arena',
      purpose: 'Backtest and compare trading strategies.'
    });

    expect(dryRun).toMatchObject({
      schemaVersion: 'hadara.projectState.update.v1',
      command: 'project-state.update',
      ok: true,
      mode: 'dry-run',
      changed: true,
      writes: []
    });
    expect(dryRun.executeCommand).toContain('hadara project-state update');
    expect(read(root, 'docs/PROJECT_STATE.md')).toContain('| Name | Project name not set |');

    const execute = createProjectStateUpdateReport(root, {
      name: 'Quant Battle Arena',
      purpose: 'Backtest and compare trading strategies.',
      mode: 'execute',
      beforeHash: dryRun.targetBeforeHash
    });

    expect(execute).toMatchObject({ ok: true, mode: 'execute', writes: ['docs/PROJECT_STATE.md'] });
    const content = read(root, 'docs/PROJECT_STATE.md');
    expect(content).toContain('| Name | Quant Battle Arena |');
    expect(content).toContain('| Purpose | Backtest and compare trading strategies. |');
    expect(content).toContain('| HADARA Profile | governed |');
  });

  it('fails execute on stale reviewed hash without mutating project state', () => {
    const root = tempProject();
    initProject(root, 'basic', { silent: true });

    const report = createProjectStateUpdateReport(root, {
      name: 'Changed',
      mode: 'execute',
      beforeHash: 'sha256:stale'
    });

    expect(report.ok).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ code: 'PROJECT_STATE_UPDATE_BEFORE_HASH_MISMATCH' }));
    expect(read(root, 'docs/PROJECT_STATE.md')).toContain('| Name | Project name not set |');
  });

  it('is discoverable in the command registry', () => {
    const entry = HADARA_COMMAND_REGISTRY.find((candidate) => candidate.id === 'project-state.update');
    expect(entry).toMatchObject({
      command: expect.stringContaining('hadara project-state update'),
      writeBoundary: 'managed-doc-section',
      schemaVersion: 'hadara.projectState.update.v1'
    });
  });
});
