import { createTaskWorkbenchReport, type TaskWorkbenchReport } from './task-workbench';
import type { EvaluationState, ProjectStatusHealth, ProjectStatusNextActionV2, StatusReadinessV1 } from './project-status-v2';
import type { WorkbenchNextAction } from './workbench-next-actions';

export interface TaskStatusV2Report {
  schemaVersion: 'hadara.task.status.v2';
  command: 'task.status';
  ok: boolean;
  scope: 'task';
  mode: 'selected-task';
  taskId: string;
  generatedAt: string;
  projectRoot: string;
  phase: string;
  health: ProjectStatusHealth;
  readiness: StatusReadinessV1 & {
    closeProofValid: boolean;
    currentReady: boolean;
  };
  evaluations: Array<{
    id: string;
    state: EvaluationState;
    health: ProjectStatusHealth;
    summary: string;
  }>;
  task: TaskWorkbenchReport['task'];
  counts: {
    blockers: number;
    warnings: number;
    evidenceRecords: number;
    nextActions: number;
  };
  primaryNextAction: ProjectStatusNextActionV2 | null;
  nextActions: ProjectStatusNextActionV2[];
  compatibility: {
    legacySchemaVersion: 'hadara.task.workbench.v1';
    legacyCommand: 'hadara task status --task <task-id> --compat v1 --json';
    migration: string;
  };
  sources: {
    workbench: TaskWorkbenchReport;
  };
  diagnostics?: { generatedBy: 'cli'; commandPath: string; durationMs: number; slowThresholdMs: number; slow: boolean; note?: string };
  issues: TaskWorkbenchReport['issues'];
}

export function createTaskStatusV2Report(
  projectRoot: string,
  taskId: string,
  now = new Date(),
  options: { detail?: 'fast' | 'full' } = {}
): TaskStatusV2Report {
  const workbench = createTaskWorkbenchReport(projectRoot, taskId, now, options);
  const health = determineHealth(workbench);
  const nextActions = workbench.nextActions.map(convertNextAction);
  const primaryNextAction = workbench.loop.primaryNextAction ? convertNextAction(workbench.loop.primaryNextAction) : nextActions[0] ?? null;

  return {
    schemaVersion: 'hadara.task.status.v2',
    command: 'task.status',
    ok: workbench.ok,
    scope: 'task',
    mode: 'selected-task',
    taskId: workbench.taskId,
    generatedAt: workbench.generatedAt,
    projectRoot,
    phase: workbench.loop.phase,
    health,
    readiness: {
      intent: readinessIntent(workbench),
      status: readinessStatus(workbench, health),
      reason: workbench.state.readiness.summary,
      closeProofValid: workbench.state.readiness.closeProofValid,
      currentReady: workbench.state.readiness.currentReady
    },
    evaluations: buildEvaluations(workbench, health),
    task: workbench.task,
    counts: {
      blockers: workbench.summary.blockers,
      warnings: workbench.summary.warnings,
      evidenceRecords: workbench.summary.evidenceRecords,
      nextActions: workbench.summary.nextActions
    },
    primaryNextAction,
    nextActions,
    compatibility: {
      legacySchemaVersion: 'hadara.task.workbench.v1',
      legacyCommand: 'hadara task status --task <task-id> --compat v1 --json',
      migration: 'This v2 selected-task cockpit is the default 0.5.x task report. Use explicit --compat v1 only for legacy workbench consumers.'
    },
    sources: { workbench },
    issues: workbench.issues
  };
}

export function formatTaskStatusV2Report(report: TaskStatusV2Report): string {
  return [
    `[HADARA] task status ${report.taskId} ${report.phase} (${report.health})`,
    `readiness: ${report.readiness.status} - ${report.readiness.reason}`,
    report.primaryNextAction
      ? `next: ${report.primaryNextAction.command ?? report.primaryNextAction.message}`
      : 'next: none',
    `legacy: ${report.compatibility.legacyCommand.replace('<task-id>', report.taskId)}`
  ].join('\n');
}

function determineHealth(workbench: TaskWorkbenchReport): ProjectStatusHealth {
  if (!workbench.ok || workbench.summary.blockers > 0) return 'blocked';
  if (workbench.loop.phase === 'closed-valid') return 'ok';
  if (workbench.summary.warnings > 0) return 'attention';
  return 'ok';
}

function readinessIntent(workbench: TaskWorkbenchReport): StatusReadinessV1['intent'] {
  if (workbench.loop.phase === 'validate-evidence') return 'validate';
  if (workbench.loop.phase === 'finalize-dry-run' || workbench.loop.phase === 'finalize-execute') return 'close';
  if (workbench.loop.phase === 'closed-valid') return 'orient';
  return 'edit';
}

function readinessStatus(workbench: TaskWorkbenchReport, health: ProjectStatusHealth): StatusReadinessV1['status'] {
  if (health === 'blocked') return 'blocked';
  if (workbench.loop.phase === 'closed-valid') return 'terminal';
  if (workbench.state.ready || workbench.state.readiness.closeProofValid) return 'ready';
  if (workbench.loop.phase === 'author-task') return 'needs-context';
  return 'needs-review';
}

function buildEvaluations(workbench: TaskWorkbenchReport, health: ProjectStatusHealth): TaskStatusV2Report['evaluations'] {
  return [
    {
      id: 'task-workbench',
      state: 'evaluated',
      health,
      summary: `Workbench phase=${workbench.loop.phase}; blockers=${workbench.summary.blockers}; warnings=${workbench.summary.warnings}.`
    },
    {
      id: 'evidence',
      state: workbench.summary.evidenceRecords > 0 ? 'evaluated' : 'not-evaluated',
      health: workbench.summary.evidenceRecords > 0 ? 'ok' : 'attention',
      summary: `${workbench.summary.evidenceRecords} evidence record(s) observed.`
    },
    {
      id: 'close-proof',
      state: workbench.state.readiness.closeProofValid ? 'evaluated' : 'not-evaluated',
      health: workbench.state.readiness.closeProofValid ? 'ok' : 'attention',
      summary: workbench.state.readiness.closeProofValid ? 'Valid close proof is present.' : `Close state is ${workbench.state.closeState}.`
    }
  ];
}

function convertNextAction(action: WorkbenchNextAction): ProjectStatusNextActionV2 {
  return {
    id: action.id,
    kind: action.command ? 'command' : 'review',
    ...(action.command ? { command: action.command } : {}),
    message: action.message,
    writeBoundary: inferWriteBoundary(action),
    risk: action.priority === 'now' ? 'low' : 'none',
    requiresReview: action.kind === 'review' || !action.command || Boolean(action.executeCommand),
    writes: Boolean(action.executeCommand || action.kind === 'edit' || action.kind === 'remediation')
  };
}

function inferWriteBoundary(action: WorkbenchNextAction): ProjectStatusNextActionV2['writeBoundary'] {
  if (action.executeCommand?.includes('finalize') || action.command?.includes('finalize')) return 'evidence-append';
  if (action.kind === 'edit' || action.kind === 'remediation') return 'task-local';
  return 'read-only';
}
