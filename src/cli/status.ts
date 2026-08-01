import {
  createOpsStatusReport,
  formatOpsStatusReport
} from '../services/operations-status-service';
import { CliArgsError, getFlag, getStringOption } from './args';
import { handleTaskCommand } from './task';

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

function printStatus(input: StatusCommandInput): void {
  if (input.args[1] === 'baseline' && input.args[2] === 'promote') {
    throw new CliArgsError('CLI_OPTION_INVALID_VALUE', 'status baseline promote was removed before 0.5 stable; record validation in the Task Capsule and update project-authored state deliberately.');
  }

  const compat = getStringOption(input.args, '--compat');
  if (compat && compat !== 'v1') throw new CliArgsError('CLI_OPTION_INVALID_VALUE', '--compat must be v1');

  if (!compat) {
    if (getFlag(input.args, '--state-only') || getFlag(input.args, '--summary-json') || getFlag(input.args, '--state-issue-limit')) {
      throw new CliArgsError(
        'CLI_OPTION_INVALID_VALUE',
        'Top-level status diagnostics were retired from the primary lifecycle. Use `hadara task status --json` or the explicit `hadara status --compat v1 --json` route.'
      );
    }
    handleTaskCommand({
      args: ['task', 'status', ...input.args.slice(1)],
      projectRoot: input.projectRoot,
      jsonOutput: input.jsonOutput
    });
    return;
  }

  const detail = getStringOption(input.args, '--detail', 'fast');
  if (detail !== 'fast' && detail !== 'full') throw new CliArgsError('CLI_OPTION_INVALID_VALUE', '--detail must be fast or full');
  const stateIssueLimit = 10;
  const report = createOpsStatusReport(input.projectRoot, detail === 'full'
    ? { includeStateConsistency: true, stateIssueLimit }
    : {
        includeDebt: false,
        includeKnownProblems: false,
        includeStateConsistency: false,
        taskStatusSource: 'task-board',
        maxTextLength: 240
      });
  const compatReport = withStatusV1CompatibilityMetadata(report);
  if (input.jsonOutput) {
    console.log(JSON.stringify(compatReport, null, 2));
  } else {
    console.log([
      formatOpsStatusReport(report),
      '',
      '[HADARA] Compatibility',
      'default: hadara status --json aliases hadara task status --json',
      'legacy: this v1 report is available through hadara status --compat v1 --json during 0.5.x'
    ].join('\n'));
  }
}

function withStatusV1CompatibilityMetadata<T extends { schemaVersion: string }>(report: T): T & {
  compatibility: {
    defaultSchemaVersion: 'hadara.task.status.summary.v1';
    recommendedCommand: 'hadara task status --json';
    migration: string;
  };
} {
  return {
    ...report,
    compatibility: {
      defaultSchemaVersion: 'hadara.task.status.summary.v1',
      recommendedCommand: 'hadara task status --json',
      migration: 'This v1 status report is an explicit 0.5.x compatibility route for legacy status/read-model consumers. New agents should use hadara task status --json.'
    }
  };
}
