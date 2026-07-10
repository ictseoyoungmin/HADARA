import fs from 'node:fs';
import path from 'node:path';
import type { ContextGraphIssue, ContextGraphNode, GraphExtractionResult, StateSource } from './context-graph';
import {
  createContextGraphSourceRef,
  createEmptyExtractionResult,
  createTaskNodeId,
  hashContextGraphText,
  normalizeContextGraphPath,
  toProjectRelativeContextPath
} from './extractor-contract';
import { findMarkdownRowByCell, parseMarkdownRowsUnderHeading, readMarkdownSection } from '../services/markdown-table';
import { findTaskCapsule, listTaskCapsules, type TaskCapsule } from '../task/task-capsule';

interface TaskBoardRow {
  id: string;
  title: string;
  status: string;
  capsule: string;
  line: number;
}

export function extractTaskBoard(projectRoot: string): GraphExtractionResult {
  const relativePath = 'docs/TASK_BOARD.md';
  const absolutePath = path.join(projectRoot, relativePath);
  const content = readOptionalText(absolutePath);
  const result = createEmptyExtractionResult('extractTaskBoard', [{ path: relativePath, content }]);
  if (content == null) {
    result.issues.push(sourceMissingIssue(relativePath, 'Task Board is missing; task graph nodes cannot be extracted from docs/TASK_BOARD.md.'));
    return result;
  }

  const sourceHash = hashContextGraphText(content);
  const rows = parseTaskBoardRows(content);
  result.nodes.push(...rows.map((row) => taskBoardNode(row, sourceHash)));
  result.stateSources?.push(taskBoardStateSource(rows, sourceHash));
  return result;
}

export function extractTaskCapsules(projectRoot: string, options: { taskIds?: string[] } = {}): GraphExtractionResult {
  const capsules = options.taskIds && options.taskIds.length > 0
    ? taskCapsulesById(projectRoot, options.taskIds)
    : listTaskCapsules(projectRoot);
  const sources = capsules.flatMap((task) => [
    readSourceInput(projectRoot, path.join(task.dir, 'TASK.md')),
    readSourceInput(projectRoot, path.join(task.dir, 'HANDOFF.md'))
  ]);
  const result = createEmptyExtractionResult('extractTaskCapsules', sources);
  const stateSources: StateSource[] = [];

  for (const task of capsules) {
    const taskPath = toProjectRelativeContextPath(projectRoot, path.join(task.dir, 'TASK.md'));
    const taskContent = readOptionalText(path.join(task.dir, 'TASK.md'));
    if (taskContent == null) {
      result.issues.push(sourceMissingIssue(taskPath, `Task Capsule ${task.id} is missing TASK.md.`));
      continue;
    }
    const handoffPath = toProjectRelativeContextPath(projectRoot, path.join(task.dir, 'HANDOFF.md'));
    const handoffContent = readOptionalText(path.join(task.dir, 'HANDOFF.md'));
    const taskStatus = readTaskStatus(taskContent);
    const handoffStatus = handoffContent == null ? null : readTaskHandoffStatus(handoffContent);
    const taskHash = hashContextGraphText(taskContent);
    const source = createContextGraphSourceRef({
      path: taskPath,
      extractor: 'extractTaskCapsules',
      line: 1,
      hash: taskHash
    });
    result.nodes.push({
      id: createTaskNodeId(task.id),
      type: 'Task',
      label: `${task.id} ${task.title}`,
      path: taskPath,
      status: taskStatus ?? undefined,
      kind: 'task-capsule',
      metadata: {
        capsule: toProjectRelativeContextPath(projectRoot, task.dir),
        ...(handoffStatus ? { handoffTaskStatus: handoffStatus } : {}),
        handoffPath,
        handoffPresent: handoffContent != null
      },
      source
    });
    stateSources.push({
      id: `state-source:task-capsule:${task.id}`,
      path: taskPath,
      kind: 'task-capsule',
      hash: taskHash,
      extracted: {
        taskId: task.id,
        title: task.title,
        status: taskStatus,
        handoffTaskStatus: handoffStatus,
        capsule: toProjectRelativeContextPath(projectRoot, task.dir)
      }
    });
  }

  result.stateSources?.push(...stateSources);
  return result;
}

