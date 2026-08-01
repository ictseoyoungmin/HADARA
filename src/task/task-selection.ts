import fs from 'node:fs';
import path from 'node:path';
import { parseMarkdownRows, readMarkdownSection } from '../services/markdown-table';
import { findTaskCapsule } from './task-capsule';
import { readSlicesState } from '../services/slices-state';
import { continuationFromTaskHandoffStep, isConsumedDoneContinuation } from './handoff-continuation';

export interface TaskSelectionReport {
  schemaVersion: 'hadara.task.selection.v1';
  command: 'task.selection';
  ok: boolean;
  projectRoot: string;
  summary: {
    recommendations: number;
    source: string;
    policy?: 'markdown-first';
  };
  recommendations: TaskSelectionRecommendation[];
  backlog?: TaskSelectionBacklogItem[];
  sources: {
    developmentSlices: { path: string; present: boolean; rows: number };
    taskBoard: { path: string; present: boolean; rows: number };
  };
  issues: TaskSelectionIssue[];
}

export interface TaskSelectionRecommendation {
  taskId: string;
  title: string;
  reason: string;
  source: string;
  sourceKind?: 'development-slices' | 'task-board-fallback' | 'task-handoff-continuation';
  taskBoardStatus: string | null;
  taskBoardPath: string | null;
  taskCapsulePresent: boolean;
  capsule: string | null;
  requiredReading: string[];
  createCommand: string | null;
  operatorGuidance?: string;
  createCommandAllowed?: boolean;
}

export interface TaskSelectionBacklogItem {
  taskId: string;
  title: string;
  status: string;
  source: 'docs/TASK_BOARD.md';
  capsule: string | null;
  taskCapsulePresent: boolean;
  reason: string;
}

export interface TaskSelectionIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
  path?: string;
}

interface SliceRow {
  taskId: string;
  title: string;
  status: string;
}

interface BoardRow {
  taskId: string;
  title: string;
  status: string;
  capsule: string;
}

const REQUIRED_READING_CANDIDATES = ['docs/DEVELOPMENT_SLICES.md', 'docs/TASK_BOARD.md'];

export function createTaskSelectionReport(projectRoot: string): TaskSelectionReport {
  const issues: TaskSelectionIssue[] = [];
  const slices = readDevelopmentSlices(projectRoot, issues);
  const board = readTaskBoard(projectRoot, issues);

  const nextSlice = slices.rows.find((row) => isOpenSliceStatus(row.status));
  const inProgressRecommendation = recommendationFromTaskBoard(projectRoot, board.rows, ['in progress', 'in-progress']);
  const openTaskRecommendation = recommendationFromTaskBoard(projectRoot, board.rows);
  const firstTaskRecommendation = recommendationForEmptyProject(projectRoot, board.rows);
  const sliceRecommendation = nextSlice ? recommendationFromSlice(projectRoot, nextSlice, board.rows) : null;
  const handoffContinuationRecommendation = recommendationFromLatestDoneHandoff(projectRoot, board.rows);
  const recommendation =
    inProgressRecommendation ??
    openTaskRecommendation ??
    sliceRecommendation ??
    handoffContinuationRecommendation ??
    firstTaskRecommendation;
  const recommendations = recommendation ? [recommendation] : [];
  const backlog = createTaskBoardBacklog(projectRoot, board.rows, recommendation?.taskId ?? null);
  if (!recommendation) {
    issues.push({
      severity: 'warning',
      code: 'TASK_SELECTION_NO_RECOMMENDATION',
      message: 'No incomplete Development Slices or Task Board rows were found.'
    });
  }

  return {
    schemaVersion: 'hadara.task.selection.v1',
    command: 'task.selection',
    ok: !issues.some((issue) => issue.severity === 'error'),
    projectRoot,
    summary: {
      recommendations: recommendations.length,
      source: recommendation?.source ?? 'none',
      policy: 'markdown-first'
    },
    recommendations,
    backlog,
    sources: {
      developmentSlices: { path: 'docs/DEVELOPMENT_SLICES.md', present: slices.present, rows: slices.rows.length },
      taskBoard: { path: 'docs/TASK_BOARD.md', present: board.present, rows: board.rows.length }
    },
    issues
  };
}

