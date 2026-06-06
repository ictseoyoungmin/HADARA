import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import type { HadaraActorContext } from '../core/actor-context';
import { readMarkdownSection, readMarkdownSectionWithHeading } from '../services/markdown-table';
import { createTaskLifecycleNextAction, defaultTaskLifecycleActor, selectPrimaryNextAction, TaskLifecycleNextAction } from './lifecycle-next-actions';
import { findTaskCapsule, TaskCapsule } from './task-capsule';

export type TaskFinishMode = 'dry-run' | 'execute';

export interface TaskFinishReport {
  schemaVersion: 'hadara.task.finish.v1';
  command: 'task.finish';
  ok: boolean;
  mode: TaskFinishMode;
  taskId: string;
  projectRoot: string;
  actor: HadaraActorContext;
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
    stateDocsPending: number;
  };
  writes: TaskFinishWrite[];
  advisories: TaskFinishAdvisory[];
  stateDocs: TaskFinishStateDoc[];
  nextActions: TaskFinishNextAction[];
  primaryNextAction?: TaskFinishNextAction;
  issues: TaskFinishIssue[];
}

export type TaskFinishNextAction = TaskLifecycleNextAction;

export interface TaskFinishWrite {
  path: string;
  action: 'update' | 'insert';
  field: 'task-status' | 'task-board-row';
  before: string | null;
  after: string;
  expectedBeforeExists: boolean;
  expectedBeforeHash: string;
  afterHash: string;
  applied: boolean;
}

export interface TaskFinishAdvisory {
  path: string;
  reason: string;
  mode: 'dry-run-only';
  state?: 'current' | 'pending' | 'missing';
}

export interface TaskFinishStateDoc {
  path: 'docs/DEVELOPMENT_SLICES.md' | 'docs/PROJECT_STATE.md' | 'docs/AGENT_HANDOFF.md';
  present: boolean;
  mentionsTask: boolean;
  state: 'current' | 'pending' | 'missing';
  reason: string;
  recommendation: string;
}

export interface TaskFinishIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  path?: string;
}

export interface TaskFinishOptions {
  actor?: HadaraActorContext;
}

export function createTaskFinishReport(projectRoot: string, taskId: string, mode: TaskFinishMode, options: TaskFinishOptions = {}): TaskFinishReport {
  const actor = options.actor ?? defaultTaskLifecycleActor();
  const task = findTaskCapsule(projectRoot, taskId);
  const issues: TaskFinishIssue[] = [];
  if (!task) {
    return {
      schemaVersion: 'hadara.task.finish.v1',
      command: 'task.finish',
      ok: false,
      mode,
      taskId,
      projectRoot,
      actor,
      status: { taskStatus: null, taskBoardStatus: null, taskBoardPresent: false },
      summary: { plannedWrites: 0, appliedWrites: 0, advisoryOnly: 0, stateDocsPending: 0 },
      writes: [],
      advisories: [],
      stateDocs: [],
      nextActions: [],
      issues: [{ severity: 'error', code: 'TASK_NOT_FOUND', message: `Task Capsule not found: ${taskId}` }]
    };
  }

  const capsule = toPortablePath(path.relative(projectRoot, task.dir));
  const taskStatus = readTaskStatus(task);
  const statusHistoryStatus = readLatestStatusHistoryStatus(task);
  const board = readTaskBoard(projectRoot, task.id);
  const writes = planWrites(projectRoot, task, capsule, taskStatus, statusHistoryStatus, board, issues);
  const stateDocs = createStateDocAdvisories(projectRoot, task);
  if (mode === 'execute' && !issues.some((issue) => issue.severity === 'error')) {
    applyWrites(projectRoot, writes, issues);
  }
  const nextActions = createFinishNextActions(taskId, mode, writes, stateDocs, issues);

  return {
    schemaVersion: 'hadara.task.finish.v1',
    command: 'task.finish',
    ok: !issues.some((issue) => issue.severity === 'error'),
    mode,
    taskId,
    projectRoot,
    actor,
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
      advisoryOnly: stateDocs.length,
      stateDocsPending: stateDocs.filter((doc) => doc.state !== 'current').length
    },
    writes,
    advisories: stateDocs.map((doc) => ({ path: doc.path, reason: doc.reason, mode: 'dry-run-only' as const, state: doc.state })),
    stateDocs,
    nextActions,
    ...(selectPrimaryNextAction(nextActions) ? { primaryNextAction: selectPrimaryNextAction(nextActions) } : {}),
    issues
  };
}

