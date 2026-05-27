import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { createTuiReadModel } from '../../src/tui/read-model';
import {
  createTuiInteractionState,
  getTuiTaskRows,
  reduceTuiInteractionState,
  tuiStateToReadModelOptions,
  tuiStateToSnapshotOptions
} from '../../src/tui/state';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-tui-state-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('TUI interaction state', () => {
  it('initializes from the read model and maps state to renderer/read-model options', () => {
    const root = tempProject();
    const first = createTaskCapsule(root, 'Alpha setup');
    const second = createTaskCapsule(root, 'Beta polish');
    writeProjectDocs(root);
    const model = createTuiReadModel(root, { selectedTaskId: first.id });

    const state = createTuiInteractionState(model, { panel: 'detail', document: 'PLAN.md' });

    expect(state).toMatchObject({
      activePanel: 'detail',
      selectedTaskId: first.id,
      documentFile: 'PLAN.md',
      documentScroll: 0,
      refreshRequested: false,
      quitRequested: false
    });
    expect(getTuiTaskRows(model, state).map((task) => task.id)).toEqual([second.id, first.id]);
    expect(tuiStateToReadModelOptions(state)).toEqual({ selectedTaskId: first.id });
    expect(tuiStateToSnapshotOptions(state, { width: 90, height: 24 })).toMatchObject({
      panel: 'detail',
      document: 'PLAN.md',
      documentScroll: 0,
      taskListScroll: 0,
      taskSearchActive: false,
      width: 90,
      height: 24
    });
  });

  it('switches panels and opens the selected task detail without reading or writing by itself', () => {
    const root = tempProject();
    const first = createTaskCapsule(root, 'First task');
    const second = createTaskCapsule(root, 'Second task');
    writeProjectDocs(root);
    const model = createTuiReadModel(root);
    const before = listProjectFiles(root);

    let state = createTuiInteractionState(model);
    state = reduceTuiInteractionState(state, model, '2');
    state = reduceTuiInteractionState(state, model, 'down');
    state = reduceTuiInteractionState(state, model, 'enter');

    expect(state.activePanel).toBe('detail');
    expect(state.selectedTaskId).toBe(first.id);
    expect(state.detailRefreshRequested).toBe(true);
    state = reduceTuiInteractionState(state, model, 'detail-refresh-complete');
    expect(state.detailRefreshRequested).toBe(false);
    expect(state.searchActive).toBe(false);
    expect(second.id).toBe(model.selectedTaskId);
    expect(listProjectFiles(root)).toEqual(before);
  });

  it('filters task selection through search and clears search with escape', () => {
    const root = tempProject();
    const alpha = createTaskCapsule(root, 'Alpha setup');
    createTaskCapsule(root, 'Beta polish');
    createTaskCapsule(root, 'Gamma docs');
    writeProjectDocs(root);
    const model = createTuiReadModel(root);

    let state = createTuiInteractionState(model);
    state = reduceTuiInteractionState(state, model, '/');
    state = reduceTuiInteractionState(state, model, 'a');
    state = reduceTuiInteractionState(state, model, 'l');

    expect(state.activePanel).toBe('tasks');
    expect(state.searchActive).toBe(true);
    expect(state.taskSearch).toBe('al');
    expect(getTuiTaskRows(model, state).map((task) => task.id)).toEqual([alpha.id]);
    expect(state.selectedTaskId).toBe(alpha.id);

    state = reduceTuiInteractionState(state, model, 'backspace');
    expect(state.taskSearch).toBe('a');
    expect(getTuiTaskRows(model, state)).toHaveLength(3);

    state = reduceTuiInteractionState(state, model, 'escape');
    expect(state.searchActive).toBe(false);
    expect(state.taskSearch).toBe('');
  });

  it('tracks document tab and scroll transitions as local state only', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Document task');
    writeProjectDocs(root);
    const model = createTuiReadModel(root);

    let state = createTuiInteractionState(model, { panel: 'detail' });
    state = reduceTuiInteractionState(state, model, 'p');
    state = reduceTuiInteractionState(state, model, 'down');
    state = reduceTuiInteractionState(state, model, 'pagedown');
    state = reduceTuiInteractionState(state, model, 'up');

    expect(state.activePanel).toBe('detail');
    expect(state.documentFile).toBe('PLAN.md');
    expect(state.documentScroll).toBe(8);
    expect(tuiStateToSnapshotOptions(state)).toMatchObject({ document: 'PLAN.md', documentScroll: 8 });

    state = reduceTuiInteractionState(state, model, 'e');
    expect(state.documentFile).toBe('EVIDENCE.md');
    expect(state.documentScroll).toBe(0);
  });

  it('records refresh and quit requests without performing the effects', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Signal task');
    writeProjectDocs(root);
    const model = createTuiReadModel(root);
    const before = listProjectFiles(root);

    let state = createTuiInteractionState(model);
    state = reduceTuiInteractionState(state, model, 'r');
    expect(state.refreshRequested).toBe(true);
    expect(state.quitRequested).toBe(false);

    state = reduceTuiInteractionState(state, model, 'refresh-complete');
    expect(state.refreshRequested).toBe(false);

    state = reduceTuiInteractionState(state, model, 'r');
    expect(state.refreshRequested).toBe(true);
    state = reduceTuiInteractionState(state, model, 'refresh-failed');
    expect(state.refreshRequested).toBe(false);

    state = reduceTuiInteractionState(state, model, 'q');
    expect(state.quitRequested).toBe(true);
    expect(listProjectFiles(root)).toEqual(before);
  });

  it('supports mockup navigation keys and search completion', () => {
    const root = tempProject();
    createTaskCapsule(root, 'Keyboard alpha');
    createTaskCapsule(root, 'Keyboard beta');
    createTaskCapsule(root, 'Keyboard gamma');
    writeProjectDocs(root);
    const model = createTuiReadModel(root);

    let state = createTuiInteractionState(model);
    state = reduceTuiInteractionState(state, model, 'tab');
    expect(state.activePanel).toBe('tasks');
    state = reduceTuiInteractionState(state, model, 'right');
    expect(state.activePanel).toBe('detail');
    state = reduceTuiInteractionState(state, model, 'shift-tab');
    expect(state.activePanel).toBe('tasks');

    state = reduceTuiInteractionState(state, model, '/');
    state = reduceTuiInteractionState(state, model, 'b');
    state = reduceTuiInteractionState(state, model, 'e');
    state = reduceTuiInteractionState(state, model, 't');
    state = reduceTuiInteractionState(state, model, 'enter');
    expect(state.searchActive).toBe(false);
    expect(state.taskSearch).toBe('bet');
    expect(getTuiTaskRows(model, state)[0]?.title).toContain('Keyboard beta');

    state = reduceTuiInteractionState(state, model, 'home');
    expect(state.selectedTaskIndex).toBe(0);
    state = reduceTuiInteractionState(state, model, 'end');
    expect(state.selectedTaskIndex).toBe(getTuiTaskRows(model, state).length - 1);
    state = reduceTuiInteractionState(state, model, 'ㅂ');
    expect(state.quitRequested).toBe(true);
  });

  it('keeps task cursor movement aligned with the mockup visible-window policy', () => {
    const root = tempProject();
    for (let index = 0; index < 15; index += 1) {
      createTaskCapsule(root, `Cursor task ${String(index + 1).padStart(2, '0')}`);
    }
    writeProjectDocs(root);
    const model = createTuiReadModel(root);

    let compact = createTuiInteractionState(model, { panel: 'tasks', taskListVisibleRows: 12 });
    for (let index = 0; index < 11; index += 1) {
      compact = reduceTuiInteractionState(compact, model, 'down', { taskListVisibleRows: 12 });
    }
    expect(compact.selectedTaskIndex).toBe(11);
    expect(compact.taskListScroll).toBe(0);

    compact = reduceTuiInteractionState(compact, model, 'down', { taskListVisibleRows: 12 });
    expect(compact.selectedTaskIndex).toBe(12);
    expect(compact.taskListScroll).toBe(1);

    compact = reduceTuiInteractionState(compact, model, 'up', { taskListVisibleRows: 12 });
    expect(compact.selectedTaskIndex).toBe(11);
    expect(compact.taskListScroll).toBe(1);
    compact = reduceTuiInteractionState(compact, model, 'up', { taskListVisibleRows: 12 });
    expect(compact.selectedTaskIndex).toBe(10);
    expect(compact.taskListScroll).toBe(1);
    for (let index = 0; index < 10; index += 1) {
      compact = reduceTuiInteractionState(compact, model, 'up', { taskListVisibleRows: 12 });
    }
    expect(compact.selectedTaskIndex).toBe(0);
    expect(compact.taskListScroll).toBe(0);

    let wide = createTuiInteractionState(model, { panel: 'tasks', taskListVisibleRows: 20 });
    for (let index = 0; index < 14; index += 1) {
      wide = reduceTuiInteractionState(wide, model, 'down', { taskListVisibleRows: 20 });
    }
    expect(wide.selectedTaskIndex).toBe(14);
    expect(wide.taskListScroll).toBe(0);
  });

  it('clears detail refresh request flags on completion or failure signals', () => {
    const root = tempProject();
    const first = createTaskCapsule(root, 'Detail first task');
    createTaskCapsule(root, 'Detail second task');
    writeProjectDocs(root);
    const model = createTuiReadModel(root);

    let state = createTuiInteractionState(model);
    state = reduceTuiInteractionState(state, model, '2');
    state = reduceTuiInteractionState(state, model, 'down');
    state = reduceTuiInteractionState(state, model, 'enter');

    expect(state.selectedTaskId).toBe(first.id);
    expect(state.detailRefreshRequested).toBe(true);
    state = reduceTuiInteractionState(state, model, 'detail-refresh-complete');
    expect(state.detailRefreshRequested).toBe(false);

    state = reduceTuiInteractionState({ ...state, detailRefreshRequested: true }, model, 'detail-refresh-failed');
    expect(state.detailRefreshRequested).toBe(false);
  });
});

