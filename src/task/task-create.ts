import path from 'node:path';
import type { TaskCapsule } from './task-capsule';
import {
  createTaskCapsule,
  TaskBoardManagedSectionError,
  TaskCapsuleCreateCollisionError,
  TaskCapsuleCreateLockError,
  withTaskCreateProjectLock,
  type CreateTaskCapsuleOptions
} from './task-capsule';
import { getTaskTemplate, supportedTaskTemplateIds, templateSummary, type TaskTemplateSummary } from './task-templates';
import { activateProjectCurrentTask } from '../services/project-current-state';

export interface TaskCreateReport {
  schemaVersion: 'hadara.task.create.v1';
  command: 'task.create';
  ok: boolean;
  taskId?: string;
  task?: {
    id: string;
    title: string;
    capsule: string;
  };
  template?: TaskTemplateSummary | {
    id: string;
    applied: false;
    recommendedActorRole: 'worker';
    expectedEvidence: string[];
    outOfScope: string[];
  };
  supportedTemplates: string[];
  issues: Array<{
    severity: 'error' | 'warning' | 'info';
    code: string;
    message: string;
  }>;
}

export function createTaskCreateReport(projectRoot: string, title: string, options: Pick<CreateTaskCapsuleOptions, 'templateId' | 'maxCreateRetries' | 'onBeforeCreateAttempt' | 'lockTimeoutMs'> = {}): TaskCreateReport {
  const supportedTemplates = supportedTaskTemplateIds();
  const template = getTaskTemplate(options.templateId);
  const templateReport = templateSummary(template);
  if (options.templateId && !template) {
    return {
      schemaVersion: 'hadara.task.create.v1',
      command: 'task.create',
      ok: false,
      template: {
        id: options.templateId,
        applied: false,
        recommendedActorRole: 'worker',
        expectedEvidence: [],
        outOfScope: []
      },
      supportedTemplates,
      issues: [
        {
          severity: 'error',
          code: 'TASK_TEMPLATE_UNKNOWN',
          message: `Unknown task template: ${options.templateId}. Supported templates: ${supportedTemplates.join(', ')}.`
        }
      ]
    };
  }

  let task: TaskCapsule;
  const issues: TaskCreateReport['issues'] = [];
  try {
    task = withTaskCreateProjectLock(projectRoot, () => {
      const created = createTaskCapsule(projectRoot, title, {
        templateId: template?.id,
        maxCreateRetries: options.maxCreateRetries,
        onBeforeCreateAttempt: options.onBeforeCreateAttempt,
        lockTimeoutMs: options.lockTimeoutMs,
        lock: false
      });
      for (const issue of activateProjectCurrentTask(projectRoot, { id: created.id, title: created.title })) {
        issues.push({
          severity: 'warning',
          code: 'TASK_CREATE_CURRENT_STATE_SYNC_FAILED',
          message: `${issue.message} The Task Capsule was created; repair current-state drift before relying on session continuation.`
        });
      }
      return created;
    }, { timeoutMs: options.lockTimeoutMs });
  } catch (error) {
    if (error instanceof TaskCapsuleCreateCollisionError || error instanceof TaskCapsuleCreateLockError || error instanceof TaskBoardManagedSectionError) {
      return {
        schemaVersion: 'hadara.task.create.v1',
        command: 'task.create',
        ok: false,
        ...(templateReport ? { template: templateReport } : {}),
        supportedTemplates,
        issues: [
          {
            severity: 'error',
            code: error.code,
            message: `${error.message} Re-run task create after refreshing task state.`
          }
        ]
      };
    }
    throw error;
  }
  return {
    schemaVersion: 'hadara.task.create.v1',
    command: 'task.create',
    ok: true,
    taskId: task.id,
    task: taskSummary(projectRoot, task),
    ...(templateReport ? { template: templateReport } : {}),
    supportedTemplates,
    issues
  };
}

export function formatTaskCreateReport(report: TaskCreateReport): string {
  if (!report.ok) {
    return [`[HADARA] task create failed`, ...report.issues.map((issue) => `[${issue.severity}] ${issue.code}: ${issue.message}`)].join('\n');
  }
  const lines = [`[HADARA] Created ${report.task?.id}: ${report.task?.title}`, report.task?.capsule ?? ''];
  if (report.template?.applied) lines.push(`template=${report.template.id}`);
  return lines.filter(Boolean).join('\n');
}

function taskSummary(projectRoot: string, task: TaskCapsule): NonNullable<TaskCreateReport['task']> {
  return {
    id: task.id,
    title: task.title,
    capsule: path.relative(projectRoot, task.dir).split(path.sep).join('/')
  };
}