function createFinishNextActions(taskId: string, mode: TaskFinishMode, writes: TaskFinishWrite[], stateDocs: TaskFinishStateDoc[], issues: TaskFinishIssue[]): TaskFinishNextAction[] {
  if (issues.some((issue) => issue.severity === 'error')) {
    return [
      createTaskLifecycleNextAction({
        id: 'resolve-finish-blockers',
        kind: 'review',
        required: true,
        message: 'Resolve finish blockers before applying task status bookkeeping.',
        writeBoundary: 'read-only',
        recommendedActorRole: 'worker',
        requiresBeforeHash: false,
        stalePlanRisk: 'none'
      })
    ];
  }
  if (mode === 'dry-run' && writes.length > 0) {
    return [
      createTaskLifecycleNextAction({
        id: 'execute-finish',
        required: true,
        command: `hadara task finish --task ${taskId} --execute --json`,
        message: 'Apply bounded task status and Task Board bookkeeping after reviewing this dry-run plan.',
        writeBoundary: 'task-local',
        recommendedActorRole: 'worker',
        requiresBeforeHash: false,
        stalePlanRisk: 'low'
      })
    ];
  }
  const pendingStateDocs = stateDocs.filter((doc) => doc.state !== 'current');
  if (pendingStateDocs.length > 0) {
    return [
      createTaskLifecycleNextAction({
        id: 'update-state-docs',
        kind: 'review',
        required: true,
        message: 'Update shared state docs before done-level readiness.',
        writeBoundary: 'shared-doc',
        recommendedActorRole: 'coordinator',
        requiresBeforeHash: true,
        stalePlanRisk: 'medium'
      })
    ];
  }
  return [
    createTaskLifecycleNextAction({
      id: 'check-ready',
      required: false,
      command: `hadara task ready --task ${taskId} --level done --json`,
      message: 'Run done-level readiness before closing the task.',
      writeBoundary: 'read-only',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'none'
    })
  ];
}

export function formatTaskFinishReport(report: TaskFinishReport): string {
  const lines = [`[HADARA] task finish ${report.taskId}: ${report.ok ? report.mode : 'blocked'}`];
  lines.push(`planned=${report.summary.plannedWrites} applied=${report.summary.appliedWrites} advisory=${report.summary.advisoryOnly}`);
  for (const write of report.writes) {
    lines.push(`${write.applied ? 'APPLIED' : 'PLANNED'}\t${write.field}\t${write.path}`);
  }
  for (const advisory of report.advisories) {
    lines.push(`ADVISORY\t${advisory.path}\t${advisory.state ?? 'pending'}\t${advisory.reason}`);
  }
  for (const issue of report.issues) {
    lines.push(`[${issue.severity}] ${issue.code}: ${issue.message}`);
  }
  return lines.join('\n');
}

