import { getFlag, getIntegerOption, getStringOption } from './args';
import { buildSessionStartReport } from '../context/session-start';
import type { ContextBudget } from '../context/context-pack';

export interface SessionCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleSessionCommand(input: SessionCommandInput): boolean {
  const sub = input.args[1];
  if (sub !== 'start') return false;

  const budget = sessionStartBudgetFromArgs(input.args);
  const report = buildSessionStartReport({
    projectRoot: input.projectRoot,
    taskId: getStringOption(input.args, '--task'),
    includeCode: getFlag(input.args, '--include-code'),
    allowLiveContextPack: getFlag(input.args, '--live'),
    ...(Object.keys(budget).length > 0 ? { budget } : {})
  });

  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(JSON.stringify(report, null, 2));
  }
  if (!report.ok) process.exitCode = 6;
  return true;
}

function sessionStartBudgetFromArgs(args: string[]): Partial<ContextBudget> {
  const targetTokens = getIntegerOption(args, '--budget', { min: 1 });
  const maxItems = getIntegerOption(args, '--max-items', { min: 1, max: 200 });
  const maxReadFirstItems = getIntegerOption(args, '--max-read-first', { min: 1, max: 50 });
  return {
    ...(targetTokens !== undefined ? { targetTokens } : {}),
    ...(maxItems !== undefined ? { maxItems } : {}),
    ...(maxReadFirstItems !== undefined ? { maxReadFirstItems } : {})
  };
}
