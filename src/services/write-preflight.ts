import fs from 'node:fs';
import path from 'node:path';
import { assertSchema } from '../core/schema';
import { slugify } from '../core/fs';
import { nextTaskId } from '../task/task-capsule';

export type WritePreflightCommand =
  | 'task.create'
  | 'evidence.collect'
  | 'handoff.update'
  | 'run-state.start'
  | 'run-state.update'
  | 'run-state.complete'
  | 'debt.add'
  | 'debt.update'
  | 'unknown';

export interface WritePreflightIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
}

export interface WritePreflightReport {
  schemaVersion: 'hadara.write.preflight.v1';
  ok: boolean;
  command: WritePreflightCommand;
  risk: 'low' | 'medium' | 'high';
  requiresApproval: boolean;
  workspaceBoundary: 'project' | 'project+private-portable';
  writes: string[];
  issues: WritePreflightIssue[];
}

const TASK_FILE_NAMES = [
  'TASK.md',
  'EVIDENCE.md',
  'evidence.jsonl',
  'HANDOFF.md'
];

export function createWritePreflightReport(projectRoot: string, targetArgs: string[]): WritePreflightReport {
  const args = normalizeTargetArgs(targetArgs);
  const command = identifyCommand(args);
  let report: WritePreflightReport;

  switch (command) {
    case 'task.create':
      report = taskCreateReport(projectRoot, args);
      break;
    case 'evidence.collect':
      report = evidenceCollectReport(projectRoot, args);
      break;
    case 'handoff.update':
      report = simpleProjectWriteReport('handoff.update', ['docs/AGENT_HANDOFF.md']);
      break;
    case 'run-state.start':
    case 'run-state.update':
    case 'run-state.complete':
      report = simpleProjectWriteReport(command, ['.hadara/local/state/active-run.json'], [
        {
          severity: 'warning',
          code: 'WRITE_COMMAND_DEFERRED',
          message: `${command} is a planned CLI-owned write boundary; the mutation command is not implemented yet.`
        }
      ]);
      break;
    case 'debt.add':
    case 'debt.update':
      report = {
        ...simpleProjectWriteReport(command, ['docs/OPERATIONAL_DEBT.md'], [
          {
            severity: 'warning',
            code: 'DEBT_WRITE_STORE_DEFERRED',
            message: 'Operational debt mutation is deferred; the durable write store is not implemented yet.'
          }
        ]),
        risk: 'medium',
        requiresApproval: true
      };
      break;
    default:
      report = {
        schemaVersion: 'hadara.write.preflight.v1',
        ok: false,
        command: 'unknown',
        risk: 'low',
        requiresApproval: false,
        workspaceBoundary: 'project',
        writes: [],
        issues: [
          {
            severity: 'error',
            code: 'UNSUPPORTED_WRITE_COMMAND',
            message: `Unsupported write preflight target: ${args.join(' ') || '(empty)'}`
          }
        ]
      };
  }

  assertWritePreflightSchema(report);
  return report;
}

export function assertWritePreflightSchema(report: WritePreflightReport): void {
  assertSchema('hadara.write.preflight.v1', report);
}

function taskCreateReport(projectRoot: string, args: string[]): WritePreflightReport {
  const title = extractValueAfterPrefix(args, ['task', 'create']);
  const issues: WritePreflightIssue[] = [];
  const taskId = nextTaskId(path.join(projectRoot, 'tasks'));
  const slug = slugify(title || 'task');
  const capsule = `tasks/${taskId}-${slug}`;

  if (!title) {
    issues.push({
      severity: 'error',
      code: 'TASK_TITLE_REQUIRED',
      message: 'task create preflight requires a title.'
    });
  }

  return {
    schemaVersion: 'hadara.write.preflight.v1',
    ok: issues.every((issue) => issue.severity !== 'error'),
    command: 'task.create',
    risk: 'low',
    requiresApproval: false,
    workspaceBoundary: 'project',
    writes: [...TASK_FILE_NAMES.map((fileName) => `${capsule}/${fileName}`), 'docs/TASK_BOARD.md'],
    issues
  };
}

