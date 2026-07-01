import { createValidationRunReport } from '../services/validation-run';
import { getFlag, getIntegerOption, getRequiredStringOption } from './args';
import { createLegacyMutationBlockedReport, printLegacyMutationBlockedReport } from './legacy-boundary';

export interface ValidationCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleValidationCommand(input: ValidationCommandInput): boolean {
  const sub = input.args[1];
  if (sub !== 'run') return false;
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
    if (report.evidence) console.log(`evidence=${report.evidence.id}`);
    if (!report.taskValidationRow.updated) console.log(`taskValidationRow=${report.taskValidationRow.mode}`);
    for (const issue of report.issues) console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
  }
  if (!report.ok) process.exitCode = 6;
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
