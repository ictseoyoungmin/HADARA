import { createEvidenceLintReport } from './evidence-lint';
import { createDashboardTimelineReport, DashboardTimelineEvent } from './dashboard-timeline';
import { createOpsStatusReport, OpsStatusReport } from './operations-status-service';
import { createTaskListReport, TaskJsonSummary } from './task-read-model';
import { createTaskWorkbenchReport } from './task-workbench';

export interface DashboardBootstrapIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
}

export interface DashboardBootstrapReport {
  schemaVersion: 'hadara.dashboard.bootstrap.v1';
  command: 'dashboard.bootstrap';
  ok: boolean;
  generatedAt: string;
  source: {
    kind: 'live-api';
    label: string;
    projectRoot: string;
  };
  cache: {
    status: 'disabled';
    key: string;
    ttlMs: null;
    generatedAt: string;
    expiresAt: null;
  };
  status: OpsStatusReport;
  taskSummary: {
    total: number;
    counts: OpsStatusReport['tasks']['counts'];
    rawStatusCounts: Record<string, number>;
    normalizedStatusCounts: Record<string, number>;
    lastCompleted: string[];
    nextRecommended: string | null;
    recent: TaskJsonSummary[];
  };
  timelineOverview: {
    schemaVersion: 'hadara.dashboard.timeline.v1';
    ok: boolean;
    events: DashboardTimelineEvent[];
    issues: DashboardBootstrapIssue[];
  };
  activeRunSummary: {
    ok: boolean;
    present: boolean;
    taskId: string | null;
    status: string | null;
    staleReason: string | null;
    issues: number;
  };
  debtSummary: OpsStatusReport['debt'];
  selectedTask: DashboardBootstrapSelectedTask | null;
  issues: DashboardBootstrapIssue[];
}

export interface DashboardBootstrapSelectedTask {
  requestedTaskId: string;
  ok: boolean;
  task: {
    id: string;
    title: string;
    taskStatus: string;
    taskBoardStatus: string;
    capsule: string;
  } | null;
  state: {
    ready: boolean;
    closeState: string;
    closedValid: boolean;
    blockers: number;
    warnings: number;
    evidenceRecords: number;
  };
  proof: {
    status: 'sufficient' | 'weak' | 'failed' | 'blocked' | 'private-only' | 'unknown';
    substantivePositive: number;
    semanticIssueCodes: string[];
  };
  issues: DashboardBootstrapIssue[];
}

export interface DashboardBootstrapInput {
  selectedTaskId?: string;
}

export function createDashboardBootstrapReport(projectRoot: string, input: DashboardBootstrapInput = {}, now = new Date()): DashboardBootstrapReport {
  const generatedAt = now.toISOString();
  const status = createOpsStatusReport(projectRoot);
  const tasks = createTaskListReport(projectRoot);
  const timeline = createDashboardTimelineReport(projectRoot, {}, now);
  const issues: DashboardBootstrapIssue[] = [
    ...status.issues.map((issue) => ({ severity: issue.severity, code: `STATUS_${issue.code}`, message: issue.message })),
    ...timeline.issues.map((issue) => ({ severity: issue.severity, code: `TIMELINE_${issue.code}`, message: issue.message }))
  ];
  const selectedTaskId = input.selectedTaskId?.trim();
  const selectedTask = selectedTaskId ? createSelectedTaskSummary(projectRoot, selectedTaskId, now, issues) : null;

  return {
    schemaVersion: 'hadara.dashboard.bootstrap.v1',
    command: 'dashboard.bootstrap',
    ok: !issues.some((issue) => issue.severity === 'error'),
    generatedAt,
    source: {
      kind: 'live-api',
      label: 'Live dashboard aggregate read',
      projectRoot
    },
    cache: {
      status: 'disabled',
      key: selectedTaskId ? `dashboard:bootstrap:selected:${selectedTaskId}` : 'dashboard:bootstrap',
      ttlMs: null,
      generatedAt,
      expiresAt: null
    },
    status,
    taskSummary: {
      total: tasks.count,
      counts: status.tasks.counts,
      rawStatusCounts: status.tasks.rawStatusCounts,
      normalizedStatusCounts: status.tasks.normalizedStatusCounts,
      lastCompleted: status.tasks.lastCompleted,
      nextRecommended: status.tasks.nextRecommended,
      recent: tasks.tasks.slice(-8)
    },
    timelineOverview: {
      schemaVersion: timeline.schemaVersion,
      ok: timeline.ok,
      events: timeline.events.slice(0, 8),
      issues: timeline.issues
    },
    activeRunSummary: {
      ok: status.activeRun.ok,
      present: Boolean(status.activeRun.activeRun),
      taskId: status.activeRun.activeRun?.taskId ?? null,
      status: status.activeRun.activeRun?.status ?? null,
      staleReason: status.activeRun.handoff.staleReason,
      issues: status.activeRun.issues.length
    },
    debtSummary: status.debt,
    selectedTask,
    issues
  };
}

