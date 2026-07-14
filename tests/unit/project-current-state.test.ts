import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { initProject } from '../../src/init/project';
import { createInitUpgradeReport } from '../../src/init/upgrade';
import {
  PROJECT_CURRENT_STATE_PATH,
  readProjectCurrentState,
  renderHandoffCanonSection,
  renderProjectStateCanonSection
} from '../../src/services/project-current-state';
import { createStateProjectionReport } from '../../src/services/state-projection';
import { createOpsStatusReport } from '../../src/services/operations-status-service';
import { createTaskCreateReport } from '../../src/task/task-create';
import { createTaskFinishReport } from '../../src/task/task-finish';

function tempRoot(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-current-state-'));
}

describe('project current-state canon', () => {
  it('scaffolds a schema-valid portable canon and deterministic Markdown projections', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });

    const read = readProjectCurrentState(root);
    expect(read.issues).toEqual([]);
    expect(read.state).toMatchObject({
      schemaVersion: 'hadara.projectCurrentState.v1',
      rev: 1,
      profile: 'governed',
      latestCompletedTask: null,
      activeTask: null
    });
    expect(validateSchema('hadara.projectCurrentState.v1', read.state).ok).toBe(true);
    expect(fs.readFileSync(path.join(root, 'docs/PROJECT_STATE.md'), 'utf8')).toContain(renderProjectStateCanonSection(read.state!));
    expect(fs.readFileSync(path.join(root, 'docs/AGENT_HANDOFF.md'), 'utf8')).toContain(renderHandoffCanonSection(read.state!));
    expect(fs.readFileSync(path.join(root, 'docs/AGENT_HANDOFF.md'), 'utf8')).toContain('| Active Task | None | No active task; use next-work selection guidance. |');
  });

  it('renders active task handoff notes based on whether a task is selected', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });

    const initial = readProjectCurrentState(root).state!;
    expect(renderHandoffCanonSection(initial)).toContain('| Active Task | None | No active task; use next-work selection guidance. |');

    const created = createTaskCreateReport(root, 'Active handoff note fixture');
    const active = readProjectCurrentState(root).state!;
    expect(active.activeTask).toEqual({ id: created.taskId, title: 'Active handoff note fixture' });
    expect(renderHandoffCanonSection(active)).toContain(`| Active Task | ${created.taskId} Active handoff note fixture | Resume this capsule first. |`);
  });

  it('synchronizes active and latest task facts through create and finish without a new command', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });

    const created = createTaskCreateReport(root, 'Canon lifecycle fixture');
    expect(created.ok).toBe(true);
    expect(created.issues).toEqual([]);
    const active = readProjectCurrentState(root).state!;
    expect(active.activeTask).toEqual({ id: created.taskId, title: 'Canon lifecycle fixture' });
    expect(fs.readFileSync(path.join(root, 'docs/AGENT_HANDOFF.md'), 'utf8')).toContain(`| Active Task | ${created.taskId} Canon lifecycle fixture |`);
    expect(createOpsStatusReport(root, { includeDebt: false })).toMatchObject({
      tasks: {
        lastCompleted: [],
        nextRecommended: created.taskId
      },
      validation: {
        latestFullCheck: 'No validation baseline has been recorded yet.'
      }
    });

    const dryRun = createTaskFinishReport(root, created.taskId!, 'dry-run');
    expect(dryRun.writes.map((write) => write.field)).toEqual(expect.arrayContaining([
      'task-status',
      'task-board-row',
      'current-state',
      'project-state-projection',
      'handoff-projection'
    ]));
    const executed = createTaskFinishReport(root, created.taskId!, 'execute');
    expect(executed.ok).toBe(true);
    const completed = readProjectCurrentState(root).state!;
    expect(completed.latestCompletedTask).toEqual({ id: created.taskId, title: 'Canon lifecycle fixture' });
    expect(completed.activeTask).toBeNull();
    expect(fs.readFileSync(path.join(root, 'docs/PROJECT_STATE.md'), 'utf8')).toContain(`| Latest Completed Task | ${created.taskId} Canon lifecycle fixture |`);
  });

  it('migrates a legacy project through reviewed init upgrade while preserving unrelated prose', () => {
    const root = tempRoot();
    fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
    fs.mkdirSync(path.join(root, 'tasks'), { recursive: true });
    fs.writeFileSync(path.join(root, 'docs/PROJECT_STATE.md'), `# PROJECT_STATE\n\n## Metadata\n\n| Field | Value |\n|---|---|\n| HADARA Profile | standard |\n| Stable Version | 0.4.2 |\n\n## Custom Notes\n\nKeep this project-authored prose.\n`, 'utf8');
    fs.writeFileSync(path.join(root, 'docs/TASK_BOARD.md'), '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n', 'utf8');

    const dryRun = createInitUpgradeReport(root, 'standard', 'dry-run');
    expect(dryRun.ok).toBe(true);
    expect(dryRun.actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ action: 'upgrade-current-state', path: PROJECT_CURRENT_STATE_PATH, status: 'planned' })
    ]));
    expect(fs.existsSync(path.join(root, PROJECT_CURRENT_STATE_PATH))).toBe(false);

    const executed = createInitUpgradeReport(root, 'standard', 'execute');
    expect(executed.ok).toBe(true);
    expect(validateSchema('hadara.projectCurrentState.v1', readProjectCurrentState(root).state).ok).toBe(true);
    const projectState = fs.readFileSync(path.join(root, 'docs/PROJECT_STATE.md'), 'utf8');
    expect(projectState).toContain('hadara:managed:start current-state-canon');
    expect(projectState).toContain('Keep this project-authored prose.');
  });

  it('reports managed projection drift while keeping the structured state authoritative', () => {
    const root = tempRoot();
    initProject(root, 'governed', { silent: true });
    const projectStatePath = path.join(root, 'docs/PROJECT_STATE.md');
    fs.writeFileSync(projectStatePath, fs.readFileSync(projectStatePath, 'utf8').replace('| Current Release |', '| Current Release Drifted |'), 'utf8');

    const report = createStateProjectionReport(root);
    expect(report.sources.currentState).toMatchObject({ exists: true, rev: 1 });
    expect(report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'STATE_CURRENT_CANON_PROJECTION_DRIFT', path: 'docs/PROJECT_STATE.md' })
    ]));
  });
});
