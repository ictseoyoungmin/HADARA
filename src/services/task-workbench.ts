import fs from 'node:fs';
import path from 'node:path';
import { EvidenceIndexRecord, PersistedEvidenceRecord, persistedEvidenceKind, persistedEvidenceResult } from '../evidence/evidence';
import { createTaskCloseReport, TaskCloseIssue } from '../task/task-close';
import { createTaskShowReport } from './task-read-model';
import { createEvidenceListReport } from './evidence-list';
import { parseMarkdownRows } from './markdown-table';
import { createDocsProtocolConsistencyReport, createProfileProtocolConsistencyReport } from './protocol-consistency';
import { buildWorkbenchNextActions, WorkbenchNextAction } from './workbench-next-actions';
import { createTaskAuthoringGuidance, TaskAuthoringGuidance } from '../task/authoring-guidance';

type CloseState = 'not-closed' | 'closed-valid' | 'close-evidence-found-invalid' | 'close-evidence-malformed';
type ReadinessStatus = 'ready' | 'current-blocked' | 'closed-valid-current-blocked' | 'missing-task';

export interface TaskWorkbenchReadiness {
  status: ReadinessStatus;
  currentReady: boolean;
  closeProofValid: boolean;
  summary: string;
}

export interface TaskWorkbenchReport {
  schemaVersion: 'hadara.task.workbench.v1';
  command: 'task.status';
  ok: boolean;
  generatedAt: string;
  projectRoot: string;
  task: {
    id: string;
    title: string;
    capsule: string;
    taskStatus: string;
    taskBoardStatus: string;
    taskBoardPath: string;
    taskBoardPresent: boolean;
  };
  state: {
    closeState: CloseState;
    ready: boolean;
    readiness: TaskWorkbenchReadiness;
    closeEvidenceFound: boolean;
    closedValid: boolean;
    closed: boolean;
    auditable: boolean;
  };
  summary: {
    blockers: number;
    warnings: number;
    evidenceRecords: number;
    nextActions: number;
  };
  sources: {
    taskClosePlan: {
      ok: boolean;
      mode: 'dry-run';
      blockers: number;
      warnings: number;
    };
    evidenceLint: {
      ok: boolean;
      issues: number;
    };
    evidenceList: {
      ok: boolean;
      records: number;
      latest?: {
        time: string;
        kind: string;
        result: string;
        visibility: string;
        summary: string;
      };
    };
    protocolTask: {
      ok: boolean;
      issues: number;
    };
    protocolDocs: {
      ok: boolean;
      issues: number;
    };
    protocolProfile: {
      ok: boolean;
      issues: number;
    };
  };
  authoringGuidance: TaskAuthoringGuidance;
  issues: TaskCloseIssue[];
  nextActions: WorkbenchNextAction[];
}

export function createTaskWorkbenchReport(projectRoot: string, taskId: string, now = new Date()): TaskWorkbenchReport {
  const taskShow = createTaskShowReport(projectRoot, taskId);
  if (!taskShow.ok || !taskShow.task) {
    const closePlan = createTaskCloseReport(projectRoot, taskId, 'dry-run');
    return buildMissingTaskReport(projectRoot, taskId, now.toISOString(), closePlan.issues);
  }

  const closePlan = createTaskCloseReport(projectRoot, taskId, 'dry-run');
  const evidenceList = createEvidenceListReport(projectRoot, { taskId });
  const docsDoctor = createDocsProtocolConsistencyReport(projectRoot, now);
  const profileDoctor = createProfileProtocolConsistencyReport(projectRoot, now);
  const taskBoard = readTaskBoardProjection(projectRoot, taskShow.task.id);
  const latestEvidence = evidenceList.records.at(-1);
  const closeState = getCloseState(evidenceList.records);
  const closeEvidenceFound = closeState !== 'not-closed';
  const closedValid = closeState === 'closed-valid';
  const readiness = buildTaskWorkbenchReadiness(closePlan.ok, closedValid);
  const authoringGuidance = createTaskAuthoringGuidance(projectRoot, taskId);
  const issues = [
    ...closePlan.issues,
    ...buildTaskBoardIssues(taskShow.task.id, taskShow.task.status, taskShow.task.capsule, taskBoard),
    ...evidenceList.issues.map((issue): TaskCloseIssue => ({ severity: issue.severity, code: `EVIDENCE_LIST_${issue.code}`, message: issue.message })),
    ...docsDoctor.issues.map((issue): TaskCloseIssue => ({ severity: issue.severity, code: `PROTOCOL_DOCS_${issue.code}`, message: issue.message, path: issue.path })),
    ...profileDoctor.issues.map((issue): TaskCloseIssue => ({ severity: issue.severity, code: `PROTOCOL_PROFILE_${issue.code}`, message: issue.message, path: issue.path }))
  ];
  const nextActions = buildWorkbenchNextActions({
    taskId,
    closed: closedValid,
    closeEvidenceFound,
    closePlanOk: closePlan.ok,
    evidenceRecords: evidenceList.count,
    closeActions: closePlan.nextActions,
    issues
  });

  return {
    schemaVersion: 'hadara.task.workbench.v1',
    command: 'task.status',
    ok: true,
    generatedAt: now.toISOString(),
    projectRoot,
    task: {
      id: taskShow.task.id,
      title: taskShow.task.title,
      capsule: taskShow.task.capsule,
      taskStatus: taskShow.task.status,
      taskBoardStatus: taskBoard.status,
      taskBoardPath: taskBoard.path,
      taskBoardPresent: taskBoard.present
    },
    state: {
      closeState,
      ready: closePlan.ok,
      readiness,
      closeEvidenceFound,
      closedValid,
      closed: closedValid,
      auditable: closeEvidenceFound
    },
    summary: {
      blockers: issues.filter((issue) => issue.severity === 'error').length,
      warnings: issues.filter((issue) => issue.severity === 'warning').length,
      evidenceRecords: evidenceList.count,
      nextActions: nextActions.length
    },
    sources: {
      taskClosePlan: {
        ok: closePlan.ok,
        mode: 'dry-run',
        blockers: closePlan.summary.blockers,
        warnings: closePlan.summary.warnings
      },
      evidenceLint: {
        ok: closePlan.evidenceLint.ok,
        issues: closePlan.evidenceLint.issueCount
      },
      evidenceList: {
        ok: evidenceList.ok,
        records: evidenceList.count,
        ...(latestEvidence ? { latest: summarizeEvidence(latestEvidence) } : {})
      },
      protocolTask: {
        ok: closePlan.protocolDoctor.ok,
        issues: closePlan.protocolDoctor.issueCount
      },
      protocolDocs: {
        ok: docsDoctor.ok,
        issues: docsDoctor.issues.length
      },
      protocolProfile: {
        ok: profileDoctor.ok,
        issues: profileDoctor.issues.length
      }
    },
    authoringGuidance,
    issues,
    nextActions
  };
}

