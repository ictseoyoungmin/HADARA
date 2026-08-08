import fs from 'node:fs';
import path from 'node:path';
import { createTaskWorkbenchReport, type TaskWorkbenchReport } from './task-workbench';
import type { EvaluationState, StatusHealth, StatusNextAction, StatusReadiness } from '../status/model';
import type { WorkbenchNextAction } from './workbench-next-actions';
import { parseMarkdownRowsUnderHeading } from './markdown-table';
import { createTaskSelectionStatusV2Report, type TaskSelectionStatusV2Report } from './task-selection-status-v2';

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
  health: StatusHealth;
  readiness: StatusReadiness & {
    closeProofValid: boolean;
    currentReady: boolean;
  };
  evaluations: Array<{
    id: string;
    state: EvaluationState;
    health: StatusHealth;
    summary: string;
  }>;
  task: TaskWorkbenchReport['task'];
  counts: {
    blockers: number;
    warnings: number;
    evidenceRecords: number;
    nextActions: number;
  };
  primaryNextAction: StatusNextAction | null;
  nextActions: StatusNextAction[];
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
  sources: {
    detail: 'fast' | 'full';
    workbench?: TaskWorkbenchReport;
    workbenchSummary: {
      schemaVersion: TaskWorkbenchReport['schemaVersion'];
      loopPhase: string;
      readinessStatus: string;
      readinessChecked: boolean;
      closeState: TaskWorkbenchReport['state']['closeState'];
      evidenceRecords: number;
      issueCodes: string[];
    };
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
  const detail = options.detail ?? 'fast';
  const workbench = createTaskWorkbenchReport(projectRoot, taskId, now, { detail });
  const health = determineHealth(workbench);
  const nextActions = workbench.nextActions.map(convertNextAction);
  const primaryNextAction = workbench.loop.primaryNextAction ? convertNextAction(workbench.loop.primaryNextAction) : nextActions[0] ?? null;
  const cockpit = determineCockpit(workbench, detail);

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
    sources: {
      detail,
      ...(detail === 'full' ? { workbench } : {}),
      workbenchSummary: {
        schemaVersion: workbench.schemaVersion,
        loopPhase: workbench.loop.phase,
        readinessStatus: workbench.state.readiness.status,
        readinessChecked: detail === 'full',
        closeState: workbench.state.closeState,
        evidenceRecords: workbench.summary.evidenceRecords,
        issueCodes: workbench.issues.map((issue) => issue.code)
      }
    },
    issues: workbench.issues
  };
}

export function createAdaptiveTaskStatusV2Report(
  projectRoot: string,
  now = new Date(),
  options: { detail?: 'fast' | 'full'; taskId?: string } = {}
): TaskStatusV2Report | TaskSelectionStatusV2Report {
  if (options.taskId) return createTaskStatusV2Report(projectRoot, options.taskId, now, options);
  const selection = createTaskSelectionStatusV2Report(projectRoot, now, options);
  const recommended = selection.recommendations[0];
  if (!recommended?.taskCapsulePresent || !/^(draft|in progress)$/i.test(recommended.taskBoardStatus ?? '')) return selection;
  const task = createTaskStatusV2Report(projectRoot, recommended.taskId, now, options);
  task.issues.push(...selection.issues);
  return task;
}

export function formatTaskStatusV2Report(report: TaskStatusV2Report): string {
  return [
    `[HADARA] task status ${report.taskId} ${report.phase} (${report.health})`,
    `readiness: ${report.readiness.status} - ${report.readiness.reason}`,
    report.primaryNextAction
      ? `next: ${report.primaryNextAction.command ?? report.primaryNextAction.message}`
      : 'next: none',
    `source: ${report.sources.workbenchSummary.schemaVersion}`
  ].join('\n');
}

function determineHealth(workbench: TaskWorkbenchReport): StatusHealth {
  if (!workbench.ok) return 'blocked';
  if (workbench.state.closeState === 'close-evidence-found-invalid' || workbench.state.closeState === 'close-evidence-malformed') return 'attention';
  if (workbench.state.readiness.status === 'closed-valid-current-blocked') return 'attention';
  if (workbench.summary.blockers > 0) return 'blocked';
  if (workbench.state.closedValid) return 'ok';
  if (workbench.summary.warnings > 0) return 'attention';
  return 'ok';
}

