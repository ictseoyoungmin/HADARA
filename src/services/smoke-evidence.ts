import fs from 'node:fs';
import path from 'node:path';
import { appendEvidenceTextArtifact, EvidenceRecord, PersistedEvidenceRecord, persistedEvidencePath } from '../evidence/evidence';

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
    provider?: object;
    networkPolicy?: object;
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

export function attachReducedSmokeEvidence(input: SmokeEvidenceInput): { evidence: PersistedEvidenceRecord; artifact: SmokeEvidenceArtifact } {
  const taskDir = findTaskDir(input.projectRoot, input.taskId);
  if (!taskDir) {
    throw new Error(`Task capsule not found: ${input.taskId}`);
  }

  const time = new Date().toISOString();
  const summaryContent = createReducedSummary(input, time);
  const content = JSON.stringify(summaryContent, null, 2);
  const appendResult = appendEvidenceTextArtifact(
    input.projectRoot,
    {
      taskId: input.taskId,
      kind: input.kind,
      summary: input.summary,
      result: input.result,
      visibility: 'public'
    },
    { fileName: 'summary.json', content, artifactDirName: input.category }
  );
  const evidencePath = persistedEvidencePath(appendResult.evidence);
  if (!evidencePath) throw new Error('Smoke evidence artifact path was not recorded.');

  return {
    evidence: appendResult.evidence,
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
      ok: input.report.ok,
      ...(input.report.provider ? { provider: input.report.provider } : {}),
      ...(input.report.networkPolicy ? { networkPolicy: input.report.networkPolicy } : {})
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

function findTaskDir(projectRoot: string, taskId: string): string | null {
  const tasksDir = path.join(projectRoot, 'tasks');
  if (!fs.existsSync(tasksDir)) return null;
  const entry = fs.readdirSync(tasksDir).find((name) => name.startsWith(`${taskId}-`));
  return entry ? path.join(tasksDir, entry) : null;
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
