import crypto from 'node:crypto';
import { appendEvidence } from '../evidence/evidence';
import { createEvidenceLintReport, EvidenceLintReport } from '../services/evidence-lint';
import { createHarnessValidateReport, HarnessValidateResult } from '../services/harness-service';
import { createTaskProtocolConsistencyReport, ProtocolConsistencyReport } from '../services/protocol-consistency';
import { listTaskCapsules } from './task-capsule';

export type TaskCloseMode = 'dry-run' | 'execute';

export interface TaskCloseReport {
  schemaVersion: 'hadara.task.close.v1';
  command: 'task.close';
  ok: boolean;
  mode: TaskCloseMode;
  taskId: string;
  projectRoot: string;
  summary: {
    blockers: number;
    warnings: number;
    nextActions: number;
  };
  validation: {
    ok: boolean;
    level: 'done';
    issueCount: number;
    validatedBeforeCloseEvidenceHash: string;
  };
  evidenceLint: {
    ok: boolean;
    issueCount: number;
  };
  protocolDoctor: {
    ok: boolean;
    issueCount: number;
  };
  closeEvidence: {
    planned: boolean;
    appended: boolean;
    kind: 'command-log';
    result: 'passed' | 'blocked';
    summary: string;
    excludedFromCurrentValidationLoop: true;
  };
  nextActions: TaskCloseNextAction[];
  issues: TaskCloseIssue[];
}

export interface TaskCloseNextAction {
  id: string;
  kind: 'command' | 'review';
  required: boolean;
  command?: string;
  message: string;
  loopBoundary?: boolean;
}

export interface TaskCloseIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
}

export function createTaskCloseReport(projectRoot: string, taskId: string, mode: TaskCloseMode): TaskCloseReport {
  const issues: TaskCloseIssue[] = [];
  const task = listTaskCapsules(projectRoot).find((candidate) => candidate.id === taskId);
  if (!task) {
    issues.push({ severity: 'error', code: 'TASK_NOT_FOUND', message: `Task Capsule not found: ${taskId}` });
    return buildMissingTaskReport(projectRoot, taskId, mode, issues);
  }

  const validation = createHarnessValidateReport(projectRoot, taskId, { level: 'done' });
  const evidenceLint = createEvidenceLintReport(projectRoot, taskId);
  const protocolDoctor = createTaskProtocolConsistencyReport(projectRoot, taskId);
  const closeEvidenceSummary = `Task close validation for ${taskId} returned ${validation.ok ? 'ok:true' : 'ok:false'} before close evidence append.`;

  collectBlockingIssues(validation, evidenceLint, protocolDoctor, issues);
  if (mode === 'execute') {
    issues.push({
      severity: 'error',
      code: 'TASK_CLOSE_EXECUTE_NOT_IMPLEMENTED',
      message: 'task close --execute is reserved for the next capsule; this report is dry-run planning only.'
    });
  }

  const ok = !issues.some((issue) => issue.severity === 'error');
  const nextActions = createNextActions(taskId, ok, mode);
  return {
    schemaVersion: 'hadara.task.close.v1',
    command: 'task.close',
    ok,
    mode,
    taskId,
    projectRoot,
    summary: {
      blockers: issues.filter((issue) => issue.severity === 'error').length,
      warnings: issues.filter((issue) => issue.severity === 'warning').length,
      nextActions: nextActions.length
    },
    validation: {
      ok: validation.ok,
      level: 'done',
      issueCount: validation.issues.length,
      validatedBeforeCloseEvidenceHash: hashValidationInputs(validation, evidenceLint, protocolDoctor)
    },
    evidenceLint: {
      ok: evidenceLint.ok,
      issueCount: evidenceLint.issues.length
    },
    protocolDoctor: {
      ok: protocolDoctor.ok,
      issueCount: protocolDoctor.issues.length
    },
    closeEvidence: {
      planned: ok,
      appended: false,
      kind: 'command-log',
      result: ok ? 'passed' : 'blocked',
      summary: closeEvidenceSummary,
      excludedFromCurrentValidationLoop: true
    },
    nextActions,
    issues
  };
}

