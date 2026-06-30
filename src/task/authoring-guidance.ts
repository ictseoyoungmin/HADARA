import fs from 'node:fs';
import path from 'node:path';
import { findTaskCapsule } from './task-capsule';

export type TaskAuthoringGuidanceStatus = 'needs-authoring' | 'current' | 'task-missing';

export interface TaskAuthoringGuidanceItem {
  id: string;
  path: string;
  section: string;
  status: 'missing' | 'placeholder' | 'pending' | 'current';
  required: boolean;
  summary: string;
}

export interface TaskAuthoringGuidance {
  readOnly: true;
  writesProse: false;
  status: TaskAuthoringGuidanceStatus;
  summary: string;
  items: TaskAuthoringGuidanceItem[];
}

export function createTaskAuthoringGuidance(projectRoot: string, taskId: string): TaskAuthoringGuidance {
  const task = findTaskCapsule(projectRoot, taskId);
  if (!task) {
    return {
      readOnly: true,
      writesProse: false,
      status: 'task-missing',
      summary: 'Task Capsule was not found; no task-owned prose can be inspected.',
      items: []
    };
  }

  const taskPath = path.join(task.dir, 'TASK.md');
  const relativeTaskPath = toPortablePath(path.relative(projectRoot, taskPath));
  const content = fs.existsSync(taskPath) ? fs.readFileSync(taskPath, 'utf8') : '';
  const items = [
    inspectTaskSection(content, relativeTaskPath, 'source-documents', 'Source Documents', 'List source docs or explicitly state that none are required.'),
    inspectTaskSection(content, relativeTaskPath, 'goal', 'Goal', 'Replace scaffold goal text with the smallest verifiable outcome.'),
    inspectTaskSection(content, relativeTaskPath, 'plan', 'Plan', 'Keep execution steps current as work moves.'),
    inspectTaskSection(content, relativeTaskPath, 'acceptance', 'Acceptance', 'Define required criteria and mark them with evidence only after validation.'),
    inspectTaskSection(content, relativeTaskPath, 'validation', 'Validation', 'List validation methods before close and update real results after execution.'),
    inspectTaskSection(content, relativeTaskPath, 'change-summary', 'Change Summary', 'Record changed paths and final line ranges before close.'),
    inspectTaskSection(content, relativeTaskPath, 'risks-followups', 'Risks / Follow-ups', 'Record real residual risks or explicitly mark none.')
  ];
  const requiredOpen = items.filter((item) => item.required && item.status !== 'current').length;
  return {
    readOnly: true,
    writesProse: false,
    status: requiredOpen > 0 ? 'needs-authoring' : 'current',
    summary: requiredOpen > 0 ? `${requiredOpen} task authoring section(s) need agent-owned prose or table updates.` : 'Task-owned prose sections look current.',
    items
  };
}

function inspectTaskSection(content: string, taskPath: string, id: string, section: string, summary: string): TaskAuthoringGuidanceItem {
  const body = readSection(content, section);
  const status = sectionStatus(body);
  return {
    id,
    path: taskPath,
    section,
    status,
    required: true,
    summary
  };
}

function readSection(content: string, section: string): string {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `## ${section}`);
  if (start < 0) return '';
  const end = lines.findIndex((line, index) => index > start && line.startsWith('## '));
  return lines.slice(start + 1, end < 0 ? undefined : end).join('\n').trim();
}

function sectionStatus(body: string): TaskAuthoringGuidanceItem['status'] {
  if (!body) return 'missing';
  const lower = body.toLowerCase();
  if (body.includes('TBD') || lower.includes('replace with') || lower.includes('scaffold placeholder')) return 'placeholder';
  if (body.includes('| Pending |') || body.includes('| Not Run |')) return 'pending';
  return 'current';
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
