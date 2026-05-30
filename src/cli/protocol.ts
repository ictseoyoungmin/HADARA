import { createDocsProtocolConsistencyReport, createTaskProtocolConsistencyReport, ProtocolConsistencyReport } from '../services/protocol-consistency';
import { CliArgsError, getStringOption } from './args';

export interface ProtocolCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleProtocolCommand(input: ProtocolCommandInput): boolean {
  const sub = input.args[1];
  if (sub !== 'doctor') return false;

  const taskId = getStringOption(input.args, '--task');
  const scope = getStringOption(input.args, '--scope');
  let report: ProtocolConsistencyReport;
  let label: string;

  if (taskId && scope) {
    throw new CliArgsError('CLI_OPTION_INVALID_VALUE', '--task and --scope cannot be used together');
  } else if (taskId) {
    report = createTaskProtocolConsistencyReport(input.projectRoot, taskId);
    label = taskId;
  } else if (scope === 'docs') {
    report = createDocsProtocolConsistencyReport(input.projectRoot);
    label = 'docs';
  } else if (scope) {
    throw new CliArgsError('CLI_OPTION_INVALID_VALUE', `unsupported protocol doctor scope: ${scope}`);
  } else {
    throw new CliArgsError('CLI_OPTION_REQUIRED', '--task or --scope docs is required');
  }

  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else if (report.ok && report.issues.length === 0) {
    console.log(`[HADARA] Protocol doctor passed: ${label}`);
  } else if (report.ok) {
    console.log(`[HADARA] Protocol doctor found warnings: ${label}`);
    for (const issue of report.issues) {
      console.log(`- ${issue.code}: ${issue.message}${issue.path ? ` (${issue.path})` : ''}`);
    }
  } else {
    console.log(`[HADARA] Protocol doctor found errors: ${label}`);
    for (const issue of report.issues) {
      console.log(`- ${issue.code}: ${issue.message}${issue.path ? ` (${issue.path})` : ''}`);
    }
  }

  if (!report.ok) process.exitCode = 6;
  return true;
}
