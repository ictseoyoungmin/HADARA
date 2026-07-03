import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { readMarkdownSectionWithHeading } from '../services/markdown-table';
import { TASK_FILES, listTaskCapsules, TaskCapsule } from './task-capsule';

export type TaskUpgradeScaffoldMode = 'dry-run' | 'execute';

export interface TaskUpgradeScaffoldReport {
  schemaVersion: 'hadara.task.upgrade_scaffold.v1';
  command: 'task.upgrade-scaffold';
  ok: boolean;
  mode: TaskUpgradeScaffoldMode;
  projectRoot: string;
  taskId: string;
  summary: {
    planned: number;
    changed: number;
    skipped: number;
    beforeHash: string | null;
  };
  actions: TaskUpgradeScaffoldAction[];
  issues: TaskUpgradeScaffoldIssue[];
}

export interface TaskUpgradeScaffoldOptions {
  beforeHash?: string;
}

export interface TaskUpgradeScaffoldAction {
  id: string;
  path: string;
  status: 'planned' | 'created' | 'updated' | 'skipped';
  summary: string;
  before?: string;
  after?: string;
  expectedBeforeExists?: boolean;
  expectedBeforeHash?: string;
  afterHash?: string;
}

export interface TaskUpgradeScaffoldIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
}

interface FrameBlock {
  id: string;
  marker: string;
  ambiguous?: RegExp;
  block: (task: TaskCapsule) => string;
}

const FRAME_BLOCKS: Record<string, FrameBlock[]> = {
  'TASK.md': [
    { id: 'goal', marker: '| Goal | Notes |', ambiguous: /^\|\s*Goal\s*\|/im, block: (task) => readCanonicalSection(task, 'TASK.md', '## Goal') },
    { id: 'scope', marker: '| Boundary | Items |', ambiguous: /^\|\s*Boundary\s*\|\s*Items\s*\|/im, block: (task) => readCanonicalSection(task, 'TASK.md', '## Scope') },
    { id: 'plan', marker: '| Step | Action | Status | Evidence |', ambiguous: /^\|\s*Step\s*\|\s*Action\s*\|/im, block: (task) => readCanonicalSection(task, 'TASK.md', '## Plan') },
    { id: 'acceptance', marker: '| ID | Criterion | Decision | State | Evidence | Reference |', ambiguous: /^\|\s*ID\s*\|\s*Criterion\s*\|/im, block: (task) => readCanonicalSection(task, 'TASK.md', '## Acceptance') },
    { id: 'validation', marker: '| Check | Gate | Result | Evidence |', ambiguous: /^\|\s*Check\s*\|(?:\s*Gate\s*\||\s*Command\s*\/\s*Method\s*\|)/im, block: (task) => readCanonicalSection(task, 'TASK.md', '## Validation') },
    { id: 'inputs-constraints', marker: '| Path / Source | Type | Authority | State | Notes | Hash |', ambiguous: /^\|\s*(?:Path\s*\/\s*Source|Path)\s*\|/im, block: (task) => readCanonicalSection(task, 'TASK.md', '## Inputs / Constraints') },
    { id: 'changes', marker: '| Area | Summary | Evidence |', ambiguous: /^\|\s*(?:Area|Path)\s*\|(?:\s*Summary\s*\||\s*Area\s*\||\s*Lines\s*\|)/im, block: (task) => readCanonicalSection(task, 'TASK.md', '## Changes') },
    { id: 'risks-followups', marker: '| ID | Type | Summary | State | Link |', ambiguous: /^\|\s*ID\s*\|(?:\s*Type\s*\||\s*Kind\s*\|)\s*Summary\s*\|/im, block: (task) => readCanonicalSection(task, 'TASK.md', '## Risks / Follow-ups') }
  ],
  'EVIDENCE.md': [
    { id: 'validation-summary-slot', marker: '<!-- hadara:slot evidence.validation-summary -->', block: (task) => readCanonicalSection(task, 'EVIDENCE.md', '## Validation Evidence') },
    { id: 'close-proof-slot', marker: '<!-- hadara:slot evidence.close-proof -->', block: (task) => readCanonicalSection(task, 'EVIDENCE.md', '## Close Proof') },
    { id: 'residuals-slot', marker: '<!-- hadara:slot evidence.residuals -->', block: (task) => readCanonicalSection(task, 'EVIDENCE.md', '## Failed / Blocked / Residual Evidence') }
  ],
  'HANDOFF.md': [
    { id: 'last-completed', marker: '| Item | Evidence |', ambiguous: /^\|\s*Item\s*\|\s*Evidence\s*\|/im, block: (task) => readCanonicalSection(task, 'HANDOFF.md', '## Last Completed') },
    { id: 'next-step', marker: '| Step | Reason | Required Reading |', ambiguous: /^\|\s*Step\s*\|\s*Reason\s*\|/im, block: (task) => readCanonicalSection(task, 'HANDOFF.md', '## Next Recommended Step') },
    { id: 'warnings', marker: '| Warning | Impact | Mitigation |', ambiguous: /^\|\s*Warning\s*\|\s*Impact\s*\|/im, block: (task) => readCanonicalSection(task, 'HANDOFF.md', '## Carry Forward Warnings') }
  ]
};

