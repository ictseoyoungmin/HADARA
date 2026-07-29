import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { listTaskCapsules } from '../task/task-capsule';
import { readMarkdownSection } from './markdown-table';

export interface ManualRemediationInput {
  id: string;
  title: string;
  issueIds?: string[];
  command?: string;
  targetPaths: string[];
  summary: string;
  steps: string[];
  preview?: {
    before?: string;
    after?: string;
  };
}

export type ProtocolRemediationFix = 'task-board-row' | 'decisions-table-frame' | 'evidence-jsonl';
export type ProtocolRemediationMode = 'dry-run' | 'execute';

export interface ProtocolRemediateInput {
  projectRoot: string;
  fix: ProtocolRemediationFix;
  mode: ProtocolRemediationMode;
  taskId?: string;
  profile?: 'basic' | 'standard' | 'governed';
  beforeHash?: string;
}

export interface ProtocolRemediateReport {
  schemaVersion: 'hadara.protocol.remediation.v1';
  command: 'protocol.remediate';
  ok: boolean;
  mode: ProtocolRemediationMode;
  projectRoot: string;
  fix: ProtocolRemediationFix;
  summary: {
    planned: number;
    changed: number;
    skipped: number;
    beforeHash: string | null;
  };
  actions: ProtocolRemediateAction[];
  issues: ProtocolRemediateIssue[];
}

export interface ProtocolRemediateAction {
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

export interface ProtocolRemediateIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
}

