import fs from 'node:fs';
import path from 'node:path';
import { ActiveRunProjection, safeCreateActiveRunProjection } from './active-run-state';
import { createEmptyOperationalDebtAggregate, OperationalDebtAggregate } from './developer-surface-placeholders';
import { extractHandoffSectionValues, extractValidationBaselineSummary } from './handoff-summary-parser';
import { findMarkdownRowByCell, parseMarkdownRows, parseMarkdownRowsUnderHeading } from './markdown-table';
import { extractSection, ProjectReadSources, readProjectSources } from './project-read-model';
import { createStateProjectionReport, StateProjectionAdvisory, toStateProjectionAdvisory } from './state-projection';
import { listTaskCapsules, TaskCapsule } from '../task/task-capsule';
import { readProjectCurrentState } from './project-current-state';

export interface OpsStatusReport {
  schemaVersion: 'hadara.ops.status.v1';
  command: 'ops.status';
  ok: boolean;
  health: 'ok' | 'degraded' | 'error';
  project: {
    branch: string;
    phase: string;
  };
  tasks: {
    counts: {
      done: number;
      draft: number;
      partial: number;
      superseded: number;
      inProgress: number;
      unknown: number;
    };
    rawStatusCounts: Record<string, number>;
    normalizedStatusCounts: Record<string, number>;
    lastCompleted: string[];
    nextRecommended: string | null;
  };
  handoff: {
    currentState: string[];
    knownProblems: string[];
    nextRecommendedStep: string[];
  };
  validation: {
    latestFullCheck: string | null;
    latestDoneLevelValidation: string | null;
  };
  activeRun: ActiveRunProjection;
  debt: OperationalDebtAggregate;
  debtEvaluation: {
    state: 'evaluated' | 'not-evaluated' | 'repo-local-only';
    summary: string;
  };
  stateConsistency?: StateProjectionAdvisory;
  mcp: {
    defaultMode: 'read-only';
    evidenceAttach: {
      enabledByDefault: false;
      requiresFlag: '--enable-evidence-attach';
      requiresApproval: true;
      audited: true;
    };
  };
  issues: Array<{
    severity: 'error' | 'warning';
    code: string;
    message: string;
  }>;
}

export interface OpsStatusSummaryReport {
  schemaVersion: 'hadara.ops.statusSummary.v1';
  command: 'status.summary';
  ok: boolean;
  health: OpsStatusReport['health'];
  project: OpsStatusReport['project'];
  tasks: {
    counts: OpsStatusReport['tasks']['counts'];
    lastCompleted: string[];
    nextRecommended: string | null;
  };
  validation: OpsStatusReport['validation'];
  stateConsistency?: StateProjectionAdvisory;
  issues: OpsStatusReport['issues'];
}

export interface OpsStatusStateReport {
  schemaVersion: 'hadara.ops.statusState.v1';
  command: 'status.state';
  ok: true;
  stateConsistency: StateProjectionAdvisory;
}

export interface OpsStatusOptions {
  // When false, skip the repo-local operational-debt surface entirely on fast
  // read paths. The aggregate remains shape-compatible, but debtEvaluation
  // makes the skipped state explicit.
  includeDebt?: boolean;
  includeKnownProblems?: boolean;
  includeStateConsistency?: boolean;
  stateIssueLimit?: number;
  taskStatusSource?: 'capsules' | 'task-board';
  maxTextLength?: number;
}

const EMPTY_DEBT_AGGREGATE: OperationalDebtAggregate = createEmptyOperationalDebtAggregate();

