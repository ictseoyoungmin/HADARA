import { spawnSync, type SpawnSyncOptionsWithStringEncoding, type SpawnSyncReturns } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { startMonotonicTimer } from '../core/timing';
import { appendEvidenceWithResult, persistedEvidenceKind, persistedEvidenceResult } from '../evidence/evidence';
import { findTaskCapsule } from '../task/task-capsule';
import { parseEvidenceIndexFile, EvidenceListRecord } from './evidence-list';
import { formatMarkdownTableRow, isSafeMarkdownTableCell } from './markdown-table';

export interface ValidationRunReport {
  schemaVersion: 'hadara.validation.run.v1';
  command: 'validation.run';
  ok: boolean;
  taskId: string;
  check: string;
  cwd: string;
  argv: string[];
  execution: {
    exitCode: number | null;
    signal: string | null;
    timedOut: boolean;
    durationMs: number;
    stdoutHash: string;
    stderrHash: string;
    commandStarted: boolean;
    failureKind: 'none' | 'non-zero-exit' | 'timeout' | 'permission-denied' | 'command-not-found' | 'launch-error';
    error?: {
      code: string | null;
      message: string;
      syscall?: string;
      path?: string;
    };
  };
  result: 'Passed' | 'Failed' | 'Blocked';
  attempt: {
    checkKey: string;
    previousFailedOrBlockedEvidenceIds: string[];
    autoResolvedEvidenceIds: string[];
  };
  evidence?: {
    id: string;
    result: string;
    kind: string;
    tags: string[];
    markdownPath: string;
    jsonlAppended: boolean;
    markdownAppended: boolean;
    appendLock: ReturnType<typeof appendEvidenceWithResult>['appendLock'];
  };
  taskValidationRow: {
    mode: 'skipped' | 'updated';
    updated: boolean;
    appended: boolean;
    path?: string;
    reason?: string;
  };
  acceptanceRows: {
    updated: false;
    reason: string;
  };
  issues: Array<{
    severity: 'error' | 'warning' | 'info';
    code: string;
    message: string;
    path?: string;
  }>;
  nextActions: Array<{
    id: string;
    kind: 'command' | 'guidance';
    message: string;
    command?: string;
  }>;
}

export interface ValidationRunOptions {
  taskId: string;
  check: string;
  argv: string[];
  tags?: string[];
  timeoutMs?: number;
  updateTask?: boolean;
  directResult?: ValidationRunReport['result'];
  directSummary?: string;
  spawnSyncFn?: ValidationSpawnSync;
}

type ValidationSpawnSync = (command: string, args: string[], options: SpawnSyncOptionsWithStringEncoding) => SpawnSyncReturns<string>;

