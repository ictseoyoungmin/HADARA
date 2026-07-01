import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
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
}

export interface ValidationRunOptions {
  taskId: string;
  check: string;
  argv: string[];
  tags?: string[];
  timeoutMs?: number;
  updateTask?: boolean;
}

export function createValidationRunReport(projectRoot: string, options: ValidationRunOptions): ValidationRunReport {
  const task = findTaskCapsule(projectRoot, options.taskId);
  const started = Date.now();
  const issues: ValidationRunReport['issues'] = [];
  if (!task) {
    return failedInputReport(projectRoot, options, 'TASK_NOT_FOUND', `Task Capsule not found: ${options.taskId}`);
  }
  if (options.argv.length === 0) {
    return failedInputReport(projectRoot, options, 'VALIDATION_COMMAND_REQUIRED', 'validation run requires a command after --.');
  }

  const executed = spawnSync(options.argv[0], options.argv.slice(1), {
    cwd: projectRoot,
    encoding: 'utf8',
    timeout: Math.max(1, options.timeoutMs ?? 120_000),
    maxBuffer: 1024 * 1024 * 8
  });
  const durationMs = Date.now() - started;
  const timedOut = Boolean(executed.error && (executed.error as NodeJS.ErrnoException).code === 'ETIMEDOUT');
  const result: ValidationRunReport['result'] = timedOut || executed.error ? 'Blocked' : executed.status === 0 ? 'Passed' : 'Failed';
  if (executed.error && !timedOut) {
    issues.push({
      severity: 'warning',
      code: 'VALIDATION_COMMAND_EXECUTION_ERROR',
      message: executed.error.message
    });
  }

  const blockedReason = result === 'Blocked' ? `blocked because ${timedOut ? 'validation command timed out' : `validation command execution error: ${executed.error?.message ?? 'unknown error'}`}` : null;
  const summary = [
    `Validation "${options.check}" ${result.toLowerCase()}`,
    ...(blockedReason ? [blockedReason] : []),
    `command: ${options.argv.join(' ')}`,
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
      stderrHash: hashText(executed.stderr ?? '')
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
      markdownAppended: evidence.markdownAppended
    },
    taskValidationRow,
    acceptanceRows: {
      updated: false,
      reason: 'Acceptance rows are not updated unless an explicit validation-to-acceptance mapping exists.'
    },
    issues
  };
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
      stderrHash: hashText('')
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
    issues: [{ severity: 'error', code, message }]
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
  const rowIndex = lines.findIndex((line) => {
    const cells = parseRow(line);
    return cells.length > 0 && cells[0] === check;
  });
  const safeCommand = isSafeMarkdownTableCell(command) ? command : command.replace(/[|\r\n]/g, ' ');
  const nextRow = formatMarkdownTableRow([check, safeCommand, 'Yes', result, evidenceId]);
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

function hashText(value: string): string {
  return `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
}
