import fs from 'node:fs';
import path from 'node:path';
import { persistedEvidenceKind, persistedEvidenceResult } from '../evidence/evidence';
import { createTaskCloseSourceReport } from '../task/close';
import { listTaskCapsules, TaskCapsule } from '../task/task-capsule';
import { parseEvidenceIndexFile } from './evidence-list';
import { findMarkdownRowByCell, parseMarkdownRows, parseMarkdownRowsUnderHeading, readMarkdownSection } from './markdown-table';
import { SLICES_STATE_PATH } from './slices-state';
import { parseTaskBoard } from '../task/task-board';

export type StateProjectionSeverity = 'error' | 'warning' | 'info';

export interface StateProjectionIssue {
  severity: StateProjectionSeverity;
  code: string;
  message: string;
  path?: string;
  taskId?: string;
  expected?: string;
  actual?: string;
  fixHint: string;
}

export interface StateProjectionSourceValue {
  path: string;
  exists: boolean;
}

export interface StateProjectionTask {
  id: string;
  title: string;
  capsule: string;
  task: {
    path: string;
    exists: boolean;
    status: string | null;
  };
  taskBoard: {
    path: 'docs/TASK_BOARD.md';
    present: boolean;
    status: string | null;
    capsule: string | null;
  };
  handoff: {
    path: string;
    exists: boolean;
    taskStatus: string | null;
    closeState: string | null;
  };
  plan: {
    path: string;
    exists: boolean;
    totalRows: number;
    doneRows: number;
    pendingRows: number;
    inProgressRows: number;
  };
  closeProof: {
    path: string;
    state: 'not-closed' | 'closed-valid' | 'closed-invalid' | 'closed-stale' | 'unknown';
    sourceHash: string | null;
    currentSourceHash: string | null;
  };
}

export interface StateProjectionReport {
  schemaVersion: 'hadara.stateProjection.v1';
  command: 'state.projection';
  ok: true;
  semantics: {
    ok: 'report-generated';
    consistent: 'no-error-or-warning-issues';
  };
  generatedAt: string;
  projectRoot: string;
  summary: {
    consistent: boolean;
    issueCounts: Record<StateProjectionSeverity, number>;
    latestDoneTaskId: string | null;
    activeTaskIds: string[];
    checkedTasks: number;
  };
  sources: {
    taskBoard: StateProjectionSourceValue & {
      rows: number;
      latestDoneTaskId: string | null;
      activeTaskIds: string[];
    };
    developmentSlices: StateProjectionSourceValue & {
      latestDoneTaskId: string | null;
    };
    docsRegistry: StateProjectionSourceValue & {
      registeredDocuments: number | null;
      statusCounts: Record<string, number>;
    };
    releaseReadiness: StateProjectionSourceValue;
  };
  tasks: StateProjectionTask[];
  issues: StateProjectionIssue[];
}

export interface StateProjectionAdvisory {
  mode: 'advisory';
  strictBlocking: false;
  consistent: boolean;
  issueCounts: Record<StateProjectionSeverity, number>;
  latestDoneTaskId: string | null;
  activeTaskIds: string[];
  checkedTasks: number;
  issues: StateProjectionIssue[];
  truncatedIssues: number;
}

interface TaskBoardRow {
  id: string;
  title: string;
  status: string;
  capsule: string;
}

const TASK_STATUS_TOKENS = new Set(['Draft', 'In Progress', 'Blocked', 'Done', 'Partial', 'Superseded', 'Archived']);
const CLOSE_STATE_TOKENS = new Set(['not-closed', 'closed-valid', 'closed-stale', 'closed-invalid', 'unknown']);

