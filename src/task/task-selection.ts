import fs from 'node:fs';
import path from 'node:path';
import { parseMarkdownRows, readMarkdownSection } from '../services/markdown-table';
import { findTaskCapsule } from './task-capsule';
import { readSlicesState } from '../services/slices-state';
import { PROJECT_CURRENT_STATE_PATH, readProjectCurrentState, type ProjectContinuation, type ProjectCurrentState } from '../services/project-current-state';

export interface TaskSelectionReport {
  schemaVersion: 'hadara.task.selection.v1';
  command: 'task.selection';
  ok: boolean;
  projectRoot: string;
  summary: {
    recommendations: number;
    source: string;
    policy?: 'handoff-first';
  };
  recommendations: TaskSelectionRecommendation[];
  backlog?: TaskSelectionBacklogItem[];
  sources: {
    currentState: {
      path: string;
      present: boolean;
      activeTask: string | null;
      nextWork: ProjectCurrentState['nextWork'] | null;
      nextOperatorIntent: string | null;
      continuation: ProjectContinuation | null;
    };
    developmentSlices: { path: string; present: boolean; rows: number };
    taskBoard: { path: string; present: boolean; rows: number };
    agentHandoff: { path: string; present: boolean; activeNext: string | null; nextRecommendedStep?: string | null };
  };
  issues: TaskSelectionIssue[];
}

export interface TaskSelectionRecommendation {
  taskId: string;
  title: string;
  reason: string;
  source: string;
  sourceKind?: 'current-state' | 'handoff' | 'development-slices' | 'task-board-fallback';
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

const REQUIRED_READING_CANDIDATES = ['docs/PROJECT_STATE.md', 'docs/AGENT_HANDOFF.md', 'docs/DEVELOPMENT_SLICES.md', 'docs/TASK_BOARD.md'];

export function createTaskSelectionReport(projectRoot: string): TaskSelectionReport {
  const issues: TaskSelectionIssue[] = [];
  const currentState = readCurrentState(projectRoot, issues);
  const slices = readDevelopmentSlices(projectRoot, issues);
  const board = readTaskBoard(projectRoot, issues);
  const handoff = readAgentHandoff(projectRoot);

  const nextSlice = slices.rows.find((row) => isOpenSliceStatus(row.status));
  const currentStateRecommendation = currentState.state ? recommendationFromCurrentState(projectRoot, currentState.state, board.rows) : null;
  const handoffRecommendation = handoff.nextRecommendedStep ? recommendationFromHandoff(projectRoot, handoff.nextRecommendedStep, board.rows) : null;
  const taskBoardRecommendation = recommendationFromTaskBoard(projectRoot, board.rows);
  const firstTaskRecommendation = recommendationForEmptyProject(projectRoot, board.rows);
  const defaultRecommendation = nextSlice ? recommendationFromSlice(projectRoot, nextSlice, board.rows) : taskBoardRecommendation;
  const recommendation = currentStateRecommendation ?? handoffRecommendation ?? defaultRecommendation ?? firstTaskRecommendation;
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
      policy: 'handoff-first'
    },
    recommendations,
    backlog,
    sources: {
      currentState: {
        path: PROJECT_CURRENT_STATE_PATH,
        present: currentState.present,
        activeTask: currentState.state?.activeTask?.id ?? null,
        nextWork: currentState.state?.nextWork ?? null,
        nextOperatorIntent: currentState.state?.nextOperatorIntent ?? null,
        continuation: currentState.state?.continuation ?? null
      },
      developmentSlices: { path: 'docs/DEVELOPMENT_SLICES.md', present: slices.present, rows: slices.rows.length },
      taskBoard: { path: 'docs/TASK_BOARD.md', present: board.present, rows: board.rows.length },
      agentHandoff: { path: 'docs/AGENT_HANDOFF.md', present: handoff.present, activeNext: handoff.activeNext, nextRecommendedStep: handoff.nextRecommendedStep }
    },
    issues
  };
}

