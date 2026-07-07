import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  activeRunManifestPath,
  createActiveRunManifest,
  createActiveRunResumeReport,
  createActiveRunProjection,
  readActiveRunManifest,
  safeCreateActiveRunProjection,
  writeActiveRunManifest
} from '../../src/services/active-run-state';
import { handleRunStateCommand } from '../../src/cli/run-state';
import { validateSchema } from '../../src/core/schema';
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
    expect(validateSchema('hadara.active_run.projection.v1', safeCreateActiveRunProjection(root)).ok).toBe(true);
    expect(validateSchema('hadara.active_run.resume.v1', createActiveRunResumeReport(root)).ok).toBe(true);
  });

  it('separates active-run report schema assertion failures from malformed local state', () => {
    const root = tempProject();
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), '# AGENT_HANDOFF\n\n## Current State\n\n- T-999 is active.\n', 'utf8');
    writeActiveRunManifest(root, {
      schemaVersion: 'hadara.active_run.v1',
      runId: 'run-schema-invalid',
      taskId: 'T-999',
      capsule: 'tasks/T-999-invalid',
      status: 'active',
      startedAt: '2026-05-24T02:07:30Z',
      updatedAt: '2026-05-24T02:07:30Z',
      summary: 'Schema-invalid report.'
    });

    const projection = safeCreateActiveRunProjection(root);

    expect(projection).toMatchObject({
      activeRun: null,
      handoff: {
        fresh: false,
        staleReason: '.hadara/local/state/active-run.json produced an invalid active-run report.'
      },
      issues: [
        {
          severity: 'warning',
          code: 'ACTIVE_RUN_REPORT_SCHEMA_INVALID',
          message: expect.stringContaining('Schema validation failed for hadara.active_run.projection.v1')
        }
      ]
    });
    expect(validateSchema('hadara.active_run.projection.v1', projection).ok).toBe(true);
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

  it('warns and uses canonical capsule paths when the manifest capsule is stale', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Canonical active run');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# AGENT_HANDOFF\n\n## Current State\n\n- ${task.id} is active.\n`, 'utf8');
    writeActiveRunManifest(root, {
      schemaVersion: 'hadara.active_run.v1',
      runId: 'run-stale-capsule',
      taskId: task.id,
      capsule: 'tasks/T-0001-old-title',
      status: 'active',
      startedAt: '2026-05-24T02:08:30Z',
      updatedAt: '2026-05-24T02:08:30Z',
      summary: 'Stale capsule path.'
    });

    const projection = createActiveRunProjection(root);
    const report = createActiveRunResumeReport(root);

    expect(projection.resume).toEqual({
      taskId: task.id,
      capsule: 'tasks/T-0001-canonical-active-run',
      nextAction: 'Resume T-0001 from tasks/T-0001-canonical-active-run.'
    });
    expect(projection.issues).toContainEqual({
      severity: 'warning',
      code: 'ACTIVE_RUN_CAPSULE_MISMATCH',
      message:
        'Active run T-0001 points to tasks/T-0001-old-title, but the canonical Task Capsule path is tasks/T-0001-canonical-active-run.'
    });
    expect(report.resumePrompt.mustRead).toEqual([
      'docs/AGENT_HANDOFF.md',
      'tasks/T-0001-canonical-active-run/TASK.md',
      'tasks/T-0001-canonical-active-run/HANDOFF.md'
    ]);
    expect(report.issues).toContainEqual(
      expect.objectContaining({
        code: 'ACTIVE_RUN_CAPSULE_MISMATCH'
      })
    );
  });

  it('warns when an existing task has an empty manifest capsule path', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Empty capsule active run');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# AGENT_HANDOFF\n\n## Current State\n\n- ${task.id} is active.\n`, 'utf8');
    writeActiveRunManifest(root, {
      schemaVersion: 'hadara.active_run.v1',
      runId: 'run-empty-capsule',
      taskId: task.id,
      capsule: '',
      status: 'active',
      startedAt: '2026-05-24T02:08:45Z',
      updatedAt: '2026-05-24T02:08:45Z',
      summary: 'Empty capsule path.'
    });

    const projection = createActiveRunProjection(root);

    expect(projection.resume?.capsule).toBe('tasks/T-0001-empty-capsule-active-run');
    expect(projection.issues).toContainEqual({
      severity: 'warning',
      code: 'ACTIVE_RUN_CAPSULE_MISMATCH',
      message:
        'Active run T-0001 points to (empty capsule), but the canonical Task Capsule path is tasks/T-0001-empty-capsule-active-run.'
    });
  });

  it('creates read-only resume guidance from the active run projection', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Resume active run');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# AGENT_HANDOFF\n\n## Current State\n\n- ${task.id} is active.\n`, 'utf8');
    writeActiveRunManifest(
      root,
      createActiveRunManifest(root, {
        runId: 'run-resume',
        taskId: task.id,
        startedAt: '2026-05-24T02:09:00Z',
        summary: 'Continue read surfaces.'
      })
    );

    const report = createActiveRunResumeReport(root);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.active_run.resume.v1',
      command: 'active-run.resume',
      ok: true,
      activeRun: {
        taskId: task.id
      },
      resumePrompt: {
        summary: `Continue ${task.id}: Continue read surfaces.`,
        mustRead: ['docs/AGENT_HANDOFF.md', 'tasks/T-0001-resume-active-run/TASK.md', 'tasks/T-0001-resume-active-run/HANDOFF.md'],
        nextActions: [expect.stringContaining(task.id), 'Run required validation before marking the task Done.'],
        constraints: expect.arrayContaining(['Do not use MCP write tools for active-run mutation.'])
      },
      issues: []
    });
  });

  it('redirects run-state show to status after public surface removal', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Run state show');
    fs.writeFileSync(path.join(root, 'docs', 'AGENT_HANDOFF.md'), `# AGENT_HANDOFF\n\n## Current State\n\n- ${task.id} is active.\n`, 'utf8');
    writeActiveRunManifest(
      root,
      createActiveRunManifest(root, {
        runId: 'run-show',
        taskId: task.id,
        startedAt: '2026-05-24T02:10:00Z',
        summary: 'Show active state.'
      })
    );
    const output: string[] = [];
    const originalLog = console.log;
    console.log = (value?: unknown) => {
      output.push(String(value));
    };

    try {
      expect(handleRunStateCommand({ args: ['run-state', 'show', '--json'], projectRoot: root, jsonOutput: true })).toBe(true);
    } finally {
      console.log = originalLog;
    }

    expect(JSON.parse(output.join('\n'))).toMatchObject({
      schemaVersion: 'hadara.commandRemoved.v1',
      command: 'run-state.show',
      replacementCommand: 'hadara status --json'
    });
  });
});
