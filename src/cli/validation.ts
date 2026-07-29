import { createValidationRunReport } from '../services/validation-run';
import { CliArgsError, getFlag, getIntegerOption, getRequiredStringOption, getStringOption } from './args';
import { renderCommandHelp } from './help';
import { createLegacyMutationBlockedReport, printLegacyMutationBlockedReport } from './legacy-boundary';

export interface ValidationCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleValidationCommand(input: ValidationCommandInput): boolean {
  const sub = input.args[1];
  if (sub !== 'run') return false;
  if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
    console.log(renderCommandHelp('validation.run'));
    return true;
  }
  if (blockLegacyMutation(input, 'validation.run')) return true;
  const separator = input.args.indexOf('--');
  const commandArgs = separator >= 0 ? input.args.slice(separator + 1) : [];
  const optionArgs = separator >= 0 ? input.args.slice(0, separator) : input.args;
  const taskId = getRequiredStringOption(optionArgs, '--task');
  const check = getRequiredStringOption(optionArgs, '--check');
  const directResult = parseDirectResult(getStringOption(optionArgs, '--direct-result'));
  const report = createValidationRunReport(input.projectRoot, {
    taskId,
    check,
    argv: commandArgs,
    tags: resolutionTagsFromArgs(optionArgs),
    timeoutMs: getIntegerOption(optionArgs, '--timeout-ms', { min: 1, max: 3_600_000 }),
    updateTask: getFlag(optionArgs, '--update-task'),
    directResult,
    directSummary: getStringOption(optionArgs, '--direct-summary'),
    showRawOutput: getFlag(optionArgs, '--show-raw-output'),
    showRawArgv: getFlag(optionArgs, '--show-raw-argv')
  });
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`[HADARA] validation run ${taskId}: ${report.status}`);
    console.log(`[HADARA] child command`);
    console.log(`argvHash=${report.argvHash}`);
    console.log(`argvPreview=${report.argvPreview.join(' ')}`);
    console.log(`argvRedacted=${report.argvRedacted}`);
    console.log(`exitCode=${report.execution.exitCode ?? 'null'} signal=${report.execution.signal ?? 'null'} durationMs=${report.execution.durationMs}`);
    console.log(`failureClass=${report.execution.failureClass}`);
    console.log(`stdoutHash=${report.execution.stdoutHash}`);
    console.log(`stderrHash=${report.execution.stderrHash}`);
    console.log(`previewMode=${report.execution.capture.previewMode} redacted=${report.execution.capture.redacted} redactionFindingCount=${report.execution.capture.redactionFindingCount} omittedBytes=${report.execution.capture.omittedBytes}`);
    printChildOutput('stdout', report.execution.capture.stdoutPreview, report.execution.capture.stdoutTruncated, report.execution.capture.previewLimitBytes);
    printChildOutput('stderr', report.execution.capture.stderrPreview, report.execution.capture.stderrTruncated, report.execution.capture.previewLimitBytes);
    console.log(`[HADARA] evidence`);
    if (report.evidence) console.log(`id=${report.evidence.id}`);
    if (report.evidence?.appendLock.contended) console.log(`appendLock=waited ${report.evidence.appendLock.waitedMs}ms at ${report.evidence.appendLock.path}`);
    console.log(`status=${report.status}`);
    console.log(`detail=${report.detail}`);
    console.log(`taskValidationRow=${formatTaskValidationRow(report.taskValidationRow)}`);
    console.log(`acceptanceRows=not-updated`);
    for (const issue of report.issues) console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
    if (report.nextActions.length > 0) console.log(`[HADARA] next actions`);
    for (const action of report.nextActions) console.log(`${action.id}=${action.command ?? action.message}`);
  }
  if (!report.ok || report.status !== 'Passed') process.exitCode = 6;
  return true;
}

function printChildOutput(name: 'stdout' | 'stderr', text: string, truncated: boolean, limitBytes: number): void {
  console.log(`[HADARA] child ${name}${truncated ? ` (truncated to ${limitBytes} bytes)` : ''}`);
  console.log(text.length > 0 ? text : '(empty)');
}

function formatTaskValidationRow(row: { mode: string; updated: boolean }): string {
  const updateState = row.updated ? 'updated' : 'not-updated';
  return row.mode === updateState ? updateState : `${row.mode} ${updateState}`;
}

function parseDirectResult(value: string | undefined): 'Passed' | 'Failed' | 'Blocked' | undefined {
  if (value === undefined) return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'passed' || normalized === 'pass') return 'Passed';
  if (normalized === 'failed' || normalized === 'fail') return 'Failed';
  if (normalized === 'blocked' || normalized === 'block') return 'Blocked';
  throw new CliArgsError('CLI_OPTION_INVALID_VALUE', '--direct-result must be passed, failed, or blocked');
}

function blockLegacyMutation(input: ValidationCommandInput, command: string): boolean {
  const report = createLegacyMutationBlockedReport(input.projectRoot, command);
  if (!report) return false;
  printLegacyMutationBlockedReport(report, input.jsonOutput);
  process.exitCode = 6;
  return true;
}

function resolutionTagsFromArgs(args: string[]): string[] | undefined {
  const tags: string[] = [];
  for (const id of getRepeatedStringOptions(args, '--resolves')) tags.push(`resolves:${id}`);
  for (const id of getRepeatedStringOptions(args, '--supersedes')) tags.push(`supersedes:${id}`);
  return tags.length > 0 ? tags : undefined;
}

function getRepeatedStringOptions(args: string[], option: string): string[] {
  const values: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] !== option) continue;
    const value = args[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`missing value for ${option}`);
    values.push(value);
  }
  return values;
}
