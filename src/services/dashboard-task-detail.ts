import fs from 'node:fs';
import path from 'node:path';
import { EvidenceIndexRecord } from '../evidence/evidence';
import { createEvidenceLintReport } from './evidence-lint';
import { createEvidenceListReport, EvidenceListReport } from './evidence-list';
import { DashboardTimelineReport } from './dashboard-timeline';
import { parseMarkdownRows } from './markdown-table';
import {
  createDashboardCacheKey,
  createDashboardProjectReference,
  DashboardCacheMetadata,
  DashboardProjectReference,
  disabledDashboardCacheMetadata
} from './dashboard-cache';
import { TaskWorkbenchReport } from './task-workbench';

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
    projectRootRedacted: true;
    project: DashboardProjectReference;
    readOnly: true;
  };
  cache: DashboardCacheMetadata;
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
  const evidenceLint = createEvidenceLintReport(projectRoot, taskId);
  const evidenceList = createEvidenceListReport(projectRoot, { taskId, limit: 24 });
  const workbench = createFastTaskWorkbenchReport(projectRoot, taskId, evidenceLint, evidenceList, now);
  const timeline = createTaskScopedTimelineReport(projectRoot, taskId, workbench, evidenceList, now);
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
      projectRootRedacted: true,
      project: createDashboardProjectReference(projectRoot),
      readOnly: true
    },
    cache: disabledDashboardCacheMetadata(createDashboardCacheKey(projectRoot, 'task-detail', taskId), generatedAt),
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

function createFastTaskWorkbenchReport(
  projectRoot: string,
  taskId: string,
  evidenceLint: ReturnType<typeof createEvidenceLintReport>,
  evidenceList: EvidenceListReport,
  now: Date
): TaskWorkbenchReport {
  const generatedAt = now.toISOString();
  const taskBoard = readTaskBoardProjection(projectRoot, taskId);
  const task = readTaskSummary(projectRoot, taskId, taskBoard.capsule);
  const latestEvidence = evidenceList.records.at(-1);
  const closeState = getCloseState(evidenceList.records);
  const closeEvidenceFound = closeState !== 'not-closed';
  const closedValid = closeState === 'closed-valid';
  const issues: TaskWorkbenchReport['issues'] = [
    ...buildTaskReadIssues(taskId, task, taskBoard),
    ...evidenceLint.issues.map((issue) => ({ severity: issue.severity, code: `EVIDENCE_LINT_${issue.code}`, message: issue.message })),
    ...evidenceList.issues.map((issue) => ({ severity: issue.severity, code: `EVIDENCE_LIST_${issue.code}`, message: issue.message }))
  ];
  const blockers = issues.filter((issue) => issue.severity === 'error').length;
  const warnings = issues.filter((issue) => issue.severity === 'warning').length;
  const closePlanOk = blockers === 0;
  const nextActions = buildFastWorkbenchNextActions(taskId, closedValid, closeEvidenceFound, closePlanOk, evidenceList.count);

  return {
    schemaVersion: 'hadara.task.workbench.v1',
    command: 'task.status',
    ok: task.present && blockers === 0,
    generatedAt,
    projectRoot,
    task: {
      id: taskId,
      title: task.title,
      capsule: task.capsule,
      taskStatus: task.status,
      taskBoardStatus: taskBoard.status,
      taskBoardPath: taskBoard.path,
      taskBoardPresent: taskBoard.present
    },
    state: {
      closeState,
      ready: closePlanOk,
      closeEvidenceFound,
      closedValid,
      closed: closedValid,
      auditable: closeEvidenceFound
    },
    summary: {
      blockers,
      warnings,
      evidenceRecords: evidenceList.count,
      nextActions: nextActions.length
    },
    sources: {
      taskClosePlan: {
        ok: closePlanOk,
        mode: 'dry-run',
        blockers,
        warnings
      },
      evidenceLint: {
        ok: evidenceLint.ok,
        issues: evidenceLint.issues.length
      },
      evidenceList: {
        ok: evidenceList.ok,
        records: evidenceList.count,
        ...(latestEvidence ? { latest: summarizeEvidence(latestEvidence) } : {})
      },
      protocolTask: {
        ok: task.present,
        issues: task.present ? 0 : 1
      },
      protocolDocs: {
        ok: true,
        issues: 0
      },
      protocolProfile: {
        ok: true,
        issues: 0
      }
    },
    issues,
    nextActions
  };
}

