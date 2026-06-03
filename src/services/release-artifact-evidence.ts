import fs from 'node:fs';
import path from 'node:path';
import { appendEvidenceTextArtifact, PersistedEvidenceRecord, persistedEvidencePath } from '../evidence/evidence';
import { ReleaseArtifactReport } from './release-artifact';
import { readCurrentGitCommit } from './release-dry-run';

export function attachReleaseArtifactEvidence(input: {
  projectRoot: string;
  taskId: string;
  summary: string;
  report: ReleaseArtifactReport;
}): { evidence: PersistedEvidenceRecord; artifact: { kind: 'report'; visibility: 'public'; evidencePath: string; rawContentIncluded: false } } {
  const taskDir = findTaskDir(input.projectRoot, input.taskId);
  if (!taskDir) throw new Error(`Task capsule not found: ${input.taskId}`);

  const time = new Date().toISOString();
  const reportArtifact = {
    ...input.report,
    evidence: {
      time,
      taskId: input.taskId,
      gitCommit: readCurrentGitCommit(input.projectRoot)
    }
  };
  const content = JSON.stringify(reportArtifact, null, 2);
  const appendResult = appendEvidenceTextArtifact(
    input.projectRoot,
    {
      taskId: input.taskId,
      kind: 'command-log',
      summary: input.summary,
      result: input.report.ok ? 'passed' : 'failed',
      visibility: 'public'
    },
    { fileName: 'report.json', content, artifactDirName: 'release-artifact' }
  );
  const evidencePath = persistedEvidencePath(appendResult.evidence);
  if (!evidencePath) throw new Error('Release artifact evidence path was not recorded.');

  return {
    evidence: appendResult.evidence,
    artifact: {
      kind: 'report',
      visibility: 'public',
      evidencePath: toPortablePath(path.join('tasks', path.basename(taskDir), evidencePath)),
      rawContentIncluded: false
    }
  };
}

function findTaskDir(projectRoot: string, taskId: string): string | null {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return null;
  const entry = fs.readdirSync(tasksDir).find((name) => name.startsWith(`${taskId}-`));
  return entry ? path.join(tasksDir, entry) : null;
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
