import { getFlag, getRequiredStringOption, getStringOption } from './args';
import { createLegacyMutationBlockedReport, printLegacyMutationBlockedReport } from './legacy-boundary';
import { createInitDoctorReport } from '../init/doctor';
import { initProject } from '../init/project';
import { parseInitProfile } from '../init/profile';
import { printInitFollowUpReport } from '../init/report';
import type { InitCommandInput, InitFollowUpMode } from '../init/types';
import { createInitUpgradeReport, createIntegrationEnableReport } from '../init/upgrade';

export { initProject } from '../init/project';
export { parseInitProfile } from '../init/profile';
export type { InitCommandInput, InitProfile } from '../init/types';

export function handleInitCommand(input: InitCommandInput): boolean {
  const subcommand = input.args[1];
  if (subcommand === 'help' || getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
    console.log(renderInitHelp());
    return true;
  }
  if (subcommand === 'doctor') {
    printInitFollowUpReport(createInitDoctorReport(input.projectRoot), input.jsonOutput);
    return true;
  }
  if (subcommand === 'upgrade') {
    const legacyReport = createLegacyMutationBlockedReport(input.projectRoot, 'init.upgrade');
    if (legacyReport) {
      printLegacyMutationBlockedReport(legacyReport, input.jsonOutput === true);
      process.exitCode = 6;
      return true;
    }
    const profile = parseInitProfile(getRequiredStringOption(input.args, '--profile'));
    const report = createInitUpgradeReport(input.projectRoot, profile, getInitFollowUpMode(input.args));
    printInitFollowUpReport(report, input.jsonOutput);
    return true;
  }
  if (subcommand === 'enable-integration') {
    if (getFlag(input.args, '--execute') === true) {
      const legacyReport = createLegacyMutationBlockedReport(input.projectRoot, 'init.enable-integration');
      if (legacyReport) {
        printLegacyMutationBlockedReport(legacyReport, input.jsonOutput === true);
        process.exitCode = 6;
        return true;
      }
    }
    const report = createIntegrationEnableReport(input.projectRoot, {
      integration: getRequiredStringOption(input.args, '--integration'),
      mode: getInitFollowUpMode(input.args)
    });
    printInitFollowUpReport(report, input.jsonOutput);
    return true;
  }
  if (subcommand && !subcommand.startsWith('-')) return false;
  const report = initProject(input.projectRoot, getStringOption(input.args, '--profile', 'standard') ?? 'standard', {
    silent: input.jsonOutput,
    adopt: getFlag(input.args, '--adopt'),
    execute: getFlag(input.args, '--execute'),
    planHash: getStringOption(input.args, '--plan-hash')
  });
  if (input.jsonOutput) console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 6;
  return true;
}

function renderInitHelp(): string {
  return `HADARA init

Usage:
  hadara init [--profile basic|standard|governed] [--json]
  hadara init --profile basic|standard|governed --adopt --execute --plan-hash <hash> --json
  hadara init doctor [--json]
  hadara init upgrade --profile <profile> [--execute] [--json]
  hadara init enable-integration --integration <name> [--execute] [--json]

Profiles:
  basic      Core current-state docs, workflow reference, registries, and task directory.
  standard   Default profile with architecture, roadmap, and decision docs.
  governed   Standard profile plus handoff and security docs.

Notes:
  --help is read-only and does not create scaffold files.
  Existing repositories return a zero-write adoption plan unless reviewed --adopt execute is requested.
`;
}

function getInitFollowUpMode(args: string[]): InitFollowUpMode {
  return getFlag(args, '--execute') ? 'execute' : 'dry-run';
}
