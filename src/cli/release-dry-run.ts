import { createReleaseDryRunReport } from '../services/release-dry-run';

export interface ReleaseDryRunCommandInput {
  args: string[];
  projectRoot: string;
  jsonOutput: boolean;
}

export function handleReleaseDryRunCommand(input: ReleaseDryRunCommandInput): boolean {
  if (input.args[0] !== 'release' || input.args[1] !== 'dry-run') return false;
  const report = createReleaseDryRunReport(input.projectRoot);

  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`${report.ok ? 'passed' : 'failed'} | release dry-run | ${report.current.packageVersion}`);
    for (const check of report.checks) {
      console.log(`${check.status} | ${check.name} | ${check.summary}`);
    }
    for (const issue of report.issues) {
      console.log(`${issue.severity} | ${issue.code} | ${issue.message}`);
    }
  }

  if (!report.ok) process.exitCode = 6;
  return true;
}
