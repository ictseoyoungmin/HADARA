import fs from 'node:fs';
import path from 'node:path';
import { ensureDir, slugify, writeFileIfMissing } from '../core/fs';
import { managedSectionBlock } from '../services/managed-sections';
import { readMarkdownSection } from '../services/markdown-table';
import { getTaskTemplate } from './task-templates';

export interface TaskCapsule {
  id: string;
  title: string;
  slug: string;
  dir: string;
}

export const TASK_FILES: Record<string, (task: TaskCapsule) => string> = {
  'TASK.md': (task) => `# ${task.id} ${task.title}\n\n## Metadata\n\n| Field | Value |\n|---|---|\n| ID | ${task.id} |\n| Title | ${task.title.replace(/\|/g, '/')} |\n| Status | Draft |\n| Created | TBD |\n| Updated | TBD |\n\n## Goal\n\n| Goal | Notes |\n|---|---|\n| TBD | Replace with the smallest verifiable outcome. |\n\n## Scope\n\n| In Scope | Reason |\n|---|---|\n| TBD | TBD |\n\n## Out of Scope\n\n| Out of Scope | Reason |\n|---|---|\n| TBD | TBD |\n\n## Status\n\nDraft\n\n## Status History\n\n${managedSectionBlock('task-status-history', { schema: 'hadara.managedSection.v1', owner: 'task.finish', kind: 'markdown-table', mode: 'update-row', version: 1, required: true, closeSourceRole: 'included' }, `| Time | Status | Reason | Evidence |\n|---|---|---|---|\n| TBD | Draft | Initial task scaffold. | TBD |\n`)}\n`,
  'PLAN.md': () => `# Plan\n\n| Step | Action | Status | Evidence |\n|---|---|---|---|\n| 1 | Read required project docs. | Pending | TBD |\n| 2 | Implement the smallest useful slice. | Pending | TBD |\n| 3 | Run validation. | Pending | TBD |\n| 4 | Attach evidence. | Pending | TBD |\n| 5 | Update handoff. | Pending | TBD |\n`,
  'CONTEXT.md': () => `# Context\n\n## Required Reading Used\n\n| Document | Why It Matters | Read Status |\n|---|---|---|\n| docs/PROJECT_STATE.md | Current project state. | Pending |\n| docs/AGENT_HANDOFF.md | Current handoff. | Pending |\n| docs/TASK_BOARD.md | Task queue and status. | Pending |\n| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Pending |\n\n## Assumptions\n\n| Assumption | Source | Risk If Wrong |\n|---|---|---|\n| TBD | TBD | TBD |\n\n## Constraints\n\n| Constraint | Source | Notes |\n|---|---|---|\n| TBD | TBD | TBD |\n`,
  'FILES.md': () => `# Files\n\n| Path | Action | Reason | Status |\n|---|---|---|---|\n`,
  'ACCEPTANCE.md': () => `# Acceptance Criteria\n\n| ID | Criterion | Status | Evidence |\n|---|---|---|---|\n| AC-1 | Scope is implemented. | Pending | TBD |\n| AC-2 | Tests or explicit constraints are recorded. | Pending | TBD |\n| AC-3 | Evidence is attached. | Pending | TBD |\n| AC-4 | Handoff is updated. | Pending | TBD |\n`,
  'TESTS.md': () => `# Tests\n\n## Routine Checks\n\n| Command | Purpose | Required For Done | Latest Result | Evidence |\n|---|---|---|---|---|\n| npm test | Run the default project test suite. | Yes | Not Run | TBD |\n| npm run check | Run the full repository check when available. | Yes | Not Run | TBD |\n\n## Special Checks\n\n| Check | Required? | Reason | Latest Result | Evidence |\n|---|---|---|---|---|\n| Security smoke | No | Only if security boundary changes. | Not Run | TBD |\n| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |\n`,
  'RISKS.md': () => `# Risks\n\n| Risk | Impact | Likelihood | Mitigation | Status |\n|---|---|---|---|---|\n`,
  'DECISIONS.md': () => `# Decisions\n\n| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n`,
  'EVIDENCE.md': () => `# Evidence\n\n| Time | Kind | Summary | Result | Visibility | JSONL |\n|---|---|---|---|---|---|\n`,
  'evidence.jsonl': () => '',
  'HANDOFF.md': (task) => `# Handoff\n\n## Current State\n\n${managedSectionBlock('task-handoff-current-state', { schema: 'hadara.managedSection.v1', owner: 'handoff.update', kind: 'key-value-table', mode: 'update-row', version: 1, required: true, closeSourceRole: 'included' }, `| Field | Value |\n|---|---|\n| Task | ${task.id} |\n| Status | Draft |\n| Last Updated | TBD |\n`)}\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| TBD | TBD |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| TBD | TBD | TBD |\n\n## Carry Forward Warnings\n\n| Warning | Impact | Mitigation |\n|---|---|---|\n`
};

