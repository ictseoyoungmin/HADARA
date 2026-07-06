import fs from 'node:fs';
import path from 'node:path';
import { createProfileConsistencyDiagnostics, createProtocolProfileSummary, ProtocolProfileSummary } from './protocol-profile';
import { createEvidenceLintReport } from './evidence-lint';
import { parseMarkdownRows, readMarkdownSection } from './markdown-table';
import { createStateProjectionReport, StateProjectionAdvisory, toStateProjectionAdvisory } from './state-projection';
import { ProtocolRemediationFix } from './protocol-remediation';
import { analyzeAcceptanceReadiness } from '../task/acceptance';
import { findTaskCapsule, isTaskCapsuleScaffoldContent, listTaskCapsules, TaskCapsule, TASK_FILES } from '../task/task-capsule';

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
  suggestedFix?: ProtocolSuggestedFix;
}

export interface ProtocolSuggestedFix {
  kind: 'protocol-remediate';
  mode: 'safe-auto';
  fix: ProtocolRemediationFix;
  command: string;
  targetPaths: string[];
  executeRequires: '--execute';
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
  taskId?: string;
  scope: ProtocolConsistencyScope;
  projectRoot: string;
  generatedAt: string;
  summary: {
    checkedDocs: number;
    checkedTasks: number;
    activeTaskId: string | null;
    detectedProfile: 'basic' | 'standard' | 'governed' | 'unknown' | 'mixed';
    profile: ProtocolProfileSummary;
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
  stateConsistency?: StateProjectionAdvisory;
  issues: ProtocolConsistencyIssue[];
  remediations: ProtocolRemediation[];
}

const REQUIRED_TASK_FILES = Object.keys(TASK_FILES);
const DONE_STATUSES = new Set(['done']);
const CORE_PROJECT_DOCS = ['AGENTS.md', 'docs/PROJECT_STATE.md', 'docs/AGENT_HANDOFF.md', 'docs/TASK_BOARD.md', 'docs/HADARA_WORKFLOW.md'];
const STANDARD_PROJECT_DOCS = ['docs/ARCHITECTURE.md', 'docs/DEVELOPMENT_SLICES.md', 'docs/DECISIONS.md', 'docs/TEST_STRATEGY.md'];
const GOVERNED_PROJECT_DOCS = ['docs/SECURITY_MODEL.md', 'docs/REFACTOR_LOG.md', 'docs/ROADMAP.md'];

export function createTaskProtocolConsistencyReport(projectRoot: string, taskId: string, now = new Date()): ProtocolConsistencyReport {
  const task = findTaskCapsule(projectRoot, taskId);
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
    return buildReport(projectRoot, now, issues, checkedDocs, undefined, null, undefined, { taskId });
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
  const activeTaskId = findActiveTaskId(taskBoardRows, tasks);
  const latestDoneTask = findLatestDoneTask(tasks);

  checkRequiredProjectDocs(projectRoot, checkedDocs, issues);
  checkRequiredReadingPaths(projectRoot, checkedDocs, issues);
  checkTaskBoardAgainstCapsules(projectRoot, tasks, taskBoardRows, issues);
  checkProjectStateConsistency(projectRoot, activeTaskId, latestDoneTask, checkedDocs, issues);
  checkProjectHandoffConsistency(projectRoot, activeTaskId, latestDoneTask, checkedDocs, issues);
  checkDevelopmentSlicesConsistency(projectRoot, tasks, checkedDocs, issues);
  checkDecisionsConsistency(projectRoot, checkedDocs, issues);
  checkTestStrategyConsistency(projectRoot, checkedDocs, issues);
  checkWorkflowScaffoldStructure(projectRoot, checkedDocs, issues);

  return buildReport(projectRoot, now, issues, checkedDocs, undefined, null, undefined, {
    scope: 'docs',
    checkedTasks: tasks.length,
    activeTaskId
  });
}

export function createProfileProtocolConsistencyReport(projectRoot: string, now = new Date()): ProtocolConsistencyReport {
  const diagnostics = createProfileConsistencyDiagnostics(projectRoot);
  const issues: ProtocolConsistencyIssue[] = [];

  for (const issue of diagnostics.issues) {
    pushIssue(issues, {
      ...issue,
      suggestedFix: createProfileSuggestedFix(issue, diagnostics.targetProfile)
    });
  }

  const remediations = diagnostics.remediations.map((remediation) => ({
    ...remediation,
    issueIds:
      remediation.issueIds.length > 0
        ? remediation.issueIds
        : issues.filter((issue) => issue.remediationId === remediation.id).map((issue) => issue.id)
  }));

  return buildReport(projectRoot, now, issues, diagnostics.checkedDocs, undefined, null, undefined, {
    scope: 'profile',
    checkedTasks: 0,
    activeTaskId: null,
    detectedProfile: diagnostics.detectedProfile,
    profileSummary: diagnostics.profileSummary,
    remediations
  });
}

export function createAllProtocolConsistencyReport(projectRoot: string, now = new Date()): ProtocolConsistencyReport {
  const docsReport = createDocsProtocolConsistencyReport(projectRoot, now);
  const profileReport = createProfileProtocolConsistencyReport(projectRoot, now);
  const taskReports = docsReport.summary.activeTaskId ? [createTaskProtocolConsistencyReport(projectRoot, docsReport.summary.activeTaskId, now)] : [];
  const issueIdMap = new Map<string, string>();
  const issues: ProtocolConsistencyIssue[] = [];

  for (const [label, report] of [
    ['docs', docsReport],
    ['profile', profileReport],
    ...taskReports.map((report) => [`task:${report.task?.id ?? report.summary.activeTaskId ?? report.scope}`, report] as const)
  ] as const) {
    for (const issue of report.issues) {
      const id = `issue-${String(issues.length + 1).padStart(3, '0')}`;
      issueIdMap.set(`${label}:${issue.id}`, id);
      issues.push({ ...issue, id });
    }
  }

  const remediations: ProtocolRemediation[] = [];
  for (const [label, report] of [
    ['docs', docsReport],
    ['profile', profileReport],
    ...taskReports.map((report) => [`task:${report.task?.id ?? report.summary.activeTaskId ?? report.scope}`, report] as const)
  ] as const) {
    for (const remediation of report.remediations) {
      const remapped = {
        ...remediation,
        issueIds: remediation.issueIds.map((issueId) => issueIdMap.get(`${label}:${issueId}`) ?? issueId)
      };
      remediations.push(remediations.some((candidate) => candidate.id === remapped.id) ? { ...remapped, id: `${label}:${remapped.id}` } : remapped);
    }
  }
  const counts = countIssues(issues);
  const stateConsistency = toStateProjectionAdvisory(createStateProjectionReport(projectRoot, now), 10);

  return {
    schemaVersion: 'hadara.protocol.consistency.v1',
    command: 'protocol.doctor',
    ok: counts.error === 0,
    scope: 'all',
    projectRoot,
    generatedAt: now.toISOString(),
    summary: {
      checkedDocs: Math.max(docsReport.summary.checkedDocs, profileReport.summary.checkedDocs),
      checkedTasks: docsReport.summary.checkedTasks,
      activeTaskId: docsReport.summary.activeTaskId,
      detectedProfile: profileReport.summary.detectedProfile,
      profile: profileReport.summary.profile,
      issueCounts: counts
    },
    stateConsistency,
    issues,
    remediations
  };
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
    taskId?: string | null;
    checkedTasks?: number;
    activeTaskId?: string | null;
    detectedProfile?: 'basic' | 'standard' | 'governed' | 'unknown' | 'mixed';
    profileSummary?: ProtocolProfileSummary;
    remediations?: ProtocolRemediation[];
  }
): ProtocolConsistencyReport {
  const counts = countIssues(issues);

  return {
    schemaVersion: 'hadara.protocol.consistency.v1',
    command: 'protocol.doctor',
    ok: counts.error === 0,
    ...(options?.taskId ? { taskId: options.taskId } : task ? { taskId: task.id } : {}),
    scope: options?.scope ?? 'tasks',
    projectRoot,
    generatedAt: now.toISOString(),
    summary: {
      checkedDocs: checkedDocs.size,
      checkedTasks: options?.checkedTasks ?? (task ? 1 : 0),
      activeTaskId: options?.activeTaskId ?? (task && !isDoneStatus(taskMeta?.taskStatus ?? '') ? task.id : null),
      detectedProfile: options?.detectedProfile ?? detectProfile(projectRoot),
      profile: options?.profileSummary ?? createProtocolProfileSummary(projectRoot),
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
    remediations: mergeRemediations(options?.remediations ?? [], buildSuggestedFixRemediations(issues))
  };
}

function countIssues(issues: ProtocolConsistencyIssue[]): { error: number; warning: number; info: number } {
  return {
    error: issues.filter((issue) => issue.severity === 'error').length,
    warning: issues.filter((issue) => issue.severity === 'warning').length,
    info: issues.filter((issue) => issue.severity === 'info').length
  };
}

function checkRequiredProjectDocs(projectRoot: string, checkedDocs: Set<string>, issues: ProtocolConsistencyIssue[]): void {
  const docs = [...CORE_PROJECT_DOCS];
  const profile = detectProfile(projectRoot);
  const docSet = getProjectDocSet(projectRoot);
  const hasAnyStandardDoc = docSet.standard.present.length > 0;
  const hasAnyGovernedDoc = docSet.governed.present.length > 0;
  if (profile === 'mixed' || (hasAnyStandardDoc && docSet.standard.missing.length > 0) || (hasAnyGovernedDoc && docSet.governed.missing.length > 0)) {
    pushIssue(issues, {
      code: 'PROFILE_DOC_SET_MIXED',
      severity: 'warning',
      area: 'profile',
      message: 'Project profile document set is mixed or partial.',
      expected: 'complete basic, standard, or governed doc set',
      actual: `standard missing: ${docSet.standard.missing.join(', ') || 'none'}; governed missing: ${docSet.governed.missing.join(', ') || 'none'}`
    });
  }
  if (profile === 'standard' || profile === 'governed' || hasAnyStandardDoc || hasAnyGovernedDoc) {
    docs.push(...STANDARD_PROJECT_DOCS);
  }
  if (profile === 'governed' || hasAnyGovernedDoc) {
    docs.push(...GOVERNED_PROJECT_DOCS);
  }

  for (const relativePath of Array.from(new Set(docs))) {
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
  const sopPath = path.join(projectRoot, 'AGENTS.md');
  const relativePath = 'AGENTS.md';
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
        message: `AGENTS Required Reading references a missing document: ${documentPath}`,
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
        actual: 'missing',
        suggestedFix: createSuggestedFix('task-board-row', task.id, [taskBoardPath])
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

function checkProjectStateConsistency(
  projectRoot: string,
  activeTaskId: string | null,
  latestDoneTask: TaskCapsule | undefined,
  checkedDocs: Set<string>,
  issues: ProtocolConsistencyIssue[]
): void {
  const projectStatePath = path.join(projectRoot, 'docs', 'PROJECT_STATE.md');
  const relativePath = 'docs/PROJECT_STATE.md';
  checkedDocs.add(relativePath);
  if (!fs.existsSync(projectStatePath)) return;

  const content = fs.readFileSync(projectStatePath, 'utf8');
  const currentStatus = readMarkdownSection(content, '## Current Status');
  if (activeTaskId && hasTaskStateMarker(content, 'active') && !currentStatus.includes(activeTaskId)) {
    pushIssue(issues, {
      code: 'PROJECT_STATE_ACTIVE_TASK_STALE',
      severity: 'warning',
      area: 'docs',
      taskId: activeTaskId,
      path: relativePath,
      message: `docs/PROJECT_STATE.md active/current task markers do not mention ${activeTaskId}.`,
      expected: `Current Status mentions ${activeTaskId}`,
      actual: 'task id not found in Current Status'
    });
  }
  if (latestDoneTask && hasTaskStateMarker(content, 'latest') && !currentStatus.includes(latestDoneTask.id)) {
    pushIssue(issues, {
      code: 'PROJECT_STATE_LATEST_COMPLETED_STALE',
      severity: 'warning',
      area: 'docs',
      taskId: latestDoneTask.id,
      path: relativePath,
      message: `docs/PROJECT_STATE.md latest completed markers do not mention ${latestDoneTask.id}.`,
      expected: `Current Status mentions ${latestDoneTask.id}`,
      actual: 'task id not found in Current Status'
    });
  }
}

function checkProjectHandoffConsistency(
  projectRoot: string,
  activeTaskId: string | null,
  latestDoneTask: TaskCapsule | undefined,
  checkedDocs: Set<string>,
  issues: ProtocolConsistencyIssue[]
): void {
  const handoffPath = path.join(projectRoot, 'docs', 'AGENT_HANDOFF.md');
  const relativePath = 'docs/AGENT_HANDOFF.md';
  checkedDocs.add(relativePath);
  if (!fs.existsSync(handoffPath)) return;

  const content = fs.readFileSync(handoffPath, 'utf8');
  const currentState = readMarkdownSection(content, '## Current State');
  const fields = readKeyValueRows(currentState);
  const latestCell = fields.get('latest completed task') ?? '';
  const activeCell = fields.get('active / next task') ?? '';

  if (latestDoneTask && !latestCell.includes(latestDoneTask.id)) {
    pushIssue(issues, {
      code: 'PROJECT_HANDOFF_LATEST_COMPLETED_STALE',
      severity: 'warning',
      area: 'handoff',
      taskId: latestDoneTask.id,
      path: relativePath,
      message: `docs/AGENT_HANDOFF.md Latest Completed Task does not point at ${latestDoneTask.id}.`,
      expected: `Latest Completed Task mentions ${latestDoneTask.id}`,
      actual: latestCell || 'missing Latest Completed Task field'
    });
  }
  if (activeTaskId && !activeCell.includes(activeTaskId)) {
    pushIssue(issues, {
      code: 'PROJECT_HANDOFF_ACTIVE_TASK_STALE',
      severity: 'warning',
      area: 'handoff',
      taskId: activeTaskId,
      path: relativePath,
      message: `docs/AGENT_HANDOFF.md Active / Next Task does not point at ${activeTaskId}.`,
      expected: `Active / Next Task mentions ${activeTaskId}`,
      actual: activeCell || 'missing Active / Next Task field'
    });
  }
}

function checkDevelopmentSlicesConsistency(projectRoot: string, tasks: TaskCapsule[], checkedDocs: Set<string>, issues: ProtocolConsistencyIssue[]): void {
  const slicesPath = path.join(projectRoot, 'docs', 'DEVELOPMENT_SLICES.md');
  const relativePath = 'docs/DEVELOPMENT_SLICES.md';
  checkedDocs.add(relativePath);
  if (!fs.existsSync(slicesPath)) return;

  const tasksById = new Map(tasks.map((task) => [task.id, task]));
  for (const row of parseMarkdownRows(fs.readFileSync(slicesPath, 'utf8'))) {
    const capsule = row[2] ?? '';
    const taskIds = [...capsule.matchAll(/T-\d{4}/g)].map((match) => match[0]);
    if (taskIds.length === 0) continue;
    const evidence = row[4] ?? '';
    const evidenceLooksDone = /^\s*Done\b/i.test(evidence);
    const evidenceLooksFuture = /^\s*Future\b/i.test(evidence);
    for (const taskId of taskIds) {
      const task = tasksById.get(taskId);
      if (!task) continue;
      const taskDone = isDoneStatus(readTaskStatus(task));
      if (taskDone && evidenceLooksFuture) {
        pushIssue(issues, {
          code: 'DEVELOPMENT_SLICE_STATUS_DRIFT',
          severity: 'warning',
          area: 'docs',
          taskId,
          path: relativePath,
          message: `docs/DEVELOPMENT_SLICES.md still marks ${taskId} as future while its Task Capsule is Done.`,
          expected: 'Done evidence',
          actual: evidence
        });
      }
      if (!taskDone && evidenceLooksDone) {
        pushIssue(issues, {
          code: 'DEVELOPMENT_SLICE_STATUS_DRIFT',
          severity: 'warning',
          area: 'docs',
          taskId,
          path: relativePath,
          message: `docs/DEVELOPMENT_SLICES.md marks ${taskId} as done while its Task Capsule is ${readTaskStatus(task) || '(empty)'}.`,
          expected: `Task Capsule status ${readTaskStatus(task) || '(empty)'}`,
          actual: evidence
        });
      }
    }
  }
}

function checkDecisionsConsistency(projectRoot: string, checkedDocs: Set<string>, issues: ProtocolConsistencyIssue[]): void {
  const decisionsPath = path.join(projectRoot, 'docs', 'DECISIONS.md');
  const relativePath = 'docs/DECISIONS.md';
  checkedDocs.add(relativePath);
  if (!fs.existsSync(decisionsPath)) return;

  const content = fs.readFileSync(decisionsPath, 'utf8');
  const rows = parseMarkdownRows(content).filter((row) => /^D-\d+/i.test(row[0] ?? ''));
  if (rows.length === 0 && /##\s+D-\d+/i.test(content)) {
    pushIssue(issues, {
      code: 'DECISIONS_TABLE_MISSING',
      severity: 'warning',
      area: 'docs',
      path: relativePath,
      message: 'docs/DECISIONS.md uses legacy decision prose without the table-first decision index expected by the current scaffold.',
      expected: 'decision table rows with evidence cells',
      actual: 'legacy decision headings',
      suggestedFix: createSuggestedFix('decisions-table-frame', undefined, [relativePath])
    });
    return;
  }
  for (const row of rows) {
    const status = row[2] ?? '';
    const evidence = row[4] ?? '';
    if (/accepted/i.test(status) && isEmptyEvidenceCell(evidence)) {
      pushIssue(issues, {
        code: 'DECISION_EVIDENCE_MISSING',
        severity: 'warning',
        area: 'docs',
        path: relativePath,
        message: `Accepted project decision ${row[0]} has no evidence link.`,
        expected: 'non-empty evidence cell',
        actual: evidence || 'empty'
      });
    }
  }
}

function checkTestStrategyConsistency(projectRoot: string, checkedDocs: Set<string>, issues: ProtocolConsistencyIssue[]): void {
  const testStrategyPath = path.join(projectRoot, 'docs', 'TEST_STRATEGY.md');
  const handoffPath = path.join(projectRoot, 'docs', 'AGENT_HANDOFF.md');
  const relativePath = 'docs/TEST_STRATEGY.md';
  checkedDocs.add(relativePath);
  if (!fs.existsSync(testStrategyPath)) return;

  const content = fs.readFileSync(testStrategyPath, 'utf8');
  const envSection = readMarkdownSection(content, '## Current Validation Environment');
  if (!/Docker/i.test(envSection) || !/primary validation path/i.test(envSection)) {
    pushIssue(issues, {
      code: 'TEST_STRATEGY_VALIDATION_BASELINE_STALE',
      severity: 'warning',
      area: 'validation',
      path: relativePath,
      message: 'docs/TEST_STRATEGY.md Current Validation Environment does not clearly identify Docker as the primary validation path.',
      expected: 'Docker primary validation baseline',
      actual: envSection.trim().split(/\r?\n/)[0] || 'missing Current Validation Environment section'
    });
  }
  if (fs.existsSync(handoffPath)) {
    const handoff = fs.readFileSync(handoffPath, 'utf8');
    if (/Validation Baseline/i.test(handoff) && /Docker/i.test(handoff) && !/Docker/i.test(envSection)) {
      pushIssue(issues, {
        code: 'TEST_STRATEGY_HANDOFF_BASELINE_DRIFT',
        severity: 'warning',
        area: 'validation',
        path: relativePath,
        message: 'docs/AGENT_HANDOFF.md records a Docker validation baseline but TEST_STRATEGY does not.',
        expected: 'TEST_STRATEGY mirrors Docker baseline',
        actual: 'Docker missing from TEST_STRATEGY validation environment'
      });
    }
  }
}

function checkWorkflowScaffoldStructure(projectRoot: string, checkedDocs: Set<string>, issues: ProtocolConsistencyIssue[]): void {
  const sopPath = path.join(projectRoot, 'docs', 'HADARA_WORKFLOW.md');
  const relativePath = 'docs/HADARA_WORKFLOW.md';
  checkedDocs.add(relativePath);
  if (!fs.existsSync(sopPath)) return;

  const content = fs.readFileSync(sopPath, 'utf8');
  const requiredSections = [
    '## Quickstart',
    '## Minimal Loop',
    '## Read Authority Rules',
    '## Task Capsule Lifecycle',
    '## Evidence',
    '## Authoring Model'
  ];
  for (const heading of requiredSections) {
    if (content.includes(heading)) continue;
    pushIssue(issues, {
      code: 'WORKFLOW_SCAFFOLD_SECTION_MISSING',
      severity: 'warning',
      area: 'docs',
      path: relativePath,
      message: `docs/HADARA_WORKFLOW.md is missing required section ${heading}.`,
      expected: heading,
      actual: 'missing'
    });
  }
  const readAuthorityRows = parseMarkdownRows(readMarkdownSection(content, '## Read Authority Rules'));
  if (!readAuthorityRows.some((row) => row[0] === 'Order' && row[1] === 'Authority' && row[2] === 'Allowed Reads')) {
    pushIssue(issues, {
      code: 'WORKFLOW_READ_AUTHORITY_TABLE_MISSING',
      severity: 'warning',
      area: 'docs',
      path: relativePath,
      message: 'docs/HADARA_WORKFLOW.md Read Authority Rules section is missing the canonical table header.',
      expected: '| Order | Authority | Allowed Reads |',
      actual: 'canonical header not found'
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
        actual: 'missing',
        suggestedFix: createSuggestedFix('task-board-row', task.id, [relativePath])
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
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(acceptancePath) && !fs.existsSync(taskPath)) return;

  const usesLegacySidecar = fs.existsSync(acceptancePath);
  const sourcePath = usesLegacySidecar ? acceptancePath : taskPath;
  const content = usesLegacySidecar ? fs.readFileSync(acceptancePath, 'utf8') : readMarkdownSection(fs.readFileSync(taskPath, 'utf8'), '## Acceptance');
  const acceptance = analyzeAcceptanceReadiness(content);
  const checklistPending = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .some((line) => /^-\s+\[\s\]/.test(line));

  if (acceptance.blockers.length > 0 || (acceptance.rows.length === 0 && checklistPending)) {
    const blockerSummary =
      acceptance.blockers.length > 0 ? ` Blockers: ${acceptance.blockers.map((blocker) => `${blocker.code}(${blocker.row.id})`).join(', ')}.` : '';
    pushIssue(issues, {
      code: 'TASK_DONE_ACCEPTANCE_PENDING',
      severity: 'error',
      area: 'validation',
      taskId: task.id,
      path: toPortablePath(path.relative(projectRoot, sourcePath)),
      message: `Task is marked Done but acceptance criteria still have pending, blocked, or in-progress criteria.${blockerSummary}`,
      expected: 'all acceptance criteria complete',
      actual: 'incomplete criteria found'
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
      actual: 'missing',
      suggestedFix: createSuggestedFix('evidence-jsonl', task.id, [toPortablePath(path.relative(projectRoot, evidencePath))])
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

  const lintReport = createEvidenceLintReport(projectRoot, task.id);
  for (const issue of lintReport.issues) {
    if (issue.code === 'EVIDENCE_MARKDOWN_JSONL_COUNT_DRIFT') continue;
    if (issue.code === 'EVIDENCE_INDEX_MISSING') continue;
    pushIssue(issues, {
      code: issue.code,
      severity: issue.severity,
      area: 'evidence',
      taskId: task.id,
      path: issue.path,
      message: issue.message,
      expected: issue.expected,
      actual: issue.actual
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
  const legacySidecarComplete = ['PLAN.md', 'ACCEPTANCE.md', 'TESTS.md', 'FILES.md'].every((fileName) => fs.existsSync(path.join(task.dir, fileName)));

  for (const fileName of REQUIRED_TASK_FILES) {
    if (fileName === 'evidence.jsonl') continue;
    if (fileName === 'TASK.md' && legacySidecarComplete) continue;
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

function findLatestDoneTask(tasks: TaskCapsule[]): TaskCapsule | undefined {
  return [...tasks].filter((task) => isDoneStatus(readTaskStatus(task))).sort((a, b) => b.id.localeCompare(a.id))[0];
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

function getProjectDocSet(projectRoot: string): {
  standard: { present: string[]; missing: string[] };
  governed: { present: string[]; missing: string[] };
} {
  return {
    standard: splitDocPresence(projectRoot, STANDARD_PROJECT_DOCS),
    governed: splitDocPresence(projectRoot, GOVERNED_PROJECT_DOCS)
  };
}

function splitDocPresence(projectRoot: string, relativePaths: string[]): { present: string[]; missing: string[] } {
  const present: string[] = [];
  const missing: string[] = [];
  for (const relativePath of relativePaths) {
    (fs.existsSync(path.join(projectRoot, relativePath)) ? present : missing).push(relativePath);
  }
  return { present, missing };
}

function readKeyValueRows(content: string): Map<string, string> {
  const fields = new Map<string, string>();
  for (const row of parseMarkdownRows(content)) {
    const key = (row[0] ?? '').trim().toLowerCase();
    if (!key || key === 'area' || key === 'field') continue;
    fields.set(key, row.slice(1).join(' | '));
  }
  return fields;
}

function hasTaskStateMarker(content: string, kind: 'active' | 'latest'): boolean {
  const pattern = kind === 'active' ? /active\s*(\/|or)?\s*(current|next)?\s*task/i : /latest\s+completed\s+task/i;
  return pattern.test(content);
}

function isEmptyEvidenceCell(value: string): boolean {
  return !value.trim() || /^(TBD|N\/A|None|Not Run)$/i.test(value.trim());
}

function pushIssue(issues: ProtocolConsistencyIssue[], issue: Omit<ProtocolConsistencyIssue, 'id'>): void {
  issues.push({
    id: `issue-${String(issues.length + 1).padStart(3, '0')}`,
    ...issue
  });
}

function createProfileSuggestedFix(
  issue: {
    code: string;
    path?: string;
  },
  targetProfile: 'basic' | 'standard' | 'governed' | 'unknown'
): ProtocolSuggestedFix | undefined {
  if (targetProfile === 'unknown') return undefined;
  if ((issue.code !== 'PROFILE_METADATA_MISSING' && issue.code !== 'PROFILE_METADATA_DRIFT') || issue.path !== 'docs/PROJECT_STATE.md') return undefined;
  return createSuggestedFix('project-state-profile', undefined, ['docs/PROJECT_STATE.md'], targetProfile);
}

function createSuggestedFix(
  fix: ProtocolRemediationFix,
  taskId: string | undefined,
  targetPaths: string[],
  profile?: 'basic' | 'standard' | 'governed'
): ProtocolSuggestedFix {
  const taskArg = taskId ? ` --task ${taskId}` : '';
  const profileArg = profile ? ` --profile ${profile}` : '';
  return {
    kind: 'protocol-remediate',
    mode: 'safe-auto',
    fix,
    command: `hadara protocol remediate --fix ${fix}${taskArg}${profileArg} --json`,
    targetPaths,
    executeRequires: '--execute'
  };
}

function buildSuggestedFixRemediations(issues: ProtocolConsistencyIssue[]): ProtocolRemediation[] {
  const groups = new Map<string, { fix: ProtocolRemediationFix; command: string; targetPaths: Set<string>; issueIds: string[] }>();
  for (const issue of issues) {
    if (!issue.suggestedFix) continue;
    const key = `${issue.suggestedFix.fix}:${issue.suggestedFix.command}`;
    const group =
      groups.get(key) ??
      {
        fix: issue.suggestedFix.fix,
        command: issue.suggestedFix.command,
        targetPaths: new Set<string>(),
        issueIds: []
      };
    for (const targetPath of issue.suggestedFix.targetPaths) group.targetPaths.add(targetPath);
    group.issueIds.push(issue.id);
    groups.set(key, group);
  }

  return [...groups.values()].map((group) => ({
    id: `safe-${group.fix}-${slugify(group.command)}`,
    issueIds: group.issueIds,
    title: safeFixTitle(group.fix),
    mode: 'safe-auto',
    command: group.command,
    targetPaths: [...group.targetPaths],
    summary: `Preview the bounded ${group.fix} remediation with the listed command; add --execute only after reviewing the dry-run action plan.`,
    steps: [
      `Run \`${group.command}\` to preview the exact planned file actions.`,
      'Review target paths, before hashes, planned content hashes, and skipped actions.',
      `Run \`${group.command.replace(/ --json$/, ' --execute --json')}\` only if the dry-run plan is still appropriate.`
    ]
  }));
}

function mergeRemediations(primary: ProtocolRemediation[], secondary: ProtocolRemediation[]): ProtocolRemediation[] {
  const result = [...primary];
  for (const remediation of secondary) {
    if (!result.some((candidate) => candidate.id === remediation.id)) result.push(remediation);
  }
  return result;
}

function safeFixTitle(fix: ProtocolRemediationFix): string {
  switch (fix) {
    case 'task-board-row':
      return 'Add the missing Task Board row';
    case 'decisions-table-frame':
      return 'Insert the Decisions table frame';
    case 'project-state-profile':
      return 'Align the Project State profile metadata row';
    case 'evidence-jsonl':
      return 'Create the missing task evidence JSONL index';
  }
}

function slugify(value: string): string {
  return value
    .replace(/^hadara protocol remediate --fix\s+/, '')
    .replace(/\s+--json$/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase();
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

function isDoneStatus(status: string | null | undefined): boolean {
  return DONE_STATUSES.has((status ?? '').trim().toLowerCase());
}

function isExternalReference(value: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(value);
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
