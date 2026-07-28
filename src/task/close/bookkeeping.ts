import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import type { HadaraActorContext } from '../../core/actor-context';
import { formatLocalMinuteTimestamp } from '../../core/local-time';
import { parseMarkdownRowsUnderHeading, readMarkdownSection, readMarkdownSectionWithHeading } from '../../services/markdown-table';
import { continuationFromTaskHandoffStep, planCompletedProjectCurrentStateWrites } from '../../services/project-current-state';
import { createTaskLifecycleNextAction, defaultTaskLifecycleActor, selectPrimaryNextAction, TaskLifecycleNextAction } from '../lifecycle-next-actions';
import { findTaskCapsule, TaskCapsule } from '../task-capsule';
import {
  defaultTaskBoard,
  formatTaskBoardRow,
  normalizeCloseSummary,
  parseTaskBoard,
  type TaskBoardSchema
} from '../task-board';

export type CloseBookkeepingMode = 'dry-run' | 'execute';

export interface CloseBookkeepingReport {
  schemaVersion: 'hadara.task.close_bookkeeping.v1';
  command: 'task.close-bookkeeping';
  ok: boolean;
  mode: CloseBookkeepingMode;
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
  writes: CloseBookkeepingWrite[];
  advisories: CloseBookkeepingAdvisory[];
  stateDocs: CloseBookkeepingStateDoc[];
  nextActions: CloseBookkeepingNextAction[];
  primaryNextAction?: CloseBookkeepingNextAction;
  issues: CloseBookkeepingIssue[];
}

export type CloseBookkeepingNextAction = TaskLifecycleNextAction;

export interface CloseBookkeepingWrite {
  path: string;
  action: 'update' | 'insert';
  field: 'task-status' | 'task-handoff-identity' | 'task-board-row' | 'current-state' | 'project-state-projection' | 'handoff-projection';
  before: string | null;
  after: string;
  expectedBeforeExists: boolean;
  expectedBeforeHash: string;
  afterHash: string;
  applied: boolean;
  contentAfter?: string;
}

export interface CloseBookkeepingAdvisory {
  path: string;
  reason: string;
  mode: 'dry-run-only';
  state?: 'current' | 'pending' | 'missing';
}

export interface CloseBookkeepingStateDoc {
  path: 'docs/DEVELOPMENT_SLICES.md' | 'docs/PROJECT_STATE.md' | 'docs/AGENT_HANDOFF.md';
  present: boolean;
  mentionsTask: boolean;
  state: 'current' | 'pending' | 'missing';
  reason: string;
  recommendation: string;
}

export interface CloseBookkeepingIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  path?: string;
}

export interface CloseBookkeepingOptions {
  actor?: HadaraActorContext;
}

