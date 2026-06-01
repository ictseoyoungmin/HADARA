import { createEvidenceLintReport } from './evidence-lint';
import { createEvidenceListReport, EvidenceListReport } from './evidence-list';
import { createDashboardTimelineReport, DashboardTimelineReport } from './dashboard-timeline';
import { createTaskWorkbenchReport, TaskWorkbenchReport } from './task-workbench';

export interface DashboardTaskDetailIssue {
  severity: 'warning' | 'error';
  code: string;
  message: string;
}

export interface DashboardTaskDetailProof {
  status: 'sufficient' | 'weak' | 'failed' | 'blocked' | 'private-only' | 'unknown';
  blocking: boolean;
  auditabilityWarning: boolean;
  note: string;
  substantivePositive: number;
  semanticIssueCodes: string[];
}

export interface DashboardTaskDetailReport {
  schemaVersion: 'hadara.dashboard.task_detail.v1';
  command: 'dashboard.task-detail';
  ok: boolean;
  taskId: string;
  generatedAt: string;
  source: {
    kind: 'live-api';
    projectRoot: string;
    readOnly: true;
  };
  workbench: TaskWorkbenchReport;
  evidenceLint: ReturnType<typeof createEvidenceLintReport>;
  evidenceList: EvidenceListReport;
  timeline: DashboardTimelineReport;
  proof: DashboardTaskDetailProof;
  commandGuidance: Array<{
    id: string;
    label: string;
    command: string | null;
    readOnly: true;
  }>;
  issues: DashboardTaskDetailIssue[];
}

export function createDashboardTaskDetailReport(projectRoot: string, taskId: string, now = new Date()): DashboardTaskDetailReport {
  const generatedAt = now.toISOString();
  const workbench = createTaskWorkbenchReport(projectRoot, taskId, now);
  const evidenceLint = createEvidenceLintReport(projectRoot, taskId);
  const evidenceList = createEvidenceListReport(projectRoot, { taskId, limit: 24 });
  const timeline = createDashboardTimelineReport(projectRoot, { taskId }, now);
  const issues: DashboardTaskDetailIssue[] = [
    ...workbench.issues.map((issue) => ({ severity: toDetailSeverity(issue.severity), code: `WORKBENCH_${issue.code}`, message: issue.message })),
    ...evidenceLint.issues.map((issue) => ({
      severity: toDetailSeverity(issue.severity),
      code: `EVIDENCE_LINT_${issue.code}`,
      message: issue.message
    })),
    ...evidenceList.issues.map((issue) => ({ severity: issue.severity, code: `EVIDENCE_LIST_${issue.code}`, message: issue.message })),
    ...timeline.issues.map((issue) => ({ severity: issue.severity, code: `TIMELINE_${issue.code}`, message: issue.message }))
  ];

  return {
    schemaVersion: 'hadara.dashboard.task_detail.v1',
    command: 'dashboard.task-detail',
    ok: workbench.ok && evidenceLint.ok && evidenceList.ok && timeline.ok && !issues.some((issue) => issue.severity === 'error'),
    taskId,
    generatedAt,
    source: {
      kind: 'live-api',
      projectRoot,
      readOnly: true
    },
    workbench,
    evidenceLint,
    evidenceList,
    timeline,
    proof: proofFromEvidenceLint(evidenceLint),
    commandGuidance: workbench.nextActions.slice(0, 4).map((action) => ({
      id: action.id,
      label: action.message,
      command: action.command ?? null,
      readOnly: true
    })),
    issues
  };
}

function proofFromEvidenceLint(evidenceLint: ReturnType<typeof createEvidenceLintReport>): DashboardTaskDetailProof {
  const semanticIssueCodes = evidenceLint.issues.filter((issue) => issue.code.startsWith('TASK_DONE_')).map((issue) => issue.code);
  const substantivePositive = evidenceLint.summary.semantics?.byStrength['substantive-positive'] ?? 0;
  const codes = new Set(semanticIssueCodes);

  if (codes.has('TASK_DONE_WITH_FAILED_EVIDENCE')) {
    return proof('failed', true, false, 'Blocking unresolved failed evidence.', substantivePositive, semanticIssueCodes);
  }
  if (codes.has('TASK_DONE_WITH_UNEXPLAINED_BLOCKED_EVIDENCE')) {
    return proof('blocked', true, false, 'Blocking blocked evidence needs explanation.', substantivePositive, semanticIssueCodes);
  }
  if (codes.has('TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE') || codes.has('TASK_DONE_WITH_ONLY_WEAK_EVIDENCE')) {
    return proof('weak', true, false, 'Blocking proof insufficiency.', substantivePositive, semanticIssueCodes);
  }
  if (codes.has('TASK_DONE_WITH_PRIVATE_ONLY_EVIDENCE')) {
    return proof('private-only', false, true, 'Auditability warning, not a Done blocker.', substantivePositive, semanticIssueCodes);
  }
  if (substantivePositive > 0) {
    return proof('sufficient', false, false, 'Evidence is sufficient for selected-task proof display.', substantivePositive, semanticIssueCodes);
  }
  return proof('unknown', false, false, 'No semantic proof summary is available.', substantivePositive, semanticIssueCodes);
}

function proof(
  status: DashboardTaskDetailProof['status'],
  blocking: boolean,
  auditabilityWarning: boolean,
  note: string,
  substantivePositive: number,
  semanticIssueCodes: string[]
): DashboardTaskDetailProof {
  return {
    status,
    blocking,
    auditabilityWarning,
    note,
    substantivePositive,
    semanticIssueCodes
  };
}

function toDetailSeverity(severity: 'error' | 'warning' | 'info'): DashboardTaskDetailIssue['severity'] {
  return severity === 'error' ? 'error' : 'warning';
}
