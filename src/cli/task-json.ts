import fs from 'node:fs';
import path from 'node:path';
import { listTaskCapsules, TaskCapsule } from '../task/task-capsule';

export interface TaskJsonSummary {
  id: string;
  title: string;
  slug: string;
  capsule: string;
}

export interface TaskListReport {
  schemaVersion: 'hadara.task.list.v1';
  command: 'task.list';
  ok: true;
  count: number;
  tasks: TaskJsonSummary[];
}

export interface TaskShowReport {
  schemaVersion: 'hadara.task.show.v1';
  command: 'task.show';
  ok: boolean;
  task?: TaskJsonSummary & {
    taskMarkdown: string;
  };
  issues: Array<{
    severity: 'error';
    code: string;
    message: string;
  }>;
}

export function createTaskListReport(projectRoot: string): TaskListReport {
  const tasks = listTaskCapsules(projectRoot).map((task) => summarizeTask(projectRoot, task));
  return {
    schemaVersion: 'hadara.task.list.v1',
    command: 'task.list',
    ok: true,
    count: tasks.length,
    tasks
  };
}

export function createTaskShowReport(projectRoot: string, taskId: string): TaskShowReport {
  const task = listTaskCapsules(projectRoot).find((item) => item.id === taskId);
  if (!task) {
    return {
      schemaVersion: 'hadara.task.show.v1',
      command: 'task.show',
      ok: false,
      issues: [
        {
          severity: 'error',
          code: 'TASK_NOT_FOUND',
          message: `Task Capsule not found: ${taskId}`
        }
      ]
    };
  }

  return {
    schemaVersion: 'hadara.task.show.v1',
    command: 'task.show',
    ok: true,
    task: {
      ...summarizeTask(projectRoot, task),
      taskMarkdown: fs.readFileSync(path.join(task.dir, 'TASK.md'), 'utf8')
    },
    issues: []
  };
}

export function formatTaskListReport(report: TaskListReport): string {
  return report.tasks.map((task) => `${task.id}\t${task.title}\t${task.capsule}`).join('\n');
}

function summarizeTask(projectRoot: string, task: TaskCapsule): TaskJsonSummary {
  return {
    id: task.id,
    title: task.title,
    slug: task.slug,
    capsule: toPortablePath(path.relative(projectRoot, task.dir))
  };
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}

