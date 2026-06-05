import { updateHandoff } from '../handoff/handoff';
import { createHandoffSuggestionReport, formatHandoffSuggestionReport } from '../handoff/handoff-suggestion';
import { getFlag, getStringOption } from './args';

export interface HandoffCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleHandoffCommand(input: HandoffCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'suggest') {
    const taskId = getStringOption(input.args, '--task') ?? input.args[2];
    if (!taskId || taskId.startsWith('--')) throw new Error('handoff suggest requires --task <task-id>');
    const report = createHandoffSuggestionReport(input.projectRoot, taskId, { executeRequested: getFlag(input.args, '--execute') });
    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatHandoffSuggestionReport(report));
    }
    if (!report.ok) process.exitCode = 6;
    return true;
  }

  if (sub !== 'update') return false;

  const taskId = getStringOption(input.args, '--task');
  const summary = getStringOption(input.args, '--summary');
  const nextStep = getStringOption(input.args, '--next');
  const filePath = updateHandoff({ projectRoot: input.projectRoot, taskId, summary, nextStep });
  console.log(`[HADARA] Handoff updated: ${filePath}`);
  return true;
}
