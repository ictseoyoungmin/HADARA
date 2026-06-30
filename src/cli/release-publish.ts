import { HadaraPaths } from '../core/paths';
import { createReleasePublishReport, ReleasePublishMode } from '../services/release-publish';
import { getFlag, getStringOption } from './args';
import { createLegacyMutationBlockedReport, printLegacyMutationBlockedReport } from './legacy-boundary';

export interface ReleasePublishCommandInput {
  args: string[];
  paths: HadaraPaths;
  jsonOutput: boolean;
}

export function handleReleasePublishCommand(input: ReleasePublishCommandInput): boolean {
  if (input.args[0] !== 'release' || input.args[1] !== 'publish') return false;
  const mode = parseMode(input.args);
  if (mode === 'execute') {
    const legacyReport = createLegacyMutationBlockedReport(input.paths.projectRoot, 'release.publish');
    if (legacyReport) {
      printLegacyMutationBlockedReport(legacyReport, input.jsonOutput);
      process.exitCode = 6;
      return true;
    }
  }
  const report = createReleasePublishReport({
    projectRoot: input.paths.projectRoot,
    auditDir: input.paths.auditDir,
    mode,
    approvalActor: getStringOption(input.args, '--approval-actor'),
    approvalReason: getStringOption(input.args, '--approval-reason'),
    confirm: getStringOption(input.args, '--confirm')
  });

  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`${report.ok ? 'passed' : 'blocked'} | release publish | ${report.mode} | ${report.current.packageVersion}`);
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

function parseMode(args: string[]): ReleasePublishMode {
  if (getFlag(args, '--execute')) return 'execute';
  const mode = getStringOption(args, '--mode', 'dry-run');
  if (mode === 'dry-run' || mode === 'execute') return mode;
  throw new Error(`unsupported release publish mode: ${mode}`);
}
