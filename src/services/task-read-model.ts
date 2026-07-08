import fs from 'node:fs';
import path from 'node:path';
import { PersistedEvidenceRecord } from '../evidence/evidence';
import { findTaskCapsule, listTaskCapsules, TaskCapsule } from '../task/task-capsule';
import { EvidenceListIssue, parseEvidenceIndexFile } from './evidence-list';

const TASK_CAPSULE_FILES = [
  'TASK.md',
  'EVIDENCE.md',
  'evidence.jsonl',
  'HANDOFF.md'
];

export interface TaskJsonSummary {
  id: string;
  title: string;
  status: string;
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

export interface TaskReadReport {
  schemaVersion: 'hadara.task.read.v1';
  command: 'task.read';
  ok: boolean;
  taskId: string;
  task?: TaskJsonSummary;
  files?: Record<string, string>;
  evidenceIndex?: PersistedEvidenceRecord[];
  issues: EvidenceListIssue[];
}

export interface TaskReadOptions {
  includePrivate?: boolean;
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

export function createTaskReadReport(projectRoot: string, taskId: string, options: TaskReadOptions = {}): TaskReadReport {
  const task = findTaskCapsule(projectRoot, taskId);
  if (!task) {
    return {
      schemaVersion: 'hadara.task.read.v1',
      command: 'task.read',
      ok: false,
      taskId,
      issues: [
        {
          severity: 'error',
          code: 'TASK_NOT_FOUND',
          message: `Task Capsule not found: ${taskId}`
        }
      ]
    };
  }

  const files = Object.fromEntries(
    TASK_CAPSULE_FILES.map((fileName) => {
      const filePath = path.join(task.dir, fileName);
      return [fileName, fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : ''];
    })
  );
  const evidenceParse = parseEvidenceIndexFile(path.join(task.dir, 'evidence.jsonl'), task.id);
  const includePrivate = options.includePrivate === true;
  const evidenceRecords = evidenceParse.records.filter((record) => includePrivate || record.visibility !== 'private');
  files['evidence.jsonl'] = formatEvidenceIndexFile(evidenceRecords);
  return {
    schemaVersion: 'hadara.task.read.v1',
    command: 'task.read',
    ok: !evidenceParse.issues.some((issue) => issue.severity === 'error'),
    taskId: task.id,
    task: summarizeTask(projectRoot, task),
    files,
    evidenceIndex: evidenceRecords,
    issues: evidenceParse.issues
  };
}

export function formatTaskListReport(report: TaskListReport): string {
  return report.tasks.map((task) => `${task.id}\t${task.title}\t${task.capsule}`).join('\n');
}

function formatEvidenceIndexFile(records: PersistedEvidenceRecord[]): string {
  if (records.length === 0) return '';
  return `${records.map((record) => JSON.stringify(record)).join('\n')}\n`;
}

export function summarizeTask(projectRoot: string, task: TaskCapsule): TaskJsonSummary {
  return {
    id: task.id,
    title: task.title,
    status: readTaskStatus(task),
    slug: task.slug,
    capsule: toPortablePath(path.relative(projectRoot, task.dir))
  };
}

function readTaskStatus(task: TaskCapsule): string {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return 'Unknown';
  const content = fs.readFileSync(taskPath, 'utf8');
  const tableStatus = content.match(/^\|\s*Status\s*\|\s*([^|]+?)\s*\|$/m)?.[1]?.trim();
  if (tableStatus) return tableStatus;
  const match = content.match(/^## Status\s*\n+([\s\S]*?)(?:\n## |\s*$)/m);
  return match?.[1]?.trim().split(/\r?\n/)[0]?.trim() || 'Unknown';
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
