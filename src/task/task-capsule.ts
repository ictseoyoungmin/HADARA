import fs from 'node:fs';
import path from 'node:path';
import { ensureDir, slugify, writeFileIfMissing } from '../core/fs';
import { formatLocalDate, formatLocalMinuteTimestamp } from '../core/local-time';
import { startMonotonicTimer } from '../core/timing';
import { managedSectionBlock, parseManagedSections } from '../services/managed-sections';
import { readMarkdownSection } from '../services/markdown-table';
import { getTaskTemplate } from './task-templates';

export interface TaskCapsule {
  id: string;
  title: string;
  slug: string;
  dir: string;
}

function taskTitleForTable(task: TaskCapsule): string {
  return task.title.replace(/\|/g, '/');
}

export const TASK_FILES: Record<string, (task: TaskCapsule) => string> = {
  'TASK.md': (task) => {
    const timestamp = formatLocalMinuteTimestamp();
    return `# ${task.id} ${task.title}\n\n## Identity\n\n| Field | Value |\n|---|---|\n| ID | ${task.id} |\n| Title | ${taskTitleForTable(task)} |\n| Status | Draft |\n| Created | ${timestamp} |\n| Updated | ${timestamp} |\n\nSchema hint: use \`hadara schema --json\` or \`hadara schema --domain <domain-id> --json\` for controlled values before replacing scaffold tokens.\n\nLifecycle note: do not hand-edit Identity \`Status\` or \`docs/TASK_BOARD.md\` Status to close work. Keep the task prose current, then run \`hadara task finalize --task ${task.id} --execute --auto --json\`.\n\n## Goal\n\n| Goal | Notes |\n|---|---|\n| TBD | Replace with the smallest verifiable outcome. |\n\n## Scope\n\n| Boundary | Items |\n|---|---|\n| In | TBD |\n| Out | TBD |\n\n## Plan\n\n| Step | Action | Status |\n|---|---|---|\n| 1 | Define the task contract. | Pending |\n| 2 | Implement the smallest useful slice. | Pending |\n| 3 | Validate and record evidence. | Pending |\n\n## Acceptance\n\n| ID | Criterion | State | Evidence | Reference |\n|---|---|---|---|---|\n| AC-1 | Scope is implemented. | Pending | TBD | TBD |\n| AC-2 | Validation evidence is recorded. | Pending | TBD | TBD |\n\n## Validation\n\n| Check | Gate | Result | Evidence |\n|---|---|---|---|\n| TBD | Yes | Not Run | TBD |\n\n## Inputs / Constraints\n\n| Source | Role | State | Notes |\n|---|---|---|---|\n| TBD | reference | active | TBD |\n\n## Changes\n\n| Area | Summary |\n|---|---|\n| N/A | TBD |\n\n## Risks / Follow-ups\n\n| ID | Type | Summary | State | Link |\n|---|---|---|---|---|\n| RF-1 | Follow-up | TBD | Open | TBD |\n\n## History\n\n| Date | State | Note |\n|---|---|---|\n| ${formatLocalDate()} | Draft | Initial task scaffold. |\n`;
  },
  'HANDOFF.md': (task) => {
    const timestamp = formatLocalMinuteTimestamp();
    return `# Handoff\n\n## Identity\n\n| Field | Value |\n|---|---|\n| ID | ${task.id} |\n| Title | ${taskTitleForTable(task)} |\n| Status | Draft |\n| Created | ${timestamp} |\n| Updated | ${timestamp} |\n\n## Last Completed\n\n| Item | Evidence |\n|---|---|\n| TBD | TBD |\n\n## Next Recommended Step\n\n| Step | Reason | Required Reading |\n|---|---|---|\n| TBD | TBD | TBD |\n\n## Carry Forward Warnings\n\n| Warning | Impact | Mitigation |\n|---|---|---|\n`;
  },
  'EVIDENCE.md': () => `# EVIDENCE\n\nThis file is a human-readable projection from \`evidence.jsonl\`.\n\nDo not hand-edit this file.\n\n## Validation Evidence\n\n<!-- hadara:slot evidence.validation-summary -->\n| Evidence ID | Outcome | Category | Summary |\n|---|---|---|---|\n<!-- /hadara:slot -->\n\n## Close Proof\n\n<!-- hadara:slot evidence.close-proof -->\n| Check | Result | Evidence |\n|---|---|---|\n<!-- /hadara:slot -->\n\n## Failed / Blocked / Residual Evidence\n\n<!-- hadara:slot evidence.residuals -->\n| Evidence ID | Outcome | Summary | Disposition | Reference |\n|---|---|---|---|---|\n<!-- /hadara:slot -->\n`,
  'evidence.jsonl': () => '',
};