export function createStateProjectionReport(projectRoot: string, now = new Date()): StateProjectionReport {
  const issues: StateProjectionIssue[] = [];
  const sourceTexts = readSources(projectRoot, issues);
  const taskBoardRows = parseTaskBoardRows(sourceTexts.taskBoard.content);
  const tasks = listTaskCapsules(projectRoot);
  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const taskIds = new Set([...tasks.map((task) => task.id), ...taskBoardRows.map((row) => row.id)]);
  const basicTaskStates = [...taskIds].sort().map((taskId) => ({
    id: taskId,
    taskStatus: taskById.get(taskId) ? readTaskStatus(path.join(taskById.get(taskId)!.dir, 'TASK.md')) : null,
    taskBoardStatus: taskBoardRows.find((row) => row.id === taskId)?.status ?? null
  }));
  const latestDoneTaskId = latestTaskId(basicTaskStates.filter((task) => isDone(task.taskStatus) || isDone(task.taskBoardStatus)).map((task) => task.id));
  const taskBoardActiveTaskIds = basicTaskStates.filter((task) => isActive(task.taskBoardStatus)).map((task) => task.id);
  const activeTaskIds = taskBoardActiveTaskIds;
  const deepCheckTaskIds = new Set([latestDoneTaskId, ...activeTaskIds].filter((value): value is string => Boolean(value)));
  const projectedTasks = [...taskIds]
    .sort()
    .map((taskId) => buildTaskProjection(projectRoot, taskId, taskById.get(taskId), taskBoardRows.find((row) => row.id === taskId), deepCheckTaskIds.has(taskId), issues));
  checkLatestCloseProof(projectedTasks, latestDoneTaskId, issues);
  const developmentSlices = extractDevelopmentSlices(sourceTexts.developmentSlices);
  const docsRegistry = extractDocsRegistry(projectRoot, issues);
  const releaseReadiness = readSource(projectRoot, 'docs/RELEASE_READINESS.md');

  if (!releaseReadiness.exists) {
    issues.push(info('STATE_RELEASE_READINESS_MISSING', releaseReadiness.path, 'docs/RELEASE_READINESS.md is missing.', 'Create or register release readiness docs before release work depends on this projection.'));
  }

  if (fs.existsSync(path.join(projectRoot, SLICES_STATE_PATH))) {
    compareLatestTask('STATE_DEVELOPMENT_SLICES_LATEST_MISMATCH', 'docs/DEVELOPMENT_SLICES.md', developmentSlices.latestDoneTaskId, latestDoneTaskId, issues);
  }
  compareActiveTasks(activeTaskIds, issues);

  const counts = countIssues(issues);
  return {
    schemaVersion: 'hadara.stateProjection.v1',
    command: 'state.projection',
    ok: true,
    semantics: {
      ok: 'report-generated',
      consistent: 'no-error-or-warning-issues'
    },
    generatedAt: now.toISOString(),
    projectRoot,
    summary: {
      consistent: counts.error === 0 && counts.warning === 0,
      issueCounts: counts,
      latestDoneTaskId,
      activeTaskIds,
      checkedTasks: projectedTasks.length
    },
    sources: {
      taskBoard: {
        path: sourceTexts.taskBoard.path,
        exists: sourceTexts.taskBoard.exists,
        rows: taskBoardRows.length,
        latestDoneTaskId: latestTaskId(taskBoardRows.filter((row) => isDone(row.status)).map((row) => row.id)),
        activeTaskIds
      },
      developmentSlices: {
        path: sourceTexts.developmentSlices.path,
        exists: sourceTexts.developmentSlices.exists,
        latestDoneTaskId: developmentSlices.latestDoneTaskId
      },
      docsRegistry,
      releaseReadiness: {
        path: releaseReadiness.path,
        exists: releaseReadiness.exists
      }
    },
    tasks: projectedTasks,
    issues
  };
}

