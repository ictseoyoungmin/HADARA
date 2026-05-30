import { createTaskProtocolConsistencyReport } from '../services/protocol-consistency';
import { getRequiredStringOption } from './args';

export interface ProtocolCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleProtocolCommand(input: ProtocolCommandInput): boolean {
  const sub = input.args[1];
  if (sub !== 'doctor') return false;

  const taskId = getRequiredStringOption(input.args, '--task');
  const report = createTaskProtocolConsistencyReport(input.projectRoot, taskId);
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else if (report.ok && report.issues.length === 0) {
    console.log(`[HADARA] Protocol doctor passed: ${taskId}`);
  } else if (report.ok) {
    console.log(`[HADARA] Protocol doctor found warnings: ${taskId}`);
    for (const issue of report.issues) {
      console.log(`- ${issue.code}: ${issue.message}${issue.path ? ` (${issue.path})` : ''}`);
    }
  } else {
    console.log(`[HADARA] Protocol doctor found errors: ${taskId}`);
    for (const issue of report.issues) {
      console.log(`- ${issue.code}: ${issue.message}${issue.path ? ` (${issue.path})` : ''}`);
    }
  }

  if (!report.ok) process.exitCode = 6;
  return true;
}