export function createProtocolRemediateReport(input: ProtocolRemediateInput): ProtocolRemediateReport {
  const actions: ProtocolRemediateAction[] = [];
  const issues: ProtocolRemediateIssue[] = [];

  switch (input.fix) {
    case 'task-board-row':
      planTaskBoardRow(input, actions, issues);
      break;
    case 'decisions-table-frame':
      planDecisionsTableFrame(input, actions, issues);
      break;
    case 'evidence-jsonl':
      planEvidenceJsonl(input, actions, issues);
      break;
    default:
      issues.push({ severity: 'error', code: 'PROTOCOL_REMEDIATION_FIX_UNSUPPORTED', message: `unsupported protocol remediation fix: ${String(input.fix)}` });
  }

  const beforeHash = createPlanHash(actions);
  if (input.mode === 'execute' && beforeHash) validateBeforeHash(input.beforeHash, beforeHash, issues);

  if (input.mode === 'execute' && issues.every((issue) => issue.severity !== 'error')) {
    applyActions(input.projectRoot, actions, issues);
  }

  return {
    schemaVersion: 'hadara.protocol.remediation.v1',
    command: 'protocol.remediate',
    ok: issues.every((issue) => issue.severity !== 'error'),
    mode: input.mode,
    projectRoot: input.projectRoot,
    fix: input.fix,
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

function createPlanHash(actions: ProtocolRemediateAction[]): string | null {
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

function validateBeforeHash(beforeHash: string | undefined, expected: string, issues: ProtocolRemediateIssue[]): void {
  if (!beforeHash) {
    issues.push({
      severity: 'error',
      code: 'PROTOCOL_REMEDIATION_BEFORE_HASH_REQUIRED',
      message: `Execute mode requires --before-hash ${expected} from a reviewed dry-run report before applying planned writes.`
    });
    return;
  }
  if (beforeHash !== expected) {
    issues.push({
      severity: 'error',
      code: 'PROTOCOL_REMEDIATION_BEFORE_HASH_MISMATCH',
      message: 'The supplied --before-hash does not match the current remediation plan; rerun the dry-run and review the new plan.'
    });
  }
}

function planTaskBoardRow(input: ProtocolRemediateInput, actions: ProtocolRemediateAction[], issues: ProtocolRemediateIssue[]): void {
  const taskId = input.taskId;
  if (!taskId) {
    issues.push({ severity: 'error', code: 'PROTOCOL_REMEDIATION_TASK_REQUIRED', message: '--task is required for task-board-row remediation' });
    return;
  }
  const task = listTaskCapsules(input.projectRoot).find((candidate) => candidate.id === taskId);
  if (!task) {
    issues.push({ severity: 'error', code: 'PROTOCOL_REMEDIATION_TASK_NOT_FOUND', message: `Task Capsule not found: ${taskId}` });
    return;
  }

  const relativePath = 'docs/TASK_BOARD.md';
  const absolutePath = path.join(input.projectRoot, relativePath);
  const existsAtPlan = fs.existsSync(absolutePath);
  const current = readIfExists(absolutePath);
  const taskBoardFrame = '| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|';
  if (current && !current.includes(taskBoardFrame)) {
    issues.push({
      severity: 'warning',
      code: 'TASK_BOARD_TABLE_FRAME_MISSING',
      message: `${relativePath} does not contain the canonical Task Board table frame; refusing to append a bare row. Run a table-frame remediation first.`,
      path: relativePath
    });
    actions.push({ id: 'task-board-row', path: relativePath, status: 'skipped', summary: `${relativePath} is missing the canonical Task Board table frame.` });
    return;
  }
  const row = `| ${task.id} | ${task.title.replace(/\|/g, '/')} | ${readTaskStatus(task.dir)} | ${toPortablePath(path.relative(input.projectRoot, task.dir))} | Remediated by protocol command. |`;
  if (current.includes(`| ${task.id} |`)) {
    actions.push({ id: 'task-board-row', path: relativePath, status: 'skipped', summary: `${relativePath} already contains ${task.id}.` });
    return;
  }
  const after = current
    ? ensureTrailingNewline(current) + row + '\n'
    : `# TASK_BOARD\n\n| ID | Title | Status | Capsule | Notes |\n|---|---|---|---|---|\n${row}\n`;
  actions.push({
    id: 'task-board-row',
    path: relativePath,
    status: 'planned',
    summary: `${input.mode === 'execute' ? 'Add' : 'Would add'} Task Board row for ${task.id}.`,
    before: current,
    after,
    expectedBeforeExists: existsAtPlan,
    expectedBeforeHash: hashContent(current),
    afterHash: hashContent(after)
  });
}

function planDecisionsTableFrame(input: ProtocolRemediateInput, actions: ProtocolRemediateAction[], issues: ProtocolRemediateIssue[]): void {
  const relativePath = 'docs/DECISIONS.md';
  const absolutePath = path.join(input.projectRoot, relativePath);
  const existsAtPlan = fs.existsSync(absolutePath);
  const current = readIfExists(absolutePath);
  const frame = '| ID | Date | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|---|\n';
  if (current.includes('| ID | Date | Decision | Status | Rationale | Evidence |')) {
    actions.push({ id: 'decisions-table-frame', path: relativePath, status: 'skipped', summary: `${relativePath} already contains the decision table frame.` });
    return;
  }
  if (hasLegacyDecisionTable(current)) {
    issues.push({
      severity: 'warning',
      code: 'DECISIONS_TABLE_FRAME_AMBIGUOUS',
      message: `${relativePath} already appears to contain a non-canonical decision table; refusing to insert a second semantic frame.`,
      path: relativePath
    });
    actions.push({ id: 'decisions-table-frame', path: relativePath, status: 'skipped', summary: `${relativePath} contains a non-canonical decision table.` });
    return;
  }
  const base = current || '# DECISIONS\n';
  const after = insertAfterTitle(base, `\n${frame}`);
  actions.push({
    id: 'decisions-table-frame',
    path: relativePath,
    status: 'planned',
    summary: `${input.mode === 'execute' ? 'Insert' : 'Would insert'} Decisions table frame without deleting existing content.`,
    before: current,
    after,
    expectedBeforeExists: existsAtPlan,
    expectedBeforeHash: hashContent(current),
    afterHash: hashContent(after)
  });
  if (!current) {
    issues.push({ severity: 'warning', code: 'PROTOCOL_REMEDIATION_DOC_WILL_BE_CREATED', message: `${relativePath} does not exist and would be created.`, path: relativePath });
  }
}

function planEvidenceJsonl(input: ProtocolRemediateInput, actions: ProtocolRemediateAction[], issues: ProtocolRemediateIssue[]): void {
  const taskId = input.taskId;
  if (!taskId) {
    issues.push({ severity: 'error', code: 'PROTOCOL_REMEDIATION_TASK_REQUIRED', message: '--task is required for evidence-jsonl remediation' });
    return;
  }
  const task = listTaskCapsules(input.projectRoot).find((candidate) => candidate.id === taskId);
  if (!task) {
    issues.push({ severity: 'error', code: 'PROTOCOL_REMEDIATION_TASK_NOT_FOUND', message: `Task Capsule not found: ${taskId}` });
    return;
  }
  const relativePath = toPortablePath(path.relative(input.projectRoot, path.join(task.dir, 'evidence.jsonl')));
  const absolutePath = path.join(input.projectRoot, relativePath);
  if (fs.existsSync(absolutePath)) {
    actions.push({ id: 'evidence-jsonl', path: relativePath, status: 'skipped', summary: `${relativePath} already exists.` });
    return;
  }
  actions.push({
    id: 'evidence-jsonl',
    path: relativePath,
    status: 'planned',
    summary: `${input.mode === 'execute' ? 'Create' : 'Would create'} empty evidence JSONL index.`,
    before: '',
    after: '',
    expectedBeforeExists: false,
    expectedBeforeHash: hashContent(''),
    afterHash: hashContent('')
  });
}

function applyActions(projectRoot: string, actions: ProtocolRemediateAction[], issues: ProtocolRemediateIssue[]): void {
  const planned = actions.filter((action) => action.status === 'planned');
  const prepared: Array<{ action: ProtocolRemediateAction; absolutePath: string; tmpPath: string; existed: boolean; original: string }> = [];
  const committed: typeof prepared = [];
  try {
    for (const action of planned) {
      const absolutePath = path.resolve(projectRoot, action.path);
      const relative = path.relative(projectRoot, absolutePath);
      if (relative.startsWith('..') || path.isAbsolute(relative)) {
        issues.push({ severity: 'error', code: 'PROTOCOL_REMEDIATION_PATH_OUTSIDE_PROJECT', message: `Refusing to write outside project: ${action.path}`, path: action.path });
        action.status = 'skipped';
        action.summary = `${action.path} was skipped because it resolves outside the project.`;
        continue;
      }
      const existed = fs.existsSync(absolutePath);
      const current = existed ? fs.readFileSync(absolutePath, 'utf8') : '';
      const currentHash = hashContent(current);
      const existsChanged = action.expectedBeforeExists !== undefined && existed !== action.expectedBeforeExists;
      if (existsChanged || (action.expectedBeforeHash && currentHash !== action.expectedBeforeHash)) {
        issues.push({
          severity: 'error',
          code: 'PROTOCOL_REMEDIATION_WRITE_CONFLICT',
          message: `${action.path} changed after remediation planning; rerun dry-run before executing.`,
          path: action.path
        });
        action.status = 'skipped';
        action.summary = `${action.path} was skipped because the current content no longer matches the planned before hash.`;
        continue;
      }
      fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
      const tmpPath = path.join(path.dirname(absolutePath), `.hadara-remediate-${process.pid}-${Date.now()}-${prepared.length}-${path.basename(absolutePath)}.tmp`);
      fs.writeFileSync(tmpPath, action.after ?? '', { encoding: 'utf8', flag: 'wx' });
      prepared.push({ action, absolutePath, tmpPath, existed, original: current });
    }
    if (issues.some((issue) => issue.severity === 'error')) {
      for (const item of prepared) {
        if (fs.existsSync(item.tmpPath)) fs.rmSync(item.tmpPath, { force: true });
      }
      return;
    }
    for (const item of prepared) {
      fs.renameSync(item.tmpPath, item.absolutePath);
      committed.push(item);
      item.action.status = item.existed ? 'updated' : 'created';
      item.action.summary = executedSummary(item.action, item.existed);
    }
  } catch (error) {
    for (const item of prepared) {
      if (fs.existsSync(item.tmpPath)) fs.rmSync(item.tmpPath, { force: true });
    }
    let rollbackFailed = false;
    for (const item of committed.reverse()) {
      try {
        if (item.existed) {
          fs.writeFileSync(item.absolutePath, item.original, 'utf8');
        } else if (fs.existsSync(item.absolutePath)) {
          fs.rmSync(item.absolutePath, { force: true });
        }
        item.action.status = 'planned';
      } catch {
        rollbackFailed = true;
      }
    }
    issues.push({
      severity: 'error',
      code: 'PROTOCOL_REMEDIATION_ATOMIC_WRITE_FAILED',
      message: `Atomic remediation write failed and rollback was attempted. Inspect target files before retrying. Cause: ${error instanceof Error ? error.message : String(error)}`
    });
    if (rollbackFailed) {
      issues.push({
        severity: 'warning',
        code: 'PROTOCOL_REMEDIATION_ROLLBACK_INCOMPLETE',
        message: 'One or more remediation rollback writes failed; inspect target files before retrying.'
      });
    }
  }
}

function readIfExists(absolutePath: string): string {
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';
}

function readTaskStatus(taskDir: string): string {
  const taskPath = path.join(taskDir, 'TASK.md');
  const content = readIfExists(taskPath);
  const row = content.match(/\|\s*Status\s*\|\s*([^|]+)\|/i);
  if (row?.[1]) return row[1].trim();
  return readMarkdownSection(content, '## Status').trim().split(/\r?\n/)[0]?.trim() || 'Draft';
}

function ensureTrailingNewline(value: string): string {
  return value.endsWith('\n') ? value : `${value}\n`;
}

function insertAfterTitle(content: string, insertion: string): string {
  const lines = ensureTrailingNewline(content).split(/\n/);
  const titleIndex = lines.findIndex((line) => /^#\s+/.test(line));
  const index = titleIndex >= 0 ? titleIndex + 1 : 0;
  lines.splice(index, 0, insertion.trimEnd(), '');
  return lines.join('\n').replace(/\n{4,}/g, '\n\n\n');
}

function hasLegacyDecisionTable(content: string): boolean {
  return content.split('\n').some((line) => {
    if (!/^\|.*\|$/.test(line)) return false;
    const normalized = line.toLowerCase();
    return normalized.includes('id') && normalized.includes('decision') && !normalized.includes('date | decision | status | rationale | evidence');
  });
}

function hashContent(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

function executedSummary(action: ProtocolRemediateAction, existed: boolean): string {
  const verb = existed ? 'Updated' : 'Created';
  const stripped = action.summary.replace(/^(Would\s+|Add\s+|Insert\s+|Set\s+|Create\s+)/, '');
  return `${verb} ${stripped.charAt(0).toLowerCase()}${stripped.slice(1)}`;
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}

export function createManualRemediation(input: ManualRemediationInput): {
  id: string;
  issueIds: string[];
  title: string;
  mode: 'manual';
  command?: string;
  targetPaths: string[];
  summary: string;
  steps: string[];
  preview?: {
    before?: string;
    after?: string;
  };
} {
  return {
    id: input.id,
    issueIds: input.issueIds ?? [],
    title: input.title,
    mode: 'manual',
    command: input.command,
    targetPaths: Array.from(new Set(input.targetPaths)),
    summary: input.summary,
    steps: input.steps,
    ...(input.preview ? { preview: input.preview } : {})
  };
}
