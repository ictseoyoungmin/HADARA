import fs from 'node:fs';
import path from 'node:path';
import { isTaskCapsuleScaffoldContent, listTaskCapsules, TaskCapsule, TASK_FILES } from '../task/task-capsule';

export type ProtocolConsistencyScope = 'docs' | 'tasks' | 'profile' | 'all';
export type ProtocolConsistencySeverity = 'error' | 'warning' | 'info';
export type ProtocolConsistencyArea = 'profile' | 'docs' | 'task' | 'evidence' | 'handoff' | 'validation' | 'required-reading';

export interface ProtocolConsistencyIssue {
  id: string;
  code: string;
  severity: ProtocolConsistencySeverity;
  area: ProtocolConsistencyArea;
  path?: string;
  taskId?: string;
  message: string;
  expected?: string;
  actual?: string;
  remediationId?: string;
}

export interface ProtocolRemediation {
  id: string;
  issueIds: string[];
  title: string;
  mode: 'manual' | 'safe-auto' | 'unsafe-auto';
  command?: string;
  targetPaths: string[];
  summary: string;
  steps: string[];
  preview?: {
    before?: string;
    after?: string;
  };
}

export interface ProtocolConsistencyReport {
  schemaVersion: 'hadara.protocol.consistency.v1';
  command: 'protocol.doctor';
  ok: boolean;
  scope: ProtocolConsistencyScope;
  projectRoot: string;
  generatedAt: string;
  summary: {
    checkedDocs: number;
    checkedTasks: number;
    activeTaskId: string | null;
    detectedProfile: 'basic' | 'standard' | 'governed' | 'unknown' | 'mixed';
    issueCounts: {
      error: number;
      warning: number;
      info: number;
    };
  };
  task?: {
    id: string;
    title: string;
    capsule: string;
    taskStatus: string;
    taskBoardStatus: string | null;
  };
  issues: ProtocolConsistencyIssue[];
  remediations: ProtocolRemediation[];
}

const REQUIRED_TASK_FILES = Object.keys(TASK_FILES);
const DONE_STATUSES = new Set(['done']);

export function createTaskProtocolConsistencyReport(projectRoot: string, taskId: string, now = new Date()): ProtocolConsistencyReport {
  const task = listTaskCapsules(projectRoot).find((candidate) => candidate.id === taskId);
  const issues: ProtocolConsistencyIssue[] = [];
  const checkedDocs = new Set<string>();

  if (!task) {
    pushIssue(issues, {
      code: 'TASK_NOT_FOUND',
      severity: 'error',
      area: 'task',
      taskId,
      message: `Task Capsule not found: ${taskId}`
    });
    return buildReport(projectRoot, now, issues, checkedDocs, undefined, null);
  }

  const capsulePath = toPortablePath(path.relative(projectRoot, task.dir));
  const taskStatus = readTaskStatus(task);
  const taskBoardRows = readTaskBoardRows(projectRoot, checkedDocs).filter((row) => row.id === task.id);
  const taskBoardStatus = taskBoardRows.length === 1 ? taskBoardRows[0].status : null;
  const taskLooksDone = isDoneStatus(taskStatus) || isDoneStatus(taskBoardStatus);

  checkRequiredTaskFiles(projectRoot, task, issues);
  checkTaskBoard(projectRoot, task, taskStatus, taskBoardRows, issues);
  checkDoneAcceptance(projectRoot, task, taskLooksDone, issues);
  checkEvidenceIndex(projectRoot, task, taskLooksDone, issues);
  checkProjectHandoff(projectRoot, task, taskStatus, checkedDocs, issues);
  checkScaffoldPlaceholders(projectRoot, task, taskLooksDone, issues);

  return buildReport(projectRoot, now, issues, checkedDocs, task, taskBoardStatus, {
    capsule: capsulePath,
    taskStatus
  });
}

