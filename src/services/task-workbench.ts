import { EvidenceIndexRecord } from '../evidence/evidence';
import { createTaskCloseReport, TaskCloseIssue } from '../task/task-close';
import { createTaskListReport, createTaskShowReport } from './task-read-model';
import { createEvidenceListReport } from './evidence-list';
import { createDocsProtocolConsistencyReport, createProfileProtocolConsistencyReport } from './protocol-consistency';
import { buildWorkbenchNextActions, WorkbenchNextAction } from './workbench-next-actions';

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
  };
  state: {
    closeState: 'not-closed' | 'closed';
    ready: boolean;
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
  const taskBoardStatus = createTaskListReport(projectRoot).tasks.find((task) => task.id === taskId)?.status ?? 'Unknown';
  const latestEvidence = evidenceList.records.at(-1);
  const closed = evidenceList.records.some(isCloseEvidenceRecord);
  const issues = [
    ...closePlan.issues,
    ...evidenceList.issues.map((issue): TaskCloseIssue => ({ severity: issue.severity, code: `EVIDENCE_LIST_${issue.code}`, message: issue.message })),
    ...docsDoctor.issues.map((issue): TaskCloseIssue => ({ severity: issue.severity, code: `PROTOCOL_DOCS_${issue.code}`, message: issue.message, path: issue.path })),
    ...profileDoctor.issues.map((issue): TaskCloseIssue => ({ severity: issue.severity, code: `PROTOCOL_PROFILE_${issue.code}`, message: issue.message, path: issue.path }))
  ];
  const nextActions = buildWorkbenchNextActions({
    taskId,
    closed,
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
      taskBoardStatus
    },
    state: {
      closeState: closed ? 'closed' : 'not-closed',
      ready: closePlan.ok,
      closed,
      auditable: closed
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
    `- Task Board status: ${report.task.taskBoardStatus}`,
    `- Close state: ${report.state.closeState}`,
    `- Ready for Done: ${report.state.ready ? 'yes' : 'no'}`,
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
      taskBoardStatus: 'Missing'
    },
    state: {
      closeState: 'not-closed',
      ready: false,
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
    issues,
    nextActions: []
  };
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

function isCloseEvidenceRecord(record: EvidenceIndexRecord): boolean {
  return record.kind === 'command-log' && /Task close validation .* before close evidence append/.test(record.summary);
}