function readCurrentState(projectRoot: string, issues: TaskSelectionIssue[]): { present: boolean; state: ProjectCurrentState | null } {
  const read = readProjectCurrentState(projectRoot);
  for (const issue of read.issues) {
    issues.push({
      severity: issue.severity === 'error' ? 'error' : 'warning',
      code: issue.code,
      message: issue.message,
      path: issue.path
    });
  }
  return { present: read.present, state: read.state };
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

function recommendationFromHandoff(projectRoot: string, step: string, boardRows: BoardRow[]): TaskSelectionRecommendation {
  const knownTaskId = step.match(/\bT-\d{4}\b/)?.[0] ?? null;
  const title = normalizeHandoffTitle(step);
  const fuzzyBoardRow = knownTaskId ? undefined : findSimilarOpenBoardRow(title, boardRows);
  const taskId = knownTaskId ?? fuzzyBoardRow?.taskId ?? 'TBD';
  const boardRow = knownTaskId
    ? boardRows.find((row) => row.taskId === knownTaskId)
    : fuzzyBoardRow;
  const capsule = taskId !== 'TBD' ? findTaskCapsule(projectRoot, taskId) : undefined;
  const resolvedTitle = boardRow?.title ?? title;
  return {
    taskId,
    title: resolvedTitle,
    reason: boardRow && !knownTaskId
      ? 'Existing open Task Board row closely matches docs/AGENT_HANDOFF.md next recommended step.'
      : 'Current next recommended step from docs/AGENT_HANDOFF.md.',
    source: 'docs/AGENT_HANDOFF.md',
    sourceKind: 'handoff',
    taskBoardStatus: boardRow?.status ?? null,
    taskBoardPath: boardRow ? 'docs/TASK_BOARD.md' : null,
    taskCapsulePresent: Boolean(capsule),
    capsule: capsule ? toPortablePath(path.relative(projectRoot, capsule.dir)) : boardRow?.capsule || null,
    requiredReading: requiredReadingForProject(projectRoot),
    createCommand: capsule || boardRow ? null : `hadara task create ${shellQuote(title)}`
  };
}

function recommendationFromCurrentState(projectRoot: string, state: ProjectCurrentState, boardRows: BoardRow[]): TaskSelectionRecommendation | null {
  if (state.activeTask) {
    const boardRow = boardRows.find((row) => row.taskId === state.activeTask?.id);
    const capsule = findTaskCapsule(projectRoot, state.activeTask.id);
    return {
      taskId: state.activeTask.id,
      title: boardRow?.title ?? state.activeTask.title,
      reason: `Structured current-state canon names ${state.activeTask.id} as the active task.`,
      source: PROJECT_CURRENT_STATE_PATH,
      sourceKind: 'current-state',
      taskBoardStatus: boardRow?.status ?? null,
      taskBoardPath: boardRow ? 'docs/TASK_BOARD.md' : null,
      taskCapsulePresent: Boolean(capsule),
      capsule: capsule ? toPortablePath(path.relative(projectRoot, capsule.dir)) : boardRow?.capsule || null,
      requiredReading: requiredReadingForProject(projectRoot),
      createCommand: null
    };
  }

  const nextWork = state.nextWork;
  if (!nextWork || nextWork.state === 'none') return null;
  if (!isActionableHandoffStep(nextWork.title)) return null;
  if (nextWork.origin === 'bootstrap-first-task' && (boardRows.length > 0 || hasAnyTaskCapsule(projectRoot))) return null;
  const knownTaskId = nextWork.title.match(/\bT-\d{4}\b/)?.[0] ?? null;
  const title = normalizeNextWorkTitle(nextWork.title);
  const fuzzyBoardRow = knownTaskId ? undefined : findSimilarOpenBoardRow(title, boardRows);
  const taskId = knownTaskId ?? fuzzyBoardRow?.taskId ?? 'TBD';
  const boardRow = knownTaskId
    ? boardRows.find((row) => row.taskId === knownTaskId)
    : fuzzyBoardRow;
  const capsule = taskId !== 'TBD' ? findTaskCapsule(projectRoot, taskId) : undefined;
  const resolvedTitle = boardRow?.title ?? title;
  const existingTaskHistory = boardRows.length > 0 || hasAnyTaskCapsule(projectRoot);
  const adoptionBaselineReviewOnly = nextWork.origin === 'bootstrap-adoption-baseline' && existingTaskHistory;
  const createCommandAllowed = adoptionBaselineReviewOnly ? false : nextWork.createCommandAllowed;
  const operatorGuidance = adoptionBaselineReviewOnly
    ? `${nextWork.operatorGuidance} Existing task history is present; review whether the adoption baseline is still needed before creating another capsule.`
    : nextWork.operatorGuidance;
  return {
    taskId,
    title: resolvedTitle,
    reason: adoptionBaselineReviewOnly
      ? 'Structured current-state canon names the brownfield adoption baseline, but task history already exists; review before creating another capsule.'
      : boardRow && !knownTaskId
      ? 'Existing open Task Board row closely matches the structured current-state next work.'
      : 'Next work from the structured current-state canon.',
    source: PROJECT_CURRENT_STATE_PATH,
    sourceKind: 'current-state',
    taskBoardStatus: boardRow?.status ?? null,
    taskBoardPath: boardRow ? 'docs/TASK_BOARD.md' : null,
    taskCapsulePresent: Boolean(capsule),
    capsule: capsule ? toPortablePath(path.relative(projectRoot, capsule.dir)) : boardRow?.capsule || null,
    requiredReading: requiredReadingForProject(projectRoot),
    createCommand: capsule || boardRow || !createCommandAllowed ? null : `hadara task create ${shellQuote(title)}`,
    operatorGuidance,
    createCommandAllowed
  };
}

function normalizeNextWorkTitle(title: string): string {
  return title.replace(/[.]+$/, '').trim();
}

function recommendationFromTaskBoard(projectRoot: string, boardRows: BoardRow[]): TaskSelectionRecommendation | null {
  // `Partial` is a deliberate terminal/deferred status, not an active queue
  // signal. Keep those rows visible in backlog, but never revive an old
  // capsule merely because no Draft/In Progress work exists.
  const row = boardRows.find((candidate) => isPrimaryOpenBoardStatus(candidate.status));
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

function findSimilarOpenBoardRow(title: string, boardRows: BoardRow[]): BoardRow | undefined {
  const titleTokens = normalizedTitleTokens(title);
  if (titleTokens.length === 0) return undefined;
  let best: { row: BoardRow; score: number; overlap: number } | null = null;
  for (const row of boardRows.filter((candidate) => isOpenBoardStatus(candidate.status))) {
    const rowTokens = normalizedTitleTokens(row.title);
    const overlap = rowTokens.filter((token) => titleTokens.includes(token)).length;
    const union = new Set([...titleTokens, ...rowTokens]).size;
    const score = union === 0 ? 0 : overlap / union;
    if (!best || score > best.score) best = { row, score, overlap };
  }
  return best && best.overlap >= 2 && best.score >= 0.4 ? best.row : undefined;
}

function normalizedTitleTokens(value: string): string[] {
  return Array.from(new Set(value
    .toLowerCase()
    .replace(/[`*_.,:;()[\]{}]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3)
    .map((token) => token.replace(/^(finalize|finalise|finalizing)$/, 'final'))
    .filter((token) => !['and', 'task', 'capsule', 'create', 'select', 'first', 'with', 'next', 'work'].includes(token))));
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

function readAgentHandoff(projectRoot: string): { present: boolean; activeNext: string | null; nextRecommendedStep: string | null } {
  const filePath = path.join(projectRoot, 'docs', 'AGENT_HANDOFF.md');
  if (!fs.existsSync(filePath)) return { present: false, activeNext: null, nextRecommendedStep: null };
  const content = fs.readFileSync(filePath, 'utf8');
  const row = parseMarkdownRows(content).find((cells) => cells[0] === 'Active / Next Task');
  const nextRecommendedStep = parseMarkdownRows(readMarkdownSection(content, '## Next Recommended Step'))
    .map((cells) => cells[0] ?? '')
    .find((cell) => isActionableHandoffStep(cell)) ?? null;
  return { present: true, activeNext: row?.[1] ?? null, nextRecommendedStep };
}

function isActionableHandoffStep(step: string): boolean {
  const normalized = step.trim().toLowerCase();
  if (!normalized || normalized === 'step' || normalized === 'tbd') return false;
  if (/^(later|eventually|future|deferred)\b/.test(normalized)) return false;
  if (isTaskSelectionMetaGuidance(normalized)) return false;
  if (normalized.includes('create or select first task capsule')) return false;
  if (normalized.startsWith('migrate selected historical evidence only when explicitly requested')) return false;
  return true;
}

function isTaskSelectionMetaGuidance(normalizedStep: string): boolean {
  const compact = normalizedStep.replace(/[`*_]/g, '').replace(/\s+/g, ' ');
  if (/\b(hadara\s+)?task\s+(next|selection)\b/.test(compact) && /\b(run|select|choose|create)\b/.test(compact)) return true;
  if (/\bselect the next capsule\b/.test(compact) && /\b(operator priority|fresh diagnostic evidence)\b/.test(compact)) return true;
  return false;
}

function hasAnyTaskCapsule(projectRoot: string): boolean {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return false;
  return fs.readdirSync(tasksDir, { withFileTypes: true }).some((entry) => entry.isDirectory() && /^T-\d{4}-/.test(entry.name));
}

function normalizeHandoffTitle(step: string): string {
  return step
    .replace(/^continue\s+(with\s+)?/i, '')
    .replace(/\.$/, '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^./, (first) => first.toUpperCase());
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

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}