export function toStateProjectionAdvisory(report: StateProjectionReport, issueLimit = 10): StateProjectionAdvisory {
  const limit = Math.max(0, issueLimit);
  return {
    mode: 'advisory',
    strictBlocking: false,
    consistent: report.summary.consistent,
    issueCounts: report.summary.issueCounts,
    latestDoneTaskId: report.summary.latestDoneTaskId,
    activeTaskIds: report.summary.activeTaskIds,
    checkedTasks: report.summary.checkedTasks,
    issues: report.issues.slice(0, limit),
    truncatedIssues: Math.max(0, report.issues.length - limit)
  };
}

export function formatStateProjectionReport(report: StateProjectionReport, issueLimit = 10): string {
  const advisory = toStateProjectionAdvisory(report, issueLimit);
  const counts = `errors ${advisory.issueCounts.error}, warnings ${advisory.issueCounts.warning}, info ${advisory.issueCounts.info}`;
  const lines = [
    '[HADARA] State verify',
    'ok: report generated; consistent: state health verdict',
    `consistent: ${advisory.consistent}`,
    `issues: ${counts}`,
    `latestDoneTaskId: ${advisory.latestDoneTaskId ?? 'none'}`,
    `activeTaskIds: ${advisory.activeTaskIds.join(', ') || 'none'}`,
    `checkedTasks: ${advisory.checkedTasks}`,
    'rollout: advisory only; strict gates do not block on state projection drift yet.'
  ];
  for (const issue of advisory.issues) {
    lines.push(`- ${issue.severity} ${issue.code}: ${issue.message}${issue.path ? ` (${issue.path})` : ''}`);
  }
  if (advisory.truncatedIssues > 0) lines.push(`- ... ${advisory.truncatedIssues} more issue(s) omitted`);
  return lines.join('\n');
}

function readSources(projectRoot: string, issues: StateProjectionIssue[]): {
  taskBoard: SourceText;
  developmentSlices: SourceText;
} {
  const taskBoard = readSource(projectRoot, 'docs/TASK_BOARD.md');
  const developmentSlices = readSource(projectRoot, 'docs/DEVELOPMENT_SLICES.md');
  for (const source of [taskBoard, developmentSlices]) {
    if (!source.exists) {
      if (source.path === 'docs/DEVELOPMENT_SLICES.md') {
        issues.push(info(
          'STATE_DEVELOPMENT_SLICES_MISSING',
          source.path,
          'docs/DEVELOPMENT_SLICES.md is missing.',
          'Bootstrap slice state with `hadara slice add ... --json` or import a legacy slice table with `hadara slice migrate --execute --json` when slice tracking is needed.'
        ));
      } else {
        issues.push(warning('STATE_SOURCE_MISSING', source.path, `${source.path} is missing.`, `Restore ${source.path} or run the relevant HADARA init/profile remediation.`));
      }
    }
  }
  return { taskBoard, developmentSlices };
}

interface SourceText extends StateProjectionSourceValue {
  content: string;
}

function readSource(projectRoot: string, relativePath: string): SourceText {
  const absolutePath = path.join(projectRoot, relativePath);
  const exists = fs.existsSync(absolutePath);
  return {
    path: relativePath,
    exists,
    content: exists ? fs.readFileSync(absolutePath, 'utf8') : ''
  };
}

function parseTaskBoardRows(content: string): TaskBoardRow[] {
  return parseTaskBoard(content).rows
    .map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      capsule: row.capsule
    }));
}

