import { safeCreateActiveRunProjection } from './active-run-state';
import { createDashboardProjectReference, DashboardProjectReference } from './dashboard-cache';
import { extractHandoffSectionValues, extractValidationBaselineSummary } from './handoff-summary-parser';
import {
  createDashboardProjectionRecord,
  readDashboardProjection,
  writeDashboardProjection
} from './dashboard-projection-store';
import { DashboardTaskProjectionSummary, readDashboardTaskProjectionIndex } from './dashboard-task-projection';
import { readProjectSources } from './project-read-model';

export interface DashboardCoreIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
}

export interface DashboardCoreReport {
  schemaVersion: 'hadara.dashboard.core.v1';
  command: 'dashboard.core';
  ok: boolean;
  generatedAt: string;
  source: {
    kind: 'projection' | 'live-api';
    label: string;
    projectRootRedacted: true;
    project: DashboardProjectReference;
  };
  projection: {
    freshness: 'fresh' | 'stale' | 'missing' | 'unknown';
    completeness: 'core' | 'partial' | 'complete';
    refreshState: 'idle' | 'checking' | 'refreshing' | 'failed';
    generatedAt: string | null;
    pendingSections: string[];
    staleSections: string[];
    sourceSignals: {
      taskBoard: 'known' | 'checking' | 'changed' | 'missing' | 'unknown';
      handoff: 'known' | 'checking' | 'changed' | 'missing' | 'unknown';
      projectState: 'known' | 'checking' | 'changed' | 'missing' | 'unknown';
      capsules: 'known' | 'checking' | 'changed' | 'missing' | 'unknown';
      debt: 'known' | 'checking' | 'changed' | 'missing' | 'unknown';
    };
  };
  core: {
    health: 'ok' | 'degraded' | 'error' | 'unknown';
    taskSummary: {
      total: number;
      counts: {
        done: number;
        draft: number;
        partial: number;
        superseded: number;
        inProgress: number;
        unknown: number;
      };
      lastCompleted: string[];
      nextRecommended: string | null;
      recent: DashboardCoreTaskSummary[];
    };
    handoffSummary: {
      currentState: string[];
      knownProblems: string[];
      nextRecommendedStep: string[];
    };
    activeRunSummary: {
      ok: boolean;
      present: boolean;
      taskId: string | null;
      status: string | null;
      staleReason: string | null;
      issues: number;
    };
    validationSummary: {
      latestFullCheck: string | null;
      latestDoneLevelValidation: string | null;
    };
    debtSummary: Record<string, unknown>;
  };
  issues: DashboardCoreIssue[];
}

export interface DashboardCoreTaskSummary {
  id: string;
  title: string;
  status: string;
  capsule: string;
}

export interface DashboardCoreOptions {
  bypassProjection?: boolean;
  projectionFreshness?: DashboardCoreReport['projection']['freshness'];
  refreshState?: DashboardCoreReport['projection']['refreshState'];
  pendingSections?: string[];
  staleSections?: string[];
}

interface TaskBoardRow {
  id: string;
  title: string;
  status: string;
  capsule: string;
}

export function createDashboardCoreReport(projectRoot: string, options: DashboardCoreOptions = {}, now = new Date()): DashboardCoreReport {
  if (!options.bypassProjection) {
    const cached = readDashboardProjection<DashboardCoreReport>({ projectRoot }, 'core', 'index');
    if (cached) return reportFromProjection(cached.body, cached.generatedAt, options);
  }

  const report = createLiveDashboardCoreReport(projectRoot, now);
  try {
    writeDashboardProjection({ projectRoot }, createDashboardProjectionRecord(projectRoot, 'core', 'index', report, report.generatedAt));
  } catch (error) {
    report.issues.push({
      severity: 'warning',
      code: 'DASHBOARD_CORE_PROJECTION_WRITE_FAILED',
      message: `Dashboard core projection could not be written: ${error instanceof Error ? error.message : String(error)}`
    });
    report.ok = !report.issues.some((issue) => issue.severity === 'error');
    report.core.health = report.core.health === 'error' ? 'error' : 'degraded';
  }
  return report;
}