export function createValidationRunReport(projectRoot: string, options: ValidationRunOptions): ValidationRunReport {
  const task = findTaskCapsule(projectRoot, options.taskId);
  const timer = startMonotonicTimer();
  const issues: ValidationRunReport['issues'] = [];
  if (!task) {
    return failedInputReport(projectRoot, options, 'TASK_NOT_FOUND', `Task Capsule not found: ${options.taskId}`);
  }
  if (options.argv.length === 0 && !options.directResult) {
    return failedInputReport(projectRoot, options, 'VALIDATION_COMMAND_REQUIRED', 'validation run requires a command after --.');
  }

  const directExecution = options.directResult ? directResultExecution(options.directResult) : null;
  const spawn: ValidationSpawnSync = options.spawnSyncFn ?? ((command, args, spawnOptions) => spawnSync(command, args, spawnOptions));
  const executed =
    directExecution ??
    spawn(options.argv[0], options.argv.slice(1), {
      cwd: projectRoot,
      encoding: 'utf8',
      timeout: Math.max(1, options.timeoutMs ?? 120_000),
      maxBuffer: 1024 * 1024 * 8
    });
  const durationMs = timer.elapsedMs();
  const timedOut = !directExecution && Boolean(executed.error && (executed.error as NodeJS.ErrnoException).code === 'ETIMEDOUT');
  const executionSemantics = directExecution ? classifyDirectExecution(options.directResult ?? 'Blocked') : classifyExecution(executed, timedOut);
  const result: ValidationRunReport['result'] = options.directResult ?? (executionSemantics.failureKind !== 'none' && executionSemantics.failureKind !== 'non-zero-exit' ? 'Blocked' : executed.status === 0 ? 'Passed' : 'Failed');
  if (executionSemantics.issueCode) {
    issues.push({
      severity: 'error',
      code: executionSemantics.issueCode,
      message: executionSemantics.issueMessage
    });
  }

  const blockedReason = result === 'Blocked' ? executionSemantics.blockedReason : null;
  const summary = [
    `Validation "${options.check}" ${result.toLowerCase()}${options.directResult ? ' from direct result' : ''}`,
    ...(options.directSummary ? [options.directSummary] : []),
    ...(blockedReason ? [blockedReason] : []),
    `command: ${options.argv.length > 0 ? options.argv.join(' ') : 'direct-result'}`,
    `exitCode: ${executed.status ?? 'null'}`,
    `signal: ${executed.signal ?? 'null'}`,
    `durationMs: ${durationMs}`,
    `stdoutHash: ${hashText(executed.stdout ?? '')}`,
    `stderrHash: ${hashText(executed.stderr ?? '')}`
  ].join('; ');
  const legacyResult = result === 'Passed' ? 'passed' : result === 'Failed' ? 'failed' : 'blocked';
  const checkKey = validationCheckKey(options.check);
  const previousFailedOrBlockedEvidenceIds = findUnresolvedFailedOrBlockedAttempts(task.dir, options.check, checkKey);
  const autoResolvedEvidenceIds = result === 'Passed' ? previousFailedOrBlockedEvidenceIds : [];
  const tags = Array.from(
    new Set([...(options.tags ?? []), `validation-check:${checkKey}`, ...autoResolvedEvidenceIds.map((id) => `resolves:${id}`)])
  );
  const evidence = appendEvidenceWithResult(projectRoot, {
    taskId: options.taskId,
    kind: 'command-log',
    summary,
    result: legacyResult,
    category: 'validation',
    outcome: legacyResult,
    tags,
    visibility: 'public',
    idempotencyKey: `validation-run:${options.taskId}:${options.check}:${hashText(options.argv.join('\0'))}:${executed.status ?? 'null'}:${executed.signal ?? 'null'}:${hashText((options.tags ?? []).join('\0'))}`
  });
  const evidenceId = evidence.evidence.schemaVersion === 'hadara.evidence.v2' ? evidence.evidence.id : 'evidence.jsonl';
  if (evidence.appendLock.contended) {
    issues.push({
      severity: 'warning',
      code: 'EVIDENCE_APPEND_LOCK_CONTENDED',
      message: `Evidence append waited ${evidence.appendLock.waitedMs}ms for the task-scoped lock at ${evidence.appendLock.path}. Serialize same-task evidence writes to avoid contention.`
    });
  }
  const taskValidationRow = options.updateTask
    ? updateTaskValidationRow(projectRoot, task.dir, options.check, options.argv.join(' '), result, evidenceId)
    : {
        mode: 'skipped' as const,
        updated: false,
        appended: false,
        path: path.relative(projectRoot, path.join(task.dir, 'TASK.md')).split(path.sep).join('/'),
        reason: 'TASK.md Validation row sync is opt-in; rerun with --update-task or update task prose deliberately before finalize.'
      };

  return {
    schemaVersion: 'hadara.validation.run.v1',
    command: 'validation.run',
    ok: result === 'Passed',
    taskId: options.taskId,
    check: options.check,
    cwd: projectRoot,
    argv: options.argv,
    execution: {
      exitCode: executed.status,
      signal: executed.signal,
      timedOut,
      durationMs,
      stdoutHash: hashText(executed.stdout ?? ''),
      stderrHash: hashText(executed.stderr ?? ''),
      commandStarted: executionSemantics.commandStarted,
      failureKind: executionSemantics.failureKind,
      ...(options.directResult ? { directResult: true, directSummary: options.directSummary ?? null } : {}),
      ...(executionSemantics.error ? { error: executionSemantics.error } : {})
    },
    result,
    attempt: {
      checkKey,
      previousFailedOrBlockedEvidenceIds,
      autoResolvedEvidenceIds
    },
    evidence: {
      id: evidenceId,
      result: persistedEvidenceResult(evidence.evidence),
      kind: persistedEvidenceKind(evidence.evidence),
      tags: evidence.evidence.schemaVersion === 'hadara.evidence.v2' ? evidence.evidence.tags : [],
      markdownPath: evidence.markdownPath,
      jsonlAppended: evidence.jsonlAppended,
      markdownAppended: evidence.markdownAppended,
      appendLock: evidence.appendLock
    },
    taskValidationRow,
    acceptanceRows: {
      updated: false,
      reason: 'Acceptance rows are not updated unless an explicit validation-to-acceptance mapping exists.'
    },
    issues,
    nextActions: createValidationRunNextActions(options, result, executionSemantics.failureKind)
  };
}

