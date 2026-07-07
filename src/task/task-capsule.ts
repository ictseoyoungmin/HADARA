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
  'TASK.md': (task) => `# ${task.id} ${task.title}\n\n## Identity\n\n| Field | Value |\n|---|---|\n| ID | ${task.id} |\n| Title | ${task.title.replace(/\|/g, '/')} |\n| Status | Draft |\n| Created | ${new Date().toISOString().slice(0, 10)} |\n| Updated | ${new Date().toISOString().slice(0, 10)} |\n\nSchema hint: use \`hadara schema --json\` or \`hadara schema --domain <domain-id> --json\` for controlled values before replacing scaffold tokens.\n\n## Goal\n\n| Goal | Notes |\n|---|---|\n| TBD | Replace with the smallest verifiable outcome. |\n\n## Scope\n\n| Boundary | Items |\n|---|---|\n| In | TBD |\n| Out | TBD |\n\n## Plan\n\n| Step | Action | Status |\n|---|---|---|\n| 1 | Define the task contract. | Pending |\n| 2 | Implement the smallest useful slice. | Pending |\n| 3 | Validate and record evidence. | Pending |\n\n## Acceptance\n\n| ID | Criterion | State | Evidence | Reference |\n|---|---|---|---|---|\n| AC-1 | Scope is implemented. | Pending | TBD | TBD |\n| AC-2 | Validation evidence is recorded. | Pending | TBD | TBD |\n\n## Validation\n\n| Check | Gate | Result | Evidence |\n|---|---|---|---|\n| TBD | Yes | Not Run | TBD |\n\n## Inputs / Constraints\n\n| Source | Role | State | Notes |\n|---|---|---|---|\n| TBD | reference | active | TBD |\n\n## Changes\n\n| Area | Summary |\n|---|---|\n| N/A | TBD |\n\n## Risks / Follow-ups\n\n| ID | Type | Summary | State | Link |\n|---|---|---|---|---|\n| RF-1 | Follow-up | TBD | Open | TBD |\n\n## History\n\n| Date | State | Note |\n|---|---|---|\n| ${new Date().toISOString().slice(0, 10)} | Draft | Initial task scaffold. |\n`,
  'HANDOFF.md': () => `# Handoff\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| TBD | TBD |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| TBD | TBD | TBD |\n\n## Carry Forward Warnings\n\n| Warning | Impact | Mitigation |\n|---|---|---|\n`,
  'EVIDENCE.md': () => `# EVIDENCE\n\nThis file is a human-readable projection from \`evidence.jsonl\`.\n\nDo not hand-edit this file.\n\n## Validation Evidence\n\n<!-- hadara:slot evidence.validation-summary -->\n| Evidence ID | Outcome | Category | Summary |\n|---|---|---|---|\n<!-- /hadara:slot -->\n\n## Close Proof\n\n<!-- hadara:slot evidence.close-proof -->\n| Check | Result | Evidence |\n|---|---|---|\n<!-- /hadara:slot -->\n\n## Failed / Blocked / Residual Evidence\n\n<!-- hadara:slot evidence.residuals -->\n| Evidence ID | Outcome | Summary | Disposition | Reference |\n|---|---|---|---|---|\n<!-- /hadara:slot -->\n`,
  'evidence.jsonl': () => '',
};

export function isTaskCapsuleScaffoldContent(task: TaskCapsule, fileName: string, content: string): boolean {
  if (fileName === 'TASK.md') {
    return ['## Goal', '## Scope', '## Plan', '## Acceptance', '## Validation', '## Inputs / Constraints', '## Changes', '## Risks / Follow-ups'].some((heading) =>
      isPlaceholderSection(readMarkdownSection(content, heading))
    );
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
  const max = Math.max(maxTaskDirectoryNumber(tasksDir), maxTaskBoardNumber(path.dirname(tasksDir)));

  let next = max + 1;
  let id = `T-${String(next).padStart(4, '0')}`;
  while (blockedIds.has(id)) {
    next += 1;
    id = `T-${String(next).padStart(4, '0')}`;
  }
  return id;
}

function maxTaskDirectoryNumber(tasksDir: string): number {
  return fs
    .readdirSync(tasksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name.match(/^T-(\d{4})-/)?.[1])
    .filter((value): value is string => Boolean(value))
    .map(Number)
    .reduce((acc, value) => Math.max(acc, value), 0);
}

function maxTaskBoardNumber(projectRoot: string): number {
  const taskBoard = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  if (!fs.existsSync(taskBoard)) return 0;
  return [...fs.readFileSync(taskBoard, 'utf8').matchAll(/^\|\s*T-(\d{4})\s*\|/gm)]
    .map((match) => Number(match[1]))
    .reduce((acc, value) => Math.max(acc, value), 0);
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
        if (!TASK_FILES[fileName]) continue;
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
    .filter((entry) => {
      if (!entry.isDirectory() || !/^T-\d{4}-/.test(entry.name)) return false;
      return fs.existsSync(path.join(tasksDir, entry.name, 'TASK.md'));
    })
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
    .find((candidate) =>
      candidate.isDirectory() &&
      candidate.name.startsWith(`${taskId}-`) &&
      fs.existsSync(path.join(tasksDir, candidate.name, 'TASK.md'))
    );
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
