import { HadaraPaths } from '../core/paths';
import { createPackageSmokeDryRunReport } from '../services/package-smoke';
import { getFlag, getIntegerOption, getStringOption } from './args';

export interface PackageCommandInput {
  args: string[];
  paths: HadaraPaths;
  jsonOutput: boolean;
}

export function handlePackageCommand(input: PackageCommandInput): boolean {
  if (input.args[0] !== 'package' || input.args[1] !== 'smoke') return false;

  const report = createPackageSmokeDryRunReport({
    paths: input.paths,
    dryRun: true,
    from: getStringOption(input.args, '--from'),
    workspace: getStringOption(input.args, '--workspace'),
    taskId: getStringOption(input.args, '--task'),
    attachEvidence: getFlag(input.args, '--attach-evidence'),
    noEvidence: getFlag(input.args, '--no-evidence'),
    keepTemp: getFlag(input.args, '--keep-temp'),
    privateLogs: getFlag(input.args, '--private-logs'),
    timeoutSeconds: getIntegerOption(input.args, '--timeout', { min: 1 })
  });

  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`${report.ok ? 'passed' : 'failed'} | package smoke | ${report.mode}`);
    for (const step of report.steps) {
      console.log(`${step.status} | ${step.label} | ${step.summary}`);
    }
    for (const issue of report.issues) {
      console.log(`${issue.severity} | ${issue.code} | ${issue.message}`);
    }
  }

  if (!report.ok) process.exitCode = 6;
  return true;
}
