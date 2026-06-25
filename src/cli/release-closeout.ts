import { createReleaseCloseoutReport, formatReleaseCloseoutReport } from '../services/release-closeout';
import { getStringOption } from './args';

export interface ReleaseCloseoutCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleReleaseCloseoutCommand(input: ReleaseCloseoutCommandInput): boolean {
  if (input.args[0] !== 'release' || input.args[1] !== 'closeout') return false;
  const report = createReleaseCloseoutReport(input.projectRoot, {
    version: getStringOption(input.args, '--version'),
    taskId: getStringOption(input.args, '--task')
  });

  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatReleaseCloseoutReport(report));
  }
  if (!report.ok) process.exitCode = 6;
  return true;
}