export function isTaskCapsuleScaffoldContent(task: TaskCapsule, fileName: string, content: string): boolean {
  if (fileName === 'TASK.md') {
    return ['## Goal', '## Scope', '## Out of Scope'].some((heading) => isPlaceholderSection(readMarkdownSection(content, heading)));
  }

  if (fileName === 'ACCEPTANCE.md') {
    const defaultItems = [
      'Scope is implemented.',
      'Tests or explicit constraints are recorded.',
      'Evidence is attached.',
      'Handoff is updated.'
    ];
    const tableCriteria = acceptanceTableCriteria(content);
    if (tableCriteria.length > 0) {
      return tableCriteria.join('\n') === defaultItems.join('\n');
    }
    return acceptanceChecklistText(content).join('\n') === defaultItems.join('\n');
  }

  const factory = TASK_FILES[fileName];
  if (!factory) return false;
  return normalizeMarkdown(content) === normalizeMarkdown(factory(task));
}

export function nextTaskId(tasksDir: string, blockedIds: Set<string> = new Set()): string {
  ensureDir(tasksDir);
  const max = fs
    .readdirSync(tasksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name.match(/^T-(\d{4})-/)?.[1])
    .filter((value): value is string => Boolean(value))
    .map(Number)
    .reduce((acc, value) => Math.max(acc, value), 0);

  let next = max + 1;
  let id = `T-${String(next).padStart(4, '0')}`;
  while (blockedIds.has(id)) {
    next += 1;
    id = `T-${String(next).padStart(4, '0')}`;
  }
  return id;
}

export interface CreateTaskCapsuleOptions {
  templateId?: string;
  maxCreateRetries?: number;
  onBeforeCreateAttempt?: (attempt: { id: string; dir: string; attempt: number }) => void;
}

export class TaskCapsuleCreateCollisionError extends Error {
  readonly code = 'TASK_CREATE_COLLISION_RETRIES_EXHAUSTED';
  readonly attempts: number;

  constructor(attempts: number) {
    super(`Task Capsule creation collided ${attempts} time(s); retry limit exhausted.`);
    this.attempts = attempts;
  }
}

export function createTaskCapsule(projectRoot: string, title: string, options: CreateTaskCapsuleOptions = {}): TaskCapsule {
  const tasksDir = path.join(projectRoot, 'tasks');
  const slug = slugify(title);
  ensureDir(tasksDir);
  const maxCreateRetries = Math.max(1, options.maxCreateRetries ?? 5);
  const blockedIds = new Set<string>();

  for (let attempt = 1; attempt <= maxCreateRetries; attempt += 1) {
    const id = nextTaskId(tasksDir, blockedIds);
    const dir = path.join(tasksDir, `${id}-${slug}`);
    const task: TaskCapsule = { id, title, slug, dir };

    if (taskBoardContainsId(projectRoot, id)) {
      blockedIds.add(id);
      continue;
    }

    options.onBeforeCreateAttempt?.({ id, dir, attempt });
    try {
      fs.mkdirSync(dir);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
        blockedIds.add(id);
        continue;
      }
      throw error;
    }

    for (const [fileName, factory] of Object.entries(TASK_FILES)) {
      writeFileIfMissing(path.join(dir, fileName), factory(task));
    }
    const template = getTaskTemplate(options.templateId);
    if (template) {
      for (const [fileName, factory] of Object.entries(template.files)) {
        if (factory) fs.writeFileSync(path.join(dir, fileName), factory(task), 'utf8');
      }
    }

    appendTaskBoardRow(projectRoot, task);
    return task;
  }

  throw new TaskCapsuleCreateCollisionError(maxCreateRetries);
}

