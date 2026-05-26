import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createTuiReadModel } from '../../src/tui/read-model';
import { renderTuiSnapshot, TuiSnapshotPanel } from '../../src/tui/snapshot';
import { visibleWidth } from '../../src/tui/layout';
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
