import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createTaskListReport, createTaskShowReport, formatTaskListReport } from '../../src/cli/task-json';
import { createTaskCapsule } from '../../src/task/task-capsule';
import { extractTaskCreateTitle } from '../../src/cli/task';

const roots: string[] = [];

function tempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-task-json-'));
  roots.push(dir);
  return dir;
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('CLI task JSON reports', () => {
  it('returns a stable task list envelope with portable capsule paths', () => {
    const root = tempProject();
    createTaskCapsule(root, 'First task');
    createTaskCapsule(root, 'Second task');

    const report = createTaskListReport(root);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.list.v1',
      command: 'task.list',
      ok: true,
      count: 2,
      tasks: [
        {
          id: 'T-0001',
          title: 'First task',
          status: 'Draft',
          slug: 'first-task',
          capsule: 'tasks/T-0001-first-task'
        },
        {
          id: 'T-0002',
          title: 'Second task',
          status: 'Draft',
          slug: 'second-task',
          capsule: 'tasks/T-0002-second-task'
        }
      ]
    });
    expect(formatTaskListReport(report)).toContain('T-0001\tFirst task\ttasks/T-0001-first-task');
  });

  it('returns TASK.md content for task show JSON', () => {
    const root = tempProject();
    const task = createTaskCapsule(root, 'Show me');

    const report = createTaskShowReport(root, task.id);

    expect(report).toMatchObject({
      schemaVersion: 'hadara.task.show.v1',
      command: 'task.show',
      ok: true,
      task: {
        id: task.id,
        title: 'Show me',
        status: 'Draft',
        capsule: `tasks/${task.id}-show-me`
      },
      issues: []
    });
    expect(report.task?.taskMarkdown).toContain(`# ${task.id} Show me`);
  });

  it('returns a stable missing task envelope', () => {
    const root = tempProject();

    const report = createTaskShowReport(root, 'T-9999');

    expect(report).toEqual({
      schemaVersion: 'hadara.task.show.v1',
      command: 'task.show',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: 'TASK_NOT_FOUND',
          message: 'Task Capsule not found: T-9999'
        }
      ]
    });
  });

  it('extracts task create title without global flags', () => {
    expect(extractTaskCreateTitle(['task', 'create', 'Foo', '--project', '/tmp/repo', '--json'])).toBe('Foo');
  });
});
