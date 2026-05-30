import fs from 'node:fs';
import path from 'node:path';
import { listTaskCapsules } from '../task/task-capsule';

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

export type ProtocolRemediationFix = 'task-board-row' | 'decisions-table-frame' | 'project-state-profile' | 'evidence-jsonl';
export type ProtocolRemediationMode = 'dry-run' | 'execute';

export interface ProtocolRemediateInput {
  projectRoot: string;
  fix: ProtocolRemediationFix;
  mode: ProtocolRemediationMode;
  taskId?: string;
  profile?: 'basic' | 'standard' | 'governed';
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
    case 'project-state-profile':
      planProjectStateProfile(input, actions, issues);
      break;
    case 'evidence-jsonl':
      planEvidenceJsonl(input, actions, issues);
      break;
    default:
      issues.push({ severity: 'error', code: 'PROTOCOL_REMEDIATION_FIX_UNSUPPORTED', message: `unsupported protocol remediation fix: ${String(input.fix)}` });
  }

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
      skipped: actions.filter((action) => action.status === 'skipped').length
    },
    actions,
    issues
  };
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
  const current = readIfExists(absolutePath);
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
    status: input.mode === 'execute' ? 'planned' : 'planned',
    summary: `${input.mode === 'execute' ? 'Add' : 'Would add'} Task Board row for ${task.id}.`,
    before: current,
    after
  });
}

function planDecisionsTableFrame(input: ProtocolRemediateInput, actions: ProtocolRemediateAction[], issues: ProtocolRemediateIssue[]): void {
  const relativePath = 'docs/DECISIONS.md';
  const absolutePath = path.join(input.projectRoot, relativePath);
  const current = readIfExists(absolutePath);
  const frame = '| ID | Date | Decision | Status | Rationale | Evidence |\n|---|---|---|---|---|---|\n';
  if (current.includes('| ID | Date | Decision | Status | Rationale | Evidence |')) {
    actions.push({ id: 'decisions-table-frame', path: relativePath, status: 'skipped', summary: `${relativePath} already contains the decision table frame.` });
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
    after
  });
  if (!current) {
    issues.push({ severity: 'warning', code: 'PROTOCOL_REMEDIATION_DOC_WILL_BE_CREATED', message: `${relativePath} does not exist and would be created.`, path: relativePath });
  }
}

function planProjectStateProfile(input: ProtocolRemediateInput, actions: ProtocolRemediateAction[], issues: ProtocolRemediateIssue[]): void {
  const profile = input.profile;
  if (!profile) {
    issues.push({ severity: 'error', code: 'PROTOCOL_REMEDIATION_PROFILE_REQUIRED', message: '--profile basic|standard|governed is required for project-state-profile remediation' });
    return;
  }
  const relativePath = 'docs/PROJECT_STATE.md';
  const absolutePath = path.join(input.projectRoot, relativePath);
  const current = readIfExists(absolutePath);
  const base = current || '# PROJECT_STATE\n';
  const after = upsertProjectStateProfile(base, profile);
  if (after === current) {
    actions.push({ id: 'project-state-profile', path: relativePath, status: 'skipped', summary: `${relativePath} already declares ${profile}.` });
    return;
  }
  actions.push({
    id: 'project-state-profile',
    path: relativePath,
    status: 'planned',
    summary: `${input.mode === 'execute' ? 'Set' : 'Would set'} HADARA Profile to ${profile}.`,
    before: current,
    after
  });
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
    after: ''
  });
}

function applyActions(projectRoot: string, actions: ProtocolRemediateAction[], issues: ProtocolRemediateIssue[]): void {
  for (const action of actions) {
    if (action.status !== 'planned') continue;
    const absolutePath = path.resolve(projectRoot, action.path);
    const relative = path.relative(projectRoot, absolutePath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      issues.push({ severity: 'error', code: 'PROTOCOL_REMEDIATION_PATH_OUTSIDE_PROJECT', message: `Refusing to write outside project: ${action.path}`, path: action.path });
      continue;
    }
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, action.after ?? '', 'utf8');
    action.status = fs.existsSync(absolutePath) && (action.before ?? '') === '' && (action.after ?? '') === '' ? 'created' : action.before ? 'updated' : 'created';
    action.summary = action.summary.replace(/^Would /, action.status === 'created' ? 'Created ' : 'Updated ');
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
  const section = content.match(/## Status\s+([^\n]+)/i);
  return section?.[1]?.trim() || 'Draft';
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

function upsertProjectStateProfile(content: string, profile: 'basic' | 'standard' | 'governed'): string {
  if (/\|\s*HADARA Profile\s*\|[^|\n]*\|/i.test(content)) {
    return content.replace(/\|\s*HADARA Profile\s*\|[^|\n]*\|/i, `| HADARA Profile | ${profile} |`);
  }
  const metadata = `## Metadata\n\n| Field | Value |\n|---|---|\n| HADARA Profile | ${profile} |\n`;
  if (/## Metadata\b/.test(content)) {
    return content.replace(/## Metadata\b\s*/i, `${metadata}\n`);
  }
  return insertAfterTitle(content || '# PROJECT_STATE\n', `\n${metadata}`);
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
