import { createTaskCloseReport, TaskCloseIssue, TaskCloseNextAction } from './task-close';
import type { HadaraActorContext } from '../core/actor-context';
import { createTaskLifecycleNextAction, defaultTaskLifecycleActor, selectPrimaryNextAction } from './lifecycle-next-actions';

export type TaskReadyLevel = 'done';

export interface TaskReadyReport {
  schemaVersion: 'hadara.task.ready.v1';
  command: 'task.ready';
  ok: boolean;
  taskId: string;
  projectRoot: string;
  actor: HadaraActorContext;
  level: TaskReadyLevel;
  summary: {
    ready: boolean;
    blockers: number;
    warnings: number;
  };
  checks: {
    doneValidation: boolean;
    evidenceLint: boolean;
    protocolDoctor: boolean;
  };
  nextActions: TaskCloseNextAction[];
  primaryNextAction?: TaskCloseNextAction;
  issues: TaskCloseIssue[];
}

export interface TaskReadyOptions {
  actor?: HadaraActorContext;
}

export function createTaskReadyReport(projectRoot: string, taskId: string, level: TaskReadyLevel = 'done', options: TaskReadyOptions = {}): TaskReadyReport {
  const actor = options.actor ?? defaultTaskLifecycleActor();
  const closePlan = createTaskCloseReport(projectRoot, taskId, 'dry-run', { actor });
  return createTaskReadyReportFromClosePlan(projectRoot, taskId, level, closePlan, actor);
}

export function createTaskReadyReportFromClosePlan(projectRoot: string, taskId: string, level: TaskReadyLevel, closePlan: ReturnType<typeof createTaskCloseReport>, actor: HadaraActorContext): TaskReadyReport {
  const ready = closePlan.ok;
  const nextActions: TaskCloseNextAction[] = ready
    ? [
        createTaskLifecycleNextAction({
          id: 'run-task-close',
          required: false,
          command: `hadara task close --task ${taskId} --json`,
          message: 'Review the close plan before appending close evidence.',
          writeBoundary: 'read-only',
          recommendedActorRole: 'worker',
          requiresBeforeHash: false,
          stalePlanRisk: 'none'
        })
      ]
    : createBlockedReadyActions(taskId, closePlan.nextActions, closePlan.issues);

  return {
    schemaVersion: 'hadara.task.ready.v1',
    command: 'task.ready',
    ok: ready,
    taskId,
    projectRoot,
    actor,
    level,
    summary: {
      ready,
      blockers: closePlan.issues.filter((issue) => issue.severity === 'error').length,
      warnings: closePlan.issues.filter((issue) => issue.severity === 'warning').length
    },
    checks: {
      doneValidation: closePlan.validation.ok,
      evidenceLint: closePlan.evidenceLint.ok,
      protocolDoctor: closePlan.protocolDoctor.ok
    },
    nextActions,
    ...(selectPrimaryNextAction(nextActions) ? { primaryNextAction: selectPrimaryNextAction(nextActions) } : {}),
    issues: closePlan.issues
  };
}

function createBlockedReadyActions(taskId: string, closeActions: TaskCloseNextAction[], issues: TaskCloseIssue[]): TaskCloseNextAction[] {
  const actions = closeActions.filter((action) => action.id !== 'append-close-evidence');
  if (issues.some((issue) => issue.code === 'HARNESS_TASK_STATUS_NOT_DONE')) {
    actions.unshift(
      createTaskLifecycleNextAction({
        id: 'finish-first',
        required: true,
        command: `hadara task finish --task ${taskId} --json`,
        message: 'Preview finish writes before checking done-level readiness.',
        writeBoundary: 'task-local',
        recommendedActorRole: 'worker',
        requiresBeforeHash: false,
        stalePlanRisk: 'low'
      })
    );
  }
  if (issues.some((issue) => issue.code.startsWith('EVIDENCE_LINT_') || issue.code === 'HARNESS_EVIDENCE_REQUIRED')) {
    actions.push(
      createTaskLifecycleNextAction({
        id: 'refresh-evidence',
        required: true,
        command: `hadara evidence lint --task ${taskId} --json`,
        message: 'Inspect evidence semantics before done-level readiness.',
        writeBoundary: 'read-only',
        recommendedActorRole: 'worker',
        requiresBeforeHash: false,
        stalePlanRisk: 'none'
      })
    );
  }
  actions.push(
    createTaskLifecycleNextAction({
      id: 'resolve-ready-blockers',
      kind: 'review',
      required: true,
      message: 'Resolve blockers before running task close.',
      writeBoundary: 'read-only',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'none'
    })
  );
  return actions;
}