export function createTaskUpgradeScaffoldReport(projectRoot: string, taskId: string, mode: TaskUpgradeScaffoldMode, options: TaskUpgradeScaffoldOptions = {}): TaskUpgradeScaffoldReport {
  const actions: TaskUpgradeScaffoldAction[] = [];
  const issues: TaskUpgradeScaffoldIssue[] = [];
  const task = listTaskCapsules(projectRoot).find((candidate) => candidate.id === taskId);

  if (!task) {
    issues.push({ severity: 'error', code: 'TASK_NOT_FOUND', message: `Task Capsule not found: ${taskId}` });
  } else {
    for (const fileName of Object.keys(TASK_FILES)) {
      planFileUpgrade(projectRoot, task, fileName, mode, actions, issues);
    }
  }

  const beforeHash = createPlanHash(actions);
  if (mode === 'execute' && beforeHash) validateBeforeHash(options.beforeHash, beforeHash, issues);

  if (mode === 'execute' && issues.every((issue) => issue.severity !== 'error')) {
    applyActions(projectRoot, actions, issues);
  }

  return {
    schemaVersion: 'hadara.task.upgrade_scaffold.v1',
    command: 'task.upgrade-scaffold',
    ok: issues.every((issue) => issue.severity !== 'error'),
    mode,
    projectRoot,
    taskId,
    summary: {
      planned: actions.filter((action) => action.status === 'planned').length,
      changed: actions.filter((action) => action.status === 'created' || action.status === 'updated').length,
      skipped: actions.filter((action) => action.status === 'skipped').length,
      beforeHash
    },
    actions,
    issues
  };
}

export function formatTaskUpgradeScaffoldReport(report: TaskUpgradeScaffoldReport): string {
  const lines = [`[HADARA] task upgrade-scaffold ${report.taskId}: ${report.ok ? 'ok' : 'issues'}`];
  for (const action of report.actions) lines.push(`${action.status.toUpperCase()}\t${action.path}\t${action.summary}`);
  for (const issue of report.issues) lines.push(`${issue.severity.toUpperCase()}\t${issue.code}\t${issue.path ?? ''}\t${issue.message}`);
  return lines.join('\n');
}

