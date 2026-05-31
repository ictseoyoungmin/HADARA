import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
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
  };
  actions: TaskUpgradeScaffoldAction[];
  issues: TaskUpgradeScaffoldIssue[];
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
    { id: 'metadata', marker: '## Metadata', block: (task) => readCanonicalSection(task, 'TASK.md', '## Metadata') },
    { id: 'goal', marker: '| Goal | Notes |', ambiguous: /^\|\s*Goal\s*\|/im, block: (task) => readCanonicalSection(task, 'TASK.md', '## Goal') },
    { id: 'scope', marker: '| In Scope | Reason |', ambiguous: /^\|\s*In Scope\s*\|/im, block: (task) => readCanonicalSection(task, 'TASK.md', '## Scope') },
    { id: 'out-of-scope', marker: '| Out of Scope | Reason |', ambiguous: /^\|\s*Out of Scope\s*\|/im, block: (task) => readCanonicalSection(task, 'TASK.md', '## Out of Scope') },
    { id: 'status-history', marker: '| Time | Status | Reason | Evidence |', ambiguous: /^\|\s*Time\s*\|\s*Status\s*\|/im, block: (task) => readCanonicalSection(task, 'TASK.md', '## Status History') }
  ],
  'PLAN.md': [
    {
      id: 'plan-table',
      marker: '| Step | Action | Status | Evidence |',
      ambiguous: /^\|\s*Step\s*\|\s*Action\s*\|/im,
      block: () => '| Step | Action | Status | Evidence |\n|---|---|---|---|\n'
    }
  ],
  'CONTEXT.md': [
    { id: 'required-reading', marker: '| Document | Why It Matters | Read Status |', ambiguous: /^\|\s*Document\s*\|/im, block: (task) => readCanonicalSection(task, 'CONTEXT.md', '## Required Reading Used') },
    { id: 'assumptions', marker: '| Assumption | Source | Risk If Wrong |', ambiguous: /^\|\s*Assumption\s*\|/im, block: (task) => readCanonicalSection(task, 'CONTEXT.md', '## Assumptions') },
    { id: 'constraints', marker: '| Constraint | Source | Notes |', ambiguous: /^\|\s*Constraint\s*\|/im, block: (task) => readCanonicalSection(task, 'CONTEXT.md', '## Constraints') }
  ],
  'FILES.md': [
    {
      id: 'files-table',
      marker: '| Path | Action | Reason | Status |',
      ambiguous: /^\|\s*Path\s*\|\s*Action\s*\|\s*Reason\s*\|/im,
      block: () => '| Path | Action | Reason | Status |\n|---|---|---|---|\n'
    }
  ],
  'ACCEPTANCE.md': [
    {
      id: 'acceptance-table',
      marker: '| ID | Criterion | Status | Evidence |',
      ambiguous: /^\|\s*ID\s*\|\s*Criterion\s*\|/im,
      block: (task) => readCanonicalSection(task, 'ACCEPTANCE.md', '# Acceptance Criteria')
    }
  ],
  'TESTS.md': [
    { id: 'routine-checks', marker: '| Command | Purpose | Required For Done | Latest Result | Evidence |', ambiguous: /^\|\s*Command\s*\|\s*Purpose\s*\|/im, block: (task) => readCanonicalSection(task, 'TESTS.md', '## Routine Checks') },
    { id: 'special-checks', marker: '| Check | Required? | Reason | Latest Result | Evidence |', ambiguous: /^\|\s*Check\s*\|\s*Required\?\s*\|/im, block: (task) => readCanonicalSection(task, 'TESTS.md', '## Special Checks') }
  ],
  'RISKS.md': [
    {
      id: 'risks-table',
      marker: '| Risk | Impact | Likelihood | Mitigation | Status |',
      ambiguous: /^\|\s*Risk\s*\|\s*(Impact\s*\|)?\s*Likelihood\s*\|/im,
      block: () => '| Risk | Impact | Likelihood | Mitigation | Status |\n|---|---|---|---|---|\n'
    }
  ],
  'DECISIONS.md': [
    {
      id: 'decisions-table',
      marker: '| ID | Decision | Status | Rationale | Evidence |',
      ambiguous: /^\|\s*ID\s*\|\s*Decision\s*\|/im,
      block: () => '| ID | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|\n'
    }
  ],
  'EVIDENCE.md': [
    {
      id: 'evidence-table',
      marker: '| Time | Kind | Summary | Result | Visibility | JSONL |',
      ambiguous: /^\|\s*Time\s*\|\s*Kind\s*\|/im,
      block: () => '| Time | Kind | Summary | Result | Visibility | JSONL |\n|---|---|---|---|---|---|\n'
    }
  ],
  'HANDOFF.md': [
    { id: 'current-state', marker: '| Field | Value |', ambiguous: /^\|\s*Field\s*\|\s*Value\s*\|/im, block: (task) => readCanonicalSection(task, 'HANDOFF.md', '## Current State') },
    { id: 'last-completed', marker: '| Item | Evidence |', ambiguous: /^\|\s*Item\s*\|\s*Evidence\s*\|/im, block: (task) => readCanonicalSection(task, 'HANDOFF.md', '## Last Completed') },
    { id: 'next-step', marker: '| Step | Reason | Required Reading |', ambiguous: /^\|\s*Step\s*\|\s*Reason\s*\|/im, block: (task) => readCanonicalSection(task, 'HANDOFF.md', '## Next Recommended Step') },
    { id: 'warnings', marker: '| Warning | Impact | Mitigation |', ambiguous: /^\|\s*Warning\s*\|\s*Impact\s*\|/im, block: (task) => readCanonicalSection(task, 'HANDOFF.md', '## Carry Forward Warnings') }
  ]
};

export function createTaskUpgradeScaffoldReport(projectRoot: string, taskId: string, mode: TaskUpgradeScaffoldMode): TaskUpgradeScaffoldReport {
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
      skipped: actions.filter((action) => action.status === 'skipped').length
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
  const start = content.indexOf(heading);
  if (start < 0) return content;
  const afterHeading = content.slice(start + heading.length);
  const nextHeading = afterHeading.search(/\n##\s+/);
  return `${heading}${nextHeading >= 0 ? afterHeading.slice(0, nextHeading) : afterHeading}`.trimEnd();
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