function buildTaskProjection(
  projectRoot: string,
  taskId: string,
  task: TaskCapsule | undefined,
  taskBoard: TaskBoardRow | undefined,
  deepCheck: boolean,
  issues: StateProjectionIssue[]
): StateProjectionTask {
  const taskPath = task ? toPortablePath(path.relative(projectRoot, path.join(task.dir, 'TASK.md'))) : '';
  const handoffPath = task ? toPortablePath(path.relative(projectRoot, path.join(task.dir, 'HANDOFF.md'))) : '';
  const planSource = task ? taskPlanSource(projectRoot, task.dir) : { path: '', absolutePath: '', heading: undefined as string | undefined, exists: false };
  const planPath = planSource.path;
  const taskStatus = task ? readTaskStatus(path.join(task.dir, 'TASK.md')) : null;
  const taskHandoff = task && deepCheck ? readTaskHandoff(path.join(task.dir, 'HANDOFF.md')) : { exists: task ? fs.existsSync(path.join(task.dir, 'HANDOFF.md')) : false, taskStatus: null, closeState: null };
  const plan = task && deepCheck ? readPlanState(planSource.absolutePath, planSource.heading) : { exists: planSource.exists, totalRows: 0, doneRows: 0, pendingRows: 0, inProgressRows: 0 };
  const closeProof = task && deepCheck ? readCloseProof(projectRoot, task) : { path: task ? toPortablePath(path.relative(projectRoot, path.join(task.dir, 'evidence.jsonl'))) : '', state: 'unknown' as const, sourceHash: null, currentSourceHash: null };
  const capsule = task ? toPortablePath(path.relative(projectRoot, task.dir)) : taskBoard?.capsule ?? '';

  if (!task && taskBoard) {
    issues.push(warning('STATE_TASK_BOARD_CAPSULE_MISSING', 'docs/TASK_BOARD.md', `Task Board row ${taskId} points at ${taskBoard.capsule || '(empty)'}, but no matching capsule was found.`, `Create the missing capsule or update/remove the ${taskId} Task Board row.`, taskId));
  }
  if (task && !taskBoard) {
    issues.push(warning('STATE_TASK_BOARD_ROW_MISSING', 'docs/TASK_BOARD.md', `Task Capsule ${taskId} exists but has no Task Board row.`, `Run task workflow remediation or add a Task Board row for ${taskId}.`, taskId));
  }
  if (task && taskBoard && taskBoard.capsule !== capsule) {
    issues.push(warning('STATE_TASK_BOARD_CAPSULE_DRIFT', 'docs/TASK_BOARD.md', `Task Board capsule for ${taskId} is ${taskBoard.capsule || '(empty)'}, expected ${capsule}.`, `Update the Task Board capsule cell for ${taskId}.`, taskId, capsule, taskBoard.capsule || '(empty)'));
  }
  if (taskStatus && taskBoard?.status && taskStatus !== taskBoard.status) {
    issues.push(warning('STATE_TASK_BOARD_STATUS_DRIFT', 'docs/TASK_BOARD.md', `Task Board status for ${taskId} is ${taskBoard.status}, but TASK.md status is ${taskStatus}.`, `Align docs/TASK_BOARD.md deliberately before running hadara task close --task ${taskId} --json.`, taskId, taskStatus, taskBoard.status));
  }
  if (deepCheck && taskHandoff.taskStatus && !TASK_STATUS_TOKENS.has(taskHandoff.taskStatus)) {
    issues.push(warning('STATE_TASK_HANDOFF_STATUS_INVALID', handoffPath, `Task handoff TaskStatus for ${taskId} is not a canonical task status token: ${taskHandoff.taskStatus}.`, 'Use a canonical TaskStatus token; close proof state belongs in task status/finalize/state read models.', taskId));
  }
  if (deepCheck && taskHandoff.taskStatus && /pending lifecycle close|closed-valid|not-closed/i.test(taskHandoff.taskStatus)) {
    issues.push(warning('STATE_TASK_HANDOFF_STATUS_CLOSE_STATE_MIXED', handoffPath, `Task handoff TaskStatus for ${taskId} appears to mix task status and close proof state.`, 'Use TaskStatus: Done only; derive CloseState from task status/finalize/state read models.', taskId));
  }
  if (deepCheck && taskHandoff.closeState) {
    issues.push(warning('STATE_TASK_HANDOFF_CLOSE_STATE_PERSISTED', handoffPath, `Task handoff persists derived CloseState for ${taskId}: ${taskHandoff.closeState}.`, 'Remove CloseState from task-local HANDOFF.md; use task status --detail full, task close, status, or protocol doctor read models for derived close state.', taskId));
    if (!CLOSE_STATE_TOKENS.has(taskHandoff.closeState)) {
      issues.push(warning('STATE_TASK_HANDOFF_CLOSE_STATE_INVALID', handoffPath, `Task handoff CloseState for ${taskId} is not canonical: ${taskHandoff.closeState}.`, 'Remove the CloseState row from task-local HANDOFF.md.', taskId));
    }
  }
  if (deepCheck && (isDone(taskStatus) || isDone(taskBoard?.status)) && (plan.pendingRows > 0 || plan.inProgressRows > 0)) {
    issues.push(warning('STATE_TASK_PLAN_DRIFT', planPath, `Done task ${taskId} has plan rows still Pending or In Progress.`, 'Update Plan rows to Done or record an explicit residual-risk decision before closing.', taskId));
  }

  return {
    id: taskId,
    title: task?.title ?? taskBoard?.title ?? 'Unknown',
    capsule,
    task: {
      path: taskPath,
      exists: Boolean(task),
      status: taskStatus
    },
    taskBoard: {
      path: 'docs/TASK_BOARD.md',
      present: Boolean(taskBoard),
      status: taskBoard?.status ?? null,
      capsule: taskBoard?.capsule ?? null
    },
    handoff: {
      path: handoffPath,
      exists: taskHandoff.exists,
      taskStatus: taskHandoff.taskStatus,
      closeState: taskHandoff.closeState
    },
    plan: {
      ...plan,
      path: planPath
    },
    closeProof
  };
}