function planFileUpgrade(
  projectRoot: string,
  task: TaskCapsule,
  fileName: string,
  mode: TaskUpgradeScaffoldMode,
  actions: TaskUpgradeScaffoldAction[],
  issues: TaskUpgradeScaffoldIssue[]
): void {
  const relativePath = toPortablePath(path.relative(projectRoot, path.join(task.dir, fileName)));
  const absolutePath = path.join(task.dir, fileName);
  const existsAtPlan = fs.existsSync(absolutePath);
  const current = existsAtPlan ? fs.readFileSync(absolutePath, 'utf8') : '';
  const canonical = TASK_FILES[fileName](task);

  if (!existsAtPlan) {
    actions.push(createAction(fileName, relativePath, current, canonical, existsAtPlan, `${mode === 'execute' ? 'Create' : 'Would create'} missing Task Capsule scaffold file.`));
    return;
  }

  if (fileName === 'evidence.jsonl') {
    actions.push({ id: 'evidence-jsonl', path: relativePath, status: 'skipped', summary: `${relativePath} already exists.` });
    return;
  }

  const blocks = FRAME_BLOCKS[fileName] ?? [];
  const missingBlocks: string[] = [];
  for (const block of blocks) {
    if (current.includes(block.marker)) continue;
    if (block.ambiguous?.test(current)) {
      issues.push({
        severity: 'warning',
        code: 'TASK_UPGRADE_SCAFFOLD_AMBIGUOUS_FRAME',
        message: `${relativePath} appears to contain a non-canonical ${block.id} frame; refusing to insert a duplicate semantic table.`,
        path: relativePath
      });
      actions.push({ id: `${fileName}:${block.id}`, path: relativePath, status: 'skipped', summary: `${relativePath} has an ambiguous ${block.id} frame.` });
      continue;
    }
    missingBlocks.push(block.block(task).trimEnd());
  }

  if (missingBlocks.length === 0) {
    actions.push({ id: fileName, path: relativePath, status: 'skipped', summary: `${relativePath} already contains v2 scaffold frames.` });
    return;
  }

  const after = `${ensureTrailingNewline(current)}\n<!-- HADARA v2 scaffold frames inserted by task upgrade-scaffold -->\n\n${missingBlocks.join('\n\n')}\n`;
  actions.push(createAction(fileName, relativePath, current, after, existsAtPlan, `${mode === 'execute' ? 'Insert' : 'Would insert'} missing v2 scaffold frame sections without deleting existing content.`));
}

function createAction(
  id: string,
  relativePath: string,
  before: string,
  after: string,
  expectedBeforeExists: boolean,
  summary: string
): TaskUpgradeScaffoldAction {
  return {
    id,
    path: relativePath,
    status: 'planned',
    summary,
    before,
    after,
    expectedBeforeExists,
    expectedBeforeHash: hashContent(before),
    afterHash: hashContent(after)
  };
}

function createPlanHash(actions: TaskUpgradeScaffoldAction[]): string | null {
  const planned = actions
    .filter((action) => action.status === 'planned')
    .map((action) => ({
      id: action.id,
      path: action.path,
      expectedBeforeExists: action.expectedBeforeExists ?? null,
      expectedBeforeHash: action.expectedBeforeHash ?? null,
      afterHash: action.afterHash ?? null
    }));
  if (planned.length === 0) return null;
  return hashContent(JSON.stringify(planned));
}

function validateBeforeHash(beforeHash: string | undefined, expected: string, issues: TaskUpgradeScaffoldIssue[]): void {
  if (!beforeHash) {
    issues.push({
      severity: 'error',
      code: 'TASK_UPGRADE_SCAFFOLD_BEFORE_HASH_REQUIRED',
      message: `Execute mode requires --before-hash ${expected} from a reviewed dry-run report before applying planned writes.`
    });
    return;
  }
  if (beforeHash !== expected) {
    issues.push({
      severity: 'error',
      code: 'TASK_UPGRADE_SCAFFOLD_BEFORE_HASH_MISMATCH',
      message: 'The supplied --before-hash does not match the current scaffold upgrade plan; rerun the dry-run and review the new plan.'
    });
  }
}