function collectBlockingIssues(validation: HarnessValidateResult, evidenceLint: EvidenceLintReport, protocolDoctor: ProtocolConsistencyReport, issues: TaskCloseIssue[]): void {
  for (const issue of validation.issues) {
    issues.push({ severity: issue.severity, code: `HARNESS_${issue.code}`, message: issue.message, path: issue.path });
  }
  for (const issue of evidenceLint.issues) {
    issues.push({ severity: issue.severity, code: `EVIDENCE_LINT_${issue.code}`, message: issue.message, path: issue.path });
  }
  for (const issue of protocolDoctor.issues) {
    if (issue.severity !== 'error') continue;
    issues.push({ severity: 'error', code: `PROTOCOL_${issue.code}`, message: issue.message, path: issue.path });
  }
}

function createNextActions(taskId: string, ok: boolean, mode: TaskCloseMode): TaskCloseNextAction[] {
  const actions: TaskCloseNextAction[] = [
    {
      id: 'run-done-validation',
      kind: 'command',
      required: true,
      command: `hadara harness validate --task ${taskId} --level done --json`,
      message: 'Verify done-level readiness before closing.'
    },
    {
      id: 'run-evidence-lint',
      kind: 'command',
      required: true,
      command: `hadara evidence lint --task ${taskId} --json`,
      message: 'Verify evidence index syntax, enums, task ids, and rough Markdown/JSONL alignment.'
    }
  ];
  if (ok) {
    actions.push({
      id: mode === 'execute' ? 'close-evidence-appended' : 'append-close-evidence',
      kind: 'command',
      required: mode !== 'execute',
      command: mode === 'execute' ? undefined : `hadara task close --task ${taskId} --execute --json`,
      message: mode === 'execute' ? 'Close evidence append is planned for the execute MVP.' : 'Append close audit evidence after reviewing this dry-run plan.',
      loopBoundary: true
    });
  } else {
    actions.push({
      id: 'resolve-close-blockers',
      kind: 'review',
      required: true,
      message: 'Resolve blocking issues before appending close evidence.'
    });
  }
  return actions;
}

function buildMissingTaskReport(projectRoot: string, taskId: string, mode: TaskCloseMode, issues: TaskCloseIssue[]): TaskCloseReport {
  return {
    schemaVersion: 'hadara.task.close.v1',
    command: 'task.close',
    ok: false,
    mode,
    taskId,
    projectRoot,
    summary: { blockers: issues.length, warnings: 0, nextActions: 0 },
    validation: { ok: false, level: 'done', issueCount: 0, validatedBeforeCloseEvidenceHash: 'sha256:missing-task' },
    evidenceLint: { ok: false, issueCount: 0 },
    protocolDoctor: { ok: false, issueCount: 0 },
    closeEvidence: {
      planned: false,
      appended: false,
      kind: 'command-log',
      result: 'blocked',
      summary: `Task close validation for ${taskId} could not run because the task was not found.`,
      excludedFromCurrentValidationLoop: true
    },
    nextActions: [],
    issues
  };
}

function hashValidationInputs(validation: HarnessValidateResult, evidenceLint: EvidenceLintReport, protocolDoctor: ProtocolConsistencyReport): string {
  const payload = JSON.stringify({
    validationOk: validation.ok,
    validationIssues: validation.issues,
    evidenceOk: evidenceLint.ok,
    evidenceIssues: evidenceLint.issues,
    protocolOk: protocolDoctor.ok,
    protocolIssues: protocolDoctor.issues
  });
  return `sha256:${crypto.createHash('sha256').update(payload, 'utf8').digest('hex')}`;
}

export function executeTaskCloseEvidence(projectRoot: string, report: TaskCloseReport): void {
  appendEvidence(projectRoot, {
    taskId: report.taskId,
    kind: 'command-log',
    summary: report.closeEvidence.summary,
    result: report.closeEvidence.result,
    visibility: 'public'
  });
  report.closeEvidence.appended = true;
}