function readTaskStatus(taskPath: string): string | null {
  if (!fs.existsSync(taskPath)) return null;
  const content = fs.readFileSync(taskPath, 'utf8');
  const tableStatus = content.match(/^\|\s*Status\s*\|\s*([^|]+?)\s*\|$/m)?.[1]?.trim();
  if (tableStatus) return tableStatus;
  const section = readMarkdownSection(content, '## Status');
  return section.trim().split(/\r?\n/)[0]?.trim() || null;
}

function readTaskHandoff(handoffPath: string): { exists: boolean; taskStatus: string | null; closeState: string | null } {
  if (!fs.existsSync(handoffPath)) return { exists: false, taskStatus: null, closeState: null };
  const rows = parseMarkdownRowsUnderHeading(fs.readFileSync(handoffPath, 'utf8'), '## Current State');
  return {
    exists: true,
    taskStatus: findMarkdownRowByCell(rows, 0, 'TaskStatus')?.[1] ?? findMarkdownRowByCell(rows, 0, 'Status')?.[1] ?? null,
    closeState: findMarkdownRowByCell(rows, 0, 'CloseState')?.[1] ?? null
  };
}

function taskPlanSource(projectRoot: string, taskDir: string): { path: string; absolutePath: string; heading?: string; exists: boolean } {
  const legacyPlanPath = path.join(taskDir, 'PLAN.md');
  if (fs.existsSync(legacyPlanPath)) {
    return {
      path: toPortablePath(path.relative(projectRoot, legacyPlanPath)),
      absolutePath: legacyPlanPath,
      exists: true
    };
  }
  const taskPath = path.join(taskDir, 'TASK.md');
  return {
    path: toPortablePath(path.relative(projectRoot, taskPath)),
    absolutePath: taskPath,
    heading: '## Plan',
    exists: fs.existsSync(taskPath)
  };
}

function readPlanState(planPath: string, heading?: string): StateProjectionTask['plan'] {
  if (!fs.existsSync(planPath)) {
    return { path: '', exists: false, totalRows: 0, doneRows: 0, pendingRows: 0, inProgressRows: 0 };
  }
  const content = fs.readFileSync(planPath, 'utf8');
  const rows = parseMarkdownRows(heading ? readMarkdownSection(content, heading) : content).filter((row) => /^\d+$/.test(row[0] ?? ''));
  return {
    path: toPortablePath(planPath),
    exists: true,
    totalRows: rows.length,
    doneRows: rows.filter((row) => normalizeStatus(row[2]) === 'done').length,
    pendingRows: rows.filter((row) => normalizeStatus(row[2]) === 'pending').length,
    inProgressRows: rows.filter((row) => normalizeStatus(row[2]) === 'inprogress').length
  };
}

