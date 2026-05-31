import fs from 'node:fs';
import path from 'node:path';
import { parseMarkdownRows } from '../services/markdown-table';
import { listTaskCapsules } from './task-capsule';

export interface TaskNextReport {
  schemaVersion: 'hadara.task.next.v1';
  command: 'task.next';
  ok: boolean;
  projectRoot: string;
  summary: {
    recommendations: number;
    source: string;
  };
  recommendations: TaskNextRecommendation[];
  sources: {
    developmentSlices: { path: string; present: boolean; rows: number };
    taskBoard: { path: string; present: boolean; rows: number };
    agentHandoff: { path: string; present: boolean; activeNext: string | null };
  };
  issues: TaskNextIssue[];
}

export interface TaskNextRecommendation {
  taskId: string;
  title: string;
  reason: string;
  source: string;
  taskBoardStatus: string | null;
  taskBoardPath: string | null;
  taskCapsulePresent: boolean;
  capsule: string | null;
  requiredReading: string[];
  createCommand: string | null;
}

export interface TaskNextIssue {
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

const REQUIRED_READING = ['docs/PROJECT_STATE.md', 'docs/AGENT_HANDOFF.md', 'docs/DEVELOPMENT_SLICES.md', 'docs/TASK_BOARD.md'];

export function createTaskNextReport(projectRoot: string): TaskNextReport {
  const issues: TaskNextIssue[] = [];
  const slices = readDevelopmentSlices(projectRoot, issues);
  const board = readTaskBoard(projectRoot, issues);
  const handoff = readAgentHandoff(projectRoot);
  const capsules = listTaskCapsules(projectRoot);

  const nextSlice = slices.rows.find((row) => isOpenSliceStatus(row.status));
  const recommendation = nextSlice ? recommendationFromSlice(projectRoot, nextSlice, board.rows, capsules) : recommendationFromTaskBoard(board.rows, capsules);
  const recommendations = recommendation ? [recommendation] : [];
  if (!recommendation) {
    issues.push({
      severity: 'warning',
      code: 'TASK_NEXT_NO_RECOMMENDATION',
      message: 'No incomplete Development Slices or Task Board rows were found.'
    });
  }

  return {
    schemaVersion: 'hadara.task.next.v1',
    command: 'task.next',
    ok: !issues.some((issue) => issue.severity === 'error'),
    projectRoot,
    summary: {
      recommendations: recommendations.length,
      source: recommendation?.source ?? 'none'
    },
    recommendations,
    sources: {
      developmentSlices: { path: 'docs/DEVELOPMENT_SLICES.md', present: slices.present, rows: slices.rows.length },
      taskBoard: { path: 'docs/TASK_BOARD.md', present: board.present, rows: board.rows.length },
      agentHandoff: { path: 'docs/AGENT_HANDOFF.md', present: handoff.present, activeNext: handoff.activeNext }
    },
    issues
  };
}

export function formatTaskNextReport(report: TaskNextReport): string {
  const lines = [`[HADARA] task next: ${report.recommendations.length} recommendation(s)`];
  for (const recommendation of report.recommendations) {
    lines.push(`${recommendation.taskId}\t${recommendation.title}\t${recommendation.reason}`);
    lines.push(`source\t${recommendation.source}`);
    lines.push(`capsule\t${recommendation.capsule ?? recommendation.createCommand ?? 'missing'}`);
  }
  for (const issue of report.issues) lines.push(`[${issue.severity}] ${issue.code}: ${issue.message}`);
  return lines.join('\n');
}

function recommendationFromSlice(projectRoot: string, slice: SliceRow, boardRows: BoardRow[], capsules: ReturnType<typeof listTaskCapsules>): TaskNextRecommendation {
  const boardRow = boardRows.find((row) => row.taskId === slice.taskId);
  const capsule = capsules.find((task) => task.id === slice.taskId);
  const capsulePath = capsule ? toPortablePath(path.relative(projectRoot, capsule.dir)) : boardRow?.capsule ?? null;
  return {
    taskId: slice.taskId,
    title: slice.title,
    reason: `First incomplete planned slice in docs/DEVELOPMENT_SLICES.md: ${slice.status || 'no status'}.`,
    source: 'docs/DEVELOPMENT_SLICES.md',
    taskBoardStatus: boardRow?.status ?? null,
    taskBoardPath: boardRow ? 'docs/TASK_BOARD.md' : null,
    taskCapsulePresent: Boolean(capsule),
    capsule: capsulePath,
    requiredReading: REQUIRED_READING,
    createCommand: capsule ? null : `hadara task create ${shellQuote(slice.title)}`
  };
}

function recommendationFromTaskBoard(boardRows: BoardRow[], capsules: ReturnType<typeof listTaskCapsules>): TaskNextRecommendation | null {
  const row = boardRows.find((candidate) => isOpenBoardStatus(candidate.status));
  if (!row) return null;
  const capsule = capsules.find((task) => task.id === row.taskId);
  return {
    taskId: row.taskId,
    title: row.title,
    reason: `First incomplete Task Board row with status ${row.status || 'empty'}.`,
    source: 'docs/TASK_BOARD.md',
    taskBoardStatus: row.status,
    taskBoardPath: 'docs/TASK_BOARD.md',
    taskCapsulePresent: Boolean(capsule),
    capsule: capsule ? row.capsule : row.capsule || null,
    requiredReading: REQUIRED_READING,
    createCommand: capsule ? null : `hadara task create ${shellQuote(row.title)}`
  };
}

function readDevelopmentSlices(projectRoot: string, issues: TaskNextIssue[]): { present: boolean; rows: SliceRow[] } {
  const filePath = path.join(projectRoot, 'docs', 'DEVELOPMENT_SLICES.md');
  if (!fs.existsSync(filePath)) {
    issues.push({ severity: 'warning', code: 'TASK_NEXT_DEVELOPMENT_SLICES_MISSING', message: 'docs/DEVELOPMENT_SLICES.md is missing.', path: 'docs/DEVELOPMENT_SLICES.md' });
    return { present: false, rows: [] };
  }
  const rows = parseMarkdownRows(fs.readFileSync(filePath, 'utf8'))
    .filter((cells) => /^T-\d{4}$/.test(cells[2] ?? ''))
    .map((cells) => ({ taskId: cells[2], title: cells[1] || cells[2], status: cells[4] ?? '' }));
  return { present: true, rows };
}

function readTaskBoard(projectRoot: string, issues: TaskNextIssue[]): { present: boolean; rows: BoardRow[] } {
  const filePath = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  if (!fs.existsSync(filePath)) {
    issues.push({ severity: 'warning', code: 'TASK_NEXT_TASK_BOARD_MISSING', message: 'docs/TASK_BOARD.md is missing.', path: 'docs/TASK_BOARD.md' });
    return { present: false, rows: [] };
  }
  const rows = parseMarkdownRows(fs.readFileSync(filePath, 'utf8'))
    .filter((cells) => /^T-\d{4}$/.test(cells[0] ?? ''))
    .map((cells) => ({ taskId: cells[0], title: cells[1] || cells[0], status: cells[2] ?? '', capsule: cells[3] ?? '' }));
  return { present: true, rows };
}

function readAgentHandoff(projectRoot: string): { present: boolean; activeNext: string | null } {
  const filePath = path.join(projectRoot, 'docs', 'AGENT_HANDOFF.md');
  if (!fs.existsSync(filePath)) return { present: false, activeNext: null };
  const row = parseMarkdownRows(fs.readFileSync(filePath, 'utf8')).find((cells) => cells[0] === 'Active / Next Task');
  return { present: true, activeNext: row?.[1] ?? null };
}

function isOpenSliceStatus(status: string): boolean {
  const normalized = status.trim().toLowerCase();
  return ['planned', 'active', 'draft', 'pending', 'blocked'].some((prefix) => normalized.startsWith(prefix));
}

function isOpenBoardStatus(status: string): boolean {
  const normalized = status.trim().toLowerCase();
  return Boolean(normalized) && !normalized.startsWith('done') && !normalized.startsWith('superseded');
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}
