import { HadaraPaths } from '../core/paths';
import { createPackageRecycleReport } from '../services/package-recycle';
import { getFlag, getIntegerOption, getStringOption } from './args';
import { renderCommandHelp } from './help';
import { printCommandRemovedReport } from './removed-command';

export interface PackageCommandInput {
  args: string[];
  paths: HadaraPaths;
  jsonOutput: boolean;
}

export function handlePackageCommand(input: PackageCommandInput): boolean {
  if (input.args[0] !== 'package') return false;

  if (input.args[1] === 'recycle') {
    if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
      console.log(renderCommandHelp('package.recycle'));
      return true;
    }
    const report = createPackageRecycleReport({
      paths: input.paths,
      execute: getFlag(input.args, '--execute'),
      packageSpecifier: getStringOption(input.args, '--package'),
      expectedVersion: getStringOption(input.args, '--expected-version'),
      workspace: getStringOption(input.args, '--workspace'),
      taskId: getStringOption(input.args, '--task'),
      attachEvidence: getFlag(input.args, '--attach-evidence'),
      noEvidence: getFlag(input.args, '--no-evidence'),
      keepTemp: getFlag(input.args, '--keep-temp'),
      includeGraph: getFlag(input.args, '--include-graph'),
      timeoutSeconds: getIntegerOption(input.args, '--timeout', { min: 1 })
    });

    if (input.jsonOutput) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(`${report.ok ? 'passed' : 'failed'} | package recycle | ${report.mode}`);
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

  if (input.args[1] !== 'smoke') return false;
  return printCommandRemovedReport(
    {
      commandId: 'package.smoke',
      removedCommand: 'hadara package smoke',
      replacementCommand: 'hadara smoke package [--dry-run|--execute] [--from <tarball|dir>] --json',
      diagnosticCommand: 'hadara help command smoke.package',
      note: 'Package smoke validation moved into the smoke command family; the release validation behavior is unchanged.'
    },
    input.jsonOutput
  );
}