function readCloseProof(projectRoot: string, task: TaskCapsule): StateProjectionTask['closeProof'] {
  const evidencePath = path.join(task.dir, 'evidence.jsonl');
  const relativeEvidencePath = toPortablePath(path.relative(projectRoot, evidencePath));
  const records = parseEvidenceIndexFile(evidencePath, task.id).records.filter((record) => persistedEvidenceKind(record) === 'command-log' && /Task close validation .* before close evidence append/.test(record.summary));
  const latest = records.at(-1);
  const currentSourceHash = hashCloseRelevantSource(projectRoot, task.dir);
  if (!latest) return { path: relativeEvidencePath, state: 'not-closed', sourceHash: null, currentSourceHash };
  const sourceHash = extractSourceHash(latest.summary);
  const passed = persistedEvidenceResult(latest) === 'passed';
  const state = !passed ? 'closed-invalid' : sourceHash && sourceHash !== currentSourceHash ? 'closed-stale' : 'closed-valid';
  return { path: relativeEvidencePath, state, sourceHash, currentSourceHash };
}

function extractDevelopmentSlices(source: SourceText): { latestDoneTaskId: string | null } {
  const rows = parseMarkdownRows(source.content);
  const doneIds = rows
    .filter((row) => /^T-\d{4}$/.test(row[2] ?? '') && /^Done\b/.test(row[4] ?? ''))
    .map((row) => row[2]);
  return { latestDoneTaskId: latestTaskId(doneIds) };
}

function extractDocsRegistry(projectRoot: string, issues: StateProjectionIssue[]): StateProjectionReport['sources']['docsRegistry'] {
  const initSource = readSource(projectRoot, '.hadara/documents.json');
  const source = initSource.exists ? initSource : readSource(projectRoot, '.hadara/docs-registry.json');
  if (!source.exists) {
    issues.push(warning('STATE_DOCS_REGISTRY_MISSING', source.path, '.hadara/documents.json and .hadara/docs-registry.json are missing.', 'Run HADARA init or the documented legacy migration before relying on docs state projection.'));
    return { path: source.path, exists: false, registeredDocuments: null, statusCounts: {} };
  }
  try {
    const parsed = JSON.parse(source.content) as { documents?: Array<{ status?: string }> };
    const documents = Array.isArray(parsed.documents) ? parsed.documents : [];
    return {
      path: source.path,
      exists: true,
      registeredDocuments: documents.length,
      statusCounts: documents.reduce<Record<string, number>>((acc, doc) => {
        const status = doc.status ?? 'unknown';
        acc[status] = (acc[status] ?? 0) + 1;
        return acc;
      }, {})
    };
  } catch (error) {
    issues.push(warning('STATE_DOCS_REGISTRY_INVALID_JSON', source.path, `${source.path} could not be parsed: ${error instanceof Error ? error.message : String(error)}`, 'Repair the canonical document registry JSON before relying on document state projection.'));
    return { path: source.path, exists: true, registeredDocuments: null, statusCounts: {} };
  }
}

function compareLatestTask(
  code: string,
  sourcePath: string,
  actual: string | null,
  expected: string | null,
  issues: StateProjectionIssue[]
): void {
  if (!actual || !expected || actual === expected) return;
  issues.push(warning(
    code,
    sourcePath,
    `${sourcePath} points to latest completed task ${actual}, but the projected highest Done task id is ${expected}.`,
    `Update ${sourcePath} latest completed task state to ${expected} or correct the Done task source. Close timestamp chronology is not tracked by this projection.`,
    undefined,
    expected,
    actual
  ));
}