export function formatTaskSelectionReport(report: TaskSelectionReport): string {
  const lines = [`[HADARA] task selection: ${report.recommendations.length} recommendation(s)`];
  for (const recommendation of report.recommendations) {
    lines.push(`${recommendation.taskId}\t${recommendation.title}\t${recommendation.reason}`);
    lines.push(`source\t${recommendation.source}`);
    lines.push(`capsule\t${recommendation.capsule ?? recommendation.createCommand ?? 'missing'}`);
  }
  for (const issue of report.issues) lines.push(`[${issue.severity}] ${issue.code}: ${issue.message}`);
  return lines.join('\n');
}

function recommendationFromSlice(projectRoot: string, slice: SliceRow, boardRows: BoardRow[]): TaskSelectionRecommendation {
  const boardRow = boardRows.find((row) => row.taskId === slice.taskId);
  const capsule = findTaskCapsule(projectRoot, slice.taskId);
  const capsulePath = capsule ? toPortablePath(path.relative(projectRoot, capsule.dir)) : boardRow?.capsule ?? null;
  return {
    taskId: slice.taskId,
    title: slice.title,
    reason: `First incomplete planned slice in docs/DEVELOPMENT_SLICES.md: ${slice.status || 'no status'}.`,
    source: 'docs/DEVELOPMENT_SLICES.md',
    sourceKind: 'development-slices',
    taskBoardStatus: boardRow?.status ?? null,
    taskBoardPath: boardRow ? 'docs/TASK_BOARD.md' : null,
    taskCapsulePresent: Boolean(capsule),
    capsule: capsulePath,
    requiredReading: requiredReadingForProject(projectRoot),
    createCommand: capsule ? null : `hadara task create ${shellQuote(slice.title)}`
  };
}

function recommendationFromTaskBoard(projectRoot: string, boardRows: BoardRow[], statusPrefixes?: string[]): TaskSelectionRecommendation | null {
  // `Partial` is a deliberate terminal/deferred status, not an active queue
  // signal. Keep those rows visible in backlog, but never revive an old
  // capsule merely because no Draft/In Progress work exists.
  const row = boardRows.find((candidate) => isPrimaryOpenBoardStatus(candidate.status) && matchesStatusPrefix(candidate.status, statusPrefixes));
  if (!row) return null;
  const capsule = findTaskCapsule(projectRoot, row.taskId);
  return {
    taskId: row.taskId,
    title: row.title,
    reason: `First incomplete Task Board row with status ${row.status || 'empty'}.`,
    source: 'docs/TASK_BOARD.md',
    sourceKind: 'task-board-fallback',
    taskBoardStatus: row.status,
    taskBoardPath: 'docs/TASK_BOARD.md',
    taskCapsulePresent: Boolean(capsule),
    capsule: capsule ? row.capsule : row.capsule || null,
    requiredReading: requiredReadingForProject(projectRoot),
    createCommand: capsule ? null : `hadara task create ${shellQuote(row.title)}`
  };
}

