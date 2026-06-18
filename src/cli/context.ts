import { getStringOption } from './args';
import { buildContextGraphReport } from '../context/context-graph-builder';

export interface ContextCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleContextCommand(input: ContextCommandInput): boolean {
  const sub = input.args[1];
  if (sub !== 'graph') return false;

  const taskId = getStringOption(input.args, '--task');
  const report = buildContextGraphReport({
    projectRoot: input.projectRoot,
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
