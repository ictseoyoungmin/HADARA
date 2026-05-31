import fs from 'node:fs';
import path from 'node:path';
import { listTaskCapsules, TaskCapsule } from './task-capsule';

export type TaskFinishMode = 'dry-run' | 'execute';

export interface TaskFinishReport {
  schemaVersion: 'hadara.task.finish.v1';
  command: 'task.finish';
  ok: boolean;
  mode: TaskFinishMode;
  taskId: string;
  projectRoot: string;
  task?: {
    id: string;
    title: string;
    capsule: string;
  };
  status: {
    taskStatus: string | null;
    taskBoardStatus: string | null;
    taskBoardPresent: boolean;
  };
  summary: {
    plannedWrites: number;
    appliedWrites: number;
    advisoryOnly: number;
  };
  writes: TaskFinishWrite[];
  advisories: TaskFinishAdvisory[];
  issues: TaskFinishIssue[];
}

export interface TaskFinishWrite {
  path: string;
  action: 'update' | 'insert';
  field: 'task-status' | 'task-board-row';
  before: string | null;
  after: string;
  applied: boolean;
}

export interface TaskFinishAdvisory {
  path: string;
  reason: string;
  mode: 'dry-run-only';
}

export interface TaskFinishIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  path?: string;
}

export function createTaskFinishReport(projectRoot: string, taskId: string, mode: TaskFinishMode): TaskFinishReport {
  const task = listTaskCapsules(projectRoot).find((candidate) => candidate.id === taskId);
  const issues: TaskFinishIssue[] = [];
  if (!task) {
    return {
      schemaVersion: 'hadara.task.finish.v1',
      command: 'task.finish',
      ok: false,
      mode,
      taskId,
      projectRoot,
      status: { taskStatus: null, taskBoardStatus: null, taskBoardPresent: false },
      summary: { plannedWrites: 0, appliedWrites: 0, advisoryOnly: 0 },
      writes: [],
      advisories: [],
      issues: [{ severity: 'error', code: 'TASK_NOT_FOUND', message: `Task Capsule not found: ${taskId}` }]
    };
  }

  const capsule = toPortablePath(path.relative(projectRoot, task.dir));
  const taskStatus = readTaskStatus(task);
  const board = readTaskBoard(projectRoot, task.id);
  const writes = planWrites(projectRoot, task, capsule, taskStatus, board, issues);
  if (mode === 'execute' && !issues.some((issue) => issue.severity === 'error')) {
    applyWrites(projectRoot, task, writes);
  }

  return {
    schemaVersion: 'hadara.task.finish.v1',
    command: 'task.finish',
    ok: !issues.some((issue) => issue.severity === 'error'),
    mode,
    taskId,
    projectRoot,
    task: {
      id: task.id,
      title: task.title,
      capsule
    },
    status: {
      taskStatus,
      taskBoardStatus: board.status,
      taskBoardPresent: board.present
    },
    summary: {
      plannedWrites: writes.length,
      appliedWrites: writes.filter((write) => write.applied).length,
      advisoryOnly: 3
    },
    writes,
    advisories: [
      { path: 'docs/DEVELOPMENT_SLICES.md', reason: 'Slice completion evidence still requires operator-authored summary.', mode: 'dry-run-only' },
      { path: 'docs/PROJECT_STATE.md', reason: 'Latest completed/current task prose remains operator-authored.', mode: 'dry-run-only' },
      { path: 'docs/AGENT_HANDOFF.md', reason: 'Next-session handoff remains operator-authored.', mode: 'dry-run-only' }
    ],
    issues
  };
}

export function formatTaskFinishReport(report: TaskFinishReport): string {
  const lines = [`[HADARA] task finish ${report.taskId}: ${report.ok ? report.mode : 'blocked'}`];
  lines.push(`planned=${report.summary.plannedWrites} applied=${report.summary.appliedWrites} advisory=${report.summary.advisoryOnly}`);
  for (const write of report.writes) {
    lines.push(`${write.applied ? 'APPLIED' : 'PLANNED'}\t${write.field}\t${write.path}`);
  }
  for (const advisory of report.advisories) {
    lines.push(`ADVISORY\t${advisory.path}\t${advisory.reason}`);
  }
  for (const issue of report.issues) {
    lines.push(`[${issue.severity}] ${issue.code}: ${issue.message}`);
  }
  return lines.join('\n');
}