function applyActions(projectRoot: string, actions: TaskUpgradeScaffoldAction[], issues: TaskUpgradeScaffoldIssue[]): void {
  const planned = actions.filter((action) => action.status === 'planned');
  const prepared: Array<{ action: TaskUpgradeScaffoldAction; absolutePath: string; tmpPath: string; existed: boolean; original: string }> = [];
  const committed: typeof prepared = [];
  try {
    for (const action of planned) {
      const absolutePath = path.resolve(projectRoot, action.path);
      const relative = path.relative(projectRoot, absolutePath);
      if (relative.startsWith('..') || path.isAbsolute(relative)) {
        issues.push({ severity: 'error', code: 'TASK_UPGRADE_SCAFFOLD_PATH_OUTSIDE_PROJECT', message: `Refusing to write outside project: ${action.path}`, path: action.path });
        action.status = 'skipped';
        continue;
      }
      const existed = fs.existsSync(absolutePath);
      const current = existed ? fs.readFileSync(absolutePath, 'utf8') : '';
      if (action.expectedBeforeExists !== undefined && existed !== action.expectedBeforeExists) {
        issues.push({ severity: 'error', code: 'TASK_UPGRADE_SCAFFOLD_WRITE_CONFLICT', message: `${action.path} existence changed after planning.`, path: action.path });
        action.status = 'skipped';
        continue;
      }
      if (action.expectedBeforeHash && hashContent(current) !== action.expectedBeforeHash) {
        issues.push({ severity: 'error', code: 'TASK_UPGRADE_SCAFFOLD_WRITE_CONFLICT', message: `${action.path} changed after planning.`, path: action.path });
        action.status = 'skipped';
        continue;
      }
      fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
      const tmpPath = path.join(path.dirname(absolutePath), `.hadara-upgrade-scaffold-${process.pid}-${Date.now()}-${prepared.length}-${path.basename(absolutePath)}.tmp`);
      fs.writeFileSync(tmpPath, action.after ?? '', { encoding: 'utf8', flag: 'wx' });
      prepared.push({ action, absolutePath, tmpPath, existed, original: current });
    }
    if (issues.some((issue) => issue.severity === 'error')) {
      for (const item of prepared) if (fs.existsSync(item.tmpPath)) fs.rmSync(item.tmpPath, { force: true });
      return;
    }
    for (const item of prepared) {
      fs.renameSync(item.tmpPath, item.absolutePath);
      committed.push(item);
      item.action.status = item.existed ? 'updated' : 'created';
      item.action.summary = item.existed ? `Updated ${item.action.path} with missing v2 scaffold frames.` : `Created ${item.action.path}.`;
    }
  } catch (error) {
    for (const item of prepared) if (fs.existsSync(item.tmpPath)) fs.rmSync(item.tmpPath, { force: true });
    for (const item of committed.reverse()) {
      try {
        if (item.existed) fs.writeFileSync(item.absolutePath, item.original, 'utf8');
        else if (fs.existsSync(item.absolutePath)) fs.rmSync(item.absolutePath, { force: true });
        item.action.status = 'planned';
      } catch {
        issues.push({ severity: 'warning', code: 'TASK_UPGRADE_SCAFFOLD_ROLLBACK_INCOMPLETE', message: `Rollback failed for ${item.action.path}.`, path: item.action.path });
      }
    }
    issues.push({
      severity: 'error',
      code: 'TASK_UPGRADE_SCAFFOLD_ATOMIC_WRITE_FAILED',
      message: `Atomic scaffold upgrade failed and rollback was attempted. Cause: ${error instanceof Error ? error.message : String(error)}`
    });
  }
}

function readCanonicalSection(task: TaskCapsule, fileName: string, heading: string): string {
  const content = TASK_FILES[fileName](task);
  return readMarkdownSectionWithHeading(content, heading) || content;
}

function ensureTrailingNewline(value: string): string {
  return value.endsWith('\n') ? value : `${value}\n`;
}

function hashContent(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
