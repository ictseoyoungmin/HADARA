import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  readDashboardTaskProjectionIndex,
  refreshDashboardTaskProjectionIndex
} from '../../src/services/dashboard-task-projection';
import { resolveDashboardProjectionStoreRoot } from '../../src/services/dashboard-projection-store';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-dashboard-task-projection-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('dashboard incremental task projection', () => {
  it('reuses unchanged task summaries without rereading task files', () => {
    const root = tempProject();
    writeTask(root, 'T-0001-first', 'Done', 1);
    writeTask(root, 'T-0002-second', 'Draft', 2);

    const first = refreshDashboardTaskProjectionIndex(root);
    expect(first.changedTaskIds).toEqual(['T-0001', 'T-0002']);
    expect(first.reusedTaskIds).toEqual([]);

    const unchangedReads = countTaskFileReads(root, () => {
      const second = refreshDashboardTaskProjectionIndex(root);
      expect(second.changedTaskIds).toEqual([]);
      expect(second.reusedTaskIds).toEqual(['T-0001', 'T-0002']);
    });
    expect(unchangedReads).toEqual([]);

    fs.appendFileSync(path.join(root, 'tasks', 'T-0002-second', 'TASK.md'), '\nUpdated title source.\n', 'utf8');
    const changedReads = countTaskFileReads(root, () => {
      const third = refreshDashboardTaskProjectionIndex(root);
      expect(third.changedTaskIds).toEqual(['T-0002']);
      expect(third.reusedTaskIds).toEqual(['T-0001']);
      expect(third.tasks.find((entry) => entry.summary.id === 'T-0002')?.summary.evidenceRecords).toBe(2);
    });
    expect(changedReads).toEqual([path.join(root, 'tasks', 'T-0002-second', 'TASK.md')]);
  });

  it('stores a redacted rebuildable task projection index', () => {
    const root = tempProject();
    writeTask(root, 'T-0001-first', 'Done', 1);

    refreshDashboardTaskProjectionIndex(root);
    const index = readDashboardTaskProjectionIndex(root);
    const stored = fs.readFileSync(path.join(resolveDashboardProjectionStoreRoot(root), 'source-signals', 'tasks.json'), 'utf8');

    expect(index?.schemaVersion).toBe('hadara.dashboard.task_projection_index.v1');
    expect(index?.tasks[0]?.summary).toMatchObject({
      id: 'T-0001',
      title: 'First',
      status: 'Done',
      capsule: 'tasks/T-0001-first',
      evidenceRecords: 1
    });
    expect(stored).not.toContain(root);
    expect(stored).toContain('"pathRedacted": true');
  });
});

function countTaskFileReads(root: string, fn: () => void): string[] {
  const tasksDir = path.join(root, 'tasks');
  const original = fs.readFileSync;
  const reads: string[] = [];
  vi.spyOn(fs, 'readFileSync').mockImplementation(((...args: Parameters<typeof fs.readFileSync>) => {
    const filePath = path.normalize(String(args[0]));
    if (filePath.startsWith(tasksDir)) reads.push(filePath);
    return original(...args);
  }) as typeof fs.readFileSync);
  try {
    fn();
    return reads;
  } finally {
    vi.restoreAllMocks();
  }
}

function writeTask(root: string, directoryName: string, status: string, evidenceRecords: number): void {
  const taskId = directoryName.slice(0, 6);
  const title = directoryName
    .slice(7)
    .split('-')
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ');
  const dir = path.join(root, 'tasks', directoryName);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'TASK.md'),
    [`# ${taskId} ${title}`, '', '## Status', '', status, ''].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(dir, 'evidence.jsonl'),
    Array.from({ length: evidenceRecords }, (_value, index) =>
      JSON.stringify({ schemaVersion: 'hadara.evidence.v1', taskId, kind: 'note', summary: `Evidence ${index}`, result: 'passed', visibility: 'public' })
    ).join('\n') + '\n',
    'utf8'
  );
}
