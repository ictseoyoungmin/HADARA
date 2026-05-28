import fs from 'node:fs';
import path from 'node:path';
import { ensureDir } from '../core/fs';
import { createPublicEvidenceArtifactPolicyReport, EvidenceArtifactPolicyError, EvidenceIndexRecord, EvidenceRecord } from '../evidence/evidence';
import { redactSecrets } from '../core/redaction';

export interface SmokeEvidenceIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
  stepId?: string;
}

export interface SmokeEvidenceArtifact {
  kind: 'summary';
  visibility: 'public';
  evidencePath: string;
  rawContentIncluded: false;
}

export interface SmokeEvidenceInput {
  projectRoot: string;
  taskId: string;
  category: 'package-smoke' | 'clean-checkout-smoke';
  kind: EvidenceRecord['kind'];
  summary: string;
  result: EvidenceRecord['result'];
  report: {
    schemaVersion: string;
    command: string;
    ok: boolean;
    mode: string;
    execution: Record<string, unknown>;
    steps: Array<{
      id: string;
      label: string;
      status: string;
      exitCode?: number | null;
      elapsedMs?: number;
      summary: string;
    }>;
    privacy: Record<string, unknown>;
    issues: SmokeEvidenceIssue[];
  };
}

export function attachReducedSmokeEvidence(input: SmokeEvidenceInput): { evidence: EvidenceIndexRecord; artifact: SmokeEvidenceArtifact } {
  const taskDir = findTaskDir(input.projectRoot, input.taskId);
  if (!taskDir) {
    throw new Error(`Task capsule not found: ${input.taskId}`);
  }

  const time = new Date().toISOString();
  const summaryContent = createReducedSummary(input, time);
  const content = JSON.stringify(summaryContent, null, 2);
  const policy = createPublicEvidenceArtifactPolicyReport(content);
  if (policy.blocking) {
    throw new EvidenceArtifactPolicyError(
      'PUBLIC_ARTIFACT_SECRET_DETECTED',
      'Public smoke evidence summary contains secret-like content; collect raw logs privately or reduce the report first.',
      policy.redaction
    );
  }

  const artifactDir = path.join(taskDir, 'artifacts', input.category);
  ensureDir(artifactDir);
  const targetPath = path.join(artifactDir, `${safeFilePart(time)}-summary.json`);
  fs.writeFileSync(targetPath, content, 'utf8');
  const evidencePath = toPortablePath(path.relative(taskDir, targetPath));
  const summary = redactSecrets(input.summary.replace(/\|/g, '/'));
  const evidence: EvidenceIndexRecord = {
    schemaVersion: 'hadara.evidence.v1',
    time,
    taskId: input.taskId,
    kind: input.kind,
    summary,
    result: input.result,
    visibility: 'public',
    evidencePath
  };

  appendEvidenceMarkdown(taskDir, evidence);
  fs.appendFileSync(path.join(taskDir, 'evidence.jsonl'), `${JSON.stringify(evidence)}\n`, 'utf8');

  return {
    evidence,
    artifact: {
      kind: 'summary',
      visibility: 'public',
      evidencePath: toPortablePath(path.join('tasks', path.basename(taskDir), evidencePath)),
      rawContentIncluded: false
    }
  };
}

function createReducedSummary(input: SmokeEvidenceInput, time: string): Record<string, unknown> {
  return {
    schemaVersion: 'hadara.smokeEvidenceSummary.v1',
    time,
    taskId: input.taskId,
    category: input.category,
    sourceReport: {
      schemaVersion: input.report.schemaVersion,
      command: input.report.command,
      mode: input.report.mode,
      ok: input.report.ok
    },
    execution: input.report.execution,
    steps: input.report.steps.map((step) => ({
      id: step.id,
      label: step.label,
      status: step.status,
      ...(step.exitCode === undefined ? {} : { exitCode: step.exitCode }),
      ...(step.elapsedMs === undefined ? {} : { elapsedMs: step.elapsedMs }),
      summary: step.summary
    })),
    privacy: input.report.privacy,
    issues: input.report.issues.map((issue) => ({
      severity: issue.severity,
      code: issue.code,
      message: issue.message,
      ...(issue.stepId ? { stepId: issue.stepId } : {})
    })),
    rawLogsIncluded: false,
    privatePathsIncluded: false,
    rawPackageContentsIncluded: false
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