export function createDocsProtocolConsistencyReport(projectRoot: string, now = new Date()): ProtocolConsistencyReport {
  const issues: ProtocolConsistencyIssue[] = [];
  const checkedDocs = new Set<string>();
  const tasks = listTaskCapsules(projectRoot);
  const taskBoardRows = readTaskBoardRows(projectRoot, checkedDocs);

  checkRequiredProjectDocs(projectRoot, checkedDocs, issues);
  checkRequiredReadingPaths(projectRoot, checkedDocs, issues);
  checkTaskBoardAgainstCapsules(projectRoot, tasks, taskBoardRows, issues);
  checkLatestCompletedHandoff(projectRoot, tasks, checkedDocs, issues);

  return buildReport(projectRoot, now, issues, checkedDocs, undefined, null, undefined, {
    scope: 'docs',
    checkedTasks: tasks.length,
    activeTaskId: findActiveTaskId(taskBoardRows, tasks)
  });
}

function buildReport(
  projectRoot: string,
  now: Date,
  issues: ProtocolConsistencyIssue[],
  checkedDocs: Set<string>,
  task: TaskCapsule | undefined,
  taskBoardStatus: string | null,
  taskMeta?: {
    capsule: string;
    taskStatus: string;
  },
  options?: {
    scope?: ProtocolConsistencyScope;
    checkedTasks?: number;
    activeTaskId?: string | null;
  }
): ProtocolConsistencyReport {
  const counts = {
    error: issues.filter((issue) => issue.severity === 'error').length,
    warning: issues.filter((issue) => issue.severity === 'warning').length,
    info: issues.filter((issue) => issue.severity === 'info').length
  };

  return {
    schemaVersion: 'hadara.protocol.consistency.v1',
    command: 'protocol.doctor',
    ok: counts.error === 0,
    scope: options?.scope ?? 'tasks',
    projectRoot,
    generatedAt: now.toISOString(),
    summary: {
      checkedDocs: checkedDocs.size,
      checkedTasks: options?.checkedTasks ?? (task ? 1 : 0),
      activeTaskId: options?.activeTaskId ?? (task && !isDoneStatus(taskMeta?.taskStatus ?? '') ? task.id : null),
      detectedProfile: detectProfile(projectRoot),
      issueCounts: counts
    },
    ...(task && taskMeta
      ? {
          task: {
            id: task.id,
            title: task.title,
            capsule: taskMeta.capsule,
            taskStatus: taskMeta.taskStatus,
            taskBoardStatus
          }
        }
      : {}),
    issues,
    remediations: []
  };
}

function checkRequiredProjectDocs(projectRoot: string, checkedDocs: Set<string>, issues: ProtocolConsistencyIssue[]): void {
  const docs = [
    'AGENTS.md',
    'docs/PROJECT_STATE.md',
    'docs/AGENT_HANDOFF.md',
    'docs/TASK_BOARD.md',
    'docs/IMPLEMENTATION_SOP.md'
  ];
  const profile = detectProfile(projectRoot);
  if (profile === 'standard' || profile === 'governed') {
    docs.push('docs/ARCHITECTURE.md', 'docs/DEVELOPMENT_SLICES.md', 'docs/DECISIONS.md', 'docs/TEST_STRATEGY.md');
  }
  if (profile === 'governed') {
    docs.push('docs/SECURITY_MODEL.md', 'docs/REFACTOR_LOG.md', 'docs/ROADMAP.md');
  }

  for (const relativePath of docs) {
    checkedDocs.add(relativePath);
    if (!fs.existsSync(path.join(projectRoot, relativePath))) {
      pushIssue(issues, {
        code: 'PROJECT_DOC_MISSING',
        severity: 'error',
        area: 'docs',
        path: relativePath,
        message: `Required project protocol document is missing: ${relativePath}`,
        expected: 'present',
        actual: 'missing'
      });
    }
  }
}

