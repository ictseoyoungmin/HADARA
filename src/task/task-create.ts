import path from 'node:path';
import type { TaskCapsule } from './task-capsule';
import { createTaskCapsule } from './task-capsule';
import { getTaskTemplate, supportedTaskTemplateIds, templateSummary, type TaskTemplateSummary } from './task-templates';

export interface TaskCreateReport {
  schemaVersion: 'hadara.task.create.v1';
  command: 'task.create';
  ok: boolean;
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

export function createTaskCreateReport(projectRoot: string, title: string, options: { templateId?: string } = {}): TaskCreateReport {
  const supportedTemplates = supportedTaskTemplateIds();
  const template = getTaskTemplate(options.templateId);
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

  const task = createTaskCapsule(projectRoot, title, { templateId: template?.id });
  return {
    schemaVersion: 'hadara.task.create.v1',
    command: 'task.create',
    ok: true,
    task: taskSummary(projectRoot, task),
    template: templateSummary(template),
    supportedTemplates,
    issues: []
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