export function createOpsStatusReport(projectRoot: string, options: OpsStatusOptions = {}): OpsStatusReport {
  const includeDebt = options.includeDebt !== false;
  const sources = readProjectSources(projectRoot);
  const structuredState = readProjectCurrentState(projectRoot).state;
  const taskBoardRows = parseTaskBoardRows(sources.taskBoard.content);
  const taskCapsules = options.taskStatusSource === 'task-board' ? [] : listTaskCapsules(projectRoot);
  const recommendationRows = options.taskStatusSource === 'task-board' ? taskBoardRows : taskCapsules.map(taskCapsuleToStatusRow);
  const taskCounts = options.taskStatusSource === 'task-board'
    ? countTaskBoardStatuses(taskBoardRows)
    : countTaskStatuses(taskCapsules);
  const handoffSections = structuredState ? {
    currentState: truncateList([
      `Release: ${structuredState.currentRelease}`,
      `Latest completed: ${structuredState.latestCompletedTask?.id ?? 'none'}`,
      `Active: ${structuredState.activeTask?.id ?? 'none'}`
    ], options.maxTextLength),
    knownProblems: options.includeKnownProblems === false
      ? []
      : truncateList(structuredState.currentKnownProblems.map((problem) => `${problem.state}: ${problem.summary} · ${problem.guidance}`), options.maxTextLength),
    nextRecommendedStep: truncateList([
      structuredState.nextWork
        ? `${structuredState.nextWork.title}${structuredState.nextWork.operatorGuidance ? ` · ${structuredState.nextWork.operatorGuidance}` : ''}`
        : structuredState.nextOperatorIntent
    ], options.maxTextLength)
  } : {
    currentState: truncateList(extractHandoffSectionValues(sources.handoff.content, '## Current State'), options.maxTextLength),
    knownProblems: options.includeKnownProblems === false
      ? []
      : truncateList(extractHandoffSectionValues(sources.handoff.content, '## Current Known Problems'), options.maxTextLength),
    nextRecommendedStep: truncateList(extractHandoffSectionValues(sources.handoff.content, '## Next Recommended Step'), options.maxTextLength)
  };
  const validation = structuredState ? {
    latestFullCheck: structuredState.validationBaseline.summary,
    latestDoneLevelValidation: structuredState.validationBaseline.evidence.at(-1) ?? structuredState.validationBaseline.summary
  } : extractValidationBaselineSummary(sources.handoff.content, sources.validationHistory.content);
  const expectedSources = determineExpectedStatusSources(projectRoot, sources);
  const activeRun = safeCreateActiveRunProjection(projectRoot);
  const debtAggregate = includeDebt ? createEmptyOperationalDebtAggregate() : EMPTY_DEBT_AGGREGATE;
  const debtEvaluation: OpsStatusReport['debtEvaluation'] = includeDebt
    ? {
        state: 'repo-local-only',
        summary: 'Operational debt remains a repo-local HADARA-dev developer surface and is not evaluated by shipped status.'
      }
    : {
        state: 'not-evaluated',
        summary: 'Operational debt was skipped on this bounded status path.'
      };
  const stateConsistency = options.includeStateConsistency
    ? toStateProjectionAdvisory(createStateProjectionReport(projectRoot), options.stateIssueLimit ?? 10)
    : undefined;
  const issues = [...collectIssues(sources, validation, expectedSources), ...activeRun.issues];
  const nextRecommended = structuredState?.activeTask?.id ?? selectNextRecommendedTask(recommendationRows, handoffSections.nextRecommendedStep[0] ?? null);

  return {
    schemaVersion: 'hadara.ops.status.v1',
    command: 'ops.status',
    ok: true,
    health: issues.some((issue) => issue.severity === 'error') ? 'error' : issues.length > 0 ? 'degraded' : 'ok',
    project: {
      branch: readGitBranch(projectRoot),
      phase: truncateText(extractProjectPhase(sources.projectState.content), options.maxTextLength)
    },
    tasks: {
      counts: taskCounts.counts,
      rawStatusCounts: taskCounts.rawStatusCounts,
      normalizedStatusCounts: taskCounts.normalizedStatusCounts,
      lastCompleted: structuredState?.latestCompletedTask?.id ? [structuredState.latestCompletedTask.id] : extractLastCompletedTaskIds(sources.handoff.content),
      nextRecommended: nextRecommended ? truncateText(nextRecommended, options.maxTextLength) : null
    },
    handoff: handoffSections,
    validation,
    activeRun,
    debt: debtAggregate,
    debtEvaluation,
    ...(stateConsistency ? { stateConsistency } : {}),
    mcp: {
      defaultMode: 'read-only',
      evidenceAttach: {
        enabledByDefault: false,
        requiresFlag: '--enable-evidence-attach',
        requiresApproval: true,
        audited: true
      }
    },
    issues
  };
}

export function createOpsStatusSummaryReport(projectRoot: string, options: OpsStatusOptions = {}): OpsStatusSummaryReport {
  const report = createOpsStatusReport(projectRoot, {
    includeDebt: false,
    includeKnownProblems: false,
    taskStatusSource: 'task-board',
    maxTextLength: 240,
    ...options
  });
  return {
    schemaVersion: 'hadara.ops.statusSummary.v1',
    command: 'status.summary',
    ok: report.ok,
    health: report.health,
    project: report.project,
    tasks: {
      counts: report.tasks.counts,
      lastCompleted: report.tasks.lastCompleted,
      nextRecommended: report.tasks.nextRecommended
    },
    validation: report.validation,
    ...(report.stateConsistency ? { stateConsistency: report.stateConsistency } : {}),
    issues: report.issues
  };
}