export function formatTaskWorkbenchReport(report: TaskWorkbenchReport): string {
  const lines = [
    `[HADARA] Task Status: ${report.task.id} ${report.task.title}`,
    '',
    'State',
    `- Capsule: ${report.task.capsule}`,
    `- TASK.md status: ${report.task.taskStatus}`,
    `- Task Board status: ${report.task.taskBoardPresent ? report.task.taskBoardStatus : 'missing'}`,
    `- Close state: ${report.state.closeState}`,
    `- Ready for Done: ${report.state.ready ? 'yes' : 'no'}`,
    `- Readiness note: ${report.state.readiness.summary}`,
    '',
    'Evidence',
    `- Lint: ${report.sources.evidenceLint.ok ? 'ok' : 'issues'}`,
    `- Records: ${report.sources.evidenceList.records}`
  ];
  if (report.sources.evidenceList.latest) {
    lines.push(`- Latest: ${report.sources.evidenceList.latest.kind} / ${report.sources.evidenceList.latest.result} / ${report.sources.evidenceList.latest.visibility}`);
  }
  lines.push(
    '',
    'Protocol',
    `- Task doctor: ${report.sources.protocolTask.ok ? 'ok' : 'issues'}`,
    `- Docs doctor: ${report.sources.protocolDocs.ok ? 'ok' : 'issues'}${report.sources.protocolDocs.issues > 0 ? ` (${report.sources.protocolDocs.issues})` : ''}`,
    `- Profile doctor: ${report.sources.protocolProfile.ok ? 'ok' : 'issues'}${report.sources.protocolProfile.issues > 0 ? ` (${report.sources.protocolProfile.issues})` : ''}`,
    '',
    'Close',
    `- Close plan: ${report.sources.taskClosePlan.ok ? 'ready' : 'blocked'}`,
    `- Blockers: ${report.summary.blockers}`,
    `- Warnings: ${report.summary.warnings}`,
    '',
    'Authoring',
    `- ${report.authoringGuidance.summary}`,
    '',
    'Suggested next'
  );
  if (report.nextActions.length === 0) {
    lines.push('- No immediate actions.');
  } else {
    report.nextActions.forEach((action, index) => lines.push(`${index + 1}. ${action.command ?? action.message}`));
  }
  return lines.join('\n');
}

