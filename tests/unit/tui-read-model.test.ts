import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createActiveRunManifest, writeActiveRunManifest } from '../../src/services/active-run-state';
import { createTuiReadModel } from '../../src/tui/read-model';
import { createTaskCapsule, TaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-tui-read-model-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('TUI read-model aggregator', () => {
  it('selects the active-run task and aggregates read-only project surfaces', () => {
    const root = tempProject();
    const first = createTaskCapsule(root, 'Active TUI task');
    const second = createTaskCapsule(root, 'Later task');
    writeProjectDocs(root, first.id);
    writeGitBranch(root, 'main');
    appendEvidence(first, 'active task evidence');
    writeActiveRunManifest(
      root,
      createActiveRunManifest(root, {
        runId: 'run_tui_001',
        taskId: first.id,
        startedAt: '2026-05-26T00:00:00.000Z',
        summary: 'Build TUI read model'
      })
    );

    const model = createTuiReadModel(root);

    expect(model).toMatchObject({
      schemaVersion: 'hadara.tui.read_model.internal.v1',
      command: 'tui.read-model',
      ok: true,
      selectedTaskId: first.id,
      overview: {
        currentWork: {
          id: second.id,
          title: 'Later task'
        },
        previousWork: {
          id: first.id,
          title: 'Active TUI task'
        },
        health: 'ok',
        phase: 'bootstrap-development',
        branch: 'main'
      },
      selectedTask: {
        summary: {
          id: first.id,
          capsule: `tasks/${first.id}-active-tui-task`
        },
        dashboardDetail: {
          schemaVersion: 'hadara.dashboard.task_detail.v1',
          command: 'dashboard.task-detail',
          taskId: first.id
        },
        proof: {
          note: expect.any(String)
        },
        evidence: {
          schemaVersion: 'hadara.evidence.list.v1',
          count: 1
        }
      },
      operator: {
        source: 'shared-dashboard-services',
        core: {
          schemaVersion: 'hadara.dashboard.core.v1',
          command: 'dashboard.core',
          source: {
            kind: 'live-api'
          },
          projection: {
            refreshState: 'idle'
          }
        },
        projectionStatus: {
          schemaVersion: 'hadara.dashboard.projection_status.v1',
          command: 'dashboard.projection.status'
        }
      },
      activeRun: {
        resume: {
          schemaVersion: 'hadara.active_run.resume.v1',
          activeRun: {
            taskId: first.id
          }
        }
      },
      releaseGate: {
        schemaVersion: 'hadara.releaseGate.v1',
        mode: 'advisory',
        ok: true
      },
      writePreview: {
        schemaVersion: 'hadara.write.preflight.v1',
        command: 'task.create',
        ok: true
      }
    });
    expect(model.tasks.count).toBe(2);
    expect(model.operator.core.projection.pendingSections).toContain('timeline');
    expect(model.operator.projectionStatus.pendingSections).toContain('core');
    expect(model.selectedTask?.evidence.records).toEqual(model.selectedTask?.dashboardDetail.evidenceList.records.slice(0, 20));
    expect(model.selectedTask?.proof).toBe(model.selectedTask?.dashboardDetail.proof);
    expect(model.tasks.tasks.map((task) => task.id)).toEqual([first.id, second.id]);
    expect(model.overview.currentDetail?.files?.['TASK.md']).toContain('Later task');
    expect(model.overview.previousDetail?.files?.['TASK.md']).toContain('Active TUI task');
    expect(model.debt.aggregate.total).toBeGreaterThan(0);
    expect(model.debt.aggregate.highOpen).toBe(0);
    expect(model.tools.surfaces.cli.length).toBeGreaterThan(0);
    expect(model.writePreview.writes).toContain(`tasks/T-0003-tui-follow-up/TASK.md`);
    expect(model.issues).not.toContainEqual(expect.objectContaining({ source: 'release-gate', code: 'OPEN_HIGH_OPERATIONAL_DEBT' }));
  });

  it('falls back to the latest task when no active task is selectable', () => {
    const root = tempProject();
    const first = createTaskCapsule(root, 'First task');
    const latest = createTaskCapsule(root, 'Latest task');
    writeProjectDocs(root);

    const model = createTuiReadModel(root);

    expect(model.selectedTaskId).toBe(latest.id);
    expect(model.overview.currentWork?.id).toBe(latest.id);
    expect(model.overview.previousWork?.id).toBe(first.id);
    expect(model.selectedTask?.detail.files?.['TASK.md']).toContain(`# ${latest.id} Latest task`);
  });

  it('can build a fast TUI read model that defers expensive advisory surfaces', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Fast aggregate task');
    writeProjectDocs(root, task.id);

    const model = createTuiReadModel(root, { profile: 'fast' });

    expect(model.ok).toBe(true);
    expect(model.operator.source).toBe('shared-dashboard-services');
    expect(model.operator.projectionStatus.refresh.state).toBe('idle');
    expect(model.selectedTaskId).toBe(task.id);
    expect(model.overview.currentWork?.id).toBe(task.id);
    expect(model.selectedTask?.dashboardDetail.schemaVersion).toBe('hadara.dashboard.task_detail.v1');
    expect(model.selectedTask?.detail.files?.['TASK.md']).toContain('Fast aggregate task');
    expect(model.debt.aggregate.total).toBe(0);
    expect(model.releaseGate.checks[0]?.name).toBe('Deferred release-gate check');
    expect(model.writePreview.command).toBe('unknown');
    expect(model.issues).toContainEqual({
      source: 'tui-read-model',
      severity: 'warning',
      code: 'TUI_HEAVY_READS_DEFERRED',
      message: 'TUI fast read model deferred debt, release-gate, tools, and write-preflight reads.'
    });
  });

  it('reports an explicit missing selected task as an aggregate error', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Existing task');
    writeProjectDocs(root);

    const model = createTuiReadModel(root, { selectedTaskId: 'T-9999' });

    expect(model.ok).toBe(false);
    expect(model.selectedTask).toBeNull();
    expect(model.issues).toContainEqual({
      source: 'tui-read-model',
      severity: 'error',
      code: 'TUI_SELECTED_TASK_NOT_FOUND',
      message: 'Selected Task Capsule not found: T-9999'
    });
  });

  it('does not mutate project files while aggregating read models', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'No write task');
    writeProjectDocs(root, task.id);
    const before = listProjectFiles(root);

    const model = createTuiReadModel(root);

    expect(model.ok).toBe(true);
    expect(listProjectFiles(root)).toEqual(before);
    expect(fs.existsSync(path.join(root, '.hadara', 'local', 'tui'))).toBe(false);
  });
});

