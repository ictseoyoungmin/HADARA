import {
  createDocsProtocolConsistencyReport,
  createProfileProtocolConsistencyReport,
  createTaskProtocolConsistencyReport,
  ProtocolConsistencyReport
} from '../services/protocol-consistency';
import { createProtocolRemediateReport, ProtocolRemediationFix } from '../services/protocol-remediation';
import { CliArgsError, getFlag, getStringOption } from './args';

export interface ProtocolCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleProtocolCommand(input: ProtocolCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'remediate') return handleProtocolRemediateCommand(input);
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
  } else if (scope === 'profile') {
    report = createProfileProtocolConsistencyReport(input.projectRoot);
    label = 'profile';
  } else if (scope) {
    throw new CliArgsError('CLI_OPTION_INVALID_VALUE', `unsupported protocol doctor scope: ${scope}`);
  } else {
    throw new CliArgsError('CLI_OPTION_REQUIRED', '--task or --scope docs|profile is required');
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

function handleProtocolRemediateCommand(input: ProtocolCommandInput): boolean {
  const fix = getStringOption(input.args, '--fix') as ProtocolRemediationFix | undefined;
  if (!fix) throw new CliArgsError('CLI_OPTION_REQUIRED', '--fix is required');
  if (!isSupportedFix(fix)) throw new CliArgsError('CLI_OPTION_INVALID_VALUE', `unsupported protocol remediation fix: ${fix}`);

  const profile = getStringOption(input.args, '--profile');
  if (profile !== undefined && profile !== 'basic' && profile !== 'standard' && profile !== 'governed') {
    throw new CliArgsError('CLI_OPTION_INVALID_VALUE', `unsupported HADARA profile: ${profile}`);
  }

  const report = createProtocolRemediateReport({
    projectRoot: input.projectRoot,
    fix,
    mode: getFlag(input.args, '--execute') ? 'execute' : 'dry-run',
    taskId: getStringOption(input.args, '--task'),
    profile
  });

  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else if (report.ok) {
    console.log(`[HADARA] Protocol remediation ${report.mode}: ${fix}`);
    for (const action of report.actions) {
      console.log(`- ${action.status}: ${action.summary}${action.path ? ` (${action.path})` : ''}`);
    }
  } else {
    console.log(`[HADARA] Protocol remediation failed: ${fix}`);
    for (const issue of report.issues) console.log(`- ${issue.code}: ${issue.message}${issue.path ? ` (${issue.path})` : ''}`);
  }

  if (!report.ok) process.exitCode = 6;
  return true;
}

function isSupportedFix(value: string): value is ProtocolRemediationFix {
  return value === 'task-board-row' || value === 'decisions-table-frame' || value === 'project-state-profile' || value === 'evidence-jsonl';
}
