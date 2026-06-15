import { createOpsStatusReport, formatOpsStatusReport } from '../services/operations-status-service';

export interface StatusCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleStatusCommand(input: StatusCommandInput): boolean {
  if (input.args[0] !== 'status') return false;
  printStatus(input.projectRoot, input.jsonOutput);
  return true;
}

export function handleOpsCommand(input: StatusCommandInput): boolean {
  if (input.args[0] !== 'ops' || input.args[1] !== 'status') return false;
  printStatus(input.projectRoot, input.jsonOutput);
  return true;
}

function printStatus(projectRoot: string, jsonOutput: boolean): void {
  const report = createOpsStatusReport(projectRoot, { includeStateConsistency: true });
  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatOpsStatusReport(report));
  }
}