interface ExecutionSemantics {
  commandStarted: boolean;
  failureKind: ValidationRunReport['execution']['failureKind'];
  error?: NonNullable<ValidationRunReport['execution']['error']>;
  issueCode?: string;
  issueMessage: string;
  blockedReason: string | null;
}

function classifyExecution(executed: SpawnSyncReturns<string>, timedOut: boolean): ExecutionSemantics {
  const error = executed.error as NodeJS.ErrnoException | undefined;
  if (timedOut) {
    return {
      commandStarted: true,
      failureKind: 'timeout',
      error: error ? executionError(error) : undefined,
      issueCode: 'VALIDATION_COMMAND_TIMED_OUT',
      issueMessage: 'Validation command timed out before returning a result.',
      blockedReason: 'blocked because validation command timed out'
    };
  }
  if (error) {
    const code = error.code ?? null;
    const failureKind = code === 'EPERM' || code === 'EACCES' ? 'permission-denied' : code === 'ENOENT' ? 'command-not-found' : 'launch-error';
    const issueCode =
      failureKind === 'permission-denied'
        ? 'VALIDATION_COMMAND_PERMISSION_DENIED'
        : failureKind === 'command-not-found'
          ? 'VALIDATION_COMMAND_NOT_FOUND'
          : 'VALIDATION_COMMAND_LAUNCH_ERROR';
    return {
      commandStarted: false,
      failureKind,
      error: executionError(error),
      issueCode,
      issueMessage: `Validation command could not be launched: ${error.message}`,
      blockedReason: `blocked because validation command could not be launched (${code ?? 'unknown'}): ${error.message}`
    };
  }
  if (executed.status !== 0) {
    return {
      commandStarted: true,
      failureKind: 'non-zero-exit',
      issueMessage: '',
      blockedReason: null
    };
  }
  return {
    commandStarted: true,
    failureKind: 'none',
    issueMessage: '',
    blockedReason: null
  };
}

function directResultExecution(result: ValidationRunReport['result']): SpawnSyncReturns<string> {
  return {
    pid: 0,
    output: [null, '', ''],
    stdout: '',
    stderr: '',
    status: result === 'Passed' ? 0 : result === 'Failed' ? 1 : null,
    signal: null
  };
}

function classifyDirectExecution(result: ValidationRunReport['result']): ExecutionSemantics {
  if (result === 'Failed') {
    return {
      commandStarted: false,
      failureKind: 'non-zero-exit',
      issueMessage: '',
      blockedReason: null
    };
  }
  if (result === 'Blocked') {
    return {
      commandStarted: false,
      failureKind: 'launch-error',
      issueCode: 'VALIDATION_DIRECT_RESULT_BLOCKED',
      issueMessage: 'Validation direct result was recorded as blocked.',
      blockedReason: 'blocked by operator-supplied direct result'
    };
  }
  return {
    commandStarted: false,
    failureKind: 'none',
    issueMessage: '',
    blockedReason: null
  };
}

