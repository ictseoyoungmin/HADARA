import { spawnSync, type SpawnSyncOptionsWithStringEncoding, type SpawnSyncReturns } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRedactionReport } from '../core/redaction';
import { startMonotonicTimer } from '../core/timing';
import { appendEvidenceWithResult, persistedEvidenceKind, persistedEvidenceResult } from '../evidence/evidence';
import { findTaskCapsule } from '../task/task-capsule';
import { parseEvidenceIndexFile, EvidenceListRecord } from './evidence-list';
import { formatMarkdownTableRow, isSafeMarkdownTableCell } from './markdown-table';

const OUTPUT_PREVIEW_LIMIT_BYTES = 16 * 1024;
const ARGV_PREVIEW_LIMIT_BYTES = 16 * 1024;

export interface ValidationRunReport {
  schemaVersion: 'hadara.validation.run.v2';
  command: 'validation.run';
  ok: boolean;
  taskId: string;
  check: string;
  cwd: string;
  argvHash: string;
  argvPreview: string[];
  argvRedacted: boolean;
  argvPreviewLimitBytes: number;
  argvPreviewTruncated: boolean;
  argvOmittedBytes: number;
  rawArgv?: string[];
  execution: {
    exitCode: number | null;
    signal: string | null;
    timedOut: boolean;
    durationMs: number;
    stdoutHash: string;
    stderrHash: string;
    commandStarted: boolean;
    failureKind: 'none' | 'non-zero-exit' | 'timeout' | 'permission-denied' | 'command-not-found' | 'launch-error';
    failureClass: 'none' | 'assertion' | 'timeout' | 'environment-setup';
    capture: {
      mode: 'file' | 'injected' | 'direct';
      stdoutBytes: number;
      stderrBytes: number;
      stdoutPreview: string;
      stderrPreview: string;
      stdoutTruncated: boolean;
      stderrTruncated: boolean;
      previewLimitBytes: number;
      previewMode: 'redacted' | 'raw';
      redacted: boolean;
      redactionFindingCount: number;
      omittedBytes: number;
      controlSequenceFindingCount: number;
      controlCharactersStripped: boolean;
      fallbackUsed: boolean;
      fallbackReason?: string;
    };
    error?: {
      code: string | null;
      message: string;
      syscall?: string;
      path?: string;
    };
  };
  status: 'Passed' | 'Failed' | 'Blocked';
  detail: string;
  /** @deprecated Use status. */
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

export type ValidationRunV1CompatReport = Omit<ValidationRunReport, 'schemaVersion' | 'rawArgv'> & {
  schemaVersion: 'hadara.validation.run.v1';
  argv: string[];
};

export interface ValidationRunOptions {
  taskId: string;
  check: string;
  argv: string[];
  tags?: string[];
  timeoutMs?: number;
  updateTask?: boolean;
  directResult?: ValidationRunReport['result'];
  directSummary?: string;
  showRawOutput?: boolean;
  showRawArgv?: boolean;
  spawnSyncFn?: ValidationSpawnSync;
}

type ValidationSpawnSync = (command: string, args: string[], options: SpawnSyncOptionsWithStringEncoding) => SpawnSyncReturns<string>;
type ValidationSpawnResult = SpawnSyncReturns<string> & { hadaraCapture?: ValidationRunReport['execution']['capture'] };

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
  const injectedSpawn = Boolean(options.spawnSyncFn);
  const spawn: ValidationSpawnSync = options.spawnSyncFn ?? spawnSyncWithFileCapture;
  const executed = (
    directExecution ??
    spawn(options.argv[0], options.argv.slice(1), {
      cwd: projectRoot,
      encoding: 'utf8',
      timeout: Math.max(1, options.timeoutMs ?? 120_000),
      maxBuffer: 1024 * 1024 * 8
    })
  ) as ValidationSpawnResult;
  const durationMs = timer.elapsedMs();
  const timedOut = !directExecution && Boolean(executed.error && (executed.error as NodeJS.ErrnoException).code === 'ETIMEDOUT');
  const executionSemantics = directExecution ? classifyDirectExecution(options.directResult ?? 'Blocked') : classifyExecution(executed, timedOut);
  const failureClass = classifyFailure(executionSemantics.failureKind);
  const result: ValidationRunReport['result'] = options.directResult ?? (executionSemantics.failureKind !== 'none' && executionSemantics.failureKind !== 'non-zero-exit' ? 'Blocked' : executed.status === 0 ? 'Passed' : 'Failed');
  if (executionSemantics.issueCode) {
    issues.push({
      severity: 'error',
      code: executionSemantics.issueCode,
      message: executionSemantics.issueMessage
    });
  }