function buildMissingTaskReport(projectRoot: string, taskId: string, generatedAt: string, issues: TaskCloseIssue[]): TaskWorkbenchReport {
  return {
    schemaVersion: 'hadara.task.workbench.v1',
    command: 'task.status',
    ok: false,
    generatedAt,
    projectRoot,
    task: {
      id: taskId,
      title: 'Unknown',
      capsule: '',
      taskStatus: 'Missing',
      taskBoardStatus: 'Missing',
      taskBoardPath: 'docs/TASK_BOARD.md',
      taskBoardPresent: false
    },
    state: {
      closeState: 'not-closed',
      ready: false,
      readiness: buildMissingTaskReadiness(),
      closeEvidenceFound: false,
      closedValid: false,
      closed: false,
      auditable: false
    },
    summary: {
      blockers: issues.filter((issue) => issue.severity === 'error').length,
      warnings: issues.filter((issue) => issue.severity === 'warning').length,
      evidenceRecords: 0,
      nextActions: 0
    },
    sources: {
      taskClosePlan: { ok: false, mode: 'dry-run', blockers: issues.length, warnings: 0 },
      evidenceLint: { ok: false, issues: 0 },
      evidenceList: { ok: false, records: 0 },
      protocolTask: { ok: false, issues: 0 },
      protocolDocs: { ok: false, issues: 0 },
      protocolProfile: { ok: false, issues: 0 }
    },
    authoringGuidance: {
      readOnly: true,
      writesProse: false,
      status: 'task-missing',
      summary: 'Task Capsule was not found; no task-owned prose can be inspected.',
      items: []
    },
    issues,
    nextActions: []
  };
}

export function buildTaskWorkbenchReadiness(currentReady: boolean, closeProofValid: boolean): TaskWorkbenchReadiness {
  if (currentReady) {
    return {
      status: 'ready',
      currentReady,
      closeProofValid,
      summary: closeProofValid
        ? 'Current done-level readiness passes and a valid close proof is present.'
        : 'Current done-level readiness passes; no valid close proof is required for this read-only status report.'
    };
  }
  if (closeProofValid) {
    return {
      status: 'closed-valid-current-blocked',
      currentReady,
      closeProofValid,
      summary: 'A valid close proof exists, but current done-level readiness is blocked by changed or newly failed task state.'
    };
  }
  return {
    status: 'current-blocked',
    currentReady,
    closeProofValid,
    summary: 'Current done-level readiness is blocked; inspect blockers before closing or completing the task.'
  };
}

function buildMissingTaskReadiness(): TaskWorkbenchReadiness {
  return {
    status: 'missing-task',
    currentReady: false,
    closeProofValid: false,
    summary: 'Task Capsule was not found, so done-level readiness cannot be evaluated.'
  };
}

function summarizeEvidence(record: PersistedEvidenceRecord): NonNullable<TaskWorkbenchReport['sources']['evidenceList']['latest']> {
  return {
    time: record.time,
    kind: persistedEvidenceKind(record),
    result: persistedEvidenceResult(record),
    visibility: record.visibility,
    summary: record.summary
  };
}

interface TaskBoardProjection {
  status: string;
  path: string;
  present: boolean;
  capsule: string | null;
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

function buildTaskBoardIssues(taskId: string, taskStatus: string, capsule: string, taskBoard: TaskBoardProjection): TaskCloseIssue[] {
  if (!taskBoard.present) {
    return [
      {
        severity: 'warning',
        code: 'WORKBENCH_TASK_BOARD_ROW_MISSING',
        message: `docs/TASK_BOARD.md does not contain a row for ${taskId}.`,
        path: taskBoard.path
      }
    ];
  }

  const issues: TaskCloseIssue[] = [];
  if (taskBoard.status !== taskStatus) {
    issues.push({
      severity: 'warning',
      code: 'WORKBENCH_TASK_BOARD_STATUS_DRIFT',
      message: `docs/TASK_BOARD.md status for ${taskId} is ${taskBoard.status || '(empty)'}, but TASK.md status is ${taskStatus || '(empty)'}.`,
      path: taskBoard.path
    });
  }
  if (taskBoard.capsule !== capsule) {
    issues.push({
      severity: 'warning',
      code: 'WORKBENCH_TASK_BOARD_CAPSULE_DRIFT',
      message: `docs/TASK_BOARD.md capsule for ${taskId} is ${taskBoard.capsule || '(empty)'}, expected ${capsule}.`,
      path: taskBoard.path
    });
  }
  return issues;
}

function getCloseState(records: PersistedEvidenceRecord[]): CloseState {
  if (records.some(isPassedCloseEvidenceRecord)) return 'closed-valid';
  if (records.some(isWellFormedCloseEvidenceRecord)) return 'close-evidence-found-invalid';
  if (records.some(isMalformedCloseEvidenceRecord)) return 'close-evidence-malformed';
  return 'not-closed';
}

function isPassedCloseEvidenceRecord(record: PersistedEvidenceRecord): boolean {
  return isWellFormedCloseEvidenceRecord(record) && persistedEvidenceResult(record) === 'passed';
}

function isWellFormedCloseEvidenceRecord(record: PersistedEvidenceRecord): boolean {
  return persistedEvidenceKind(record) === 'command-log' && /Task close validation .* before close evidence append/.test(record.summary);
}

function isMalformedCloseEvidenceRecord(record: PersistedEvidenceRecord): boolean {
  return /Task close validation |before close evidence append/.test(record.summary);
}