function executionError(error: NodeJS.ErrnoException): NonNullable<ValidationRunReport['execution']['error']> {
  return {
    code: error.code ?? null,
    message: error.message,
    ...(error.syscall ? { syscall: error.syscall } : {}),
    ...(error.path ? { path: String(error.path) } : {})
  };
}

function createValidationRunNextActions(options: ValidationRunOptions, result: ValidationRunReport['result'], failureKind: ValidationRunReport['execution']['failureKind']): ValidationRunReport['nextActions'] {
  if (result !== 'Blocked') return [];
  const summary = `Validation "${options.check}" was blocked by ${failureKind}.`;
  return [
    {
      id: 'run-direct-command',
      kind: 'guidance',
      message: 'Run the validation command directly in the current environment to distinguish command failure from wrapper launch failure.'
    },
    {
      id: 'record-direct-validation-result',
      kind: 'command',
      message: 'Record an already-run direct result through validation run so TASK.md row sync and validation-check resolution tags remain consistent.',
      command: `hadara validation run --task ${options.taskId} --check ${shellSingleQuote(options.check)} --direct-result passed --direct-summary ${shellSingleQuote('Direct command passed after wrapper launch failure.')}${options.updateTask ? ' --update-task' : ''} --json`
    },
    {
      id: 'record-direct-result',
      kind: 'command',
      message: 'Record the direct result without rerunning through validation run; adjust --result and --summary if the direct command passed or failed instead of staying blocked.',
      command: `hadara evidence add-command --task ${options.taskId} --summary ${shellSingleQuote(summary)} --result blocked --category validation --json`
    }
  ];
}

function shellSingleQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function failedInputReport(projectRoot: string, options: ValidationRunOptions, code: string, message: string): ValidationRunReport {
  return {
    schemaVersion: 'hadara.validation.run.v1',
    command: 'validation.run',
    ok: false,
    taskId: options.taskId,
    check: options.check,
    cwd: projectRoot,
    argv: options.argv,
    execution: {
      exitCode: null,
      signal: null,
      timedOut: false,
      durationMs: 0,
      stdoutHash: hashText(''),
      stderrHash: hashText(''),
      commandStarted: false,
      failureKind: 'launch-error'
    },
    result: 'Blocked',
    attempt: {
      checkKey: validationCheckKey(options.check),
      previousFailedOrBlockedEvidenceIds: [],
      autoResolvedEvidenceIds: []
    },
    taskValidationRow: { mode: 'skipped', updated: false, appended: false, reason: 'Validation command did not run.' },
    acceptanceRows: {
      updated: false,
      reason: 'Validation command did not run.'
    },
    issues: [{ severity: 'error', code, message }],
    nextActions: []
  };
}

function validationCheckKey(check: string): string {
  return crypto.createHash('sha256').update(check.trim().replace(/\s+/g, ' ').toLowerCase(), 'utf8').digest('hex').slice(0, 16);
}

function findUnresolvedFailedOrBlockedAttempts(taskDir: string, check: string, checkKey: string): string[] {
  const parsed = parseEvidenceIndexFile(path.join(taskDir, 'evidence.jsonl'), taskIdFromTaskDir(taskDir));
  const records = parsed.records;
  const unresolved: string[] = [];
  for (const record of records) {
    if (!isValidationAttemptForCheck(record, check, checkKey)) continue;
    if (record.outcome === 'passed' || record.outcome === 'recorded') {
      for (const tag of record.tags) {
        if (!tag.startsWith('resolves:') && !tag.startsWith('supersedes:')) continue;
        const resolvedId = tag.replace(/^(resolves|supersedes):/, '');
        const index = unresolved.indexOf(resolvedId);
        if (index >= 0) unresolved.splice(index, 1);
      }
      continue;
    }
    if ((record.outcome === 'failed' || record.outcome === 'blocked') && !unresolved.includes(record.id)) {
      unresolved.push(record.id);
    }
  }
  return unresolved;
}

