import { createStateProjectionReport, formatStateProjectionReport } from '../services/state-projection';

export interface StateCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleStateCommand(input: StateCommandInput): boolean {
  if (input.args[0] !== 'state' || input.args[1] !== 'verify') return false;
  const report = createStateProjectionReport(input.projectRoot);
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatStateProjectionReport(report));
  }
  return true;
}