function createLiveDashboardCoreReport(projectRoot: string, now: Date): DashboardCoreReport {
  const generatedAt = now.toISOString();
  const sources = readProjectSources(projectRoot);
  const taskBoardRows = parseTaskBoardRows(sources.taskBoard.content);
  const taskProjection = readDashboardTaskProjectionIndex(projectRoot);
  const handoffSummary = {
    currentState: extractHandoffSectionValues(sources.handoff.content, '## Current State'),
    knownProblems: extractHandoffSectionValues(sources.handoff.content, '## Current Known Problems'),
    nextRecommendedStep: extractHandoffSectionValues(sources.handoff.content, '## Next Recommended Step')
  };
  const validationSummary = extractValidationBaselineSummary(sources.handoff.content, sources.validationHistory.content);
  const activeRun = safeCreateActiveRunProjection(projectRoot);
  const debtProjection = readDashboardProjection<Record<string, unknown>>({ projectRoot }, 'debt', 'summary');
  const pendingSections = pendingSectionsFor(Boolean(taskProjection), Boolean(debtProjection));
  const issues = collectIssues(
    {
      projectState: sources.projectState.exists,
      handoff: sources.handoff.exists,
      taskBoard: sources.taskBoard.exists
    },
    validationSummary,
    activeRun.issues.length
  );

  return {
    schemaVersion: 'hadara.dashboard.core.v1',
    command: 'dashboard.core',
    ok: !issues.some((issue) => issue.severity === 'error'),
    generatedAt,
    source: {
      kind: 'live-api',
      label: 'Live cheap dashboard core read',
      projectRootRedacted: true,
      project: createDashboardProjectReference(projectRoot)
    },
    projection: {
      freshness: 'fresh',
      completeness: taskProjection || debtProjection ? 'partial' : 'core',
      refreshState: 'idle',
      generatedAt,
      pendingSections,
      staleSections: [],
      sourceSignals: {
        taskBoard: sources.taskBoard.exists ? 'known' : 'missing',
        handoff: sources.handoff.exists ? 'known' : 'missing',
        projectState: sources.projectState.exists ? 'known' : 'missing',
        capsules: taskProjection ? 'known' : 'unknown',
        debt: debtProjection ? 'known' : 'missing'
      }
    },
    core: {
      health: issues.some((issue) => issue.severity === 'error') ? 'error' : issues.length > 0 ? 'degraded' : 'ok',
      taskSummary: taskProjection
        ? summarizeProjectedTasks(
            taskProjection.tasks.map((entry) => entry.summary),
            handoffSummary.nextRecommendedStep[0] ?? null
          )
        : summarizeTaskBoard(taskBoardRows, handoffSummary.nextRecommendedStep[0] ?? null),
      handoffSummary,
      activeRunSummary: {
        ok: activeRun.ok,
        present: Boolean(activeRun.activeRun),
        taskId: activeRun.activeRun?.taskId ?? null,
        status: activeRun.activeRun?.status ?? null,
        staleReason: activeRun.handoff.staleReason,
        issues: activeRun.issues.length
      },
      validationSummary,
      debtSummary: debtProjection?.body ?? { pending: true }
    },
    issues
  };
}

function reportFromProjection(report: DashboardCoreReport, projectionGeneratedAt: string, options: DashboardCoreOptions): DashboardCoreReport {
  return {
    ...report,
    source: {
      ...report.source,
      kind: 'projection',
      label: 'Local dashboard core projection'
    },
    projection: {
      ...report.projection,
      freshness: options.projectionFreshness ?? report.projection.freshness ?? 'unknown',
      refreshState: options.refreshState ?? 'idle',
      generatedAt: projectionGeneratedAt,
      pendingSections: options.pendingSections ?? report.projection.pendingSections,
      staleSections: options.staleSections ?? report.projection.staleSections
    }
  };
}

