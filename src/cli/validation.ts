import { createValidationRunReport } from '../services/validation-run';
import { getFlag, getIntegerOption, getRequiredStringOption } from './args';
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
  const report = createValidationRunReport(input.projectRoot, {
    taskId,
    check,
    argv: commandArgs,
    tags: resolutionTagsFromArgs(optionArgs),
    timeoutMs: getIntegerOption(optionArgs, '--timeout-ms', { min: 1, max: 3_600_000 }),
    updateTask: getFlag(optionArgs, '--update-task')
  });
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`[HADARA] validation run ${taskId}: ${report.result}`);
    console.log(`[HADARA] child command`);
    console.log(`command=${report.argv.join(' ')}`);
    console.log(`exitCode=${report.execution.exitCode ?? 'null'} signal=${report.execution.signal ?? 'null'} durationMs=${report.execution.durationMs}`);
    console.log(`stdoutHash=${report.execution.stdoutHash}`);
    console.log(`stderrHash=${report.execution.stderrHash}`);
    console.log(`childOutput=not printed; stdout/stderr hashes are recorded in HADARA evidence`);
    console.log(`[HADARA] evidence`);
    if (report.evidence) console.log(`id=${report.evidence.id}`);
    console.log(`result=${report.result}`);
    console.log(`taskValidationRow=${report.taskValidationRow.mode}${report.taskValidationRow.updated ? ' updated' : ' not-updated'}`);
    console.log(`acceptanceRows=not-updated`);
    for (const issue of report.issues) console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
    if (report.nextActions.length > 0) console.log(`[HADARA] next actions`);
    for (const action of report.nextActions) console.log(`${action.id}=${action.command ?? action.message}`);
  }
  if (!report.ok || report.result !== 'Passed') process.exitCode = 6;
  return true;
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
