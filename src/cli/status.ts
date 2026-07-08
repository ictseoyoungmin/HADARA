import {
  createOpsStatusReport,
  createOpsStatusStateReport,
  createOpsStatusSummaryReport,
  formatOpsStatusReport
} from '../services/operations-status-service';
import { CliArgsError, getFlag, getIntegerOption, getStringOption } from './args';
import { printCommandRemovedReport } from './removed-command';

export interface StatusCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleStatusCommand(input: StatusCommandInput): boolean {
  if (input.args[0] !== 'status') return false;
  printStatus(input);
  return true;
}

export function handleOpsCommand(input: StatusCommandInput): boolean {
  if (input.args[0] !== 'ops' || input.args[1] !== 'status') return false;
  return printCommandRemovedReport(
    {
      commandId: 'ops.status',
      removedCommand: 'hadara ops status',
      replacementCommand: 'hadara status --json',
      note: 'Operations status is consolidated under the top-level status command.'
    },
    input.jsonOutput
  );
}

function printStatus(input: StatusCommandInput): void {
  const detail = getStringOption(input.args, '--detail', 'fast');
  if (detail !== 'fast' && detail !== 'full') throw new CliArgsError('CLI_OPTION_INVALID_VALUE', '--detail must be fast or full');
  const stateIssueLimit = getIntegerOption(input.args, '--state-issue-limit', { fallback: 10, min: 0, max: 100 }) ?? 10;

  if (getFlag(input.args, '--state-only')) {
    const report = createOpsStatusStateReport(input.projectRoot, stateIssueLimit);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log([
        '[HADARA] Status State',
        `consistent: ${report.stateConsistency.consistent}`,
        `issues: errors ${report.stateConsistency.issueCounts.error}, warnings ${report.stateConsistency.issueCounts.warning}, info ${report.stateConsistency.issueCounts.info}`,
        `latestDoneTaskId: ${report.stateConsistency.latestDoneTaskId ?? 'none'}`,
        `activeTaskIds: ${report.stateConsistency.activeTaskIds.join(', ') || 'none'}`
      ].join('\n'));
    }
    return;
  }

  if (getFlag(input.args, '--summary-json')) {
    const report = createOpsStatusSummaryReport(input.projectRoot, {
      includeStateConsistency: getFlag(input.args, '--include-state'),
      stateIssueLimit,
      maxTextLength: 240
    });
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const report = createOpsStatusReport(input.projectRoot, detail === 'full'
    ? { includeStateConsistency: true, stateIssueLimit }
    : {
        includeDebt: false,
        includeKnownProblems: false,
        includeStateConsistency: false,
        taskStatusSource: 'task-board',
        maxTextLength: 240
      });
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatOpsStatusReport(report));
  }
}