  const blockedReason = result === 'Blocked' ? executionSemantics.blockedReason : null;
  const detail = validationDetail(options, result, executed.status, durationMs, blockedReason);
  const argvFields = argvReportFields(options.argv, Boolean(options.showRawArgv));
  const commandPreview = validationCommandText(argvFields.argvPreview);
  const summary = [
    `Validation "${options.check}" ${result.toLowerCase()}${options.directResult ? ' from direct result' : ''}`,
    ...(options.directSummary ? [options.directSummary] : []),
    ...(blockedReason ? [blockedReason] : []),
    `failureClass: ${failureClass}`,
    `command: ${commandPreview}`,
    `argvHash: ${argvFields.argvHash}`,
    `exitCode: ${executed.status ?? 'null'}`,
    `signal: ${executed.signal ?? 'null'}`,
    `durationMs: ${durationMs}`,
    `stdoutHash: ${hashText(executed.stdout ?? '')}`,
    `stderrHash: ${hashText(executed.stderr ?? '')}`
  ].join('; ');
  const legacyResult = result === 'Passed' ? 'passed' : result === 'Failed' ? 'failed' : 'blocked';
  const checkKey = validationCheckKey(options.check, options.argv);
  const previousFailedOrBlockedEvidenceIds = findUnresolvedFailedOrBlockedAttempts(task.dir, options.check, checkKey, validationCommandText(options.argv));
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
      message: `Evidence append waited ${evidence.appendLock.waitedMs}ms for the task-scoped lock at ${evidence.appendLock.path}; the append completed under internal serialization.`
    });
  }
  const taskValidationRow = options.updateTask
    ? updateTaskValidationRow(projectRoot, task.dir, options.check, commandPreview, result, detail, evidenceId)
    : {
        mode: 'skipped' as const,
        updated: false,
        appended: false,
        path: path.relative(projectRoot, path.join(task.dir, 'TASK.md')).split(path.sep).join('/'),
        reason: 'TASK.md Validation row sync is opt-in; rerun with --update-task or update task prose deliberately before finalize.'
      };

  return {
    schemaVersion: 'hadara.validation.run.v2',
    command: 'validation.run',
    ok: result === 'Passed',
    taskId: options.taskId,
    check: options.check,
    cwd: projectRoot,
    argvHash: argvFields.argvHash,
    argvPreview: argvFields.argvPreview,
    argvRedacted: argvFields.argvRedacted,
    argvPreviewLimitBytes: argvFields.argvPreviewLimitBytes,
    argvPreviewTruncated: argvFields.argvPreviewTruncated,
    argvOmittedBytes: argvFields.argvOmittedBytes,
    ...(argvFields.rawArgv ? { rawArgv: argvFields.rawArgv } : {}),
    execution: {
      exitCode: executed.status,
      signal: executed.signal,
      timedOut,
      durationMs,
      stdoutHash: hashText(executed.stdout ?? ''),
      stderrHash: hashText(executed.stderr ?? ''),
      commandStarted: executionSemantics.commandStarted,
      failureKind: executionSemantics.failureKind,
      failureClass,
      capture: executionCaptureForReport(executed, { direct: Boolean(directExecution), injected: injectedSpawn }, Boolean(options.showRawOutput)),
      ...(options.directResult ? { directResult: true, directSummary: options.directSummary ?? null } : {}),
      ...(executionSemantics.error ? { error: executionSemantics.error } : {})
    },
    status: result,
    detail,
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

export function createValidationRunV1CompatReport(projectRoot: string, options: ValidationRunOptions): ValidationRunV1CompatReport {
  const report = createValidationRunReport(projectRoot, options);
  const { rawArgv: _rawArgv, ...rest } = report;
  return {
    ...rest,
    schemaVersion: 'hadara.validation.run.v1',
    argv: options.argv
  };
}

function spawnSyncWithFileCapture(command: string, args: string[], options: SpawnSyncOptionsWithStringEncoding): ValidationSpawnResult {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hadara-validation-capture-'));
  const stdoutPath = path.join(tempDir, 'stdout.txt');
  const stderrPath = path.join(tempDir, 'stderr.txt');
  let stdoutFd: number | null = null;
  let stderrFd: number | null = null;
  try {
    stdoutFd = fs.openSync(stdoutPath, 'w');
    stderrFd = fs.openSync(stderrPath, 'w');
    const result = spawnSync(command, args, {
      ...options,
      stdio: ['ignore', stdoutFd, stderrFd]
    } as SpawnSyncOptionsWithStringEncoding) as ValidationSpawnResult;
    if (stdoutFd !== null) {
      fs.closeSync(stdoutFd);
      stdoutFd = null;
    }
    if (stderrFd !== null) {
      fs.closeSync(stderrFd);
      stderrFd = null;
    }
    const stdout = readCaptureFile(stdoutPath);
    const stderr = readCaptureFile(stderrPath);
    return {
      ...result,
      stdout,
      stderr,
      output: [null, stdout, stderr],
      hadaraCapture: {
        mode: 'file',
        stdoutBytes: Buffer.byteLength(stdout, 'utf8'),
        stderrBytes: Buffer.byteLength(stderr, 'utf8'),
        ...outputPreviewFields(stdout, stderr, false),
        fallbackUsed: false
      }
    };
  } finally {
    if (stdoutFd !== null) fs.closeSync(stdoutFd);
    if (stderrFd !== null) fs.closeSync(stderrFd);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function readCaptureFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function executionCapture(executed: ValidationSpawnResult, modes: { direct: boolean; injected: boolean }): ValidationRunReport['execution']['capture'] {
  if (modes.direct) {
    return {
      mode: 'direct',
      stdoutBytes: 0,
      stderrBytes: 0,
      ...outputPreviewFields('', '', false),
      fallbackUsed: false
    };
  }
  if (executed.hadaraCapture && !modes.injected) return executed.hadaraCapture;
  const stdout = executed.stdout ?? '';
  const stderr = executed.stderr ?? '';
  return {
    mode: modes.injected ? 'injected' : 'file',
    stdoutBytes: Buffer.byteLength(stdout, 'utf8'),
    stderrBytes: Buffer.byteLength(stderr, 'utf8'),
    ...outputPreviewFields(stdout, stderr, false),
    fallbackUsed: false
  };
}

function executionCaptureForReport(executed: ValidationSpawnResult, modes: { direct: boolean; injected: boolean }, showRawOutput: boolean): ValidationRunReport['execution']['capture'] {
  const capture = executionCapture(executed, modes);
  if (modes.direct) return capture;
  const stdout = executed.stdout ?? '';
  const stderr = executed.stderr ?? '';
  return {
    ...capture,
    ...outputPreviewFields(stdout, stderr, showRawOutput)
  };
}

function outputPreviewFields(
  stdout: string,
  stderr: string,
  showRawOutput: boolean
): Pick<ValidationRunReport['execution']['capture'], 'stdoutPreview' | 'stderrPreview' | 'stdoutTruncated' | 'stderrTruncated' | 'previewLimitBytes' | 'previewMode' | 'redacted' | 'redactionFindingCount' | 'omittedBytes' | 'controlSequenceFindingCount' | 'controlCharactersStripped'> {
  const stdoutPrepared = prepareOutputPreviewText(stdout, showRawOutput);
  const stderrPrepared = prepareOutputPreviewText(stderr, showRawOutput);
  const stdoutPreview = boundedOutputPreview(stdoutPrepared.text);
  const stderrPreview = boundedOutputPreview(stderrPrepared.text);
  return {
    stdoutPreview: stdoutPreview.text,
    stderrPreview: stderrPreview.text,
    stdoutTruncated: stdoutPreview.truncated,
    stderrTruncated: stderrPreview.truncated,
    previewLimitBytes: OUTPUT_PREVIEW_LIMIT_BYTES,
    previewMode: showRawOutput ? 'raw' : 'redacted',
    redacted: stdoutPrepared.redactionFindingCount + stderrPrepared.redactionFindingCount > 0,
    redactionFindingCount: stdoutPrepared.redactionFindingCount + stderrPrepared.redactionFindingCount,
    omittedBytes: stdoutPreview.omittedBytes + stderrPreview.omittedBytes,
    controlSequenceFindingCount: stdoutPrepared.controlSequenceFindingCount + stderrPrepared.controlSequenceFindingCount,
    controlCharactersStripped: stdoutPrepared.controlSequenceFindingCount + stderrPrepared.controlSequenceFindingCount > 0
  };
}

function prepareOutputPreviewText(text: string, showRawOutput: boolean): { text: string; redactionFindingCount: number; controlSequenceFindingCount: number } {
  const sanitized = stripTerminalControls(text);
  if (showRawOutput) {
    return {
      text: sanitized.text,
      redactionFindingCount: 0,
      controlSequenceFindingCount: sanitized.removedCount
    };
  }
  const redaction = createRedactionReport(sanitized.text, { includeRedactedText: true });
  return {
    text: redaction.redactedText ?? sanitized.text,
    redactionFindingCount: redaction.findings.reduce((sum, finding) => sum + finding.count, 0),
    controlSequenceFindingCount: sanitized.removedCount
  };
}

function argvReportFields(argv: string[], showRawArgv: boolean): Pick<ValidationRunReport, 'argvHash' | 'argvPreview' | 'argvRedacted' | 'argvPreviewLimitBytes' | 'argvPreviewTruncated' | 'argvOmittedBytes' | 'rawArgv'> {
  const prepared: Array<{ text: string; redactionFindingCount: number }> = [];
  let redactNext = false;
  for (const arg of argv) {
    const inlineSensitive = redactSensitiveInlineArg(arg);
    if (inlineSensitive) {
      prepared.push({ text: inlineSensitive, redactionFindingCount: 1 });
      redactNext = false;
      continue;
    }
    if (redactNext) {
      prepared.push({ text: '[REDACTED]', redactionFindingCount: 1 });
      redactNext = false;
      continue;
    }
    const entry = prepareOutputPreviewText(arg, false);
    prepared.push(entry);
    if (isSensitiveArgName(arg)) redactNext = true;
  }
  const bounded = boundArgvPreview(prepared.map((entry) => entry.text), ARGV_PREVIEW_LIMIT_BYTES);
  return {
    argvHash: hashText(argv.join('\0')),
    argvPreview: bounded.preview,
    argvRedacted: prepared.some((entry) => entry.redactionFindingCount > 0),
    argvPreviewLimitBytes: ARGV_PREVIEW_LIMIT_BYTES,
    argvPreviewTruncated: bounded.truncated,
    argvOmittedBytes: bounded.omittedBytes,
    ...(showRawArgv ? { rawArgv: argv } : {})
  };
}

function isSensitiveArgName(arg: string): boolean {
  const option = arg.trim();
  if (!option.startsWith('-') || option.includes('=')) return false;
  return isSensitiveOptionName(option);
}

function redactSensitiveInlineArg(arg: string): string | null {
  const separator = arg.indexOf('=');
  if (separator <= 0) return null;
  const name = arg.slice(0, separator);
  if (!isSensitiveOptionName(name)) return null;
  return `${name}=[REDACTED]`;
}

function isSensitiveOptionName(name: string): boolean {
  const normalized = name.replace(/^-+/, '').toLowerCase();
  if (!normalized) return false;
  const components = normalized.split(/[-_.:]/).filter(Boolean);
  return components.some((component) =>
    ['key', 'secret', 'token', 'password', 'credential', 'credentials', 'authorization', 'auth'].includes(component)
  );
}

function boundArgvPreview(argvPreview: string[], limitBytes: number): { preview: string[]; truncated: boolean; omittedBytes: number } {
  const preview: string[] = [];
  let usedBytes = 0;
  let omittedBytes = 0;
  let truncated = false;
  for (const arg of argvPreview) {
    const separatorBytes = preview.length > 0 ? 1 : 0;
    const argBytes = Buffer.byteLength(arg, 'utf8');
    const remaining = limitBytes - usedBytes - separatorBytes;
    if (remaining <= 0) {
      omittedBytes += separatorBytes + argBytes;
      truncated = true;
      continue;
    }
    if (argBytes <= remaining) {
      preview.push(arg);
      usedBytes += separatorBytes + argBytes;
      continue;
    }
    const marker = '[...argv truncated...]';
    const markerBytes = Buffer.byteLength(marker, 'utf8');
    const headLimit = Math.max(0, remaining - markerBytes);
    const head = utf8Head(arg, headLimit);
    const bounded = `${head}${marker}`;
    preview.push(bounded);
    omittedBytes += Math.max(0, argBytes - Buffer.byteLength(head, 'utf8'));
    usedBytes += separatorBytes + Buffer.byteLength(bounded, 'utf8');
    truncated = true;
  }
  return { preview, truncated, omittedBytes };
}

function stripTerminalControls(text: string): { text: string; removedCount: number } {
  let removedCount = 0;
  const replaceWithCount = (input: string, pattern: RegExp): string => input.replace(pattern, () => {
    removedCount += 1;
    return '';
  });
  let sanitized = replaceWithCount(text, /\x1B\][\s\S]*?(?:\x07|\x1B\\)/g);
  sanitized = replaceWithCount(sanitized, /\x1B\[[0-?]*[ -/]*[@-~]/g);
  sanitized = replaceWithCount(sanitized, /\x1B[@-Z\\-_]/g);
  sanitized = replaceWithCount(sanitized, /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g);
  return { text: sanitized, removedCount };
}

function boundedOutputPreview(text: string): { text: string; truncated: boolean; omittedBytes: number } {
  const bytes = Buffer.byteLength(text, 'utf8');
  if (bytes <= OUTPUT_PREVIEW_LIMIT_BYTES) return { text, truncated: false, omittedBytes: 0 };
  const markerReserveBytes = 96;
  const headLimit = Math.floor((OUTPUT_PREVIEW_LIMIT_BYTES - markerReserveBytes) / 2);
  const tailLimit = OUTPUT_PREVIEW_LIMIT_BYTES - markerReserveBytes - headLimit;
  const head = utf8Head(text, headLimit);
  const tail = utf8Tail(text, tailLimit);
  const omittedBytes = Math.max(0, bytes - Buffer.byteLength(head, 'utf8') - Buffer.byteLength(tail, 'utf8'));
  return {
    text: `${head}\n[... ${omittedBytes} bytes omitted ...]\n${tail}`,
    truncated: true,
    omittedBytes
  };
}

function utf8Head(text: string, maxBytes: number): string {
  let bytes = 0;
  let output = '';
  for (const char of text) {
    const charBytes = Buffer.byteLength(char, 'utf8');
    if (bytes + charBytes > maxBytes) break;
    output += char;
    bytes += charBytes;
  }
  return output;
}

function utf8Tail(text: string, maxBytes: number): string {
  let bytes = 0;
  const chars: string[] = [];
  const source = Array.from(text);
  for (let index = source.length - 1; index >= 0; index -= 1) {
    const char = source[index] ?? '';
    const charBytes = Buffer.byteLength(char, 'utf8');
    if (bytes + charBytes > maxBytes) break;
    chars.push(char);
    bytes += charBytes;
  }
  return chars.reverse().join('');
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

function classifyFailure(
  failureKind: ValidationRunReport['execution']['failureKind']
): ValidationRunReport['execution']['failureClass'] {
  if (failureKind === 'none') return 'none';
  if (failureKind === 'non-zero-exit') return 'assertion';
  if (failureKind === 'timeout') return 'timeout';
  return 'environment-setup';
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
  const timedOut = failureKind === 'timeout';
  const summary = `Validation "${options.check}" was blocked by ${failureKind}.`;
  return [
    {
      id: 'run-direct-command',
      kind: 'guidance',
      message: timedOut
        ? 'Rerun with a suitable --timeout-ms or run the command directly to diagnose why it exceeded the deadline.'
        : 'Run the validation command directly in the current environment to distinguish command failure from wrapper launch failure.'
    },
    {
      id: 'record-direct-validation-result',
      kind: 'command',
      message: 'Record an already-run direct result through validation run so TASK.md row sync and validation-check resolution tags remain consistent.',
      command: `hadara validation run --task ${options.taskId} --check ${shellSingleQuote(options.check)} --direct-result passed --direct-summary ${shellSingleQuote(timedOut ? 'Direct command completed after wrapper timeout.' : 'Direct command passed after wrapper launch failure.')}${options.updateTask ? ' --update-task' : ''} --json`
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
    schemaVersion: 'hadara.validation.run.v2',
    command: 'validation.run',
    ok: false,
    taskId: options.taskId,
    check: options.check,
    cwd: projectRoot,
    ...argvReportFields(options.argv, Boolean(options.showRawArgv)),
    execution: {
      exitCode: null,
      signal: null,
      timedOut: false,
      durationMs: 0,
      stdoutHash: hashText(''),
      stderrHash: hashText(''),
      commandStarted: false,
      failureKind: 'launch-error',
      failureClass: 'environment-setup',
      capture: {
        mode: 'direct',
        stdoutBytes: 0,
        stderrBytes: 0,
        ...outputPreviewFields('', '', false),
        fallbackUsed: false
      }
    },
    status: 'Blocked',
    detail: message,
    result: 'Blocked',
    attempt: {
      checkKey: validationCheckKey(options.check, options.argv),
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

function validationCheckKey(check: string, argv: string[]): string {
  const normalizedCheck = check.trim().replace(/\s+/g, ' ').toLowerCase();
  return crypto.createHash('sha256').update(`${normalizedCheck}\0${argv.join('\0')}`, 'utf8').digest('hex').slice(0, 16);
}

function validationCommandText(argv: string[]): string {
  return argv.length > 0 ? argv.join(' ') : 'direct-result';
}

function findUnresolvedFailedOrBlockedAttempts(taskDir: string, check: string, checkKey: string, commandText: string): string[] {
  const parsed = parseEvidenceIndexFile(path.join(taskDir, 'evidence.jsonl'), taskIdFromTaskDir(taskDir));
  const records = parsed.records;
  const unresolved: string[] = [];
  for (const record of records) {
    if (!isValidationAttemptForCheck(record, check, checkKey, commandText)) continue;
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

// A record only counts as an attempt at the same check when both the check
// name and the underlying command match. Matching on check name alone would
// let a validation run with a swapped command (e.g. a no-op) silently
// auto-resolve an unrelated earlier command's failure under a reused name.
function isValidationAttemptForCheck(record: EvidenceListRecord, check: string, checkKey: string, commandText: string): boolean {
  if (record.category !== 'validation') return false;
  if (record.tags.includes(`validation-check:${checkKey}`)) return true;
  if (extractValidationCheckFromSummary(record.summary) !== check) return false;
  return extractValidationCommandFromSummary(record.summary) === commandText;
}

function extractValidationCheckFromSummary(summary: string): string | undefined {
  return /^Validation "([^"]+)"\s/.exec(summary)?.[1];
}

function extractValidationCommandFromSummary(summary: string): string | undefined {
  return /;\s*command:\s*([^;]*);/.exec(summary)?.[1]?.trim();
}

function taskIdFromTaskDir(taskDir: string): string {
  const name = path.basename(taskDir);
  return /^T-\d+/.exec(name)?.[0] ?? name;
}

function updateTaskValidationRow(projectRoot: string, taskDir: string, check: string, command: string, status: ValidationRunReport['status'], detail: string, evidenceId: string): ValidationRunReport['taskValidationRow'] {
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
  const hasDetail = header.includes('Detail');
  const nextRow = header[1] === 'Gate'
    ? formatMarkdownTableRow(hasDetail ? [check, 'Yes', status, detail, evidenceId] : [check, 'Yes', status, evidenceId])
    : formatMarkdownTableRow(hasDetail ? [check, safeCommand, 'Yes', status, detail, evidenceId] : [check, safeCommand, 'Yes', status, evidenceId]);
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

function validationDetail(
  options: ValidationRunOptions,
  status: ValidationRunReport['status'],
  exitCode: number | null,
  durationMs: number,
  blockedReason: string | null
): string {
  const value = options.directSummary
    ?? blockedReason
    ?? (status === 'Passed' ? `exit 0 in ${durationMs}ms` : `exit ${exitCode ?? 'null'} in ${durationMs}ms`);
  return value.replace(/[|\r\n]/g, ' ').trim().slice(0, 160);
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
