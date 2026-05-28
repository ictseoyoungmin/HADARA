import { HadaraPaths } from '../core/paths';
import { createFeatureSmokeReport } from '../services/feature-smoke';
import { getStringOption } from './args';

export interface SmokeCommandInput {
  args: string[];
  paths: HadaraPaths;
  jsonOutput: boolean;
}

export function handleSmokeCommand(input: SmokeCommandInput): boolean {
  if (input.args[0] !== 'smoke' || input.args[1] !== 'run') return false;

  const report = createFeatureSmokeReport({
    profile: getStringOption(input.args, '--profile', 'core'),
    paths: input.paths
  });

  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`${report.ok ? 'passed' : 'failed'} | smoke run | profile ${report.profile}`);
    for (const step of report.steps) {
      console.log(`${step.status} | ${step.command} | ${step.summary}`);
    }
    for (const issue of report.issues) {
      console.log(`${issue.severity} | ${issue.code} | ${issue.message}`);
    }
  }

  if (!report.ok) process.exitCode = 6;
  return true;
}