export function createOpsStatusStateReport(projectRoot: string, issueLimit = 10): OpsStatusStateReport {
  return {
    schemaVersion: 'hadara.ops.statusState.v1',
    command: 'status.state',
    ok: true,
    stateConsistency: toStateProjectionAdvisory(createStateProjectionReport(projectRoot), issueLimit)
  };
}

export function formatOpsStatusReport(report: OpsStatusReport): string {
  const counts = Object.entries(report.tasks.counts)
    .map(([status, count]) => `${status}: ${count}`)
    .join(', ');
  return [
    '[HADARA] Operations Status',
    `phase: ${report.project.phase}`,
    `branch: ${report.project.branch}`,
    `tasks: ${counts}`,
    report.debtEvaluation.state === 'evaluated'
      ? `debt: open ${report.debt.open}, highOpen ${report.debt.highOpen}`
      : `debt: ${report.debtEvaluation.summary}`,
    ...(report.stateConsistency
      ? [
          `stateConsistency: ${report.stateConsistency.consistent ? 'consistent' : 'drift'} ` +
            `(errors ${report.stateConsistency.issueCounts.error}, warnings ${report.stateConsistency.issueCounts.warning}, info ${report.stateConsistency.issueCounts.info})`
        ]
      : []),
    `lastCompleted: ${report.tasks.lastCompleted.join(', ') || 'none'}`,
    `nextRecommended: ${report.tasks.nextRecommended ?? 'none'}`
  ].join('\n');
}

function readGitBranch(projectRoot: string): string {
  const headPath = path.join(projectRoot, '.git', 'HEAD');
  if (!fs.existsSync(headPath)) return 'unknown';
  const head = fs.readFileSync(headPath, 'utf8').trim();
  const refPrefix = 'ref: refs/heads/';
  if (head.startsWith(refPrefix)) return head.slice(refPrefix.length);
  return head.length > 0 ? 'detached' : 'unknown';
}

function extractProjectPhase(projectState: string): string {
  const section = extractSection(projectState, '## Current Phase');
  const phaseRow = findMarkdownRowByCell(parseMarkdownRowsUnderHeading(projectState, '## Current Phase'), 0, 'Phase');
  if (phaseRow?.[1]) return phaseRow[1].trim();
  const line = section
    .split(/\r?\n/)
    .map((value) => value.trim())
    .find((value) => value && !value.startsWith('|'));
  if (!line) return 'unknown';
  const explicit = line.match(/^Phase:\s*(.+)$/i);
  if (explicit) return explicit[1].trim();
  if (/Phase 0\s*\/\s*Phase 1 boundary/i.test(line)) return 'bootstrap-development';
  return line;
}

function countTaskStatuses(tasks: TaskCapsule[]): {
  counts: OpsStatusReport['tasks']['counts'];
  rawStatusCounts: Record<string, number>;
  normalizedStatusCounts: Record<string, number>;
} {
  const counts: OpsStatusReport['tasks']['counts'] = {
    done: 0,
    draft: 0,
    partial: 0,
    superseded: 0,
    inProgress: 0,
    unknown: 0
  };
  const rawStatusCounts: Record<string, number> = {};
  const normalizedStatusCounts: Record<string, number> = {};
  for (const task of tasks) {
    const rawStatus = readTaskStatus(task);
    const normalizedStatus = normalizeStatus(rawStatus);
    const aggregate = aggregateStatus(normalizedStatus);
    counts[aggregate] += 1;
    rawStatusCounts[rawStatus] = (rawStatusCounts[rawStatus] ?? 0) + 1;
    normalizedStatusCounts[normalizedStatus] = (normalizedStatusCounts[normalizedStatus] ?? 0) + 1;
  }
  return { counts, rawStatusCounts, normalizedStatusCounts };
}

interface TaskBoardStatusRow {
  id: string;
  title: string;
  status: string;
  capsule: string;
}

function parseTaskBoardRows(content: string): TaskBoardStatusRow[] {
  return parseMarkdownRows(content)
    .filter((row) => /^T-\d{4}$/.test(row[0] ?? ''))
    .map((row) => ({
      id: row[0],
      title: row[1] || '',
      status: row[2] || 'Unknown',
      capsule: row[3] || ''
    }));
}

function taskCapsuleToStatusRow(task: TaskCapsule): TaskBoardStatusRow {
  return {
    id: task.id,
    title: task.title,
    status: readTaskStatus(task),
    capsule: path.relative(path.dirname(path.dirname(task.dir)), task.dir).replace(/\\/g, '/')
  };
}