function compareActiveTasks(activeTaskIds: string[], issues: StateProjectionIssue[]): void {
  if (activeTaskIds.length > 1) {
    issues.push(warning('STATE_MULTIPLE_ACTIVE_TASKS', 'docs/TASK_BOARD.md', `Task Board has multiple active tasks: ${activeTaskIds.join(', ')}.`, 'Keep only one In Progress task unless a future coordinator explicitly supports parallel active work.'));
  }
}

function checkLatestCloseProof(projectedTasks: StateProjectionTask[], latestDoneTaskId: string | null, issues: StateProjectionIssue[]): void {
  if (!latestDoneTaskId) return;
  const task = projectedTasks.find((candidate) => candidate.id === latestDoneTaskId);
  if (!task) return;
  if (task.closeProof.state === 'closed-valid') return;
  if (task.closeProof.state === 'not-closed') {
    issues.push(warning('STATE_LATEST_CLOSE_PROOF_MISSING', task.closeProof.path, `Latest Done task ${latestDoneTaskId} has no close proof.`, `Run hadara task close --task ${latestDoneTaskId} --dry-run --json, resolve blockers, then run task close.`, latestDoneTaskId));
    return;
  }
  if (task.closeProof.state === 'closed-stale') {
    issues.push(warning('STATE_LATEST_CLOSE_PROOF_STALE', task.closeProof.path, `Latest Done task ${latestDoneTaskId} has stale close proof.`, `Rerun hadara task close --task ${latestDoneTaskId} --dry-run --json after intentional close-source edits, then run task close when ready.`, latestDoneTaskId, task.closeProof.currentSourceHash ?? undefined, task.closeProof.sourceHash ?? undefined));
    return;
  }
  issues.push(warning('STATE_LATEST_CLOSE_PROOF_INVALID', task.closeProof.path, `Latest Done task ${latestDoneTaskId} close proof is ${task.closeProof.state}.`, `Rerun task close/audit-close for ${latestDoneTaskId} after resolving validation blockers.`, latestDoneTaskId));
}

function hashCloseRelevantSource(projectRoot: string, taskDir: string): string {
  const taskId = path.basename(taskDir).match(/^(T-\d{4})-/)?.[1] ?? '';
  return createTaskCloseSourceReport(projectRoot, taskId).sourceHash;
}

function extractSourceHash(summary: string): string | null {
  return summary.match(/sourceHash\s+(sha256:[a-f0-9]+)/)?.[1] ?? null;
}

function extractTaskId(value: string): string | null {
  return value.match(/\bT-\d{4}\b/)?.[0] ?? null;
}

function latestTaskId(ids: string[]): string | null {
  return ids.sort().at(-1) ?? null;
}

function normalizeStatus(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase().replace(/[\s_-]+/g, '');
}

function isDone(value: string | null | undefined): boolean {
  return normalizeStatus(value) === 'done';
}

function isActive(value: string | null | undefined): boolean {
  return normalizeStatus(value) === 'inprogress';
}

function countIssues(issues: StateProjectionIssue[]): Record<StateProjectionSeverity, number> {
  return {
    error: issues.filter((issue) => issue.severity === 'error').length,
    warning: issues.filter((issue) => issue.severity === 'warning').length,
    info: issues.filter((issue) => issue.severity === 'info').length
  };
}

function warning(code: string, pathValue: string, message: string, fixHint: string, taskId?: string, expected?: string, actual?: string): StateProjectionIssue {
  return {
    severity: 'warning',
    code,
    path: pathValue,
    ...(taskId ? { taskId } : {}),
    message,
    ...(expected ? { expected } : {}),
    ...(actual ? { actual } : {}),
    fixHint
  };
}

function info(code: string, pathValue: string, message: string, fixHint: string): StateProjectionIssue {
  return {
    severity: 'info',
    code,
    path: pathValue,
    message,
    fixHint
  };
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
