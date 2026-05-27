import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createTuiFastReadModel, createTuiReadModel } from '../../src/tui/read-model';
import { renderTuiSnapshot, TuiSnapshotPanel } from '../../src/tui/snapshot';
import { stripAnsi, visibleWidth } from '../../src/tui/layout';
import { createTaskCapsule } from '../../src/task/task-capsule';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-tui-snapshot-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('TUI snapshot renderer', () => {
  it('renders deterministic no-color snapshots for all panels', () => {
    const root = tempProject();
    const first = createTaskCapsule(root, 'Snapshot first');
    const second = createTaskCapsule(root, 'Snapshot second');
    writeProjectDocs(root, second.id);
    const model = createTuiReadModel(root, { selectedTaskId: second.id });

    for (const panel of ['overview', 'tasks', 'detail', 'help'] satisfies TuiSnapshotPanel[]) {
      const snapshot = renderTuiSnapshot(model, { panel, width: 92, height: 26 });

      expect(snapshot).toMatchObject({
        schemaVersion: 'hadara.tui.snapshot.internal.v1',
        command: 'tui.snapshot',
        panel,
        terminal: {
          width: 92,
          height: 26,
          color: false
        }
      });
      expect(snapshot.lines).toHaveLength(26);
      expect(snapshot.lines.every((line) => visibleWidth(line) === 92)).toBe(true);
      expect(snapshot.text).not.toMatch(/\x1b\[/);
      expect(snapshot.text).toContain('HADARA Work Console');
      expect(snapshot.text).not.toContain(model.generatedAt);
    }

    expect(renderTuiSnapshot(model, { panel: 'overview', width: 92, height: 26 }).text).toContain(`${second.id} Snapshot second`);
    expect(renderTuiSnapshot(model, { panel: 'tasks', width: 92, height: 26 }).text).toContain(`${first.id}`);
    expect(renderTuiSnapshot(model, { panel: 'detail', width: 92, height: 26 }).text).toContain('Document Viewer TASK.md');
    expect(renderTuiSnapshot(model, { panel: 'help', width: 92, height: 26 }).text).toContain('Boundary: read-only snapshot');
  });

  it('keeps default snapshots byte-stable across volatile generatedAt values', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Stable snapshot');
    writeProjectDocs(root, task.id);
    const model = createTuiReadModel(root, { selectedTaskId: task.id });
    const laterModel = { ...model, generatedAt: '2099-01-01T00:00:00.000Z' };

    const first = renderTuiSnapshot(model, { panel: 'overview', width: 92, height: 26 });
    const second = renderTuiSnapshot(laterModel, { panel: 'overview', width: 92, height: 26 });
    const explicit = renderTuiSnapshot(laterModel, { panel: 'overview', width: 92, height: 26, includeGeneratedAt: true });

    expect(second.text).toBe(first.text);
    expect(first.text).not.toContain(model.generatedAt);
    expect(explicit.text).toContain('2099-01-01T00:00:00.000Z');
  });

  it('makes the width policy explicit without mutating project files', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Long snapshot task name that should be clipped in narrow terminals');
    writeProjectDocs(root, task.id);
    const before = listProjectFiles(root);
    const model = createTuiReadModel(root);

    const snapshot = renderTuiSnapshot(model, { panel: 'detail', width: 44, height: 12 });

    expect(snapshot.terminal).toMatchObject({ width: 78, height: 24 });
    expect(snapshot.lines).toHaveLength(24);
    expect(snapshot.lines.every((line) => visibleWidth(line) === 78)).toBe(true);
    expect(snapshot.text).toContain('…');
    expect(listProjectFiles(root)).toEqual(before);

    const compact = renderTuiSnapshot(model, { panel: 'detail', widthPolicy: 'compact', width: 44, height: 12 });
    expect(compact.terminal).toMatchObject({ width: 44, height: 12 });
    expect(compact.lines).toHaveLength(12);
    expect(compact.lines.every((line) => visibleWidth(line) === 44)).toBe(true);
    expect(listProjectFiles(root)).toEqual(before);
  });

  it('renders alternate Task Capsule documents through mockup-style detail tabs', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Document tab task');
    fs.writeFileSync(path.join(task.dir, 'PLAN.md'), '# Plan\n\n- [ ] Port mockup renderer\n', 'utf8');
    writeProjectDocs(root, task.id);
    const model = createTuiReadModel(root, { selectedTaskId: task.id });

    const snapshot = renderTuiSnapshot(model, { panel: 'detail', document: 'PLAN.md', width: 92, height: 26 });

    expect(snapshot.text).toContain('Document Viewer PLAN.md');
    expect(snapshot.text).toContain('[P PLAN]');
    expect(snapshot.text).toContain('[ ] Port mockup renderer');
  });

  it('emits renderer-derived hitboxes for panels, task rows, and detail document tabs', () => {
    const root = tempProject();
    const first = createTaskCapsule(root, 'Hitbox first');
    const second = createTaskCapsule(root, 'Hitbox second');
    writeProjectDocs(root, second.id);
    const model = createTuiReadModel(root, { selectedTaskId: second.id });

    const tasks = renderTuiSnapshot(model, { panel: 'tasks', widthPolicy: 'compact', width: 92, height: 26 });
    expect(tasks.hitboxes).toContainEqual(expect.objectContaining({ action: 'panel', payload: 'tasks', y1: 6, y2: 6 }));
    expect(tasks.hitboxes).toContainEqual(expect.objectContaining({ action: 'task', payload: first.id }));
    expect(tasks.hitboxes).toContainEqual(expect.objectContaining({ action: 'task', payload: second.id }));

    const detail = renderTuiSnapshot(model, { panel: 'detail', widthPolicy: 'compact', width: 92, height: 26 });
    expect(detail.hitboxes).toContainEqual(expect.objectContaining({ action: 'document', payload: 'PLAN.md', y1: 12, y2: 12 }));
    expect(detail.hitboxes).toContainEqual(expect.objectContaining({ action: 'document', payload: 'ACCEPTANCE.md' }));

    const wide = renderTuiSnapshot(model, { panel: 'tasks', width: 120, height: 28 });
    expect(wide.hitboxes).toContainEqual(expect.objectContaining({ action: 'panel', payload: 'tasks', x1: 1, y1: 8 }));
    expect(wide.hitboxes.find((box) => box.action === 'task' && box.payload === first.id)?.x1).toBe(26);
  });

  it('applies document scroll and mockup-short detail tab labels', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Scrollable viewer task');
    fs.writeFileSync(
      path.join(task.dir, 'TASK.md'),
      ['# Scrollable', '', ...Array.from({ length: 28 }, (_, index) => `- Viewer line ${String(index + 1).padStart(2, '0')}`)].join('\n'),
      'utf8'
    );
    writeProjectDocs(root, task.id);
    const model = createTuiReadModel(root, { selectedTaskId: task.id });

    const top = renderTuiSnapshot(model, { panel: 'detail', width: 104, height: 28 });
    const scrolled = renderTuiSnapshot(model, { panel: 'detail', width: 104, height: 28, documentScroll: 10 });

    expect(top.text).toContain('Viewer line 01');
    expect(top.text).not.toContain('Viewer line 20');
    expect(scrolled.text).not.toContain('Viewer line 01');
    expect(scrolled.text).toContain('Viewer line 18');
    expect(scrolled.text).toContain('Document Viewer TASK.md 11-');
    expect(scrolled.text).toContain(' d DEC ');
    expect(scrolled.text).toContain(' a ACC ');
    expect(scrolled.text).toContain(' e EVD ');
    expect(scrolled.text).toContain(' h HAND ');
    expect(scrolled.lines.every((line) => visibleWidth(line) === 104)).toBe(true);
  });

  it('renders mockup-style color and loading frames when explicitly requested', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Loading color task');
    writeProjectDocs(root, task.id);
    const model = createTuiReadModel(root, { selectedTaskId: task.id });

    const color = renderTuiSnapshot(model, { panel: 'overview', width: 104, height: 26, theme: 'hadara', logLine: 'ready: visual parity' });
    expect(color.terminal).toMatchObject({ color: true, theme: 'hadara' });
    expect(color.text).toMatch(/\x1b\[/);
    expect(color.text).toContain('\x1b[38;2;52;67;74m');
    expect(color.text).toContain('\x1b[48;2;130;190;134m\x1b[38;2;8;16;20m OK \x1b[0m');
    expect(color.text).toContain('log');
    expect(color.lines.every((line) => visibleWidth(line) === 104)).toBe(true);

    const loading = renderTuiSnapshot(model, { panel: 'tasks', width: 92, height: 26, loading: true, loadingTick: 3 });
    expect(loading.text).toContain('Tasks Reading');
    expect(loading.text).toContain('reading task capsule');
    expect(loading.text).not.toMatch(/\x1b\[/);
    expect(loading.lines.every((line) => visibleWidth(line) === 92)).toBe(true);
  });

  it('keeps overview work cards aligned at wide intermediate widths without edge ellipses', () => {
    const root = tempProject();
    const current = createTaskCapsule(root, 'Current overview card with enough text to clip inside the card');
    createTaskCapsule(root, 'Previous overview card with enough text to clip inside the card');
    writeProjectDocs(root, current.id);
    const model = createTuiFastReadModel(root, { selectedTaskId: current.id });

    const snapshot = renderTuiSnapshot(model, { panel: 'overview', width: 118, height: 28, theme: 'hadara' });
    const plainLines = snapshot.lines.map(stripAnsi);
    const previousStart = plainLines.findIndex((line) => line.includes('Previous Work'));
    const previousBlock = plainLines.slice(previousStart, previousStart + 7);

    expect(previousStart).toBeGreaterThanOrEqual(0);
    expect(previousBlock.every((line) => line.trimEnd().endsWith('│') || line.trimEnd().endsWith('╮') || line.trimEnd().endsWith('╯'))).toBe(true);
    expect(previousBlock.some((line) => line.trimEnd().endsWith('…'))).toBe(false);
    expect(snapshot.text).toContain('\x1b[38;2;130;199;206mGoal\x1b[0m');
    expect(snapshot.text).toContain('\x1b[38;2;224;185;109mNext\x1b[0m');
    expect(snapshot.text).toContain('\x1b[38;2;130;190;134mProof\x1b[0m');
    expect(snapshot.lines.every((line) => visibleWidth(line) === 118)).toBe(true);
  });

  it('renders task windows from interaction scroll state and active search copy', () => {
    const root = tempProject();
    const tasks = Array.from({ length: 18 }, (_, index) => createTaskCapsule(root, `Windowed task ${String(index + 1).padStart(2, '0')}`));
    writeProjectDocs(root, tasks[17]?.id ?? '');
    const model = createTuiReadModel(root, { selectedTaskId: tasks[5]?.id });

    const snapshot = renderTuiSnapshot(model, {
      panel: 'tasks',
      width: 92,
      height: 26,
      selectedTaskId: tasks[5]?.id,
      taskListScroll: 10,
      taskSearch: 'Windowed',
      taskSearchActive: true
    });

    expect(snapshot.text).toContain(`> [DRAFT] ${tasks[5]?.id}`);
    expect(snapshot.text).toContain('search: Windowed_');
    expect(snapshot.text).toContain('Enter/click opens Detail.');
    expect(snapshot.text).toContain('Showing 7-18 of 18/18');
    expect(snapshot.text).not.toContain(`${tasks[17]?.id} Windowed task 18`);
  });

  it('makes fast-profile deferred advisory reads visible instead of reporting false ok counts', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Deferred overview task');
    writeProjectDocs(root, task.id);
    const model = createTuiFastReadModel(root, { selectedTaskId: task.id });

    const snapshot = renderTuiSnapshot(model, { panel: 'overview', width: 150, height: 30 });

    expect(snapshot.text).toContain('[DEFERRED] debt/release/tools/write-preview deferred');
    expect(snapshot.text).not.toContain('debt open 0, high 0  release advisory: ok');
  });

  it('renders high contrast color mode explicitly', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Contrast color task');
    writeProjectDocs(root, task.id);
    const model = createTuiReadModel(root, { selectedTaskId: task.id });

    const snapshot = renderTuiSnapshot(model, { panel: 'detail', width: 104, height: 26, theme: 'contrast' });

    expect(snapshot.terminal).toMatchObject({ color: true, theme: 'contrast' });
    expect(snapshot.text).toMatch(/\x1b\[/);
    expect(snapshot.text).toContain('\x1b[38;2;119;119;119m');
    expect(snapshot.text).toContain('Document Viewer TASK.md');
    expect(snapshot.lines.every((line) => visibleWidth(line) === 104)).toBe(true);
  });

  it('colors detail viewer document content instead of leaving a legacy plain markdown box', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Viewer color task');
    fs.writeFileSync(path.join(task.dir, 'TASK.md'), ['# Goal', '', '- [ ] Keep viewer parity', '- Readable bullet', '', '1. Numbered action'].join('\n'), 'utf8');
    writeProjectDocs(root, task.id);
    const model = createTuiReadModel(root, { selectedTaskId: task.id });

    const snapshot = renderTuiSnapshot(model, { panel: 'detail', width: 104, height: 28, theme: 'hadara' });

    expect(snapshot.text).toContain('Document Viewer TASK.md');
    expect(snapshot.text).toContain('\x1b[38;2;224;185;109mGoal');
    expect(snapshot.text).toContain('\x1b[38;2;52;67;74m────────────\x1b[0m');
    expect(snapshot.text).toContain('\x1b[48;2;208;164;90m\x1b[38;2;8;16;20m TODO \x1b[0m');
    expect(snapshot.text).toContain('\x1b[38;2;198;161;95m•\x1b[0m');
    expect(snapshot.lines.every((line) => visibleWidth(line) === 104)).toBe(true);
  });

  it('renders Korean wide characters within fixed visible terminal width', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, '한글 스냅샷 렌더링');
    fs.writeFileSync(
      path.join(task.dir, 'TASK.md'),
      ['# 목표', '', '- [ ] 한글 폭 계산을 보존한다', '- 표와 줄바꿈이 터미널 폭을 넘지 않는다'].join('\n'),
      'utf8'
    );
    writeProjectDocs(root, task.id);
    const before = listProjectFiles(root);
    const model = createTuiReadModel(root, { selectedTaskId: task.id });

    const snapshot = renderTuiSnapshot(model, { panel: 'detail', widthPolicy: 'compact', width: 48, height: 24 });

    expect(snapshot.text).toContain('한글');
    expect(snapshot.lines).toHaveLength(24);
    expect(snapshot.lines.every((line) => visibleWidth(line) === 48)).toBe(true);
    expect(snapshot.text).not.toContain(model.generatedAt);
    expect(listProjectFiles(root)).toEqual(before);
  });
});

function writeProjectDocs(root: string, activeTaskId: string): void {
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
      '- T-0101 Task Board Append Done-Level Guard: complete.',
      '',
      '## Next Recommended Step',
      '',
      '- Continue TUI snapshot renderer.',
      '',
      '## Validation Baseline',
      '',
      '- Latest full check: Docker npm run check passed',
      '- Latest done-level validation: T-0101 ok'
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