function planWrites(projectRoot: string, task: TaskCapsule, capsule: string, taskStatus: string, board: TaskBoardProjection, issues: TaskFinishIssue[]): TaskFinishWrite[] {
  const writes: TaskFinishWrite[] = [];
  if (taskStatus !== 'Done') {
    writes.push({
      path: toPortablePath(path.relative(projectRoot, path.join(task.dir, 'TASK.md'))),
      action: 'update',
      field: 'task-status',
      before: taskStatus,
      after: 'Done',
      applied: false
    });
  }

  if (!board.present) {
    writes.push({
      path: 'docs/TASK_BOARD.md',
      action: 'insert',
      field: 'task-board-row',
      before: null,
      after: formatTaskBoardRow(task, capsule, 'Done'),
      applied: false
    });
    return writes;
  }

  if (board.duplicates) {
    issues.push({
      severity: 'error',
      code: 'TASK_BOARD_ROW_DUPLICATE',
      message: `docs/TASK_BOARD.md contains multiple rows for ${task.id}; refusing bounded finish sync.`,
      path: 'docs/TASK_BOARD.md'
    });
    return writes;
  }

  const expected = formatTaskBoardRow(task, capsule, 'Done');
  if (board.line !== expected) {
    writes.push({
      path: 'docs/TASK_BOARD.md',
      action: 'update',
      field: 'task-board-row',
      before: board.line,
      after: expected,
      applied: false
    });
  }
  return writes;
}

function applyWrites(projectRoot: string, task: TaskCapsule, writes: TaskFinishWrite[]): void {
  for (const write of writes) {
    if (write.field === 'task-status') {
      const taskPath = path.join(task.dir, 'TASK.md');
      const content = fs.readFileSync(taskPath, 'utf8');
      fs.writeFileSync(taskPath, replaceTaskStatus(content, 'Done'), 'utf8');
      write.applied = true;
    }
    if (write.field === 'task-board-row') {
      const taskBoardPath = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
      const content = fs.existsSync(taskBoardPath) ? fs.readFileSync(taskBoardPath, 'utf8') : defaultTaskBoard();
      const next = write.action === 'insert' ? appendTaskBoardRow(content, write.after) : replaceTaskBoardRow(content, task.id, write.after);
      fs.writeFileSync(taskBoardPath, next, 'utf8');
      write.applied = true;
    }
  }
}

interface TaskBoardProjection {
  present: boolean;
  duplicates: boolean;
  line: string | null;
  status: string | null;
}

function readTaskBoard(projectRoot: string, taskId: string): TaskBoardProjection {
  const taskBoardPath = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  if (!fs.existsSync(taskBoardPath)) return { present: false, duplicates: false, line: null, status: null };
  const lines = fs.readFileSync(taskBoardPath, 'utf8').split(/\r?\n/);
  const matches = lines.filter((line) => line.startsWith(`| ${taskId} |`));
  if (matches.length === 0) return { present: false, duplicates: false, line: null, status: null };
  const cells = matches[0]
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim());
  return { present: true, duplicates: matches.length > 1, line: matches[0], status: cells[2] ?? null };
}

function readTaskStatus(task: TaskCapsule): string {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return 'Unknown';
  const match = fs.readFileSync(taskPath, 'utf8').match(/^## Status\s*\n+([\s\S]*?)(?:\n## |\s*$)/m);
  return match?.[1]?.trim().split(/\r?\n/)[0]?.trim() || 'Unknown';
}

function replaceTaskStatus(content: string, status: string): string {
  const withMetadata = content.replace(/^(\|\s*Status\s*\|\s*)[^|]*(\|)$/m, `$1${status} $2`);
  return withMetadata.replace(/^## Status\s*\n+[\s\S]*?(?=\n## Status History)/m, `## Status\n\n${status}\n`);
}

function replaceTaskBoardRow(content: string, taskId: string, row: string): string {
  return content
    .split(/\r?\n/)
    .map((line) => (line.startsWith(`| ${taskId} |`) ? row : line))
    .join('\n');
}

function appendTaskBoardRow(content: string, row: string): string {
  const normalized = content.endsWith('\n') ? content : `${content}\n`;
  return `${normalized}${row}\n`;
}

function formatTaskBoardRow(task: TaskCapsule, capsule: string, status: string): string {
  return `| ${task.id} | ${task.title.replace(/\|/g, '/')} | ${status} | ${capsule} | |`;
}

function defaultTaskBoard(): string {
  return '# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n';
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
