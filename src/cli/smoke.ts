import { HadaraPaths } from '../core/paths';
import { createCleanCheckoutSmokeReport } from '../services/clean-checkout-smoke';
import { createFeatureSmokeReport } from '../services/feature-smoke';
import { getFlag, getIntegerOption, getStringOption } from './args';

export interface SmokeCommandInput {
  args: string[];
  paths: HadaraPaths;
  jsonOutput: boolean;
}

export function handleSmokeCommand(input: SmokeCommandInput): boolean {
  if (input.args[0] !== 'smoke') return false;

  if (input.args[1] === 'clean-checkout') {
    const report = createCleanCheckoutSmokeReport({
      paths: input.paths,
      execute: getFlag(input.args, '--execute'),
      workspace: getStringOption(input.args, '--workspace'),
      keepTemp: getFlag(input.args, '--keep-temp'),
      timeoutSeconds: getIntegerOption(input.args, '--timeout', { min: 1 })
    });

    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`${report.ok ? 'passed' : 'failed'} | smoke clean-checkout | ${report.mode}`);
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

  if (input.args[1] !== 'run') return false;

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