function writeProjectDocs(root: string): void {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs', 'PROJECT_STATE.md'), '# PROJECT_STATE\n\n## Current Phase\n\nPhase 0 / Phase 1 boundary.\n', 'utf8');
  fs.writeFileSync(
    path.join(root, 'docs', 'AGENT_HANDOFF.md'),
    [
      '# AGENT_HANDOFF',
      '',
      '## Current State',
      '',
      '- TUI state tests are running.',
      '',
      '## Current Known Problems',
      '',
      '- Docker is the working validation path for now.',
      '',
      '## Last 3 Completed Tasks',
      '',
      '- T-0104 TUI Snapshot Polish: complete.',
      '',
      '## Next Recommended Step',
      '',
      '- Continue TUI interactive state.',
      '',
      '## Validation Baseline',
      '',
      '- Latest full check: Docker npm run check passed',
      '- Latest done-level validation: T-0104 ok'
    ].join('\n'),
    'utf8'
  );
  fs.writeFileSync(path.join(root, 'docs', 'DEVELOPMENT_SLICES.md'), '# DEVELOPMENT_SLICES\n', 'utf8');
  fs.writeFileSync(path.join(root, 'docs', 'VALIDATION_HISTORY.md'), '# VALIDATION_HISTORY\n', 'utf8');
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