function evidenceCollectReport(projectRoot: string, args: string[]): WritePreflightReport {
  const taskId = getOptionValue(args, '--task');
  const kind = getOptionValue(args, '--kind') ?? 'note';
  const artifactPath = getOptionValue(args, '--path');
  const visibility = args.includes('--private') ? 'private' : getOptionValue(args, '--visibility') ?? 'public';
  const issues: WritePreflightIssue[] = [];

  if (!taskId) {
    issues.push({
      severity: 'error',
      code: 'TASK_ID_REQUIRED',
      message: 'evidence collect preflight requires --task <task-id>.'
    });
  }

  const capsule = taskId ? findTaskCapsulePath(projectRoot, taskId) : null;
  if (taskId && !capsule) {
    issues.push({
      severity: 'error',
      code: 'TASK_CAPSULE_NOT_FOUND',
      message: `Task Capsule not found: ${taskId}`
    });
  }

  const writes = capsule ? [`${capsule}/EVIDENCE.md`, `${capsule}/evidence.jsonl`] : [];
  if (capsule && artifactPath && visibility === 'public') {
    writes.push(`${capsule}/artifacts/${kind}/<timestamp>-${safeFilePart(path.basename(artifactPath))}`);
  }
  if (taskId && artifactPath && visibility === 'private') {
    writes.push(`.hadara/local/portable/data/private-evidence/${taskId}/<evidence-id>.bin`);
    writes.push(`.hadara/local/portable/data/private-evidence/${taskId}/manifest.jsonl`);
    writes.push('.hadara/local/portable/data/audit/audit.jsonl');
  }

  return {
    schemaVersion: 'hadara.write.preflight.v1',
    ok: issues.every((issue) => issue.severity !== 'error'),
    command: 'evidence.collect',
    risk: visibility === 'private' ? 'medium' : 'low',
    requiresApproval: visibility === 'private',
    workspaceBoundary: visibility === 'private' ? 'project+private-portable' : 'project',
    writes,
    issues
  };
}

function simpleProjectWriteReport(command: WritePreflightCommand, writes: string[], issues: WritePreflightIssue[] = []): WritePreflightReport {
  return {
    schemaVersion: 'hadara.write.preflight.v1',
    ok: issues.every((issue) => issue.severity !== 'error'),
    command,
    risk: 'low',
    requiresApproval: false,
    workspaceBoundary: 'project',
    writes,
    issues
  };
}

function identifyCommand(args: string[]): WritePreflightCommand {
  const [root, sub] = args;
  if (root === 'task' && sub === 'create') return 'task.create';
  if (root === 'evidence' && sub === 'collect') return 'evidence.collect';
  if (root === 'handoff' && sub === 'update') return 'handoff.update';
  if (root === 'run-state' && (sub === 'start' || sub === 'update' || sub === 'complete')) return `run-state.${sub}`;
  if (root === 'debt' && (sub === 'add' || sub === 'update')) return `debt.${sub}`;
  return 'unknown';
}

function normalizeTargetArgs(args: string[]): string[] {
  const normalized: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === '--') continue;
    if (value === '--json') continue;
    if (value === '--project') {
      index += 1;
      continue;
    }
    normalized.push(value);
  }
  return normalized;
}

function extractValueAfterPrefix(args: string[], prefix: string[]): string {
  return args
    .slice(prefix.length)
    .filter((value, index, values) => {
      if (value.startsWith('--')) return false;
      const previous = values[index - 1];
      return previous !== '--project';
    })
    .join(' ')
    .trim();
}

function getOptionValue(args: string[], option: string): string | undefined {
  const index = args.indexOf(option);
  if (index === -1) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) return undefined;
  return value;
}

function findTaskCapsulePath(projectRoot: string, taskId: string): string | null {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return null;
  const entry = fs.readdirSync(tasksDir).find((name) => name.startsWith(`${taskId}-`));
  return entry ? toPortablePath(path.relative(projectRoot, path.join(tasksDir, entry))) : null;
}

function safeFilePart(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'artifact';
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