function writeProjectDocs(root: string, activeTaskId = 'T-0001'): void {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Current Phase\n\nPhase 0 / Phase 1 boundary.\n', 'utf8');
  fs.writeFileSync(
    path.join(root, 'docs', 'AGENT_HANDOFF.md'),
    [
      '# AGENT_HANDOFF',
      '',
      '## Current State',
      '',
      `- ${activeTaskId} is current.`,
      '',
      '## Current Known Problems',
      '',
      '- Docker is the working validation path for now.',
      '',
      '## Last 3 Completed Tasks',
      '',
      '- T-0099 TUI Design and Development Plan: complete.',
      '',
      '## Next Recommended Step',
      '',
      '- Continue TUI read-model aggregator.',
      '',
      '## Validation Baseline',
      '',
      '- Latest full check: Docker npm run check passed',
      '- Latest done-level validation: T-0099 ok'
    ].join('\n'),
    'utf8'
  );
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'VALIDATION_HISTORY.md'), '# VALIDATION_HISTORY\n', 'utf8');
}

function writeGitBranch(root: string, branch: string): void {
  fs.mkdirSync(path.join(root, '.git'), { recursive: true });
  fs.writeFileSync(path.join(root, '.git', 'HEAD'), `ref: refs/heads/${branch}\n`, 'utf8');
}

function appendEvidence(task: TaskCapsule, summary: string): void {
  fs.writeFileSync(
    path.join(task.dir, 'evidence.jsonl'),
    `${JSON.stringify({
      schemaVersion: 'hadara.evidence.v1',
      time: '2026-05-26T00:00:00.000Z',
      taskId: task.id,
      kind: 'note',
      summary,
      result: 'passed',
      visibility: 'public'
    })}\n`,
    'utf8'
  );
}

function listProjectFiles(root: string): string[] {
  const files: string[] = [];
  walk(root, files);
  return files.sort();
}

function walk(dir: string, files: string[]): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
}
