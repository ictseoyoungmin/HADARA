import { HadaraPaths } from '../core/paths';
import { createReleaseArtifactReport } from '../services/release-artifact';
import { getFlag, getIntegerOption, getStringOption } from './args';

export interface ReleaseArtifactCommandInput {
  args: string[];
  paths: HadaraPaths;
  jsonOutput: boolean;
}

export function handleReleaseArtifactCommand(input: ReleaseArtifactCommandInput): boolean {
  if (input.args[0] !== 'release' || input.args[1] !== 'artifact') return false;

  const report = createReleaseArtifactReport({
    paths: input.paths,
    execute: getFlag(input.args, '--execute'),
    output: getStringOption(input.args, '--output'),
    keepTemp: getFlag(input.args, '--keep-temp'),
    timeoutSeconds: getIntegerOption(input.args, '--timeout', { min: 1 })
  });

  if (input.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`${report.ok ? 'passed' : 'failed'} | release artifact | ${report.output.retention}`);
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