interface TaskBoardProjection {
  status: string;
  path: string;
  present: boolean;
  capsule: string | null;
}

interface TaskSummary {
  present: boolean;
  title: string;
  capsule: string;
  status: string;
}

function readTaskBoardProjection(projectRoot: string, taskId: string): TaskBoardProjection {
  const taskBoardPath = 'docs/TASK_BOARD.md';
  const absolutePath = path.join(projectRoot, taskBoardPath);
  if (!fs.existsSync(absolutePath)) {
    return { status: 'Missing', path: taskBoardPath, present: false, capsule: null };
  }

  const rows = parseMarkdownRows(fs.readFileSync(absolutePath, 'utf8')).filter((row) => row[0] === taskId);
  if (rows.length !== 1) {
    return { status: 'Missing', path: taskBoardPath, present: false, capsule: null };
  }

  return {
    status: rows[0][2] || 'Unknown',
    path: taskBoardPath,
    present: true,
    capsule: rows[0][3] || null
  };
}

function readTaskSummary(projectRoot: string, taskId: string, capsule: string | null): TaskSummary {
  if (!capsule) {
    return { present: false, title: 'Unknown', capsule: '', status: 'Missing' };
  }

  const taskPath = path.join(projectRoot, capsule, 'TASK.md');
  if (!fs.existsSync(taskPath)) {
    return { present: false, title: 'Unknown', capsule, status: 'Missing' };
  }

  const content = fs.readFileSync(taskPath, 'utf8');
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? taskId;
  const title = heading.startsWith(taskId) ? heading.slice(taskId.length).trim() || taskId : heading;
  return {
    present: true,
    title,
    capsule,
    status: readStatusSection(content)
  };
}