function planWrites(
  projectRoot: string,
  task: TaskCapsule,
  capsule: string,
  taskStatus: string,
  statusHistoryStatus: string | null,
  board: TaskBoardProjection,
  issues: TaskFinishIssue[]
): TaskFinishWrite[] {
  const writes: TaskFinishWrite[] = [];
  if (taskStatus !== 'Done' || statusHistoryStatus !== 'Done') {
    const taskPath = path.join(task.dir, 'TASK.md');
    const taskContent = fs.existsSync(taskPath) ? fs.readFileSync(taskPath, 'utf8') : '';
    const nextTaskContent = normalizeAtomicTextDocument(replaceTaskStatus(taskContent, 'Done'));
    if (nextTaskContent === taskContent || latestStatusHistoryStatus(nextTaskContent) !== 'Done') {
      issues.push({
        severity: 'error',
        code: 'TASK_FINISH_TASK_STATUS_REPLACE_FAILED',
        message: 'TASK.md does not contain the expected metadata/status/history frames for bounded finish sync.',
        path: toPortablePath(path.relative(projectRoot, taskPath))
      });
    } else {
      writes.push({
        path: toPortablePath(path.relative(projectRoot, taskPath)),
        action: 'update',
        field: 'task-status',
        before: taskStatus,
        after: 'Done',
        expectedBeforeExists: true,
        expectedBeforeHash: hashContent(taskContent),
        afterHash: hashContent(nextTaskContent),
        applied: false
      });
    }
  }

  if (board.exists && !board.tableFramePresent) {
    issues.push({
      severity: 'error',
      code: 'TASK_BOARD_TABLE_FRAME_MISSING',
      message: 'docs/TASK_BOARD.md is missing the canonical table frame; refusing bounded finish sync.',
      path: 'docs/TASK_BOARD.md'
    });
    return writes;
  }

  if (!board.present) {
    const beforeContent = board.content ?? defaultTaskBoard();
    const afterRow = formatTaskBoardRow(task, capsule, 'Done');
    const afterContent = normalizeAtomicTextDocument(appendTaskBoardRow(beforeContent, afterRow));
    writes.push({
      path: 'docs/TASK_BOARD.md',
      action: 'insert',
      field: 'task-board-row',
      before: null,
      after: afterRow,
      expectedBeforeExists: board.exists,
      expectedBeforeHash: hashContent(beforeContent),
      afterHash: hashContent(afterContent),
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
    const beforeContent = board.content ?? '';
    const afterContent = normalizeAtomicTextDocument(replaceTaskBoardRow(beforeContent, task.id, expected));
    if (afterContent === beforeContent) {
      issues.push({
        severity: 'error',
        code: 'TASK_FINISH_TASK_BOARD_REPLACE_FAILED',
        message: `docs/TASK_BOARD.md row for ${task.id} could not be replaced safely.`,
        path: 'docs/TASK_BOARD.md'
      });
      return writes;
    }
    writes.push({
      path: 'docs/TASK_BOARD.md',
      action: 'update',
      field: 'task-board-row',
      before: board.line,
      after: expected,
      expectedBeforeExists: true,
      expectedBeforeHash: hashContent(beforeContent),
      afterHash: hashContent(afterContent),
      applied: false
    });
  }
  return writes;
}

function applyWrites(projectRoot: string, writes: TaskFinishWrite[], issues: TaskFinishIssue[]): void {
  const prepared: Array<{ write: TaskFinishWrite; absolutePath: string; tmpPath: string; existed: boolean; original: string }> = [];
  const committed: typeof prepared = [];
  try {
    for (const write of writes) {
      const absolutePath = path.resolve(projectRoot, write.path);
      const relative = path.relative(projectRoot, absolutePath);
      if (relative.startsWith('..') || path.isAbsolute(relative)) {
        issues.push({ severity: 'error', code: 'TASK_FINISH_PATH_OUTSIDE_PROJECT', message: `Refusing to write outside project: ${write.path}`, path: write.path });
        continue;
      }

      const existed = fs.existsSync(absolutePath);
      const current = existed ? fs.readFileSync(absolutePath, 'utf8') : missingFileBaseline(write);
      if (existed !== write.expectedBeforeExists || hashContent(current) !== write.expectedBeforeHash) {
        issues.push({
          severity: 'error',
          code: 'TASK_FINISH_WRITE_CONFLICT',
          message: `${write.path} changed after finish planning; rerun dry-run before executing.`,
          path: write.path
        });
        continue;
      }

      const next = nextWriteContent(current, write);
      if (next === current) {
        issues.push({
          severity: 'error',
          code: 'TASK_FINISH_NOOP_WRITE',
          message: `${write.path} did not change after applying planned finish write.`,
          path: write.path
        });
        continue;
      }
      if (hashContent(next) !== write.afterHash) {
        issues.push({
          severity: 'error',
          code: 'TASK_FINISH_AFTER_HASH_MISMATCH',
          message: `${write.path} planned after hash does not match generated content.`,
          path: write.path
        });
        continue;
      }

      fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
      const tmpPath = path.join(path.dirname(absolutePath), `.hadara-task-finish-${process.pid}-${Date.now()}-${prepared.length}-${path.basename(absolutePath)}.tmp`);
      fs.writeFileSync(tmpPath, next, { encoding: 'utf8', flag: 'wx' });
      prepared.push({ write, absolutePath, tmpPath, existed, original: current });
    }
    if (issues.some((issue) => issue.severity === 'error')) {
      for (const item of prepared) if (fs.existsSync(item.tmpPath)) fs.rmSync(item.tmpPath, { force: true });
      return;
    }
    for (const item of prepared) {
      fs.renameSync(item.tmpPath, item.absolutePath);
      committed.push(item);
      item.write.applied = true;
    }
  } catch (error) {
    for (const item of prepared) if (fs.existsSync(item.tmpPath)) fs.rmSync(item.tmpPath, { force: true });
    for (const item of committed.reverse()) {
      try {
        if (item.existed) fs.writeFileSync(item.absolutePath, item.original, 'utf8');
        else if (fs.existsSync(item.absolutePath)) fs.rmSync(item.absolutePath, { force: true });
        item.write.applied = false;
      } catch {
        issues.push({ severity: 'warning', code: 'TASK_FINISH_ROLLBACK_INCOMPLETE', message: `Rollback failed for ${item.write.path}.`, path: item.write.path });
      }
    }
    issues.push({
      severity: 'error',
      code: 'TASK_FINISH_ATOMIC_WRITE_FAILED',
      message: `Atomic task finish write failed and rollback was attempted. Cause: ${error instanceof Error ? error.message : String(error)}`
    });
  }
}

function createStateDocAdvisories(projectRoot: string, task: TaskCapsule): TaskFinishStateDoc[] {
  return [
    stateDoc(projectRoot, task, 'docs/DEVELOPMENT_SLICES.md', 'Slice completion evidence still requires operator-authored summary.', 'Add or update a Development Slices row with Done evidence for this task.'),
    stateDoc(projectRoot, task, 'docs/PROJECT_STATE.md', 'Latest completed/current task prose remains operator-authored.', 'Update Project State current phase/status text if this task changes project capability state.'),
    stateDoc(projectRoot, task, 'docs/AGENT_HANDOFF.md', 'Next-session handoff remains operator-authored.', 'Update Agent Handoff latest completed task, validation baseline, known problems, and next recommended step.')
  ];
}

function stateDoc(
  projectRoot: string,
  task: TaskCapsule,
  relativePath: TaskFinishStateDoc['path'],
  baseReason: string,
  recommendation: string
): TaskFinishStateDoc {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return {
      path: relativePath,
      present: false,
      mentionsTask: false,
      state: 'missing',
      reason: `${baseReason} File is missing.`,
      recommendation
    };
  }
  const content = fs.readFileSync(absolutePath, 'utf8');
  const mentionsTask = content.includes(task.id);
  return {
    path: relativePath,
    present: true,
    mentionsTask,
    state: mentionsTask ? 'current' : 'pending',
    reason: mentionsTask ? `${baseReason} This document already mentions ${task.id}.` : `${baseReason} This document does not mention ${task.id}.`,
    recommendation
  };
}

interface TaskBoardProjection {
  exists: boolean;
  present: boolean;
  duplicates: boolean;
  tableFramePresent: boolean;
  line: string | null;
  status: string | null;
  content: string | null;
}

function readTaskBoard(projectRoot: string, taskId: string): TaskBoardProjection {
  const taskBoardPath = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  if (!fs.existsSync(taskBoardPath)) return { exists: false, present: false, duplicates: false, tableFramePresent: false, line: null, status: null, content: null };
  const content = fs.readFileSync(taskBoardPath, 'utf8');
  const lines = content.split(/\r?\n/);
  const matches = lines.filter((line) => line.startsWith(`| ${taskId} |`));
  const tableFramePresent = hasTaskBoardTableFrame(lines);
  if (matches.length === 0) return { exists: true, present: false, duplicates: false, tableFramePresent, line: null, status: null, content };
  const cells = matches[0]
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim());
  return { exists: true, present: true, duplicates: matches.length > 1, tableFramePresent, line: matches[0], status: cells[2] ?? null, content };
}