function isValidationAttemptForCheck(record: EvidenceListRecord, check: string, checkKey: string): boolean {
  if (record.category !== 'validation') return false;
  if (record.tags.includes(`validation-check:${checkKey}`)) return true;
  return extractValidationCheckFromSummary(record.summary) === check;
}

function extractValidationCheckFromSummary(summary: string): string | undefined {
  return /^Validation "([^"]+)"\s/.exec(summary)?.[1];
}

function taskIdFromTaskDir(taskDir: string): string {
  const name = path.basename(taskDir);
  return /^T-\d+/.exec(name)?.[0] ?? name;
}

function updateTaskValidationRow(projectRoot: string, taskDir: string, check: string, command: string, result: ValidationRunReport['result'], evidenceId: string): ValidationRunReport['taskValidationRow'] {
  const taskPath = path.join(taskDir, 'TASK.md');
  const content = fs.readFileSync(taskPath, 'utf8');
  const bounds = findValidationSectionBounds(content);
  if (!bounds) {
    return {
      mode: 'updated',
      updated: false,
      appended: false,
      path: path.relative(projectRoot, taskPath).split(path.sep).join('/'),
      reason: 'TASK.md has no Validation section.'
    };
  }
  const section = content.slice(bounds.start, bounds.end);
  const lines = section.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => {
    const cells = parseRow(line);
    return cells[0] === 'Check' && (cells[1] === 'Gate' || cells[1] === 'Command / Method');
  });
  const header = headerIndex >= 0 ? parseRow(lines[headerIndex]) : [];
  const rowIndex = lines.findIndex((line) => {
    const cells = parseRow(line);
    return cells.length > 0 && normalizeValidationCheckLabel(cells[0]) === normalizeValidationCheckLabel(check);
  });
  const safeCommand = isSafeMarkdownTableCell(command) ? command : command.replace(/[|\r\n]/g, ' ');
  const nextRow = header[1] === 'Gate'
    ? formatMarkdownTableRow([check, 'Yes', result, evidenceId])
    : formatMarkdownTableRow([check, safeCommand, 'Yes', result, evidenceId]);
  let appended = false;
  if (rowIndex >= 0) {
    lines[rowIndex] = nextRow;
  } else {
    const insertAt = Math.max(0, lines.length - 1);
    lines.splice(insertAt, 0, nextRow);
    appended = true;
  }
  const next = `${content.slice(0, bounds.start)}${lines.join('\n')}${content.slice(bounds.end)}`;
  fs.writeFileSync(taskPath, next, 'utf8');
  return { mode: 'updated', updated: true, appended, path: path.relative(projectRoot, taskPath).split(path.sep).join('/') };
}

function findValidationSectionBounds(content: string): { start: number; end: number } | null {
  const heading = /^## Validation\s*$/m.exec(content);
  if (!heading || heading.index === undefined) return null;
  const afterHeadingStart = heading.index + heading[0].length;
  const afterHeading = content.slice(afterHeadingStart);
  const nextHeading = afterHeading.search(/\n##\s+/);
  return {
    start: afterHeadingStart,
    end: nextHeading >= 0 ? afterHeadingStart + nextHeading : content.length
  };
}

function parseRow(line: string): string[] {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|') || /^\|\s*:?-+/.test(trimmed)) return [];
  return trimmed.slice(1, -1).split('|').map((cell) => cell.trim());
}

function normalizeValidationCheckLabel(value: string): string {
  let normalized = value.trim();
  if (/^`[^`]+`$/.test(normalized)) normalized = normalized.slice(1, -1).trim();
  return normalized.replace(/\s+/g, ' ').toLowerCase();
}

function hashText(value: string): string {
  return `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
}