function readStatusSection(content: string): string {
  const start = content.search(/^##\s+Status\s*$/m);
  if (start < 0) return 'Unknown';
  const afterHeading = content.slice(start).replace(/^##\s+Status\s*$/m, '');
  const nextHeading = afterHeading.search(/^##\s+/m);
  const section = nextHeading >= 0 ? afterHeading.slice(0, nextHeading) : afterHeading;
  const line = section
    ?.split(/\r?\n/)
    .map((item) => item.trim())
    .find((item) => item.length > 0);
  return line ?? 'Unknown';
}

function buildTaskReadIssues(taskId: string, task: TaskSummary, taskBoard: TaskBoardProjection): TaskWorkbenchReport['issues'] {
  const issues: TaskWorkbenchReport['issues'] = [];
  if (!taskBoard.present) {
    issues.push({
      severity: 'warning',
      code: 'WORKBENCH_TASK_BOARD_ROW_MISSING',
      message: `docs/TASK_BOARD.md does not contain a row for ${taskId}.`,
      path: taskBoard.path
    });
  }
  if (!task.present) {
    issues.push({
      severity: 'error',
      code: 'WORKBENCH_TASK_MISSING',
      message: `Task Capsule files could not be loaded for ${taskId}.`,
      path: task.capsule || taskBoard.path
    });
    return issues;
  }
  if (taskBoard.present && taskBoard.status !== task.status) {
    issues.push({
      severity: 'warning',
      code: 'WORKBENCH_TASK_BOARD_STATUS_DRIFT',
      message: `docs/TASK_BOARD.md status for ${taskId} is ${taskBoard.status || '(empty)'}, but TASK.md status is ${task.status || '(empty)'}.`,
      path: taskBoard.path
    });
  }
  return issues;
}

function buildFastWorkbenchNextActions(
  taskId: string,
  closed: boolean,
  closeEvidenceFound: boolean,
  closePlanOk: boolean,
  evidenceRecords: number
): TaskWorkbenchReport['nextActions'] {
  const actions: TaskWorkbenchReport['nextActions'] = [];
  if (evidenceRecords === 0) {
    actions.push({
      id: 'add-command-evidence',
      kind: 'command',
      required: true,
      priority: 'now',
      command: `hadara evidence add-command --task ${taskId} --summary "..." --result passed --json`,
      message: 'Add at least one canonical command-log evidence record before close.',
      sourceIssueCodes: ['EVIDENCE_JSONL_EMPTY']
    });
  }
  if (closed || closeEvidenceFound) {
    actions.push({
      id: 'audit-close',
      kind: 'audit',
      required: false,
      priority: 'soon',
      command: `hadara task audit-close --task ${taskId} --json`,
      message: 'Audit the existing close evidence in a read-only pass.',
      sourceIssueCodes: ['TASK_CLOSE_EVIDENCE_PRESENT']
    });
  }
  if (!closed && closePlanOk) {
    actions.push({
      id: 'review-close-plan',
      kind: 'command',
      required: true,
      priority: 'now',
      command: `hadara task close --task ${taskId} --json`,
      executeCommand: `hadara task close --task ${taskId} --execute --json`,
      message: 'Review the close plan, then append close audit evidence if it still passes.',
      sourceIssueCodes: ['TASK_CLOSE_READY'],
      loopBoundary: true
    });
  }
  return actions;
}

function summarizeEvidence(record: EvidenceIndexRecord): NonNullable<TaskWorkbenchReport['sources']['evidenceList']['latest']> {
  return {
    time: record.time,
    kind: record.kind,
    result: record.result,
    visibility: record.visibility,
    summary: record.summary
  };
}

function getCloseState(records: EvidenceIndexRecord[]): TaskWorkbenchReport['state']['closeState'] {
  if (records.some(isPassedCloseEvidenceRecord)) return 'closed-valid';
  if (records.some(isWellFormedCloseEvidenceRecord)) return 'close-evidence-found-invalid';
  if (records.some(isMalformedCloseEvidenceRecord)) return 'close-evidence-malformed';
  return 'not-closed';
}

function isPassedCloseEvidenceRecord(record: EvidenceIndexRecord): boolean {
  return isWellFormedCloseEvidenceRecord(record) && record.result === 'passed';
}

function isWellFormedCloseEvidenceRecord(record: EvidenceIndexRecord): boolean {
  return record.kind === 'command-log' && /Task close validation .* before close evidence append/.test(record.summary);
}

function isMalformedCloseEvidenceRecord(record: EvidenceIndexRecord): boolean {
  return /Task close validation |before close evidence append/.test(record.summary);
}

function createTaskScopedTimelineReport(
  projectRoot: string,
  taskId: string,
  workbench: TaskWorkbenchReport,
  evidenceList: EvidenceListReport,
  now: Date
): DashboardTimelineReport {
  const generatedAt = now.toISOString();
  const events: DashboardTimelineReport['events'] = [
    {
      id: `${taskId}-selected`,
      order: 1,
      kind: 'task',
      title: `Selected task ${taskId}`,
      summary: workbench.ok ? `${workbench.task.taskStatus} / ${workbench.state.closeState}` : 'Selected task workbench unavailable.',
      severity: workbench.ok && workbench.summary.blockers === 0 ? 'ok' : 'warning',
      taskId,
      command: `task.status ${taskId}`,
      readOnly: true
    },
    ...evidenceList.records.slice(0, 12).map((record, index) => ({
      id: `${taskId}-evidence-${index + 1}`,
      order: index + 2,
      time: record.time,
      kind: 'evidence' as const,
      title: `${record.kind} ${record.result}`,
      summary: record.summary,
      severity: record.result === 'failed' ? ('error' as const) : record.result === 'blocked' ? ('warning' as const) : record.result === 'passed' ? ('ok' as const) : ('info' as const),
      taskId,
      readOnly: true as const
    }))
  ];
  return {
    schemaVersion: 'hadara.dashboard.timeline.v1',
    command: 'dashboard.timeline',
    ok: workbench.ok && evidenceList.ok,
    taskId,
    generatedAt,
    source: {
      projectRoot,
      projectRootRedacted: true,
      project: createDashboardProjectReference(projectRoot),
      live: true
    },
    cache: disabledDashboardCacheMetadata(createDashboardCacheKey(projectRoot, 'task-detail', taskId, 'timeline'), generatedAt),
    events,
    issues: evidenceList.issues.map((issue) => ({ severity: issue.severity, code: `EVIDENCE_LIST_${issue.code}`, message: issue.message }))
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