function taskCapsulesById(projectRoot: string, taskIds: string[]): TaskCapsule[] {
  const seen = new Set<string>();
  const capsules: TaskCapsule[] = [];
  for (const taskId of taskIds) {
    if (seen.has(taskId)) continue;
    seen.add(taskId);
    const capsule = findTaskCapsule(projectRoot, taskId);
    if (capsule) capsules.push(capsule);
  }
  return capsules.sort((a, b) => a.id.localeCompare(b.id));
}

function taskBoardNode(row: TaskBoardRow, sourceHash: string): ContextGraphNode {
  return {
    id: createTaskNodeId(row.id),
    type: 'Task',
    label: `${row.id} ${row.title}`.trim(),
    path: normalizeContextGraphPath(path.posix.join(row.capsule, 'TASK.md')),
    status: row.status,
    kind: 'task-board-row',
    metadata: {
      capsule: normalizeContextGraphPath(row.capsule)
    },
    source: createContextGraphSourceRef({
      path: 'docs/TASK_BOARD.md',
      extractor: 'extractTaskBoard',
      line: row.line,
      hash: sourceHash
    })
  };
}

function taskBoardStateSource(rows: TaskBoardRow[], sourceHash: string): StateSource {
  return {
    id: 'state-source:task-board',
    path: 'docs/TASK_BOARD.md',
    kind: 'task-board',
    hash: sourceHash,
    extracted: {
      rows: rows.length,
      latestDoneTask: latestTaskId(rows.filter((row) => row.status === 'Done').map((row) => row.id)),
      activeTasks: rows.filter((row) => row.status === 'In Progress').map((row) => row.id)
    }
  };
}

function parseTaskBoardRows(content: string): TaskBoardRow[] {
  const rows: TaskBoardRow[] = [];
  content.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || !trimmed.endsWith('|') || /^\|\s*:?-+/.test(trimmed)) return;
    const cells = trimmed.slice(1, -1).split('|').map((cell) => cell.trim());
    if (!/^T-\d{4}$/.test(cells[0] ?? '')) return;
    rows.push({
      id: cells[0],
      title: cells[1] ?? '',
      status: cells[2] ?? '',
      capsule: cells[3] ?? '',
      line: index + 1
    });
  });
  return rows;
}

function readTaskStatus(content: string): string | null {
  const sectionStatus = readMarkdownSection(content, '## Status').trim().split(/\r?\n/)[0]?.trim();
  if (sectionStatus) return sectionStatus;
  const identityRows = parseMarkdownRowsUnderHeading(content, '## Identity');
  const metadataRows = parseMarkdownRowsUnderHeading(content, '## Metadata');
  return findMarkdownRowByCell(identityRows, 0, 'Status')?.[1] ?? findMarkdownRowByCell(metadataRows, 0, 'Status')?.[1] ?? null;
}

function readTaskHandoffStatus(content: string): string | null {
  const rows = parseMarkdownRowsUnderHeading(content, '## Current State');
  return findMarkdownRowByCell(rows, 0, 'TaskStatus')?.[1] ?? findMarkdownRowByCell(rows, 0, 'Status')?.[1] ?? null;
}

function readSourceInput(projectRoot: string, absolutePath: string): { path: string; content: string | null } {
  return {
    path: toProjectRelativeContextPath(projectRoot, absolutePath),
    content: readOptionalText(absolutePath)
  };
}

function readOptionalText(absolutePath: string): string | null {
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : null;
}

function sourceMissingIssue(relativePath: string, message: string): ContextGraphIssue {
  return {
    severity: 'warning',
    code: 'CONTEXT_GRAPH_SOURCE_MISSING',
    path: relativePath,
    message,
    fixHint: `Restore ${relativePath} or run the relevant HADARA workflow before relying on context graph extraction.`
  };
}

function latestTaskId(ids: string[]): string | null {
  return ids.sort().at(-1) ?? null;
}
