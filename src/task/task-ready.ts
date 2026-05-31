import { createTaskCloseReport, TaskCloseIssue, TaskCloseNextAction } from './task-close';

export type TaskReadyLevel = 'done';

export interface TaskReadyReport {
  schemaVersion: 'hadara.task.ready.v1';
  command: 'task.ready';
  ok: boolean;
  taskId: string;
  projectRoot: string;
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
  issues: TaskCloseIssue[];
}

export function createTaskReadyReport(projectRoot: string, taskId: string, level: TaskReadyLevel = 'done'): TaskReadyReport {
  const closePlan = createTaskCloseReport(projectRoot, taskId, 'dry-run');
  const ready = closePlan.ok;
  const nextActions: TaskCloseNextAction[] = ready
    ? [
        {
          id: 'run-task-close',
          kind: 'command',
          required: false,
          command: `hadara task close --task ${taskId} --json`,
          message: 'Review the close plan before appending close evidence.'
        }
      ]
    : [
        ...closePlan.nextActions.filter((action) => action.id !== 'append-close-evidence'),
        {
          id: 'resolve-ready-blockers',
          kind: 'review',
          required: true,
          message: 'Resolve blockers before running task close.'
        }
      ];

  return {
    schemaVersion: 'hadara.task.ready.v1',
    command: 'task.ready',
    ok: ready,
    taskId,
    projectRoot,
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
    issues: closePlan.issues
  };
}
