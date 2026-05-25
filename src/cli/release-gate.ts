import { createReleaseGateReport } from '../services/operational-debt';
import { getStringOption } from './args';

export interface ReleaseGateCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleReleaseGateCommand(input: ReleaseGateCommandInput): boolean {
  if (input.args[0] !== 'release' || input.args[1] !== 'gate') return false;
  const mode = parseReleaseGateMode(input.args);
  const report = createReleaseGateReport(input.projectRoot, mode);
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    for (const check of report.checks) {
      console.log(`${check.status} | ${check.name} | ${check.summary}`);
    }
  }
  return true;
}

function parseReleaseGateMode(args: string[]): 'advisory' | 'strict' {
  const value = getStringOption(args, '--mode', 'advisory');
  if (value === 'advisory' || value === 'strict') return value;
  throw new Error(`unsupported release gate mode: ${value}`);
}
