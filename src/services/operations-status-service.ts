import fs from 'node:fs';
import path from 'node:path';
import { ActiveRunProjection, safeCreateActiveRunProjection } from './active-run-state';
import { extractHandoffSectionValues, extractValidationBaselineSummary } from './handoff-summary-parser';
import { createOperationalDebtReport, OperationalDebtAggregate } from './operational-debt';
import { extractSection, ProjectReadSources, readProjectSources } from './project-read-model';
import { listTaskCapsules, TaskCapsule } from '../task/task-capsule';

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

export interface OpsStatusOptions {
  // When false, skip the operational-debt computation (the dominant cost on
  // large/slow filesystems) and return a zeroed debt aggregate. Used by the
  // dashboard "core" tier, which loads debt separately in the background.
  includeDebt?: boolean;
}

const EMPTY_DEBT_AGGREGATE: OperationalDebtAggregate = {
  total: 0,
  open: 0,
  tracked: 0,
  mitigated: 0,
  candidate: 0,
  highOpen: 0,
  bySeverity: { high: 0, medium: 0, low: 0 }
};

export function createOpsStatusReport(projectRoot: string, options: OpsStatusOptions = {}): OpsStatusReport {
  const includeDebt = options.includeDebt !== false;
  const sources = readProjectSources(projectRoot);
  const tasks = listTaskCapsules(projectRoot);
  const taskCounts = countTaskStatuses(tasks);
  const handoffSections = {
    currentState: extractHandoffSectionValues(sources.handoff.content, '## Current State'),
    knownProblems: extractHandoffSectionValues(sources.handoff.content, '## Current Known Problems'),
    nextRecommendedStep: extractHandoffSectionValues(sources.handoff.content, '## Next Recommended Step')
  };
  const validation = extractValidationBaselineSummary(sources.handoff.content, sources.validationHistory.content);
  const activeRun = safeCreateActiveRunProjection(projectRoot);
  const debtAggregate = includeDebt ? createOperationalDebtReport(projectRoot).aggregate : EMPTY_DEBT_AGGREGATE;
  const issues = [...collectIssues(sources, validation), ...activeRun.issues];

  return {
    schemaVersion: 'hadara.ops.status.v1',
    command: 'ops.status',
    ok: true,
    health: issues.some((issue) => issue.severity === 'error') ? 'error' : issues.length > 0 ? 'degraded' : 'ok',
    project: {
      branch: readGitBranch(projectRoot),
      phase: extractProjectPhase(sources.projectState.content)
    },
    tasks: {
      counts: taskCounts.counts,
      rawStatusCounts: taskCounts.rawStatusCounts,
      normalizedStatusCounts: taskCounts.normalizedStatusCounts,
      lastCompleted: extractLastCompletedTaskIds(sources.handoff.content),
      nextRecommended: handoffSections.nextRecommendedStep[0] ?? null
    },
    handoff: handoffSections,
    validation,
    activeRun,
    debt: debtAggregate,
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

export function formatOpsStatusReport(report: OpsStatusReport): string {
  const counts = Object.entries(report.tasks.counts)
    .map(([status, count]) => `${status}: ${count}`)
    .join(', ');
  return [
    '[HADARA] Operations Status',
    `phase: ${report.project.phase}`,
    `branch: ${report.project.branch}`,
    `tasks: ${counts}`,
    `debt: open ${report.debt.open}, highOpen ${report.debt.highOpen}`,
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
  const line = section
    .split(/\r?\n/)
    .map((value) => value.trim())
    .find(Boolean);
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

function readTaskStatus(task: TaskCapsule): string {
  const taskPath = path.join(task.dir, 'TASK.md');
  if (!fs.existsSync(taskPath)) return 'Unknown';
  const content = fs.readFileSync(taskPath, 'utf8');
  const match = content.match(/^## Status\s*\n+([\s\S]*?)(?:\n## |\s*$)/m);
  return match?.[1]?.trim().split(/\r?\n/)[0]?.trim() || 'Unknown';
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
  validation: OpsStatusReport['validation']
): OpsStatusReport['issues'] {
  const issues: OpsStatusReport['issues'] = [];
  if (!sources.projectState.exists) issues.push(warning('PROJECT_STATE_MISSING', 'docs/PROJECT_STATE.md is missing.'));
  if (!sources.handoff.exists) issues.push(warning('AGENT_HANDOFF_MISSING', 'docs/AGENT_HANDOFF.md is missing.'));
  if (!sources.taskBoard.exists) issues.push(warning('TASK_BOARD_MISSING', 'docs/TASK_BOARD.md is missing.'));
  if (!sources.developmentSlices.exists) issues.push(warning('DEVELOPMENT_SLICES_MISSING', 'docs/DEVELOPMENT_SLICES.md is missing.'));
  if (!validation.latestFullCheck && !validation.latestDoneLevelValidation) {
    issues.push(warning('VALIDATION_BASELINE_MISSING', 'No latest validation baseline was found in handoff or validation history.'));
  }
  return issues;
}

function warning(code: string, message: string): OpsStatusReport['issues'][number] {
  return {
    severity: 'warning',
    code,
    message
  };
}