function recommendationFromLatestDoneHandoff(projectRoot: string, boardRows: BoardRow[]): TaskSelectionRecommendation | null {
  const row = [...boardRows].reverse().find((candidate) => candidate.status.trim().toLowerCase().startsWith('done'));
  if (!row) return null;
  const capsule = findTaskCapsule(projectRoot, row.taskId);
  if (!capsule) return null;
  const handoffPath = path.join(capsule.dir, 'HANDOFF.md');
  if (!fs.existsSync(handoffPath)) return null;
  const nextStep = readStructuredHandoffNextStep(fs.readFileSync(handoffPath, 'utf8'));
  if (!nextStep) return null;
  const doneTaskIds = new Set(boardRows
    .filter((candidate) => candidate.status.trim().toLowerCase().startsWith('done'))
    .map((candidate) => candidate.taskId.toUpperCase()));
  if (isConsumedDoneContinuation({ step: nextStep.step, sourceTaskId: row.taskId, doneTaskIds })) return null;
  const capsulePath = toPortablePath(path.relative(projectRoot, capsule.dir));
  const continuation = continuationFromTaskHandoffStep({
    ...nextStep,
    sourceTaskId: row.taskId,
    sourceCapsulePath: capsulePath
  });
  if (!continuation) return null;
  if (continuation.disposition !== 'actionable' && continuation.disposition !== 'waiting-for-operator') return null;
  const requiredReading = [
    `${capsulePath}/HANDOFF.md`,
    ...(continuation.references ?? []).map((reference) => reference.path)
  ].filter((entry, index, all) => all.indexOf(entry) === index && fs.existsSync(path.join(projectRoot, entry)));
  const createCommandAllowed = continuation.disposition === 'actionable' && continuation.createCommandAllowed === true;
  return {
    taskId: 'TBD',
    title: continuation.title,
    reason: `Latest Done Task Capsule HANDOFF continuation from ${capsulePath}/HANDOFF.md.`,
    source: `${capsulePath}/HANDOFF.md`,
    sourceKind: 'task-handoff-continuation',
    taskBoardStatus: null,
    taskBoardPath: 'docs/TASK_BOARD.md',
    taskCapsulePresent: false,
    capsule: null,
    requiredReading,
    createCommand: createCommandAllowed ? `hadara task create ${shellQuote(continuation.title)}` : null,
    operatorGuidance: continuation.reason ?? 'Review task-local HANDOFF continuation before creating follow-up work.',
    createCommandAllowed
  };
}

function readStructuredHandoffNextStep(content: string): { step: string; reason: string; requiredReading: string; disposition?: string; createTask?: string } | null {
  const rows = parseMarkdownRows(readMarkdownSection(content, '## Next Recommended Step'));
  const header = rows[0] ?? [];
  const data = rows.find((row, index) => index > 0 && row.some(Boolean));
  if (!data) return null;
  const cell = (name: string): string => {
    const index = header.findIndex((entry) => entry.trim().toLowerCase() === name.toLowerCase());
    return index >= 0 ? (data[index] ?? '').trim() : '';
  };
  return {
    step: cell('Step') || data[0] || '',
    reason: cell('Reason') || data[1] || '',
    requiredReading: cell('Required Reading') || data[2] || '',
    disposition: cell('Disposition'),
    createTask: cell('Create Task')
  };
}

function createTaskBoardBacklog(projectRoot: string, boardRows: BoardRow[], primaryTaskId: string | null): TaskSelectionBacklogItem[] {
  return boardRows
    .filter((row) => isOpenBoardStatus(row.status))
    .filter((row) => row.taskId !== primaryTaskId)
    .map((row) => {
      const capsule = findTaskCapsule(projectRoot, row.taskId);
      return {
        taskId: row.taskId,
        title: row.title,
        status: row.status,
        source: 'docs/TASK_BOARD.md',
        capsule: capsule ? row.capsule : row.capsule || null,
        taskCapsulePresent: Boolean(capsule),
        reason: `Non-primary open Task Board row with status ${row.status || 'empty'}.`
      };
    });
}

function recommendationForEmptyProject(projectRoot: string, boardRows: BoardRow[]): TaskSelectionRecommendation | null {
  if (boardRows.length > 0 || hasAnyTaskCapsule(projectRoot)) return null;
  const title = 'Create first Task Capsule';
  return {
    taskId: 'TBD',
    title,
    reason: 'No Task Board rows or Task Capsules exist yet; start by creating the first scoped task.',
    source: 'project-scaffold',
    sourceKind: 'task-board-fallback',
    taskBoardStatus: null,
    taskBoardPath: null,
    taskCapsulePresent: false,
    capsule: null,
    requiredReading: requiredReadingForProject(projectRoot),
    createCommand: `hadara task create ${shellQuote(title)}`
  };
}

