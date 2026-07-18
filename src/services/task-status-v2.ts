import fs from 'node:fs';
import path from 'node:path';
import { createTaskWorkbenchReport, type TaskWorkbenchReport } from './task-workbench';
import type { EvaluationState, ProjectStatusHealth, ProjectStatusNextActionV2, StatusReadinessV1 } from './project-status-v2';
import type { WorkbenchNextAction } from './workbench-next-actions';
import { parseMarkdownRowsUnderHeading } from './markdown-table';

export type TaskCockpitPhase =
  | 'author-task'
  | 'plan-work'
  | 'implement'
  | 'validate'
  | 'repair-evidence'
  | 'close-ready'
  | 'blocked'
  | 'closed-valid'
  | 'closed-stale';

export interface TaskStatusV2Report {
  schemaVersion: 'hadara.task.status.v2';
  command: 'task.status';
  ok: boolean;
  scope: 'task';
  mode: 'selected-task';
  taskId: string;
  generatedAt: string;
  projectRoot: string;
  phase: TaskCockpitPhase;
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
  cockpit: {
    sourcePhase: string;
    phaseReason: string;
    terminal: boolean;
    hiddenSections: string[];
    closeState: TaskWorkbenchReport['state']['closeState'];
    planState: 'not-started' | 'in-progress' | 'done' | 'unknown';
    validation: {
      checks: number;
      unresolvedFailedOrBlocked: number;
    };
  };
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
  const cockpit = determineCockpit(workbench);

