import path from 'node:path';
import { HadaraPaths } from '../core/paths';
import { persistedEvidencePath } from '../evidence/evidence';
import { attachReleaseArtifactEvidence, readReleaseArtifactJournal, writeReleaseArtifactJournal } from '../services/release-artifact-evidence';
import { createReleaseArtifactReport } from '../services/release-artifact';
import { getFlag, getIntegerOption, getStringOption } from './args';
import { renderCommandHelp } from './help';
import { createLegacyMutationBlockedReport, printLegacyMutationBlockedReport } from './legacy-boundary';

export interface ReleaseArtifactCommandInput {
  args: string[];
  paths: HadaraPaths;
  jsonOutput: boolean;
}

export function handleReleaseArtifactCommand(input: ReleaseArtifactCommandInput): boolean {
  if (input.args[0] !== 'release' || input.args[1] !== 'artifact') return false;
  if (getFlag(input.args, '--help') || getFlag(input.args, '-h')) {
    console.log(renderCommandHelp('release.artifact'));
    return true;
  }
  if (getFlag(input.args, '--execute')) {
    const legacyReport = createLegacyMutationBlockedReport(input.paths.projectRoot, 'release.artifact');
    if (legacyReport) {
      printLegacyMutationBlockedReport(legacyReport, input.jsonOutput);
      process.exitCode = 6;
      return true;
    }
  }

  const sourceRoot = getStringOption(input.args, '--source-root');
  const evidenceRoot = getStringOption(input.args, '--evidence-root');
  const sourceProjectRoot = sourceRoot ? path.resolve(input.paths.projectRoot, sourceRoot) : input.paths.projectRoot;
  const evidenceProjectRoot = evidenceRoot ? path.resolve(input.paths.projectRoot, evidenceRoot) : input.paths.projectRoot;
  const report = createReleaseArtifactReport({
    paths: { ...input.paths, projectRoot: sourceProjectRoot },
    execute: getFlag(input.args, '--execute'),
    output: getStringOption(input.args, '--output'),
    evidenceRoot: evidenceRoot ? evidenceProjectRoot : undefined,
    sourceFromOption: sourceRoot ? '--source-root' : '--project',
    attachEvidence: getFlag(input.args, '--attach-evidence'),
    allowSourceEvidenceWrite: getFlag(input.args, '--allow-source-evidence-write'),
    keepTemp: getFlag(input.args, '--keep-temp'),
    timeoutSeconds: getIntegerOption(input.args, '--timeout', { min: 1 })
  });
  const taskId = getStringOption(input.args, '--task');
  const attachEvidence = getFlag(input.args, '--attach-evidence');
  const journal = getStringOption(input.args, '--journal');
  const fromJournal = getStringOption(input.args, '--from-journal');
  const effectiveReport = fromJournal ? readReleaseArtifactJournal(fromJournal) : report;
  if (journal && !fromJournal) writeReleaseArtifactJournal({ journalPath: journal, report });
  if (attachEvidence && !taskId) {
    throw new Error('release artifact --attach-evidence requires --task <task-id>');
  }
  const selfInvalidationBlocked = effectiveReport.issues.some((issue) => issue.code === 'RELEASE_ARTIFACT_SELF_INVALIDATION_RISK');
  const attachment =
    attachEvidence && taskId && !selfInvalidationBlocked
      ? attachReleaseArtifactEvidence({
          projectRoot: evidenceProjectRoot,
          taskId,
          summary:
            'hadara release artifact --execute --attach-evidence --json generated tarball/checksum/manifest metadata, retained public report artifact, and emitted hadara.releaseArtifact.v1.',
          report: effectiveReport
        })
      : undefined;

  if (input.jsonOutput) {
    console.log(JSON.stringify(attachment && taskId ? { ...effectiveReport, taskId, attachedEvidence: attachment } : effectiveReport, null, 2));
  } else {
    console.log(`${effectiveReport.ok ? 'passed' : 'failed'} | release artifact | ${effectiveReport.output.retention}`);
    if (attachment) console.log(`evidence | ${attachment.evidence.taskId} | ${persistedEvidencePath(attachment.evidence) ?? 'no-artifact'}`);
    for (const artifact of effectiveReport.artifacts) {
      console.log(`${artifact.kind} | ${artifact.fileName} | ${artifact.hash ?? 'no-hash'}`);
    }
    for (const issue of effectiveReport.issues) {
      console.log(`${issue.severity} | ${issue.code} | ${issue.message}`);
    }
  }

  if (!effectiveReport.ok) process.exitCode = 6;
  return true;
}
