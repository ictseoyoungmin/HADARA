import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  activeRunManifestPath,
  createActiveRunManifest,
  createActiveRunProjection,
  readActiveRunManifest,
  safeCreateActiveRunProjection,
  writeActiveRunManifest
} from '../../src/services/active-run-state';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-active-run-'));
  roots.push(dir);
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\n## Current State\n\n- Ready.\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'TASK_BOARD.md'), '# TASK_BOARD\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'docs', 'VALIDATION_HISTORY.md'), '# VALIDATION_HISTORY\n', 'utf8');
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('single active run state', () => {
  it('writes and reads a single active run manifest from local project state', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Active run task');
    const manifest = createActiveRunManifest(root, {
      runId: 'run-1',
      taskId: task.id,
      startedAt: '2026-05-24T02:05:00Z',
      summary: 'Working on active run state.'
    });

    writeActiveRunManifest(root, manifest);

    expect(activeRunManifestPath(root)).toContain(path.join('.hadara', 'local', 'state', 'active-run.json'));
    expect(readActiveRunManifest(root)).toEqual({
      ...manifest,
      capsule: 'tasks/T-0001-active-run-task'
    });
  });

  it('creates a resume projection when handoff mentions the active task', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Fresh active run');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# AGENT_HANDOFF\n\n## Current State\n\n- ${task.id} is active.\n`, 'utf8');
    writeActiveRunManifest(
      root,
      createActiveRunManifest(root, {
        runId: 'run-2',
        taskId: task.id,
        startedAt: '2026-05-24T02:06:00Z',
        summary: 'Fresh handoff projection.'
      })
    );

    const projection = createActiveRunProjection(root);

    expect(projection).toMatchObject({
      schemaVersion: 'hadara.active_run.projection.v1',
      command: 'active-run.projection',
      ok: true,
      handoff: {
        fresh: true,
        staleReason: null
      },
      resume: {
        taskId: task.id,
        capsule: 'tasks/T-0001-fresh-active-run',
        nextAction: expect.stringContaining(task.id)
      },
      issues: []
    });
  });

  it('flags stale handoff when the active task is not mentioned', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\n## Current State\n\n- Last capsule only.\n', 'utf8');
    const task = createTaskCapsule(root, 'Stale active run');
    writeActiveRunManifest(
      root,
      createActiveRunManifest(root, {
        runId: 'run-3',
        taskId: task.id,
        startedAt: '2026-05-24T02:07:00Z',
        summary: 'Stale handoff projection.'
      })
    );

    const projection = createActiveRunProjection(root);

    expect(projection.handoff.fresh).toBe(false);
    expect(projection.handoff.staleReason).toBe('Active run T-0001 is not mentioned in docs/AGENT_HANDOFF.md.');
    expect(projection.issues).toEqual([
      {
        severity: 'warning',
        code: 'ACTIVE_RUN_HANDOFF_STALE',
        message: 'Active run T-0001 is not mentioned in docs/AGENT_HANDOFF.md.'
      }
    ]);
  });

  it('returns a degraded projection instead of throwing for malformed local state', () => {
    const root = tempProject();
    fs.mkdirSync(path.dirname(activeRunManifestPath(root)), { recursive: true });
    fs.writeFileSync(activeRunManifestPath(root), '{not json', 'utf8');

    expect(() => createActiveRunProjection(root)).toThrow();
    expect(safeCreateActiveRunProjection(root)).toMatchObject({
      schemaVersion: 'hadara.active_run.projection.v1',
      command: 'active-run.projection',
      ok: true,
      activeRun: null,
      handoff: {
        fresh: false,
        staleReason: '.hadara/local/state/active-run.json could not be read.'
      },
      resume: null,
      issues: [
        {
          severity: 'warning',
          code: 'ACTIVE_RUN_MANIFEST_INVALID'
        }
      ]
    });
  });

  it('warns when active run task id has no matching Task Capsule', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\n## Current State\n\n- T-9999 is active.\n', 'utf8');
    writeActiveRunManifest(root, {
      schemaVersion: 'hadara.active_run.v1',
      runId: 'run-missing',
      taskId: 'T-9999',
      capsule: '',
      status: 'active',
      startedAt: '2026-05-24T02:08:00Z',
      updatedAt: '2026-05-24T02:08:00Z',
      summary: 'Missing task.'
    });

    const projection = createActiveRunProjection(root);

    expect(projection.handoff.fresh).toBe(true);
    expect(projection.resume?.nextAction).toBe('Resolve missing Task Capsule for T-9999 before resuming.');
    expect(projection.issues).toContainEqual({
      severity: 'warning',
      code: 'ACTIVE_RUN_TASK_NOT_FOUND',
      message: 'Active run T-9999 has no matching Task Capsule.'
    });
  });
});