function createSelectedTaskSummary(
  projectRoot: string,
  taskId: string,
  now: Date,
  aggregateIssues: DashboardBootstrapIssue[]
): DashboardBootstrapSelectedTask {
  const workbench = createTaskWorkbenchReport(projectRoot, taskId, now);
  const lint = createEvidenceLintReport(projectRoot, taskId);
  const selectedIssues: DashboardBootstrapIssue[] = [
    ...workbench.issues.map((issue) => ({
      severity: toBootstrapSeverity(issue.severity),
      code: `WORKBENCH_${issue.code}`,
      message: issue.message
    })),
    ...lint.issues.map((issue) => ({
      severity: toBootstrapSeverity(issue.severity),
      code: `EVIDENCE_LINT_${issue.code}`,
      message: issue.message
    }))
  ];
  if (!workbench.ok) {
    selectedIssues.push({
      severity: 'warning',
      code: 'SELECTED_TASK_UNAVAILABLE',
      message: `Selected task summary is unavailable for ${taskId}.`
    });
  }
  aggregateIssues.push(...selectedIssues);
  const semanticIssueCodes = lint.issues.filter((issue) => issue.code.startsWith('TASK_DONE_')).map((issue) => issue.code);
  const substantivePositive = lint.summary.semantics?.byStrength['substantive-positive'] ?? 0;

  return {
    requestedTaskId: taskId,
    ok: workbench.ok && !selectedIssues.some((issue) => issue.severity === 'error'),
    task: workbench.ok
      ? {
          id: workbench.task.id,
          title: workbench.task.title,
          taskStatus: workbench.task.taskStatus,
          taskBoardStatus: workbench.task.taskBoardStatus,
          capsule: workbench.task.capsule
        }
      : null,
    state: {
      ready: workbench.state.ready,
      closeState: workbench.state.closeState,
      closedValid: workbench.state.closedValid,
      blockers: workbench.summary.blockers,
      warnings: workbench.summary.warnings,
      evidenceRecords: workbench.summary.evidenceRecords
    },
    proof: {
      status: proofStatusFrom(semanticIssueCodes, substantivePositive),
      substantivePositive,
      semanticIssueCodes
    },
    issues: selectedIssues
  };
}

function toBootstrapSeverity(severity: 'error' | 'warning' | 'info'): DashboardBootstrapIssue['severity'] {
  return severity === 'error' ? 'error' : 'warning';
}

function proofStatusFrom(
  semanticIssueCodes: string[],
  substantivePositive: number
): DashboardBootstrapSelectedTask['proof']['status'] {
  const codes = new Set(semanticIssueCodes);
  if (codes.has('TASK_DONE_WITH_FAILED_EVIDENCE')) return 'failed';
  if (codes.has('TASK_DONE_WITH_UNEXPLAINED_BLOCKED_EVIDENCE')) return 'blocked';
  if (codes.has('TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE') || codes.has('TASK_DONE_WITH_ONLY_WEAK_EVIDENCE')) return 'weak';
  if (codes.has('TASK_DONE_WITH_PRIVATE_ONLY_EVIDENCE')) return 'private-only';
  if (substantivePositive > 0) return 'sufficient';
  return 'unknown';
}
