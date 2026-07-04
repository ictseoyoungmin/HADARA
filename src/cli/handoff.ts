import { createHandoffStaleProblemsReport, formatHandoffStaleProblemsReport } from '../handoff/handoff-stale-problems';
import { createHandoffSuggestionReport, formatHandoffSuggestionReport } from '../handoff/handoff-suggestion';
import { getActorContextOption } from './actor';
import { getFlag, getStringOption } from './args';

export interface HandoffCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleHandoffCommand(input: HandoffCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'stale-problems') {
    const report = createHandoffStaleProblemsReport(input.projectRoot);
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatHandoffStaleProblemsReport(report));
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub === 'suggest') {
    const taskId = getStringOption(input.args, '--task') ?? input.args[2];
    if (!taskId || taskId.startsWith('--')) throw new Error('handoff suggest requires --task <task-id>');
    const report = createHandoffSuggestionReport(input.projectRoot, taskId, { executeRequested: getFlag(input.args, '--execute'), actor: getActorContextOption(input.args) });
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatHandoffSuggestionReport(report));
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  return false;
}