function readTaskStatus(task: TaskCapsule): string {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return 'Unknown';
  const match = fs.readFileSync(taskPath, 'utf8').match(/^## Status\s*\n+([\s\S]*?)(?:\n## |\s*$)/m);
  return match?.[1]?.trim().split(/\r?\n/)[0]?.trim() || 'Unknown';
}

function readLatestStatusHistoryStatus(task: TaskCapsule): string | null {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return null;
  return latestStatusHistoryStatus(fs.readFileSync(taskPath, 'utf8'));
}

function replaceTaskStatus(content: string, status: string): string {
  const withMetadata = content.replace(/^(\|\s*Status\s*\|\s*)[^|]*(\|)$/m, `$1${status} $2`);
  const withStatus = withMetadata.replace(/^## Status\s*\n+[\s\S]*?(?=\n## Status History)/m, `## Status\n\n${status}\n`);
  return appendStatusHistoryDone(withStatus);
}

function nextWriteContent(current: string, write: TaskFinishWrite): string {
  if (write.field === 'task-status') return normalizeAtomicTextDocument(replaceTaskStatus(current, write.after));
  if (write.action === 'insert') return normalizeAtomicTextDocument(appendTaskBoardRow(current || defaultTaskBoard(), write.after));
  const taskId = write.after.match(/^\|\s*(T-\d{4})\s*\|/)?.[1];
  if (!taskId) return current;
  return normalizeAtomicTextDocument(replaceTaskBoardRow(current, taskId, write.after));
}

function normalizeAtomicTextDocument(content: string): string {
  return `${content.replace(/[ \t\r\n]+$/, '')}\n`;
}

function missingFileBaseline(write: TaskFinishWrite): string {
  if (write.field === 'task-board-row' && write.action === 'insert') return defaultTaskBoard();
  return '';
}

function replaceTaskBoardRow(content: string, taskId: string, row: string): string {
  return content
    .split(/\r?\n/)
    .map((line) => (line.startsWith(`| ${taskId} |`) ? row : line))
    .join('\n');
}

function appendStatusHistoryDone(content: string): string {
  if (latestStatusHistoryStatus(content) === 'Done') return content;
  const section = readMarkdownSectionWithHeading(content, '## Status History');
  if (!section) return content;

  const start = content.indexOf(section);
  if (start < 0) return content;
  const end = start + section.length;
  const prefix = content.slice(0, start);
  const suffix = content.slice(end);
  const row = `| ${new Date().toISOString().slice(0, 10)} | Done | Finished task capsule. | \`hadara task finish --execute\` |`;
  const separator = section.endsWith('\n') ? '' : '\n';
  return `${prefix}${section}${separator}${row}\n${suffix}`;
}

function latestStatusHistoryStatus(content: string): string | null {
  const rows = readMarkdownSection(content, '## Status History')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && !/^\|\s*-+/.test(line) && !/^\|\s*Time\s*\|/i.test(line));
  const latest = rows.at(-1);
  if (!latest) return null;
  const cells = latest
    .slice(1, latest.endsWith('|') ? -1 : undefined)
    .split('|')
    .map((cell) => cell.trim());
  return cells[1] || null;
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

function hasTaskBoardTableFrame(lines: string[]): boolean {
  return lines.some((line) => line.trim() === '| ID | Title | Status | Capsule | Notes |') && lines.some((line) => /^\|\s*-+\s*\|\s*-+\s*\|\s*-+\s*\|\s*-+\s*\|\s*-+\s*\|$/.test(line.trim()));
}

function hashContent(content: string): string {
  return `sha256:${crypto.createHash('sha256').update(content).digest('hex')}`;
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
