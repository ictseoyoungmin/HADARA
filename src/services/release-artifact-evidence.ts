import fs from 'node:fs';
import path from 'node:path';
import { createPublicEvidenceArtifactPolicyReport, EvidenceArtifactPolicyError, EvidenceIndexRecord } from '../evidence/evidence';
import { ensureDir } from '../core/fs';
import { redactSecrets } from '../core/redaction';
import { ReleaseArtifactReport } from './release-artifact';
import { readCurrentGitCommit } from './release-dry-run';

export function attachReleaseArtifactEvidence(input: {
  projectRoot: string;
  taskId: string;
  summary: string;
  report: ReleaseArtifactReport;
}): { evidence: EvidenceIndexRecord; artifact: { kind: 'report'; visibility: 'public'; evidencePath: string; rawContentIncluded: false } } {
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
  const policy = createPublicEvidenceArtifactPolicyReport(content);
  if (policy.blocking) {
    throw new EvidenceArtifactPolicyError(
      'PUBLIC_ARTIFACT_SECRET_DETECTED',
      'Public release artifact evidence contains secret-like content; reduce the report before attaching.',
      policy.redaction
    );
  }

  const artifactDir = path.join(taskDir, 'artifacts', 'release-artifact');
  ensureDir(artifactDir);
  const targetPath = path.join(artifactDir, `${safeFilePart(time)}-report.json`);
  fs.writeFileSync(targetPath, content, 'utf8');
  const evidencePath = toPortablePath(path.relative(taskDir, targetPath));
  const evidence: EvidenceIndexRecord = {
    schemaVersion: 'hadara.evidence.v1',
    time,
    taskId: input.taskId,
    kind: 'command-log',
    summary: redactSecrets(input.summary.replace(/\|/g, '/')),
    result: input.report.ok ? 'passed' : 'failed',
    visibility: 'public',
    evidencePath
  };

  appendEvidenceMarkdown(taskDir, evidence);
  fs.appendFileSync(path.join(taskDir, 'evidence.jsonl'), `${JSON.stringify(evidence)}\n`, 'utf8');

  return {
    evidence,
    artifact: {
      kind: 'report',
      visibility: 'public',
      evidencePath: toPortablePath(path.join('tasks', path.basename(taskDir), evidencePath)),
      rawContentIncluded: false
    }
  };
}

function appendEvidenceMarkdown(taskDir: string, evidence: EvidenceIndexRecord): void {
  const markdownPath = path.join(taskDir, 'EVIDENCE.md');
  if (!fs.existsSync(markdownPath)) {
    fs.writeFileSync(markdownPath, '# Evidence\n\n| Time | Kind | Summary | Result |\n|---|---|---|---|\n', 'utf8');
  }
  fs.appendFileSync(markdownPath, `| ${evidence.time} | ${evidence.kind} | ${evidence.summary} (${evidence.evidencePath}) | ${evidence.result} |\n`, 'utf8');
}

function findTaskDir(projectRoot: string, taskId: string): string | null {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return null;
  const entry = fs.readdirSync(tasksDir).find((name) => name.startsWith(`${taskId}-`));
  return entry ? path.join(tasksDir, entry) : null;
}

function safeFilePart(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'artifact';
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
