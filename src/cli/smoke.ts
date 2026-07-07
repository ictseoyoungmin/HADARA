import { HadaraPaths } from '../core/paths';
import { createCleanCheckoutSmokeReport } from '../services/clean-checkout-smoke';
import { createFeatureSmokeReport } from '../services/feature-smoke';
import { createPackageSmokeDryRunReport, createPackageSmokeLocalReport } from '../services/package-smoke';
import { getFlag, getIntegerOption, getStringOption } from './args';
import { renderCommandHelp } from './help';

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
      taskId: getStringOption(input.args, '--task'),
      attachEvidence: getFlag(input.args, '--attach-evidence'),
      noEvidence: getFlag(input.args, '--no-evidence'),
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

  if (input.args[1] === 'package') {
    if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
      console.log(renderCommandHelp('smoke.package'));
      return true;
    }

    const options = {
      paths: input.paths,
      dryRun: !getFlag(input.args, '--execute'),
      provider: getStringOption(input.args, '--provider'),
      networkPolicy: getStringOption(input.args, '--network-policy'),
      from: getStringOption(input.args, '--from'),
      workspace: getStringOption(input.args, '--workspace'),
      taskId: getStringOption(input.args, '--task'),
      attachEvidence: getFlag(input.args, '--attach-evidence'),
      noEvidence: getFlag(input.args, '--no-evidence'),
      keepTemp: getFlag(input.args, '--keep-temp'),
      privateLogs: getFlag(input.args, '--private-logs'),
      timeoutSeconds: getIntegerOption(input.args, '--timeout', { min: 1 })
    };
    const report = getFlag(input.args, '--execute') ? createPackageSmokeLocalReport(options) : createPackageSmokeDryRunReport(options);

    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`${report.ok ? 'passed' : 'failed'} | smoke package | ${report.mode}`);
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
