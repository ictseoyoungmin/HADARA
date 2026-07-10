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
    inspectTaskSection(content, relativeTaskPath, 'goal', 'Goal', 'Replace scaffold goal text with the smallest verifiable outcome.'),
    inspectTaskSection(content, relativeTaskPath, 'plan', 'Plan', 'Keep execution steps current as work moves.'),
    inspectTaskSection(content, relativeTaskPath, 'acceptance', 'Acceptance', 'Define required criteria and mark them with evidence only after validation.'),
    inspectTaskSection(content, relativeTaskPath, 'validation', 'Validation', 'List validation methods before close and update real results after execution.'),
    inspectTaskSection(content, relativeTaskPath, 'source-documents', ['Inputs / Constraints', 'Source Documents'], 'List source docs or explicitly state that none are required.'),
    inspectTaskSection(content, relativeTaskPath, 'change-summary', ['Changes', 'Change Summary'], 'Record changed areas/modules and evidence before close.'),
    inspectTaskSection(content, relativeTaskPath, 'risks-followups', 'Risks / Follow-ups', 'Record real residual risks or explicitly mark none.'),
    inspectHistorySection(content, relativeTaskPath)
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

function inspectHistorySection(content: string, taskPath: string): TaskAuthoringGuidanceItem {
  const taskStatus = readIdentityStatus(content);
  const latestState = latestHistoryState(content) ?? latestStatusHistoryState(content);
  const doneRecorded = latestState === 'Done';
  const required = taskStatus === 'Done' && !doneRecorded;
  return {
    id: 'history',
    path: taskPath,
    section: content.includes('## Status History') && !content.includes('## History') ? 'Status History' : 'History',
    status: doneRecorded ? 'current' : content.includes('## History') || content.includes('## Status History') ? 'pending' : 'missing',
    required,
    summary: doneRecorded
      ? 'History records the final Done state.'
      : 'Before finalize execute, append a final `Done` row to TASK.md History; close proof hashes TASK.md, so this close-source note must be written before close.'
  };
}

function inspectTaskSection(content: string, taskPath: string, id: string, section: string | string[], summary: string): TaskAuthoringGuidanceItem {
  const sections = Array.isArray(section) ? section : [section];
  const foundSection = sections.find((candidate) => readSection(content, candidate)) ?? sections[0];
  const body = readSection(content, foundSection);
  const status = sectionStatus(body);
  return {
    id,
    path: taskPath,
    section: foundSection,
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

function readIdentityStatus(content: string): string {
  const rows = readTableRows(readSection(content, 'Identity'));
  return rows.find((row) => row[0] === 'Status')?.[1]?.trim() ?? '';
}

function latestHistoryState(content: string): string | null {
  const rows = readTableRows(readSection(content, 'History')).filter((row) => row[0] !== 'Date');
  return rows.at(-1)?.[1]?.trim() ?? null;
}

function latestStatusHistoryState(content: string): string | null {
  const rows = readTableRows(readSection(content, 'Status History')).filter((row) => row[0] !== 'Time');
  return rows.at(-1)?.[1]?.trim() ?? null;
}

function readTableRows(body: string): string[][] {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && !/^\|\s*:?-+/.test(line))
    .map((line) =>
      line
        .slice(1, line.endsWith('|') ? -1 : undefined)
        .split('|')
        .map((cell) => cell.trim())
    );
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
