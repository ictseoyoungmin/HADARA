import { getFlag, getIntegerOption, getStringOption } from './args';
import { createContextCacheStatusReport, createContextCacheWarmReport } from '../context/context-cache-store';
import { buildContextGraphReport } from '../context/context-graph-builder';
import { buildContextPackReport, buildTaskRequiredContextPackReport, type ContextBudget } from '../context/context-pack';
import { buildContextSliceReport } from '../context/context-slice';

export interface ContextCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleContextCommand(input: ContextCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'graph') return handleContextGraphCommand(input);
  if (sub === 'pack') return handleContextPackCommand(input);
  if (sub === 'slice') return handleContextSliceCommand(input);
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
  const includeCode = input.args.includes('--include-code') ? true : undefined;
  const live = getFlag(input.args, '--live');
  const budget = contextPackBudgetFromArgs(input.args);
  const report = !taskId && !live
    ? buildTaskRequiredContextPackReport({
      projectRoot: input.projectRoot,
      ...(Object.keys(budget).length > 0 ? { budget } : {})
    })
    : buildContextPackReport({
      projectRoot: input.projectRoot,
      ...(includeCode !== undefined ? { includeCode } : {}),
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

function handleContextSliceCommand(input: ContextCommandInput): boolean {
  const report = buildContextSliceReport({
    projectRoot: input.projectRoot,
    path: getStringOption(input.args, '--path'),
    from: getIntegerOption(input.args, '--from', { min: 1 }),
    to: getIntegerOption(input.args, '--to', { min: 1 }),
    symbol: getStringOption(input.args, '--symbol'),
    keyword: getStringOption(input.args, '--keyword'),
    window: getIntegerOption(input.args, '--window', { min: 0, max: 500 }),
    tail: getIntegerOption(input.args, '--tail', { min: 1, max: 1000 }),
    managedSection: getStringOption(input.args, '--managed-section'),
    taskId: getStringOption(input.args, '--task'),
    candidateId: getStringOption(input.args, '--candidate'),
    includeCode: getFlag(input.args, '--include-code')
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
  if (action !== 'status' && action !== 'warm') return false;
  const report = action === 'status'
    ? createContextCacheStatusReport({ projectRoot: input.projectRoot })
    : createContextCacheWarmReport({ projectRoot: input.projectRoot, execute: getFlag(input.args, '--execute') });
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
