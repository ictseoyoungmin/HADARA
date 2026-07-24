import { getFlag, getIntegerOption, getStringOption } from './args';
import { createContextCacheStatusReport, createContextCacheWarmReport } from '../context/context-cache-store';
import { buildContextGraphReport } from '../context/context-graph-builder';
import { buildContextSliceReport } from '../context/context-slice';

export interface ContextCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleContextCommand(input: ContextCommandInput): boolean {
  const sub = input.args[1];
  if (sub === 'graph') return handleContextGraphCommand(input);
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