function countTaskBoardStatuses(rows: TaskBoardStatusRow[]): {
  counts: OpsStatusReport['tasks']['counts'];
  rawStatusCounts: Record<string, number>;
  normalizedStatusCounts: Record<string, number>;
} {
  const counts: OpsStatusReport['tasks']['counts'] = {
    done: 0,
    draft: 0,
    partial: 0,
    superseded: 0,
    inProgress: 0,
    unknown: 0
  };
  const rawStatusCounts: Record<string, number> = {};
  const normalizedStatusCounts: Record<string, number> = {};
  for (const row of rows) {
    const normalizedStatus = normalizeStatus(row.status);
    const aggregate = aggregateStatus(normalizedStatus);
    counts[aggregate] += 1;
    rawStatusCounts[row.status] = (rawStatusCounts[row.status] ?? 0) + 1;
    normalizedStatusCounts[normalizedStatus] = (normalizedStatusCounts[normalizedStatus] ?? 0) + 1;
  }
  return { counts, rawStatusCounts, normalizedStatusCounts };
}

function selectNextRecommendedTask(rows: TaskBoardStatusRow[], fallback: string | null): string | null {
  const active = rows.find((row) => aggregateStatus(normalizeStatus(row.status)) === 'inProgress');
  if (active) return formatTaskRecommendation('Continue', active);
  const draft = rows.find((row) => aggregateStatus(normalizeStatus(row.status)) === 'draft');
  if (draft) return formatTaskRecommendation('Start', draft);
  if (fallback) return fallback;
  const partial = rows.find((row) => aggregateStatus(normalizeStatus(row.status)) === 'partial');
  if (partial) return formatTaskRecommendation('Resume partial', partial);
  return null;
}

function formatTaskRecommendation(action: string, row: TaskBoardStatusRow): string {
  const title = row.title ? ` ${row.title}` : '';
  const capsule = row.capsule ? ` (${row.capsule})` : '';
  return `${action} ${row.id}${title}${capsule}.`;
}