function checkRequiredReadingPaths(projectRoot: string, checkedDocs: Set<string>, issues: ProtocolConsistencyIssue[]): void {
  const sopPath = path.join(projectRoot, 'docs', 'IMPLEMENTATION_SOP.md');
  const relativePath = 'docs/IMPLEMENTATION_SOP.md';
  checkedDocs.add(relativePath);
  if (!fs.existsSync(sopPath)) return;

  const rows = parseMarkdownRows(readMarkdownSection(fs.readFileSync(sopPath, 'utf8'), '## Required Reading'));
  for (const cells of rows) {
    const documentCell = cells[0] ?? '';
    if (!documentCell.includes('`')) continue;
    const documentPaths = [...documentCell.matchAll(/`([^`]+)`/g)].map((match) => match[1]).filter((value) => value && !value.includes('*'));
    for (const documentPath of documentPaths) {
      if (isExternalReference(documentPath) || fs.existsSync(path.join(projectRoot, documentPath))) continue;
      pushIssue(issues, {
        code: 'REQUIRED_READING_DOC_MISSING',
        severity: 'warning',
        area: 'required-reading',
        path: relativePath,
        message: `SOP Required Reading references a missing document: ${documentPath}`,
        expected: `${documentPath} present`,
        actual: 'missing'
      });
    }
  }
}

function checkTaskBoardAgainstCapsules(
  projectRoot: string,
  tasks: TaskCapsule[],
  rows: TaskBoardRow[],
  issues: ProtocolConsistencyIssue[]
): void {
  const taskBoardPath = 'docs/TASK_BOARD.md';
  const rowsById = new Map<string, TaskBoardRow[]>();
  for (const row of rows) {
    rowsById.set(row.id, [...(rowsById.get(row.id) ?? []), row]);
  }

  for (const task of tasks) {
    const taskStatus = readTaskStatus(task);
    const expectedCapsule = toPortablePath(path.relative(projectRoot, task.dir));
    const matchingRows = rowsById.get(task.id) ?? [];
    if (matchingRows.length === 0) {
      pushIssue(issues, {
        code: 'PROJECT_TASK_BOARD_ROW_MISSING',
        severity: 'warning',
        area: 'docs',
        taskId: task.id,
        path: taskBoardPath,
        message: `docs/TASK_BOARD.md does not contain a row for ${task.id}.`,
        expected: task.id,
        actual: 'missing'
      });
      continue;
    }
    if (matchingRows.length > 1) {
      pushIssue(issues, {
        code: 'PROJECT_TASK_BOARD_ROW_DUPLICATE',
        severity: 'error',
        area: 'docs',
        taskId: task.id,
        path: taskBoardPath,
        message: `docs/TASK_BOARD.md contains ${matchingRows.length} rows for ${task.id}; expected one.`,
        expected: '1 row',
        actual: `${matchingRows.length} rows`
      });
      continue;
    }

    const row = matchingRows[0];
    if (row.status !== taskStatus) {
      pushIssue(issues, {
        code: 'PROJECT_TASK_BOARD_STATUS_DRIFT',
        severity: 'warning',
        area: 'docs',
        taskId: task.id,
        path: taskBoardPath,
        message: `docs/TASK_BOARD.md status for ${task.id} is ${row.status || '(empty)'}, but TASK.md status is ${taskStatus || '(empty)'}.`,
        expected: taskStatus || '(empty)',
        actual: row.status || '(empty)'
      });
    }
    if (row.capsule !== expectedCapsule) {
      pushIssue(issues, {
        code: 'PROJECT_TASK_BOARD_CAPSULE_DRIFT',
        severity: 'warning',
        area: 'docs',
        taskId: task.id,
        path: taskBoardPath,
        message: `docs/TASK_BOARD.md capsule for ${task.id} is ${row.capsule || '(empty)'}, expected ${expectedCapsule}.`,
        expected: expectedCapsule,
        actual: row.capsule || '(empty)'
      });
    }
  }

  const taskIds = new Set(tasks.map((task) => task.id));
  for (const row of rows) {
    if (taskIds.has(row.id)) continue;
    pushIssue(issues, {
      code: 'PROJECT_TASK_BOARD_ORPHAN_ROW',
      severity: 'warning',
      area: 'docs',
      taskId: row.id,
      path: taskBoardPath,
      message: `docs/TASK_BOARD.md contains ${row.id}, but no matching Task Capsule directory was found.`,
      expected: 'matching Task Capsule directory',
      actual: 'missing'
    });
  }
}

function checkLatestCompletedHandoff(projectRoot: string, tasks: TaskCapsule[], checkedDocs: Set<string>, issues: ProtocolConsistencyIssue[]): void {
  const handoffPath = path.join(projectRoot, 'docs', 'AGENT_HANDOFF.md');
  const relativePath = 'docs/AGENT_HANDOFF.md';
  checkedDocs.add(relativePath);
  if (!fs.existsSync(handoffPath)) return;

  const latestDone = [...tasks]
    .filter((task) => isDoneStatus(readTaskStatus(task)))
    .sort((a, b) => b.id.localeCompare(a.id))[0];
  if (!latestDone) return;

  const content = fs.readFileSync(handoffPath, 'utf8');
  if (!content.includes(latestDone.id)) {
    pushIssue(issues, {
      code: 'PROJECT_HANDOFF_LATEST_COMPLETED_STALE',
      severity: 'warning',
      area: 'handoff',
      taskId: latestDone.id,
      path: relativePath,
      message: `docs/AGENT_HANDOFF.md does not mention the latest completed task ${latestDone.id}.`,
      expected: `handoff mentions ${latestDone.id}`,
      actual: 'task id not found'
    });
  }
}

function checkRequiredTaskFiles(projectRoot: string, task: TaskCapsule, issues: ProtocolConsistencyIssue[]): void {
  for (const fileName of REQUIRED_TASK_FILES) {
    const filePath = path.join(task.dir, fileName);
    if (!fs.existsSync(filePath)) {
      pushIssue(issues, {
        code: 'TASK_FILE_MISSING',
        severity: 'error',
        area: 'task',
        taskId: task.id,
        path: toPortablePath(path.relative(projectRoot, filePath)),
        message: `Required Task Capsule file is missing: ${fileName}`,
        expected: 'present',
        actual: 'missing'
      });
    }
  }
}

function checkTaskBoard(
  projectRoot: string,
  task: TaskCapsule,
  taskStatus: string,
  rows: TaskBoardRow[],
  issues: ProtocolConsistencyIssue[]
): void {
  const taskBoardPath = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  const relativePath = toPortablePath(path.relative(projectRoot, taskBoardPath));
  const expectedCapsule = toPortablePath(path.relative(projectRoot, task.dir));

  if (!fs.existsSync(taskBoardPath)) {
    pushIssue(issues, {
      code: 'TASK_BOARD_MISSING',
      severity: 'error',
      area: 'docs',
      taskId: task.id,
      path: relativePath,
      message: 'docs/TASK_BOARD.md is missing.',
      expected: 'present',
      actual: 'missing'
    });
    return;
  }

  if (rows.length === 0) {
    pushIssue(issues, {
      code: 'TASK_BOARD_ROW_MISSING',
      severity: 'error',
      area: 'docs',
      taskId: task.id,
      path: relativePath,
      message: `docs/TASK_BOARD.md does not contain a row for ${task.id}.`,
      expected: task.id,
      actual: 'missing'
    });
    return;
  }

  if (rows.length > 1) {
    pushIssue(issues, {
      code: 'TASK_BOARD_ROW_DUPLICATE',
      severity: 'error',
      area: 'docs',
      taskId: task.id,
      path: relativePath,
      message: `docs/TASK_BOARD.md contains ${rows.length} rows for ${task.id}; expected one.`,
      expected: '1 row',
      actual: `${rows.length} rows`
    });
    return;
  }

  const row = rows[0];
  if (row.status !== taskStatus) {
    pushIssue(issues, {
      code: 'TASK_BOARD_STATUS_DRIFT',
      severity: 'warning',
      area: 'docs',
      taskId: task.id,
      path: relativePath,
      message: `docs/TASK_BOARD.md status for ${task.id} is ${row.status || '(empty)'}, but TASK.md status is ${taskStatus || '(empty)'}.`,
      expected: taskStatus || '(empty)',
      actual: row.status || '(empty)'
    });
  }

  if (row.capsule !== expectedCapsule) {
    pushIssue(issues, {
      code: 'TASK_BOARD_CAPSULE_DRIFT',
      severity: 'warning',
      area: 'docs',
      taskId: task.id,
      path: relativePath,
      message: `docs/TASK_BOARD.md capsule for ${task.id} is ${row.capsule || '(empty)'}, expected ${expectedCapsule}.`,
      expected: expectedCapsule,
      actual: row.capsule || '(empty)'
    });
  }
}

function checkDoneAcceptance(projectRoot: string, task: TaskCapsule, taskLooksDone: boolean, issues: ProtocolConsistencyIssue[]): void {
  if (!taskLooksDone) return;

  const acceptancePath = path.join(task.dir, 'ACCEPTANCE.md');
  if (!fs.existsSync(acceptancePath)) return;

  const content = fs.readFileSync(acceptancePath, 'utf8');
  const rows = parseMarkdownRows(content).filter((cells) => /^AC-\d+$/i.test(cells[0] ?? ''));
  const pendingRows = rows.filter((cells) => {
    const status = cells[2]?.trim().toLowerCase();
    return !status || status === 'pending' || status === 'blocked';
  });
  const checklistPending = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .some((line) => /^-\s+\[\s\]/.test(line));

  if (pendingRows.length > 0 || (rows.length === 0 && checklistPending)) {
    pushIssue(issues, {
      code: 'TASK_DONE_ACCEPTANCE_PENDING',
      severity: 'error',
      area: 'validation',
      taskId: task.id,
      path: toPortablePath(path.relative(projectRoot, acceptancePath)),
      message: 'Task is marked Done but ACCEPTANCE.md still has pending or blocked criteria.',
      expected: 'all acceptance criteria complete',
      actual: 'pending criteria found'
    });
  }
}

function checkEvidenceIndex(projectRoot: string, task: TaskCapsule, taskLooksDone: boolean, issues: ProtocolConsistencyIssue[]): void {
  const evidencePath = path.join(task.dir, 'evidence.jsonl');
  if (!fs.existsSync(evidencePath)) {
    pushIssue(issues, {
      code: 'EVIDENCE_JSONL_MISSING',
      severity: 'error',
      area: 'evidence',
      taskId: task.id,
      path: toPortablePath(path.relative(projectRoot, evidencePath)),
      message: 'Task Capsule evidence index is missing.',
      expected: 'evidence.jsonl present',
      actual: 'missing'
    });
    return;
  }

  if (taskLooksDone && !fs.readFileSync(evidencePath, 'utf8').trim()) {
    pushIssue(issues, {
      code: 'EVIDENCE_JSONL_EMPTY',
      severity: 'error',
      area: 'evidence',
      taskId: task.id,
      path: toPortablePath(path.relative(projectRoot, evidencePath)),
      message: 'Task is marked Done but evidence.jsonl has no records.',
      expected: 'at least one evidence record',
      actual: 'empty evidence.jsonl'
    });
  }
}

function checkProjectHandoff(
  projectRoot: string,
  task: TaskCapsule,
  taskStatus: string,
  checkedDocs: Set<string>,
  issues: ProtocolConsistencyIssue[]
): void {
  if (isDoneStatus(taskStatus)) return;

  const handoffPath = path.join(projectRoot, 'docs', 'AGENT_HANDOFF.md');
  checkedDocs.add(toPortablePath(path.relative(projectRoot, handoffPath)));
  if (!fs.existsSync(handoffPath)) {
    pushIssue(issues, {
      code: 'PROJECT_HANDOFF_MISSING',
      severity: 'warning',
      area: 'handoff',
      taskId: task.id,
      path: toPortablePath(path.relative(projectRoot, handoffPath)),
      message: 'docs/AGENT_HANDOFF.md is missing, so active task handoff freshness cannot be checked.'
    });
    return;
  }

  const content = fs.readFileSync(handoffPath, 'utf8');
  if (!content.includes(task.id)) {
    pushIssue(issues, {
      code: 'PROJECT_HANDOFF_STALE',
      severity: 'warning',
      area: 'handoff',
      taskId: task.id,
      path: toPortablePath(path.relative(projectRoot, handoffPath)),
      message: `docs/AGENT_HANDOFF.md does not mention active task ${task.id}.`,
      expected: `handoff mentions ${task.id}`,
      actual: 'task id not found'
    });
  }
}

function checkScaffoldPlaceholders(projectRoot: string, task: TaskCapsule, taskLooksDone: boolean, issues: ProtocolConsistencyIssue[]): void {
  if (!taskLooksDone) return;

  for (const fileName of REQUIRED_TASK_FILES) {
    if (fileName === 'evidence.jsonl') continue;
    const filePath = path.join(task.dir, fileName);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    if (isTaskCapsuleScaffoldContent(task, fileName, content)) {
      pushIssue(issues, {
        code: 'TASK_SCAFFOLD_PLACEHOLDER',
        severity: 'warning',
        area: 'task',
        taskId: task.id,
        path: toPortablePath(path.relative(projectRoot, filePath)),
        message: `${fileName} still appears to contain default scaffold placeholder content.`,
        expected: 'task-specific content',
        actual: 'scaffold placeholder content'
      });
    }
  }
}

function readTaskStatus(task: TaskCapsule): string {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return '';
  const content = fs.readFileSync(taskPath, 'utf8');
  const metadataStatus = parseMetadataStatus(content);
  if (metadataStatus) return metadataStatus;
  const bodyStatus = readMarkdownSection(content, '## Status').trim().split(/\r?\n/)[0]?.trim();
  return bodyStatus || '';
}

function parseMetadataStatus(content: string): string | null {
  for (const cells of parseMarkdownRows(content)) {
    if ((cells[0] ?? '').toLowerCase() === 'status') return cells[1] ?? '';
  }
  return null;
}

interface TaskBoardRow {
  id: string;
  status: string;
  capsule: string;
}

function readTaskBoardRows(projectRoot: string, checkedDocs: Set<string>): TaskBoardRow[] {
  const taskBoardPath = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  checkedDocs.add(toPortablePath(path.relative(projectRoot, taskBoardPath)));
  if (!fs.existsSync(taskBoardPath)) return [];
  return fs
    .readFileSync(taskBoardPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\|\s*T-\d{4}\s*\|/.test(line))
    .map((line) => {
      const cells = line
        .slice(1, line.endsWith('|') ? -1 : undefined)
        .split('|')
        .map((cell) => cell.trim());
      return {
        id: cells[0] ?? '',
        status: cells[2] ?? '',
        capsule: cells[3] ?? ''
      };
    });
}

function findActiveTaskId(rows: TaskBoardRow[], tasks: TaskCapsule[]): string | null {
  const activeRow = rows.find((row) => row.status.trim().toLowerCase() === 'active');
  if (activeRow) return activeRow.id;
  const draftRow = rows.find((row) => row.status.trim().toLowerCase() === 'draft');
  if (draftRow) return draftRow.id;
  const activeTask = tasks.find((task) => {
    const status = readTaskStatus(task).trim().toLowerCase();
    return status === 'active' || status === 'draft';
  });
  return activeTask?.id ?? null;
}

function pushIssue(issues: ProtocolConsistencyIssue[], issue: Omit<ProtocolConsistencyIssue, 'id'>): void {
  issues.push({
    id: `issue-${String(issues.length + 1).padStart(3, '0')}`,
    ...issue
  });
}

function detectProfile(projectRoot: string): 'basic' | 'standard' | 'governed' | 'unknown' | 'mixed' {
  const hasStandardDocs = ['ARCHITECTURE.md', 'DEVELOPMENT_SLICES.md', 'DECISIONS.md', 'TEST_STRATEGY.md'].every((file) =>
    fs.existsSync(path.join(projectRoot, 'docs', file))
  );
  const hasGovernedDocs = ['SECURITY_MODEL.md', 'REFACTOR_LOG.md', 'ROADMAP.md'].every((file) => fs.existsSync(path.join(projectRoot, 'docs', file)));
  if (hasGovernedDocs && hasStandardDocs) return 'governed';
  if (hasGovernedDocs && !hasStandardDocs) return 'mixed';
  if (hasStandardDocs) return 'standard';
  if (fs.existsSync(path.join(projectRoot, 'docs', 'PROJECT_STATE.md'))) return 'basic';
  return 'unknown';
}

function parseMarkdownRows(content: string): string[][] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && line.endsWith('|'))
    .filter((line) => !/^\|\s*-+/.test(line))
    .map((line) =>
      line
        .slice(1, -1)
        .split('|')
        .map((cell) => cell.trim())
    );
}

function readMarkdownSection(content: string, heading: string): string {
  const start = content.indexOf(heading);
  if (start < 0) return '';
  const afterHeading = content.slice(start + heading.length);
  const nextHeading = afterHeading.search(/\n##\s+/);
  return nextHeading >= 0 ? afterHeading.slice(0, nextHeading) : afterHeading;
}

function isDoneStatus(status: string | null | undefined): boolean {
  return DONE_STATUSES.has((status ?? '').trim().toLowerCase());
}

function isExternalReference(value: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(value);
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