function readinessIntent(phase: TaskCockpitPhase): StatusReadiness['intent'] {
  if (phase === 'plan-work') return 'plan';
  if (phase === 'validate') return 'validate';
  if (phase === 'close-ready' || phase === 'repair-evidence' || phase === 'closed-stale') return 'close';
  if (phase === 'closed-valid') return 'orient';
  return 'edit';
}

function readinessStatus(phase: TaskCockpitPhase, health: StatusHealth, workbench: TaskWorkbenchReport): StatusReadiness['status'] {
  if (health === 'blocked') return 'blocked';
  if (phase === 'closed-valid') return 'terminal';
  if (phase === 'repair-evidence' || phase === 'closed-stale') return 'needs-review';
  if (phase === 'plan-work') return 'needs-review';
  if (phase === 'validate') return 'ready';
  if (phase === 'close-ready') return workbench.state.ready || workbench.state.readiness.currentReady ? 'ready' : 'not-evaluated';
  if (workbench.state.ready || workbench.state.readiness.closeProofValid) return 'ready';
  if (phase === 'author-task') return 'needs-context';
  return 'needs-review';
}

function buildEvaluations(workbench: TaskWorkbenchReport, health: StatusHealth): TaskStatusV2Report['evaluations'] {
  const readinessChecked = !workbench.state.readiness.status.includes('not-checked') && !workbench.state.readiness.summary.includes('Fast task status skipped');
  return [
    {
      id: 'task-workbench',
      state: 'evaluated',
      health,
      summary: `Workbench phase=${workbench.loop.phase}; blockers=${workbench.summary.blockers}; warnings=${workbench.summary.warnings}.`
    },
    {
      id: 'evidence',
      state: 'evaluated',
      health: workbench.summary.evidenceRecords > 0 ? 'ok' : 'attention',
      summary: `${workbench.summary.evidenceRecords} evidence record(s) observed.`
    },
    {
      id: 'close-proof',
      state: 'evaluated',
      health: workbench.state.readiness.closeProofValid ? 'ok' : 'attention',
      summary: workbench.state.readiness.closeProofValid ? 'Valid close proof is present.' : `Close state is ${workbench.state.closeState}.`
    },
    {
      id: 'close-readiness',
      state: readinessChecked ? 'evaluated' : 'not-evaluated',
      health: readinessChecked ? (workbench.state.ready || workbench.state.closedValid ? 'ok' : health) : 'attention',
      summary: readinessChecked ? workbench.state.readiness.summary : 'Fast selected-task status skipped close-grade checks; use --detail full or task close --dry-run for close readiness.'
    }
  ];
}

function convertNextAction(action: WorkbenchNextAction): StatusNextAction {
  const command = action.command;
  const executeAlternative = action.executeCommand ? {
    command: action.executeCommand,
    writeBoundary: inferWriteBoundary({ ...action, command: action.executeCommand }),
    requiresReview: true
  } : undefined;
  const writeBoundary = inferWriteBoundary(action);
  return {
    id: action.id,
    kind: command ? 'command' : 'review',
    ...(command ? { command } : {}),
    ...(executeAlternative ? { executeAlternative } : {}),
    message: action.message,
    writeBoundary,
    risk: action.priority === 'now' ? 'low' : 'none',
    requiresReview: action.kind === 'review' || !command || Boolean(executeAlternative),
    writes: writeBoundary !== 'read-only' && writeBoundary !== 'none'
  };
}

function determineCockpit(workbench: TaskWorkbenchReport, detail: 'fast' | 'full'): { phase: TaskCockpitPhase; reason: string; planState: TaskStatusV2Report['cockpit']['planState'] } {
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
  if (detail === 'full' && (workbench.state.ready || workbench.state.readiness.currentReady)) {
    return { phase: 'close-ready', reason: 'Close-grade checks were evaluated and the task is ready for task close.', planState };
  }
  return { phase: 'validate', reason: 'Task has evidence, but fast status has not evaluated close-grade checks; run task close --dry-run or task status --detail full.', planState };
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

function inferWriteBoundary(action: WorkbenchNextAction): StatusNextAction['writeBoundary'] {
  const command = action.command ?? '';
  if (command.includes('task close') && !command.includes('--dry-run')) return 'task-close-transaction';
  if (command.includes('task close') && command.includes('--dry-run')) return 'read-only';
  if (action.executeCommand?.includes('finalize') || command.includes('finalize')) return 'evidence-append';
  if (action.kind === 'edit' || action.kind === 'remediation') return 'task-local';
  return 'read-only';
}