export function isTaskCapsuleScaffoldContent(task: TaskCapsule, fileName: string, content: string): boolean {
  if (fileName === 'TASK.md') {
    return ['## Goal', '## Scope', '## Plan', '## Acceptance', '## Validation', '## Inputs / Constraints', '## Changes', '## Risks / Follow-ups'].some((heading) => {
      const section = readMarkdownSection(content, heading);
      if (heading === '## Validation') return isPlaceholderValidationSection(section);
      return isPlaceholderSection(section);
    });
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
  lock?: boolean;
  lockTimeoutMs?: number;
}

export class TaskCapsuleCreateCollisionError extends Error {
  readonly code = 'TASK_CREATE_COLLISION_RETRIES_EXHAUSTED';
  readonly attempts: number;

  constructor(attempts: number) {
    super(`Task Capsule creation collided ${attempts} time(s); retry limit exhausted.`);
    this.attempts = attempts;
  }
}

export class TaskCapsuleCreateLockError extends Error {
  readonly code = 'TASK_CREATE_LOCK_TIMEOUT';

  constructor(message: string) {
    super(message);
    this.name = 'TaskCapsuleCreateLockError';
  }
}

export class TaskBoardManagedSectionError extends Error {
  readonly code = 'TASK_BOARD_MANAGED_SECTION_INVALID';

  constructor(message: string) {
    super(message);
    this.name = 'TaskBoardManagedSectionError';
  }
}

export function createTaskCapsule(projectRoot: string, title: string, options: CreateTaskCapsuleOptions = {}): TaskCapsule {
  if (options.lock !== false) {
    return withTaskCreateProjectLock(projectRoot, () => createTaskCapsule(projectRoot, title, { ...options, lock: false }), { timeoutMs: options.lockTimeoutMs });
  }

  const tasksDir = path.join(projectRoot, 'tasks');
  const slug = slugify(title);
  ensureDir(tasksDir);
  assertTaskBoardWritable(projectRoot);
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

export function withTaskCreateProjectLock<T>(projectRoot: string, fn: () => T, options: { timeoutMs?: number } = {}): T {
  const lockRoot = path.join(projectRoot, '.hadara', 'local', 'locks');
  ensureDir(lockRoot);
  const lockDir = path.join(lockRoot, 'task-create.lock');
  const lockPortablePath = path.relative(projectRoot, lockDir).split(path.sep).join('/');
  const timer = startMonotonicTimer();
  const timeoutMs = options.timeoutMs ?? 5000;

  while (true) {
    try {
      fs.mkdirSync(lockDir);
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      if (timer.elapsedMs() >= timeoutMs) {
        throw new TaskCapsuleCreateLockError(
          `Timed out waiting for the project task-create lock. Lock directory: ${lockPortablePath}. ` +
            `If no HADARA process is creating a task, inspect ${lockPortablePath}/lock.json and remove the stale lock directory before retrying.`
        );
      }
      sleepSync(25);
    }
  }

  try {
    writeTaskCreateLockMetadata(lockDir);
    return fn();
  } finally {
    fs.rmSync(lockDir, { recursive: true, force: true });
  }
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
  const managed = validateTaskBoardWriteMode(current);
  if (managed.mode === 'managed') {
    const marker = '<!-- hadara:managed:end task-board -->';
    fs.writeFileSync(taskBoard, current.replace(marker, `${line}${marker}`), 'utf8');
    return;
  }
  fs.writeFileSync(taskBoard, `${current.replace(/\s*$/, '\n')}${line}`, 'utf8');
}

function assertTaskBoardWritable(projectRoot: string): void {
  const taskBoard = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  if (!fs.existsSync(taskBoard)) return;
  validateTaskBoardWriteMode(fs.readFileSync(taskBoard, 'utf8'));
}

function taskBoardContainsId(projectRoot: string, id: string): boolean {
  const taskBoard = path.join(projectRoot, 'docs', 'TASK_BOARD.md');
  if (!fs.existsSync(taskBoard)) return false;
  return fs.readFileSync(taskBoard, 'utf8').includes(`| ${id} |`);
}

function validateTaskBoardWriteMode(content: string): { mode: 'managed' | 'legacy-table' } {
  const parsed = parseManagedSections(content, 'docs/TASK_BOARD.md');
  const error = parsed.issues.find((issue) => issue.severity === 'error');
  if (error) {
    throw new TaskBoardManagedSectionError(error.message);
  }
  const taskBoardSections = parsed.sections.filter((section) => section.id === 'task-board');
  if (taskBoardSections.length === 1) {
    return { mode: 'managed' };
  }
  if (taskBoardSections.length > 1) {
    throw new TaskBoardManagedSectionError(`docs/TASK_BOARD.md must contain exactly one managed task-board section; found ${taskBoardSections.length}.`);
  }
  if (!hasCanonicalTaskBoardTable(content)) {
    throw new TaskBoardManagedSectionError('docs/TASK_BOARD.md is missing the canonical task table frame; refusing task create append.');
  }
  return { mode: 'legacy-table' };
}

function hasCanonicalTaskBoardTable(content: string): boolean {
  return /\|\s*ID\s*\|\s*Title\s*\|\s*Status\s*\|\s*Capsule\s*\|\s*Notes\s*\|/.test(content) && /\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|\s*---\s*\|/.test(content);
}

function writeTaskCreateLockMetadata(lockDir: string): void {
  try {
    fs.writeFileSync(
      path.join(lockDir, 'lock.json'),
      `${JSON.stringify({ pid: process.pid, command: 'task.create', createdAt: new Date().toISOString() })}\n`,
      'utf8'
    );
  } catch {
    // Directory ownership is the lock; metadata is best-effort diagnostics.
  }
}

function sleepSync(ms: number): void {
  const signal = new Int32Array(new SharedArrayBuffer(4));
  Atomics.wait(signal, 0, 0, ms);
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

function isPlaceholderValidationSection(value: string): boolean {
  const normalized = value.trim();
  if (normalized.length === 0 || /^TBD\.?$/i.test(normalized)) return true;
  const dataRows = normalized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && !/^\|\s*-+/.test(line) && !/^\|\s*Check\s*\|/i.test(line))
    .filter((line) => !isFinalizePreCloseValidationRow(line));
  if (dataRows.length === 0) return false;
  return dataRows.some((line) => /\|\s*TBD\s*\|/i.test(line));
}

function isFinalizePreCloseValidationRow(line: string): boolean {
  const cells = line
    .slice(1, line.endsWith('|') ? -1 : undefined)
    .split('|')
    .map((cell) => cell.trim().replace(/^`|`$/g, ''));
  const check = cells[0] ?? '';
  const result = cells.length >= 4 ? cells[cells.length - 2] : '';
  const evidence = cells.length >= 4 ? cells[cells.length - 1] : '';
  return /\bhadara\s+task\s+finalize\b/.test(check) && /^Not Run$/i.test(result) && /^TBD$/i.test(evidence);
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