function parseTaskBoardRows(content: string): TaskBoardRow[] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\|\s*T-\d{4}\s*\|/.test(line))
    .map((line) =>
      line
        .slice(1, line.endsWith('|') ? -1 : undefined)
        .split('|')
        .map((cell) => cell.trim())
    )
    .map((cells) => ({
      id: cells[0] ?? '',
      title: cells[1] ?? '',
      status: cells[2] ?? 'Unknown',
      capsule: cells[3] ?? ''
    }))
    .filter((row) => row.id.length > 0);
}

function summarizeTaskBoard(rows: TaskBoardRow[], nextRecommended: string | null): DashboardCoreReport['core']['taskSummary'] {
  return summarizeProjectedTasks(
    rows.map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      slug: '',
      capsule: row.capsule,
      evidenceRecords: 0
    })),
    nextRecommended
  );
}

function summarizeProjectedTasks(
  rows: DashboardTaskProjectionSummary[],
  nextRecommended: string | null
): DashboardCoreReport['core']['taskSummary'] {
  const counts: DashboardCoreReport['core']['taskSummary']['counts'] = {
    done: 0,
    draft: 0,
    partial: 0,
    superseded: 0,
    inProgress: 0,
    unknown: 0
  };
  for (const row of rows) counts[aggregateStatus(row.status)] += 1;
  return {
    total: rows.length,
    counts,
    lastCompleted: rows
      .filter((row) => aggregateStatus(row.status) === 'done')
      .slice(-3)
      .map((row) => row.id),
    nextRecommended,
    recent: rows.slice(-8).map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      capsule: row.capsule
    }))
  };
}

function pendingSectionsFor(hasTaskProjection: boolean, hasDebtProjection: boolean): string[] {
  const pending = ['timeline'];
  if (!hasDebtProjection) pending.push('debt');
  if (!hasTaskProjection) pending.push('task-detail');
  return pending;
}

function aggregateStatus(status: string): keyof DashboardCoreReport['core']['taskSummary']['counts'] {
  const normalized = status.trim().toLowerCase().replace(/[\s_-]+(.)/g, (_match, letter: string) => letter.toUpperCase());
  if (normalized === 'done') return 'done';
  if (normalized === 'draft') return 'draft';
  if (normalized === 'partial') return 'partial';
  if (normalized === 'superseded') return 'superseded';
  if (normalized === 'inProgress' || normalized === 'active' || normalized === 'doing') return 'inProgress';
  return 'unknown';
}

function collectIssues(
  sources: { projectState: boolean; handoff: boolean; taskBoard: boolean },
  validation: DashboardCoreReport['core']['validationSummary'],
  activeRunIssues: number
): DashboardCoreIssue[] {
  const issues: DashboardCoreIssue[] = [];
  if (!sources.projectState) issues.push(warning('PROJECT_STATE_MISSING', 'docs/PROJECT_STATE.md is missing.'));
  if (!sources.handoff) issues.push(warning('AGENT_HANDOFF_MISSING', 'docs/AGENT_HANDOFF.md is missing.'));
  if (!sources.taskBoard) issues.push(warning('TASK_BOARD_MISSING', 'docs/TASK_BOARD.md is missing.'));
  if (!validation.latestFullCheck && !validation.latestDoneLevelValidation) {
    issues.push(warning('VALIDATION_BASELINE_MISSING', 'No latest validation baseline was found in handoff or validation history.'));
  }
  if (activeRunIssues > 0) issues.push(warning('ACTIVE_RUN_DEGRADED', 'Active-run projection reported warnings.'));
  return issues;
}

function warning(code: string, message: string): DashboardCoreIssue {
  return { severity: 'warning', code, message };
}