function readTaskStatus(task: TaskCapsule): string {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return 'Unknown';
  const content = fs.readFileSync(taskPath, 'utf8');
  const match = content.match(/^## Status\s*\n+([\s\S]*?)(?:\n## |\s*$)/m);
  const sectionStatus = match?.[1]?.trim().split(/\r?\n/)[0]?.trim();
  if (sectionStatus) return sectionStatus;
  const identityStatus = findMarkdownRowByCell(parseMarkdownRowsUnderHeading(content, '## Identity'), 0, 'Status')?.[1]?.trim();
  if (identityStatus) return identityStatus;
  return findMarkdownRowByCell(parseMarkdownRowsUnderHeading(content, '## Metadata'), 0, 'Status')?.[1]?.trim() || 'Unknown';
}

function normalizeStatus(status: string): string {
  const value = status.trim().toLowerCase().replace(/[\s_-]+(.)/g, (_match, letter: string) => letter.toUpperCase());
  return value || 'unknown';
}

function aggregateStatus(status: string): keyof OpsStatusReport['tasks']['counts'] {
  if (status === 'done') return 'done';
  if (status === 'draft') return 'draft';
  if (status === 'partial') return 'partial';
  if (status === 'superseded') return 'superseded';
  if (status === 'inProgress' || status === 'active' || status === 'doing') return 'inProgress';
  return 'unknown';
}

function extractLastCompletedTaskIds(handoff: string): string[] {
  return extractHandoffSectionValues(handoff, '## Last 3 Completed Tasks')
    .map((line) => line.match(/^(T-\d{4})\b/)?.[1])
    .filter((value): value is string => Boolean(value));
}

function collectIssues(
  sources: ProjectReadSources,
  validation: OpsStatusReport['validation'],
  expected: ExpectedStatusSources
): OpsStatusReport['issues'] {
  const issues: OpsStatusReport['issues'] = [];
  if (expected.projectState && !sources.projectState.exists) issues.push(warning('PROJECT_STATE_MISSING', 'docs/PROJECT_STATE.md is missing.'));
  if (expected.handoff && !sources.handoff.exists) issues.push(warning('AGENT_HANDOFF_MISSING', 'docs/AGENT_HANDOFF.md is missing.'));
  if (expected.taskBoard && !sources.taskBoard.exists) issues.push(warning('TASK_BOARD_MISSING', 'docs/TASK_BOARD.md is missing.'));
  if (expected.developmentSlices && !sources.developmentSlices.exists) issues.push(warning('DEVELOPMENT_SLICES_MISSING', 'docs/DEVELOPMENT_SLICES.md is missing.'));
  if (expected.validationBaseline && !validation.latestFullCheck && !validation.latestDoneLevelValidation) {
    issues.push(warning('VALIDATION_BASELINE_MISSING', 'No latest validation baseline was found in handoff or validation history.'));
  }
  return issues;
}

type StatusProjectProfile = 'basic' | 'standard' | 'governed' | 'hadara-dev' | 'unknown';

interface StatusSourceMetadata {
  profile: StatusProjectProfile;
  registeredActiveDocs: Set<string>;
  hasScaffold: boolean;
  hasRegistry: boolean;
}

interface ExpectedStatusSources {
  projectState: boolean;
  handoff: boolean;
  taskBoard: boolean;
  developmentSlices: boolean;
  validationBaseline: boolean;
}

function determineExpectedStatusSources(projectRoot: string, sources: ProjectReadSources): ExpectedStatusSources {
  const metadata = readStatusSourceMetadata(projectRoot, sources);
  const hasAnyStatusContext = metadata.hasScaffold ||
    metadata.hasRegistry ||
    sources.projectState.exists ||
    sources.handoff.exists ||
    sources.taskBoard.exists ||
    sources.developmentSlices.exists ||
    sources.validationHistory.exists;
  if (!hasAnyStatusContext) {
    return {
      projectState: true,
      handoff: true,
      taskBoard: true,
      developmentSlices: true,
      validationBaseline: true
    };
  }

  const registered = metadata.registeredActiveDocs;
  const handoffExpected = metadata.profile === 'governed' ||
    metadata.profile === 'hadara-dev' ||
    registered.has('docs/AGENT_HANDOFF.md');
  const developmentSlicesExpected = metadata.profile === 'hadara-dev' ||
    registered.has('docs/DEVELOPMENT_SLICES.md');
  const validationBaselineExpected = handoffExpected ||
    sources.handoff.exists ||
    sources.validationHistory.exists ||
    registered.has('docs/VALIDATION_HISTORY.md');

  return {
    projectState: true,
    handoff: handoffExpected,
    taskBoard: true,
    developmentSlices: developmentSlicesExpected,
    validationBaseline: validationBaselineExpected
  };
}

function readStatusSourceMetadata(projectRoot: string, sources: ProjectReadSources): StatusSourceMetadata {
  const registryPath = path.join(projectRoot, '.hadara', 'docs-registry.json');
  const scaffoldPath = path.join(projectRoot, '.hadara', 'scaffold.json');
  const registry = readJsonObject(registryPath);
  const scaffold = readJsonObject(scaffoldPath);
  const profile = normalizeStatusProjectProfile(registry?.projectProfile) ??
    normalizeStatusProjectProfile(scaffold?.profile) ??
    readProjectStateProfile(sources.projectState.content) ??
    'unknown';
  return {
    profile,
    registeredActiveDocs: readRegisteredActiveDocs(registry),
    hasScaffold: fs.existsSync(scaffoldPath),
    hasRegistry: fs.existsSync(registryPath)
  };
}

function readJsonObject(filePath: string): Record<string, unknown> | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function readRegisteredActiveDocs(registry: Record<string, unknown> | null): Set<string> {
  const paths = new Set<string>();
  if (!registry || !Array.isArray(registry.documents)) return paths;
  for (const rawDoc of registry.documents) {
    if (!rawDoc || typeof rawDoc !== 'object' || Array.isArray(rawDoc)) continue;
    const doc = rawDoc as Record<string, unknown>;
    if (typeof doc.path !== 'string') continue;
    if (doc.status === 'historical' || doc.status === 'superseded' || doc.status === 'archived') continue;
    paths.add(doc.path);
  }
  return paths;
}

function readProjectStateProfile(projectState: string): StatusProjectProfile | null {
  const value = findMarkdownRowByCell(parseMarkdownRowsUnderHeading(projectState, '## Metadata'), 0, 'HADARA Profile')?.[1]?.trim();
  return normalizeStatusProjectProfile(value);
}

function normalizeStatusProjectProfile(value: unknown): StatusProjectProfile | null {
  if (value === 'basic' || value === 'standard' || value === 'governed' || value === 'hadara-dev') return value;
  return null;
}

function warning(code: string, message: string): OpsStatusReport['issues'][number] {
  return {
    severity: 'warning',
    code,
    message
  };
}

function truncateList(values: string[], maxLength: number | undefined): string[] {
  return values.map((value) => truncateText(value, maxLength));
}

function truncateText(value: string, maxLength: number | undefined): string {
  if (!maxLength || value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}