function requiredReadingForProject(projectRoot: string): string[] {
  return REQUIRED_READING_CANDIDATES.filter((relativePath) => fs.existsSync(path.join(projectRoot, relativePath)));
}

function readDevelopmentSlices(projectRoot: string, issues: TaskSelectionIssue[]): { present: boolean; rows: SliceRow[] } {
  // FD-012 state-first path: when the canonical slices state exists, read it
  // directly instead of parsing the generated projection. This also fixes
  // the historical `rows: 0` failure where valid slice tables with
  // decorated capsule cells (for example `T-0001 (done)` or `TBD`) never
  // matched the strict `T-\d{4}` capsule-column regex.
  const slicesState = readSlicesState(projectRoot);
  if (slicesState.state) {
    const rows = [...slicesState.state.slices]
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
      .map((slice) => ({
        taskId: slice.capsule ?? 'TBD',
        title: slice.title ? `${slice.id}: ${slice.title}` : slice.id,
        status: slice.status
      }));
    return { present: true, rows };
  }
  for (const issue of slicesState.issues) {
    issues.push({ severity: issue.severity, code: issue.code, message: issue.message, path: issue.path });
  }

  const filePath = path.join(projectRoot, 'docs', 'DEVELOPMENT_SLICES.md');
  if (!fs.existsSync(filePath)) {
    return { present: false, rows: [] };
  }
  const rows = parseMarkdownRows(fs.readFileSync(filePath, 'utf8'))
    .filter((cells) => /^T-\d{4}$/.test(cells[2] ?? ''))
    .map((cells) => ({ taskId: cells[2], title: cells[1] || cells[2], status: cells[4] ?? '' }));
  return { present: true, rows };
}

function readTaskBoard(projectRoot: string, issues: TaskSelectionIssue[]): { present: boolean; rows: BoardRow[] } {
  const filePath = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  if (!fs.existsSync(filePath)) {
    issues.push({ severity: 'warning', code: 'TASK_SELECTION_TASK_BOARD_MISSING', message: 'docs/TASK_BOARD.md is missing.', path: 'docs/TASK_BOARD.md' });
    return { present: false, rows: [] };
  }
  const rows = parseMarkdownRows(fs.readFileSync(filePath, 'utf8'))
    .filter((cells) => /^T-\d{4}$/.test(cells[0] ?? ''))
    .map((cells) => ({ taskId: cells[0], title: cells[1] || cells[0], status: cells[2] ?? '', capsule: cells[3] ?? '' }));
  return { present: true, rows };
}

function hasAnyTaskCapsule(projectRoot: string): boolean {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return false;
  return fs.readdirSync(tasksDir, { withFileTypes: true }).some((entry) => entry.isDirectory() && /^T-\d{4}-/.test(entry.name));
}

function isOpenSliceStatus(status: string): boolean {
  const normalized = status.trim().toLowerCase();
  return ['planned', 'active', 'draft', 'pending', 'blocked', 'not-started', 'in-progress'].some((prefix) => normalized.startsWith(prefix));
}

function isOpenBoardStatus(status: string): boolean {
  const normalized = status.trim().toLowerCase();
  return Boolean(normalized) && !normalized.startsWith('done') && !normalized.startsWith('superseded');
}

function isPrimaryOpenBoardStatus(status: string): boolean {
  return isOpenBoardStatus(status) && !status.trim().toLowerCase().startsWith('partial');
}

function matchesStatusPrefix(status: string, prefixes: string[] | undefined): boolean {
  if (!prefixes) return true;
  const normalized = status.trim().toLowerCase();
  return prefixes.some((prefix) => normalized.startsWith(prefix));
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}