  return {
    schemaVersion: 'hadara.task.status.v2',
    command: 'task.status',
    ok: workbench.ok,
    scope: 'task',
    mode: 'selected-task',
    taskId: workbench.taskId,
    generatedAt: workbench.generatedAt,
    projectRoot,
    phase: cockpit.phase,
    health,
    readiness: {
      intent: readinessIntent(cockpit.phase),
      status: readinessStatus(cockpit.phase, health, workbench),
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
    cockpit: {
      sourcePhase: workbench.loop.phase,
      phaseReason: cockpit.reason,
      terminal: cockpit.phase === 'closed-valid',
      hiddenSections: cockpit.phase === 'closed-valid' ? ['authoringGuidance', 'authoringSuggestions', 'nextActions'] : [],
      closeState: workbench.state.closeState,
      planState: cockpit.planState,
      validation: {
        checks: workbench.sources.evidenceList.validationAttempts?.checks ?? 0,
        unresolvedFailedOrBlocked: workbench.sources.evidenceList.validationAttempts?.unresolvedFailedOrBlocked ?? 0
      }
    },
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
  if (!workbench.ok) return 'blocked';
  if (workbench.state.closeState === 'close-evidence-found-invalid' || workbench.state.closeState === 'close-evidence-malformed') return 'attention';
  if (workbench.state.readiness.status === 'closed-valid-current-blocked') return 'attention';
  if (workbench.summary.blockers > 0) return 'blocked';
  if (workbench.state.closedValid) return 'ok';
  if (workbench.summary.warnings > 0) return 'attention';
  return 'ok';
}

function readinessIntent(phase: TaskCockpitPhase): StatusReadinessV1['intent'] {
  if (phase === 'plan-work') return 'plan';
  if (phase === 'validate') return 'validate';
  if (phase === 'close-ready' || phase === 'repair-evidence' || phase === 'closed-stale') return 'close';
  if (phase === 'closed-valid') return 'orient';
  return 'edit';
}

function readinessStatus(phase: TaskCockpitPhase, health: ProjectStatusHealth, workbench: TaskWorkbenchReport): StatusReadinessV1['status'] {
  if (health === 'blocked') return 'blocked';
  if (phase === 'closed-valid') return 'terminal';
  if (phase === 'repair-evidence' || phase === 'closed-stale') return 'needs-review';
  if (phase === 'plan-work') return 'needs-review';
  if (phase === 'validate') return 'ready';
  if (phase === 'close-ready') return 'ready';
  if (workbench.state.ready || workbench.state.readiness.closeProofValid) return 'ready';
  if (phase === 'author-task') return 'needs-context';
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

function determineCockpit(workbench: TaskWorkbenchReport): { phase: TaskCockpitPhase; reason: string; planState: TaskStatusV2Report['cockpit']['planState'] } {
  const planState = readPlanState(workbench.projectRoot, workbench.task.capsule);
  const validationAttempts = workbench.sources.evidenceList.validationAttempts;
  const unresolvedValidation = validationAttempts?.unresolvedFailedOrBlocked ?? 0;
  if (!workbench.ok || workbench.task.taskStatus === 'Missing') {
    return { phase: 'blocked', reason: 'Selected Task Capsule could not be read.', planState };
  }
  if (workbench.state.closeState === 'close-evidence-found-invalid' || workbench.state.closeState === 'close-evidence-malformed') {
    return { phase: 'repair-evidence', reason: `Close evidence exists but close state is ${workbench.state.closeState}.`, planState };
  }
  if (workbench.state.readiness.status === 'closed-valid-current-blocked') {
    return { phase: 'closed-stale', reason: 'Valid close proof exists, but current done-level readiness is blocked by drift.', planState };
  }
  if (workbench.state.closedValid) {
    return { phase: 'closed-valid', reason: 'Valid close proof is present; hide active-work guidance.', planState };
  }
  const nonPlanAuthoringOpen = workbench.authoringGuidance.items
    .filter((item) => item.required && item.id !== 'plan' && item.status !== 'current');
  if (nonPlanAuthoringOpen.length === 0 && planState === 'not-started' && workbench.summary.evidenceRecords === 0) {
    return { phase: 'plan-work', reason: 'TASK.md Plan is explicit and not started; continue planning before implementation.', planState };
  }
  if (nonPlanAuthoringOpen.length === 0 && planState === 'in-progress') {
    return { phase: 'implement', reason: 'TASK.md Plan has in-progress or partially complete work.', planState };
  }
  if (workbench.authoringGuidance.status === 'needs-authoring') {
    return { phase: 'author-task', reason: 'Task-owned prose still needs authoring before implementation or close.', planState };
  }
  if (workbench.summary.blockers > 0 && workbench.loop.phase === 'blocked') {
    return { phase: 'blocked', reason: 'Blocking diagnostics remain before the task can continue.', planState };
  }
  if (unresolvedValidation > 0) {
    return { phase: 'repair-evidence', reason: `${unresolvedValidation} unresolved failed or blocked validation attempt(s) require repair.`, planState };
  }
  if (workbench.summary.evidenceRecords === 0) {
    return { phase: 'validate', reason: 'Task contract is authored, but no evidence records exist yet.', planState };
  }
  if (workbench.loop.phase === 'implement') {
    return { phase: 'implement', reason: workbench.loop.summary, planState };
  }
  return { phase: 'close-ready', reason: 'Task has evidence and is ready for task close or an explicit close dry-run review.', planState };
}

function readPlanState(projectRoot: string, capsulePath: string): TaskStatusV2Report['cockpit']['planState'] {
  if (!capsulePath) return 'unknown';
  const taskPath = path.join(projectRoot, capsulePath, 'TASK.md');
  if (!fs.existsSync(taskPath)) return 'unknown';
  const rows = parseMarkdownRowsUnderHeading(fs.readFileSync(taskPath, 'utf8'), '## Plan')
    .filter((row) => row[0] !== 'Step' && row.length >= 3);
  if (rows.length === 0) return 'unknown';
  const statuses = rows.map((row) => (row[2] ?? '').trim().toLowerCase());
  if (statuses.every((status) => status === 'done')) return 'done';
  if (statuses.every((status) => status === 'pending')) return 'not-started';
  if (statuses.some((status) => status === 'in progress' || status === 'pending' || status === 'done')) return 'in-progress';
  return 'unknown';
}

function inferWriteBoundary(action: WorkbenchNextAction): ProjectStatusNextActionV2['writeBoundary'] {
  if (action.executeCommand?.includes('finalize') || action.command?.includes('finalize')) return 'evidence-append';
  if (action.kind === 'edit' || action.kind === 'remediation') return 'task-local';
  return 'read-only';
}