export function createCloseBookkeepingReport(projectRoot: string, taskId: string, mode: CloseBookkeepingMode, options: CloseBookkeepingOptions = {}): CloseBookkeepingReport {
  const actor = options.actor ?? defaultTaskLifecycleActor();
  const task = findTaskCapsule(projectRoot, taskId);
  const issues: CloseBookkeepingIssue[] = [];
  if (!task) {
    return {
      schemaVersion: 'hadara.task.close_bookkeeping.v1',
      command: 'task.close-bookkeeping',
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
  const handoffTableIssue = validateHandoffNextStepTable(task);
  if (handoffTableIssue) issues.push(handoffTableIssue);
  const handoffNextStep = readTaskHandoffNextStep(task);
  const handoffContinuationIssue = handoffTableIssue ? null : validateStructuredHandoffContinuation(handoffNextStep);
  if (handoffContinuationIssue) issues.push(handoffContinuationIssue);
  const handoffContinuation = handoffNextStep && !handoffContinuationIssue
    ? continuationFromTaskHandoffStep({
        step: handoffNextStep.step,
        reason: handoffNextStep.reason,
        requiredReading: handoffNextStep.requiredReading,
        disposition: handoffNextStep.disposition,
        createTask: handoffNextStep.createTask,
        sourceTaskId: task.id,
        sourceCapsulePath: capsule
      })
    : undefined;
  const promotedContinuation = handoffContinuation?.disposition === 'terminal' ? null : handoffContinuation ?? undefined;
  const currentStatePlan = planCompletedProjectCurrentStateWrites(projectRoot, { id: task.id, title: task.title }, promotedContinuation);
  issues.push(...currentStatePlan.issues.map((issue) => ({
    severity: issue.severity,
    code: issue.code,
    message: issue.message,
    path: issue.path
  })));
  const stateSpecs = stateDocSpecs(projectRoot);
  const applicableStatePaths = new Set(stateSpecs.map((spec) => spec.path));
  const currentStateWrites = currentStatePlan.writes.filter((write) =>
    !write.path.startsWith('docs/') || applicableStatePaths.has(write.path as CloseBookkeepingStateDoc['path'])
  );
  for (const write of currentStateWrites) {
    writes.push({
      path: write.path,
      action: write.before === null ? 'insert' : 'update',
      field: write.path === '.hadara/state/current.json'
        ? 'current-state'
        : write.path === 'docs/PROJECT_STATE.md'
          ? 'project-state-projection'
          : 'handoff-projection',
      before: write.before,
      after: write.after,
      expectedBeforeExists: write.before !== null,
      expectedBeforeHash: hashContent(write.before ?? ''),
      afterHash: hashContent(write.after),
      applied: false,
      contentAfter: write.after
    });
  }
  const projectedPaths = new Set(currentStateWrites.map((write) => write.path));
  const stateDocs = createStateDocAdvisories(projectRoot, task, stateSpecs, projectedPaths);
  if (mode === 'execute' && !issues.some((issue) => issue.severity === 'error')) {
    applyCloseBookkeepingWrites(projectRoot, writes, issues);
  }
  const nextActions = createBookkeepingNextActions(taskId, mode, writes, stateDocs, issues);

  return {
    schemaVersion: 'hadara.task.close_bookkeeping.v1',
    command: 'task.close-bookkeeping',
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

export function executeReviewedCloseBookkeepingPlan(projectRoot: string, bookkeepingPlan: CloseBookkeepingReport): CloseBookkeepingReport {
  const writes = bookkeepingPlan.writes.map((write) => ({ ...write, applied: false }));
  const issues = [...bookkeepingPlan.issues];
  if (!issues.some((issue) => issue.severity === 'error')) {
    applyCloseBookkeepingWrites(projectRoot, writes, issues);
  }
  const nextActions = createBookkeepingNextActions(bookkeepingPlan.taskId, 'execute', writes, bookkeepingPlan.stateDocs, issues);
  return {
    ...bookkeepingPlan,
    mode: 'execute',
    ok: !issues.some((issue) => issue.severity === 'error'),
    writes,
    nextActions,
    ...(selectPrimaryNextAction(nextActions) ? { primaryNextAction: selectPrimaryNextAction(nextActions) } : {}),
    issues,
    summary: {
      ...bookkeepingPlan.summary,
      plannedWrites: writes.length,
      appliedWrites: writes.filter((write) => write.applied).length
    }
  };
}

function createBookkeepingNextActions(taskId: string, mode: CloseBookkeepingMode, writes: CloseBookkeepingWrite[], stateDocs: CloseBookkeepingStateDoc[], issues: CloseBookkeepingIssue[]): CloseBookkeepingNextAction[] {
  if (issues.some((issue) => issue.severity === 'error')) {
    return [
      createTaskLifecycleNextAction({
        id: 'resolve-bookkeeping-blockers',
        kind: 'review',
        required: true,
        message: 'Resolve bookkeeping blockers before applying task status bookkeeping.',
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
        id: 'execute-bookkeeping',
        required: true,
        command: `hadara task close --task ${taskId} --json`,
        message: 'Apply bounded task status and Task Board bookkeeping through guarded task close.',
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
      command: `hadara task status --task ${taskId} --detail full --json`,
      message: 'Inspect done-level readiness before closing the task.',
      writeBoundary: 'read-only',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'none'
    })
  ];
}

export function formatCloseBookkeepingReport(report: CloseBookkeepingReport): string {
  const lines = [`[HADARA] task bookkeeping ${report.taskId}: ${report.ok ? report.mode : 'blocked'}`];
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
  issues: CloseBookkeepingIssue[]
): CloseBookkeepingWrite[] {
  const writes: CloseBookkeepingWrite[] = [];
  const bookkeepingTimestamp = formatLocalMinuteTimestamp();
  const bookkeepingRequired = taskStatus !== 'Done' || (statusHistoryStatus !== null && statusHistoryStatus !== 'Done');
  if (bookkeepingRequired) {
    const taskPath = path.join(task.dir, 'TASK.md');
    const taskContent = fs.existsSync(taskPath) ? fs.readFileSync(taskPath, 'utf8') : '';
    const nextTaskContent = normalizeAtomicTextDocument(replaceTaskStatus(taskContent, 'Done', bookkeepingTimestamp));
    const nextStatusHistoryStatus = latestStatusHistoryStatus(nextTaskContent);
    if (nextTaskContent === taskContent || (statusHistoryStatus !== null && nextStatusHistoryStatus !== 'Done')) {
      issues.push({
        severity: 'error',
        code: 'TASK_CLOSE_BOOKKEEPING_TASK_STATUS_REPLACE_FAILED',
        message: 'TASK.md does not contain the expected metadata/status/history frames for bounded bookkeeping sync.',
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
        applied: false,
        contentAfter: nextTaskContent
      });
    }
  }

  const handoffPath = path.join(task.dir, 'HANDOFF.md');
  if (fs.existsSync(handoffPath)) {
    const handoffContent = fs.readFileSync(handoffPath, 'utf8');
    const shouldSyncHandoff = bookkeepingRequired || /^## Identity\s*$/m.test(handoffContent);
    const nextHandoffContent = shouldSyncHandoff
      ? normalizeAtomicTextDocument(syncHandoffIdentity(handoffContent, task, bookkeepingTimestamp))
      : normalizeAtomicTextDocument(handoffContent);
    if (nextHandoffContent !== normalizeAtomicTextDocument(handoffContent)) {
      writes.push({
        path: toPortablePath(path.relative(projectRoot, handoffPath)),
        action: 'update',
        field: 'task-handoff-identity',
        before: readIdentityField(handoffContent, 'Status'),
        after: readIdentityField(nextHandoffContent, 'Status') ?? 'Done',
        expectedBeforeExists: true,
        expectedBeforeHash: hashContent(handoffContent),
        afterHash: hashContent(nextHandoffContent),
        applied: false,
        contentAfter: nextHandoffContent
      });
    }
  }

  if (board.exists && !board.tableFramePresent) {
    issues.push({
      severity: 'error',
      code: 'TASK_BOARD_TABLE_FRAME_MISSING',
      message: 'docs/TASK_BOARD.md is missing the canonical table frame; refusing bounded bookkeeping sync.',
      path: 'docs/TASK_BOARD.md'
    });
    return writes;
  }

  if (!board.present) {
    const beforeContent = board.content ?? defaultTaskBoard('v1');
    const afterRow = boardRowAfterClose(task, capsule, board);
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
      applied: false,
      contentAfter: afterContent
    });
    return writes;
  }

  if (board.duplicates) {
    issues.push({
      severity: 'error',
      code: 'TASK_BOARD_ROW_DUPLICATE',
      message: `docs/TASK_BOARD.md contains multiple rows for ${task.id}; refusing bounded bookkeeping sync.`,
      path: 'docs/TASK_BOARD.md'
    });
    return writes;
  }

  const expected = boardRowAfterClose(task, capsule, board);
  if (board.line !== expected) {
    const beforeContent = board.content ?? '';
    const afterContent = normalizeAtomicTextDocument(replaceTaskBoardRow(beforeContent, task.id, expected));
    if (afterContent === beforeContent) {
      issues.push({
        severity: 'error',
        code: 'TASK_CLOSE_BOOKKEEPING_TASK_BOARD_REPLACE_FAILED',
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
      applied: false,
      contentAfter: afterContent
    });
  }
  return writes;
}

export function applyCloseBookkeepingWrites(projectRoot: string, writes: CloseBookkeepingWrite[], issues: CloseBookkeepingIssue[]): void {
  const prepared: Array<{ write: CloseBookkeepingWrite; absolutePath: string; tmpPath: string; existed: boolean; original: string }> = [];
  const committed: typeof prepared = [];
  try {
    for (const write of writes) {
      const absolutePath = path.resolve(projectRoot, write.path);
      const relative = path.relative(projectRoot, absolutePath);
      if (relative.startsWith('..') || path.isAbsolute(relative)) {
        issues.push({ severity: 'error', code: 'TASK_CLOSE_BOOKKEEPING_PATH_OUTSIDE_PROJECT', message: `Refusing to write outside project: ${write.path}`, path: write.path });
        continue;
      }

      const existed = fs.existsSync(absolutePath);
      const current = existed ? fs.readFileSync(absolutePath, 'utf8') : missingFileBaseline(write);
      if (existed !== write.expectedBeforeExists || hashContent(current) !== write.expectedBeforeHash) {
        issues.push({
          severity: 'error',
          code: 'TASK_CLOSE_BOOKKEEPING_WRITE_CONFLICT',
          message: `${write.path} changed after bookkeeping planning; rerun dry-run before executing.`,
          path: write.path
        });
        continue;
      }

      const next = nextWriteContent(current, write);
      if (next === current) {
        issues.push({
          severity: 'error',
          code: 'TASK_CLOSE_BOOKKEEPING_NOOP_WRITE',
          message: `${write.path} did not change after applying planned bookkeeping write.`,
          path: write.path
        });
        continue;
      }
      if (hashContent(next) !== write.afterHash) {
        issues.push({
          severity: 'error',
          code: 'TASK_CLOSE_BOOKKEEPING_AFTER_HASH_MISMATCH',
          message: `${write.path} planned after hash does not match generated content.`,
          path: write.path
        });
        continue;
      }

      fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
      const tmpPath = path.join(path.dirname(absolutePath), `.hadara-task-close-bookkeeping-${process.pid}-${Date.now()}-${prepared.length}-${path.basename(absolutePath)}.tmp`);
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
        issues.push({ severity: 'warning', code: 'TASK_CLOSE_BOOKKEEPING_ROLLBACK_INCOMPLETE', message: `Rollback failed for ${item.write.path}.`, path: item.write.path });
      }
    }
    issues.push({
      severity: 'error',
      code: 'TASK_CLOSE_BOOKKEEPING_ATOMIC_WRITE_FAILED',
      message: `Atomic task bookkeeping write failed and rollback was attempted. Cause: ${error instanceof Error ? error.message : String(error)}`
    });
  }
}

function createStateDocAdvisories(
  projectRoot: string,
  task: TaskCapsule,
  specs: Array<{ path: CloseBookkeepingStateDoc['path']; reason: string; recommendation: string }>,
  projectedPaths: Set<string>
): CloseBookkeepingStateDoc[] {
  return specs
    .map((spec) => stateDoc(projectRoot, task, spec.path, spec.reason, spec.recommendation, projectedPaths.has(spec.path)))
    .filter((doc) => doc.path !== 'docs/DEVELOPMENT_SLICES.md' || doc.mentionsTask);
}

function stateDocSpecs(projectRoot: string): Array<{ path: CloseBookkeepingStateDoc['path']; reason: string; recommendation: string }> {
  const specs: Array<{ path: CloseBookkeepingStateDoc['path']; reason: string; recommendation: string }> = [
    { path: 'docs/DEVELOPMENT_SLICES.md', reason: 'Slice completion evidence still requires operator-authored summary.', recommendation: 'Add or update a Development Slices row with Done evidence for this task.' },
    { path: 'docs/PROJECT_STATE.md', reason: 'Latest completed/current task prose remains operator-authored.', recommendation: 'Update Project State current phase/status text if this task changes project capability state.' },
    { path: 'docs/AGENT_HANDOFF.md', reason: 'Next-session handoff remains operator-authored.', recommendation: 'Update Agent Handoff latest completed task, validation baseline, known problems, and next recommended step.' }
  ];
  const registryPath = ['documents.json', 'docs-registry.json']
    .map((name) => path.join(projectRoot, '.hadara', name))
    .find((candidate) => fs.existsSync(candidate));
  const registered = registryPath ? readRegisteredDocPaths(registryPath) : null;
  return specs.filter((spec) =>
    fs.existsSync(path.join(projectRoot, spec.path))
    && (registered === null || registered.has(spec.path))
  );
}

function readRegisteredDocPaths(registryPath: string): Set<string> {
  try {
    const parsed = JSON.parse(fs.readFileSync(registryPath, 'utf8')) as { documents?: Array<{ path?: unknown }> };
    return new Set((parsed.documents ?? []).map((doc) => typeof doc.path === 'string' ? doc.path : '').filter(Boolean));
  } catch {
    return new Set();
  }
}

function stateDoc(
  projectRoot: string,
  task: TaskCapsule,
  relativePath: CloseBookkeepingStateDoc['path'],
  baseReason: string,
  recommendation: string,
  projected: boolean
): CloseBookkeepingStateDoc {
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
  if (projected) {
    return {
      path: relativePath,
      present: true,
      mentionsTask,
      state: 'current',
      reason: `${baseReason} The registered managed checkpoint is projected by this bookkeeping transaction.`,
      recommendation
    };
  }
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
  cells: string[] | null;
  status: string | null;
  schema: TaskBoardSchema;
  targets: string;
  result: string;
  content: string | null;
}

function readTaskBoard(projectRoot: string, taskId: string): TaskBoardProjection {
  const taskBoardPath = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  if (!fs.existsSync(taskBoardPath)) return { exists: false, present: false, duplicates: false, tableFramePresent: false, line: null, cells: null, status: null, schema: 'v1', targets: 'project', result: '-', content: null };
  const content = fs.readFileSync(taskBoardPath, 'utf8');
  const parsed = parseTaskBoard(content);
  const matches = parsed.rows.filter((row) => row.id === taskId);
  if (matches.length === 0) return { exists: true, present: false, duplicates: false, tableFramePresent: parsed.tableFramePresent, line: null, cells: null, status: null, schema: parsed.schema, targets: 'project', result: '-', content };
  const row = matches[0];
  return { exists: true, present: true, duplicates: matches.length > 1, tableFramePresent: parsed.tableFramePresent, line: row.line, cells: row.cells, status: row.status, schema: parsed.schema, targets: row.targets, result: row.result, content };
}

function readTaskStatus(task: TaskCapsule): string {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return 'Unknown';
  const content = fs.readFileSync(taskPath, 'utf8');
  const tableStatus = readStatusTableValue(content);
  if (tableStatus) return tableStatus;
  const match = content.match(/^## Status\s*\n+([\s\S]*?)(?:\n## |\s*$)/m);
  return match?.[1]?.trim().split(/\r?\n/)[0]?.trim() || 'Unknown';
}

function readTaskHandoffNextStep(task: TaskCapsule): { step: string; structured: boolean; disposition?: string; createTask?: string; reason: string; requiredReading: string } | null {
  const handoffPath = path.join(task.dir, 'HANDOFF.md');
  if (!fs.existsSync(handoffPath)) return null;
  const content = fs.readFileSync(handoffPath, 'utf8');
  const rows = parseMarkdownRowsUnderHeading(content, '## Next Recommended Step');
  const header = rows[0] ?? [];
  const structured = header.some((cell) => /^disposition$/i.test(cell)) || header.some((cell) => /^create task$/i.test(cell));
  const dataRows = structured ? rows.slice(1) : rows;
  const row = dataRows.find((cells) => {
    const step = (cells[0] ?? '').trim().toLowerCase();
    return step.length > 0 && step !== 'step' && step !== 'tbd';
  });
  if (!row) return null;
  if (!structured) return { step: row[0] ?? '', structured: false, reason: row[1] ?? '', requiredReading: row[2] ?? '' };
  const cell = (name: string): string => {
    const index = header.findIndex((entry) => entry.trim().toLowerCase() === name.toLowerCase());
    return index >= 0 ? row[index] ?? '' : '';
  };
  return {
    step: cell('Step'),
    structured: true,
    disposition: cell('Disposition'),
    createTask: cell('Create Task'),
    reason: cell('Reason'),
    requiredReading: cell('Required Reading')
  };
}

function validateHandoffNextStepTable(task: TaskCapsule): CloseBookkeepingIssue | null {
  const handoffPath = path.join(task.dir, 'HANDOFF.md');
  if (!fs.existsSync(handoffPath)) return null;
  const section = readMarkdownSection(fs.readFileSync(handoffPath, 'utf8'), '## Next Recommended Step');
  const lines = section.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.startsWith('|') && line.endsWith('|'));
  if (lines.length === 0) return null;
  const cells = (line: string): string[] => line.slice(1, -1).split('|').map((cell) => cell.trim());
  const header = cells(lines[0]);
  const structured = ['Step', 'Disposition', 'Create Task', 'Reason', 'Required Reading'];
  const legacy = ['Step', 'Reason', 'Required Reading'];
  const expected = header.length === structured.length && header.every((cell, index) => cell === structured[index])
    ? structured
    : header.length === legacy.length && header.every((cell, index) => cell === legacy[index])
    ? legacy
    : null;
  const divider = lines[1] ? cells(lines[1]) : [];
  const dividerValid = expected !== null && divider.length === expected.length && divider.every((cell) => /^:?-{3,}:?$/.test(cell));
  const dataValid = expected !== null && lines.slice(2).every((line) => {
    const row = cells(line);
    return row.length === expected.length && !row.every((cell) => /^:?-{3,}:?$/.test(cell));
  });
  if (dividerValid && dataValid) return null;
  return {
    severity: 'error',
    code: 'HANDOFF_NEXT_STEP_TABLE_MALFORMED',
    message: 'HANDOFF.md Next Recommended Step must use a recognized header, an immediate divider row, and consistently sized data rows.',
    path: 'HANDOFF.md'
  };
}

function validateStructuredHandoffContinuation(
  handoffNextStep: { structured: boolean; disposition?: string; createTask?: string } | null
): CloseBookkeepingIssue | null {
  if (!handoffNextStep?.structured) return null;
  const disposition = (handoffNextStep.disposition ?? '').trim().toLowerCase().replace(/[_\s]+/g, '-');
  if (disposition && disposition !== 'tbd' && !['actionable', 'waiting-for-operator', 'blocked', 'terminal', 'unresolved'].includes(disposition)) {
    return {
      severity: 'error',
      code: 'HANDOFF_CONTINUATION_DISPOSITION_INVALID',
      message: `HANDOFF.md Next Recommended Step uses invalid Disposition "${handoffNextStep.disposition}". Allowed: actionable, waiting-for-operator, blocked, terminal, unresolved.`,
      path: 'HANDOFF.md'
    };
  }
  const createTask = (handoffNextStep.createTask ?? '').trim().toLowerCase();
  const yesValues = ['yes', 'y', 'true', 'allowed', 'create'];
  const noValues = ['no', 'n', 'false', 'not allowed', 'review only', 'review-only'];
  if (createTask && createTask !== 'tbd' && !yesValues.includes(createTask) && !noValues.includes(createTask)) {
    return {
      severity: 'error',
      code: 'HANDOFF_CONTINUATION_CREATE_TASK_INVALID',
      message: `HANDOFF.md Next Recommended Step uses invalid Create Task "${handoffNextStep.createTask}". Allowed: yes/no or true/false.`,
      path: 'HANDOFF.md'
    };
  }
  if (!disposition || disposition === 'tbd' || !createTask || createTask === 'tbd') return null;
  const createTaskAllowed = yesValues.includes(createTask);
  if (disposition === 'actionable' && !createTaskAllowed) {
    return {
      severity: 'error',
      code: 'HANDOFF_CONTINUATION_SEMANTIC_CONFLICT',
      message: 'HANDOFF.md Next Recommended Step uses Disposition "actionable" with Create Task disabled. Use Create Task=yes for actionable work, or Disposition=waiting-for-operator for review-only follow-up.',
      path: 'HANDOFF.md'
    };
  }
  if (disposition !== 'actionable' && createTaskAllowed) {
    return {
      severity: 'error',
      code: 'HANDOFF_CONTINUATION_SEMANTIC_CONFLICT',
      message: `HANDOFF.md Next Recommended Step uses Disposition "${handoffNextStep.disposition}" with Create Task enabled. Only Disposition=actionable may create a follow-up task.`,
      path: 'HANDOFF.md'
    };
  }
  return null;
}

function readLatestStatusHistoryStatus(task: TaskCapsule): string | null {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return null;
  return latestStatusHistoryStatus(fs.readFileSync(taskPath, 'utf8'));
}

function replaceTaskStatus(content: string, status: string, updatedAt = formatLocalMinuteTimestamp()): string {
  const withMetadata = setIdentityField(setIdentityField(content, 'Status', status), 'Updated', updatedAt);
  const withStatus = withMetadata.includes('## Status History')
    ? withMetadata.replace(/^## Status\s*\n+[\s\S]*?(?=\n## Status History)/m, `## Status\n\n${status}\n`)
    : withMetadata;
  return appendStatusHistoryDone(withStatus);
}

function syncHandoffIdentity(content: string, task: TaskCapsule, updatedAt: string): string {
  const currentStatus = readIdentityField(content, 'Status');
  const nextStatus = 'Done';
  const created = readIdentityField(content, 'Created') ?? readTaskIdentityField(task, 'Created') ?? updatedAt;
  const existingUpdated = readIdentityField(content, 'Updated');
  const shouldUpdateTimestamp = currentStatus !== nextStatus || !existingUpdated;
  const identity = [
    '## Identity',
    '',
    '| Field | Value |',
    '|---|---|',
    `| ID | ${task.id} |`,
    `| Title | ${task.title.replace(/\|/g, '/')} |`,
    `| Status | ${nextStatus} |`,
    `| Created | ${created} |`,
    `| Updated | ${shouldUpdateTimestamp ? updatedAt : existingUpdated} |`
  ].join('\n');
  if (/^## Identity\s*$/m.test(content)) {
    return replaceMarkdownHeadingSection(content, '## Identity', `${identity}\n`);
  }
  return content.replace(/^# Handoff\s*\n*/m, `# Handoff\n\n${identity}\n\n`);
}

function replaceMarkdownHeadingSection(content: string, heading: string, replacement: string): string {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start < 0) return content;
  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^##\s+/.test(lines[index])) {
      end = index;
      break;
    }
  }
  const replacementLines = replacement.trimEnd().split(/\r?\n/);
  if (end < lines.length) replacementLines.push('');
  return `${[...lines.slice(0, start), ...replacementLines, ...lines.slice(end)].join('\n').trimEnd()}\n`;
}

function readTaskIdentityField(task: TaskCapsule, field: string): string | null {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return null;
  return readIdentityField(fs.readFileSync(taskPath, 'utf8'), field);
}

function readIdentityField(content: string, field: string): string | null {
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = content.match(new RegExp(`^\\|\\s*${escaped}\\s*\\|\\s*([^|]+?)\\s*\\|$`, 'm'));
  return match?.[1]?.trim() || null;
}

function setIdentityField(content: string, field: string, value: string): string {
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`^(\\|\\s*${escaped}\\s*\\|\\s*)[^|]*(\\|)$`, 'm');
  return content.replace(pattern, `$1${value} $2`);
}

function readStatusTableValue(content: string): string | null {
  const match = content.match(/^\|\s*Status\s*\|\s*([^|]+?)\s*\|$/m);
  return match?.[1]?.trim() || null;
}

function nextWriteContent(current: string, write: CloseBookkeepingWrite): string {
  if (write.contentAfter !== undefined) return write.contentAfter;
  if (write.field === 'task-status') return normalizeAtomicTextDocument(replaceTaskStatus(current, write.after));
  if (write.action === 'insert') return normalizeAtomicTextDocument(appendTaskBoardRow(current || defaultTaskBoard(), write.after));
  const taskId = write.after.match(/^\|\s*(T-\d{4})\s*\|/)?.[1];
  if (!taskId) return current;
  return normalizeAtomicTextDocument(replaceTaskBoardRow(current, taskId, write.after));
}

function normalizeAtomicTextDocument(content: string): string {
  return `${content.replace(/[ \t\r\n]+$/, '')}\n`;
}

function missingFileBaseline(write: CloseBookkeepingWrite): string {
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
  const row = `| ${new Date().toISOString().slice(0, 10)} | Done | Bookkeepinged task capsule. | \`hadara task close\` |`;
  const managedEnd = '<!-- hadara:managed:end task-status-history -->';
  const managedEndIndex = section.indexOf(managedEnd);
  if (managedEndIndex >= 0) {
    const beforeMarker = section.slice(0, managedEndIndex).replace(/[ \t\r\n]+$/, '');
    const afterMarker = section.slice(managedEndIndex);
    return `${prefix}${beforeMarker}\n${row}\n${afterMarker}${suffix}`;
  }
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

function boardRowAfterClose(task: TaskCapsule, capsule: string, board: TaskBoardProjection): string {
  const schema = board.schema === 'unknown' ? 'v1' : board.schema;
  const taskPath = path.join(task.dir, 'TASK.md');
  const taskContent = fs.existsSync(taskPath) ? fs.readFileSync(taskPath, 'utf8') : '';
  const result = schema === 'v1' ? normalizeCloseSummary(readMarkdownSection(taskContent, '## Close Summary')) || '-' : '-';
  return formatTaskBoardRow(schema, {
    id: task.id,
    title: task.title,
    status: 'Done',
    targets: board.targets,
    capsule,
    result
  }, board.cells ?? undefined);
}

function hashContent(content: string): string {
  return `sha256:${crypto.createHash('sha256').update(content).digest('hex')}`;
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
