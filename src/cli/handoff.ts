import { updateHandoff } from '../handoff/handoff';
import { getStringOption } from './args';

export interface HandoffCommandInput {
  args: string[];
  projectRoot: string;
}

export function handleHandoffCommand(input: HandoffCommandInput): boolean {
  const sub = input.args[1];
  if (sub !== 'update') return false;

  const taskId = getStringOption(input.args, '--task');
  const summary = getStringOption(input.args, '--summary');
  const nextStep = getStringOption(input.args, '--next');
  const filePath = updateHandoff({ projectRoot: input.projectRoot, taskId, summary, nextStep });
  console.log(`[HADARA] Handoff updated: ${filePath}`);
  return true;
}
