import fs from 'node:fs';
import { assertKnownOptions, getFlag, getRequiredStringOption, getStringOption } from './args';
import { createLegacyMutationBlockedReport, printLegacyMutationBlockedReport } from './legacy-boundary';
import { createInitDoctorReport } from '../init/doctor';
import { initProject } from '../init/project';
import { parseInitProfile } from '../init/profile';
import { printInitFollowUpReport } from '../init/report';
import { INIT_PRESET_SPECS, resolveInitPreset } from '../init/model';
import { createInitPlanningResult, printInitV1Report } from '../init/planner';
import { applyInitPlanningResult } from '../init/transaction';
import { shouldUseAdoptionPlan } from '../init/adoption';
import type { InitCommandInput, InitFollowUpMode } from '../init/types';
import { createInitUpgradeReport, createIntegrationEnableReport } from '../init/upgrade';

export { initProject } from '../init/project';
export { parseInitProfile } from '../init/profile';
export { resolveInitPreset } from '../init/model';
export { createInitPlanningResult } from '../init/planner';
export { applyInitPlanningResult } from '../init/transaction';
export type { InitCommandInput, InitProfile } from '../init/types';

export function handleInitCommand(input: InitCommandInput): boolean {
  const subcommand = input.args[1];
  assertInitOptions(input.args, subcommand);
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
  const presetValue = getStringOption(input.args, '--preset');
  const profileValue = getStringOption(input.args, '--profile');
  const useV1Planner = presetValue !== undefined
    || profileValue === undefined
    || (!getFlag(input.args, '--adopt') && !shouldUseAdoptionPlan(input.projectRoot));
  if (useV1Planner) {
    const selection = resolveInitPreset({ preset: presetValue, profile: profileValue });
    const result = createInitPlanningResult(input.projectRoot, selection.preset, {
      warnings: selection.warnings
    });
    if (getFlag(input.args, '--execute')) {
      printInitV1Report(applyInitPlanningResult(input.projectRoot, result, {
        planHash: getStringOption(input.args, '--plan-hash'),
        adopt: getFlag(input.args, '--adopt')
      }), input.jsonOutput);
      return true;
    }
    printInitV1Report(result.report, input.jsonOutput);
    if (!input.jsonOutput && process.stdin.isTTY && process.stdout.isTTY) {
      process.stdout.write('Apply this reviewed plan? [y/N] ');
      if (readInitConfirmation()) {
        printInitV1Report(applyInitPlanningResult(input.projectRoot, result, {
          planHash: result.plan.planHash,
          adopt: getFlag(input.args, '--adopt')
        }), false);
      } else {
        console.log('no-op | init\ncreated=0 updated=0 existing=0 applied=0\nreason=user-declined');
      }
    }
    return true;
  }
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
  hadara init [--preset minimal|standard|governed] [--json]
  hadara init --preset minimal|standard|governed --execute --plan-hash <hash> --json
  hadara init --preset minimal|standard|governed --adopt --json
  hadara init doctor [--json]
  hadara init upgrade [--execute --plan-hash <hash>] [--json]
  hadara init enable-integration --integration <name> [--execute] [--json]

Presets:
${renderPresetHelp()}

Notes:
  --help is read-only and does not create scaffold files.
  --profile basic is a deprecated compatibility alias for --preset minimal.
  Interactive TTY: plain "hadara init" prints the reviewed plan, then prompts
    "Apply this reviewed plan? [y/N]" and applies immediately on y/yes, in the
    same process.
  JSON / non-interactive / CI: always two-step. A dry-run prints the plan and
    a hash; nothing is written until a separate --execute --plan-hash <hash>
    call.
`;
}

function renderPresetHelp(): string {
  return (['minimal', 'standard', 'governed'] as const)
    .map((preset) => `  ${preset.padEnd(10)} features=${INIT_PRESET_SPECS[preset].features.join(',')} documents=${INIT_PRESET_SPECS[preset].documentPacks.join(',')}`)
    .join('\n');
}

function getInitFollowUpMode(args: string[]): InitFollowUpMode {
  return getFlag(args, '--execute') ? 'execute' : 'dry-run';
}

function assertInitOptions(args: string[], subcommand: string | undefined): void {
  const commonFlags = ['--json', '--help', '-h'] as const;
  const commonOptions = ['--project'] as const;
  if (subcommand === 'doctor' || subcommand === 'help') {
    assertKnownOptions(args, { flags: commonFlags, options: commonOptions });
    return;
  }
  if (subcommand === 'upgrade') {
    assertKnownOptions(args, {
      flags: [...commonFlags, '--execute'],
      options: [...commonOptions, '--plan-hash', '--profile', '--preset']
    });
    return;
  }
  if (subcommand === 'enable-integration') {
    assertKnownOptions(args, {
      flags: [...commonFlags, '--execute'],
      options: [...commonOptions, '--integration']
    });
    return;
  }
  if (subcommand && !subcommand.startsWith('-')) return;
  assertKnownOptions(args, {
    flags: [...commonFlags, '--adopt', '--execute'],
    options: [...commonOptions, '--preset', '--profile', '--plan-hash']
  });
}

export function isAffirmativeInitConfirmation(value: string): boolean {
  return value.trim().toLowerCase() === 'y' || value.trim().toLowerCase() === 'yes';
}

function readInitConfirmation(): boolean {
  const bytes: number[] = [];
  const buffer = Buffer.alloc(1);
  while (bytes.length < 16 && fs.readSync(process.stdin.fd, buffer, 0, 1, null) === 1) {
    if (buffer[0] === 10 || buffer[0] === 13) break;
    bytes.push(buffer[0]);
  }
  return isAffirmativeInitConfirmation(Buffer.from(bytes).toString('utf8'));
}
