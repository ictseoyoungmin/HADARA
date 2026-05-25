import { createWritePreflightReport } from '../services/write-preflight';

export interface WritePreflightCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleWriteCommand(input: WritePreflightCommandInput): boolean {
  if (input.args[0] !== 'write') return false;
  const sub = input.args[1];
  if (sub !== 'preflight') return false;

  const report = createWritePreflightReport(input.projectRoot, input.args.slice(2));
  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`[HADARA] Write preflight for ${report.command}: ${report.ok ? 'ok' : 'not ok'}`);
    for (const writePath of report.writes) {
      console.log(`- ${writePath}`);
    }
    for (const issue of report.issues) {
      console.log(`[${issue.severity}] ${issue.code}: ${issue.message}`);
    }
  }
  if (!report.ok) process.exitCode = 6;
  return true;
}
