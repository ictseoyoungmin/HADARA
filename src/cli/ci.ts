import { getStringOption } from './args';
import { createCiGateReport, CiGateMode } from '../services/ci-gate';

export interface CiCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleCiCommand(input: CiCommandInput): boolean {
  if (input.args[0] !== 'ci' || input.args[1] !== 'gate') return false;
  const mode = parseCiGateMode(getStringOption(input.args, '--mode', 'advisory') ?? 'advisory');
  const report = createCiGateReport(input.projectRoot, mode, { taskId: getStringOption(input.args, '--task') });
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`[HADARA] ci gate ${mode}: ${report.ok ? 'ok' : 'blocked'} | blockers ${report.blockers.length} | warnings ${report.warnings.length}`);
  }
  if (!report.ok) process.exitCode = 6;
  return true;
}

function parseCiGateMode(value: string): CiGateMode {
  if (value === 'advisory' || value === 'strict') return value;
  throw new Error(`unsupported ci gate mode: ${value}`);
}
