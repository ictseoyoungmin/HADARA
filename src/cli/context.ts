import { getFlag, getIntegerOption, getStringOption } from './args';
import { createContextCacheStatusReport } from '../context/context-cache-store';
import { buildContextGraphReport } from '../context/context-graph-builder';
import { buildContextPackReport, type ContextBudget } from '../context/context-pack';

export interface ContextCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleContextCommand(input: ContextCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'graph') return handleContextGraphCommand(input);
  if (sub === 'pack') return handleContextPackCommand(input);
  if (sub === 'cache') return handleContextCacheCommand(input);
  return false;
}

function handleContextGraphCommand(input: ContextCommandInput): boolean {
  const taskId = getStringOption(input.args, '--task');
  const includeCode = getFlag(input.args, '--include-code');
  const report = buildContextGraphReport({
    projectRoot: input.projectRoot,
    includeCode,
    ...(taskId ? { taskId, mode: 'task' } : { mode: 'full' })
  });

  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(JSON.stringify(report, null, 2));
  }
  if (!report.ok) process.exitCode = 6;
  return true;
}

function handleContextPackCommand(input: ContextCommandInput): boolean {
  const taskId = getStringOption(input.args, '--task');
  const includeCode = getFlag(input.args, '--include-code');
  const budget = contextPackBudgetFromArgs(input.args);
  const report = buildContextPackReport({
    projectRoot: input.projectRoot,
    includeCode,
    ...(taskId ? { taskId } : {}),
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

function handleContextCacheCommand(input: ContextCommandInput): boolean {
  const action = input.args[2];
  if (action !== 'status') return false;
  const report = createContextCacheStatusReport({ projectRoot: input.projectRoot });
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(JSON.stringify(report, null, 2));
  }
  if (!report.ok) process.exitCode = 6;
  return true;
}

function contextPackBudgetFromArgs(args: string[]): Partial<ContextBudget> {
  const targetTokens = getIntegerOption(args, '--budget', { min: 1 });
  const maxItems = getIntegerOption(args, '--max-items', { min: 1, max: 500 });
  const maxReadFirstItems = getIntegerOption(args, '--max-read-first', { min: 1, max: 100 });
  return {
    ...(targetTokens !== undefined ? { targetTokens } : {}),
    ...(maxItems !== undefined ? { maxItems } : {}),
    ...(maxReadFirstItems !== undefined ? { maxReadFirstItems } : {})
  };
}
