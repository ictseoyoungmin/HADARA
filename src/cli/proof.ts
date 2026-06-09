import { getRequiredStringOption } from './args';
import { createProofStatusReport } from '../services/proof-status';

export interface ProofCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleProofCommand(input: ProofCommandInput): boolean {
  if (input.args[0] !== 'proof') return false;
  const sub = input.args[1];
  if (sub !== 'status' && sub !== 'explain') return false;

  const taskId = getRequiredStringOption(input.args, '--task');
  const report = createProofStatusReport(input.projectRoot, taskId, sub);
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`[HADARA] proof ${sub} ${taskId}: ${report.verdict}`);
    console.log(`freshness: ${report.freshness.status}`);
    for (const issue of [...report.blockers, ...report.warnings]) {
      console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
    }
  }
  if (!report.ok) process.exitCode = 6;
  return true;
}
