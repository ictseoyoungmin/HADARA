import { createReleaseGateReport } from '../services/operational-debt';

export interface ReleaseGateCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleReleaseGateCommand(input: ReleaseGateCommandInput): boolean {
  if (input.args[0] !== 'release' || input.args[1] !== 'gate') return false;
  const report = createReleaseGateReport(input.projectRoot);
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    for (const check of report.checks) {
      console.log(`${check.status} | ${check.name} | ${check.summary}`);
    }
  }
  return true;
}
