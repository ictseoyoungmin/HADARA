import { HadaraPaths } from '../core/paths';
import { persistedEvidencePath } from '../evidence/evidence';
import { attachReleaseArtifactEvidence } from '../services/release-artifact-evidence';
import { createReleaseArtifactReport } from '../services/release-artifact';
import { getFlag, getIntegerOption, getStringOption } from './args';
import { createLegacyMutationBlockedReport, printLegacyMutationBlockedReport } from './legacy-boundary';

export interface ReleaseArtifactCommandInput {
  args: string[];
  paths: HadaraPaths;
  jsonOutput: boolean;
}

export function handleReleaseArtifactCommand(input: ReleaseArtifactCommandInput): boolean {
  if (input.args[0] !== 'release' || input.args[1] !== 'artifact') return false;
  if (getFlag(input.args, '--execute')) {
    const legacyReport = createLegacyMutationBlockedReport(input.paths.projectRoot, 'release.artifact');
    if (legacyReport) {
      printLegacyMutationBlockedReport(legacyReport, input.jsonOutput);
      process.exitCode = 6;
      return true;
    }
  }

  const report = createReleaseArtifactReport({
    paths: input.paths,
    execute: getFlag(input.args, '--execute'),
    output: getStringOption(input.args, '--output'),
    keepTemp: getFlag(input.args, '--keep-temp'),
    timeoutSeconds: getIntegerOption(input.args, '--timeout', { min: 1 })
  });
  const taskId = getStringOption(input.args, '--task');
  const attachEvidence = getFlag(input.args, '--attach-evidence');
  if (attachEvidence && !taskId) {
    throw new Error('release artifact --attach-evidence requires --task <task-id>');
  }
  const attachment =
    attachEvidence && taskId
      ? attachReleaseArtifactEvidence({
          projectRoot: input.paths.projectRoot,
          taskId,
          summary:
            'hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1.',
          report
        })
      : undefined;

  if (input.jsonOutput) {
    console.log(JSON.stringify(attachment && taskId ? { ...report, taskId, attachedEvidence: attachment } : report, null, 2));
  } else {
    console.log(`${report.ok ? 'passed' : 'failed'} | release artifact | ${report.output.retention}`);
    if (attachment) console.log(`evidence | ${attachment.evidence.taskId} | ${persistedEvidencePath(attachment.evidence) ?? 'no-artifact'}`);
    for (const artifact of report.artifacts) {
      console.log(`${artifact.kind} | ${artifact.fileName} | ${artifact.hash ?? 'no-hash'}`);
    }
    for (const issue of report.issues) {
      console.log(`${issue.severity} | ${issue.code} | ${issue.message}`);
    }
  }

  if (!report.ok) process.exitCode = 6;
  return true;
}