function appendTaskBoardRow(projectRoot: string, task: TaskCapsule): void {
  const taskBoard = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  ensureDir(path.dirname(taskBoard));
  const line = `| ${task.id} | ${task.title.replace(/\|/g, '/')} | Draft | ${path.relative(projectRoot, task.dir)} | |\n`;
  if (!fs.existsSync(taskBoard)) {
    fs.writeFileSync(taskBoard, `# TASK_BOARD\n\n${managedSectionBlock('task-board', { schema: 'hadara.managedSection.v1', owner: 'task.create', kind: 'markdown-table', mode: 'update-row', version: 1, required: true, closeSourceRole: 'included' }, `| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n${line}`)}\n`, 'utf8');
    return;
  }
  const current = fs.readFileSync(taskBoard, 'utf8');
  if (current.includes(`| ${task.id} |`)) throw new TaskCapsuleCreateCollisionError(1);
  const marker = '<!-- hadara:managed:end task-board -->';
  if (current.includes(marker)) {
    fs.writeFileSync(taskBoard, current.replace(marker, `${line}${marker}`), 'utf8');
    return;
  }
  fs.appendFileSync(taskBoard, line, 'utf8');
}

function taskBoardContainsId(projectRoot: string, id: string): boolean {
  const taskBoard = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  if (!fs.existsSync(taskBoard)) return false;
  return fs.readFileSync(taskBoard, 'utf8').includes(`| ${id} |`);
}

export function listTaskCapsules(projectRoot: string): TaskCapsule[] {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return [];

  return fs
    .readdirSync(tasksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^T-\d{4}-/.test(entry.name))
    .map((entry) => {
      const [id, ...slugParts] = entry.name.split('-');
      const number = slugParts.shift();
      const fullId = `${id}-${number}`;
      const slug = slugParts.join('-');
      const dir = path.join(tasksDir, entry.name);
      const taskMd = path.join(dir, 'TASK.md');
      const title = fs.existsSync(taskMd)
        ? fs.readFileSync(taskMd, 'utf8').split('\n')[0].replace(/^#\s*T-\d{4}\s*/, '').trim()
        : slug;
      return { id: fullId, title, slug, dir };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function findTaskCapsule(projectRoot: string, taskId: string): TaskCapsule | undefined {
  if (!/^T-\d{4}$/.test(taskId)) return undefined;
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return undefined;

  const entry = fs
    .readdirSync(tasksDir, { withFileTypes: true })
    .find((candidate) => candidate.isDirectory() && candidate.name.startsWith(`${taskId}-`));
  if (!entry) return undefined;

  const slug = entry.name.slice(`${taskId}-`.length);
  const dir = path.join(tasksDir, entry.name);
  return {
    id: taskId,
    title: readTaskCapsuleTitle(dir, taskId, slug),
    slug,
    dir
  };
}

function readTaskCapsuleTitle(dir: string, taskId: string, fallback: string): string {
  const taskMd = path.join(dir, 'TASK.md');
  if (!fs.existsSync(taskMd)) return fallback;
  const firstLine = fs.readFileSync(taskMd, 'utf8').split('\n')[0] ?? '';
  const title = firstLine.replace(new RegExp(`^#\\s*${taskId}\\s*`), '').trim();
  return title || fallback;
}

function isPlaceholderSection(value: string): boolean {
  const normalized = value.trim();
  if (normalized.length === 0 || /^TBD\.?$/i.test(normalized)) return true;
  return /\|\s*TBD\s*\|/i.test(normalized);
}

function normalizeMarkdown(value: string): string {
  return value.replace(/\r\n/g, '\n').trim();
}

function acceptanceChecklistText(content: string): string[] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^-\s+\[[ xX]\]/.test(line))
    .map((line) => line.replace(/^-\s+\[[ xX]\]\s*/, '').trim());
}

function acceptanceTableCriteria(content: string): string[] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\|\s*AC-\d+\s*\|/.test(line))
    .map((line) =>
      line
        .slice(1, line.endsWith('|') ? -1 : undefined)
        .split('|')
        .map((cell) => cell.trim())
    )
    .map((cells) => cells[1] ?? '')
    .filter(Boolean);
}
