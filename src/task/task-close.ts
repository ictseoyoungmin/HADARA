import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
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
    validatedBeforeCloseEvidenceReportHash: string;
    validatedBeforeCloseEvidenceSourceHash: string;
    /** @deprecated Use validatedBeforeCloseEvidenceReportHash. This hashes diagnostic report output, not raw source file content. */
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
    validationReportHash?: string;
    sourceHash?: string;
    markdownPath?: string;
    evidencePath?: string;
  };
  lifecycle: TaskCloseLifecycleGuidance;
  nextActions: TaskCloseNextAction[];
  issues: TaskCloseIssue[];
}

export interface TaskCloseLifecycleGuidance {
  model: 'validation-close-audit';
  reportPhase: 'pre-close-plan' | 'close-execute';
  nextPhaseAfterSuccess: 'close-execute' | 'post-close-audit';
  validationPhase: {
    role: 'prove-readiness';
    command: string;
    includesCloseEvidenceAppend: false;
  };
  closePhase: {
    role: 'record-proof';
    command: string;
    writes: 'close-evidence-only';
  };
  auditPhase: {
    role: 'check-close-record';
    command: string;
    writes: 'none';
  };
  closeEvidenceLoopBoundary: {
    excludedFromCurrentValidationLoop: true;
    reason: string;
  };
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
  const validationReportHash = hashValidationInputs(validation, evidenceLint, protocolDoctor);
  const sourceHash = hashCloseRelevantSource(projectRoot, task.dir);
  const closeEvidenceSummary = `Task close validation for ${taskId} returned ${validation.ok ? 'ok:true' : 'ok:false'} before close evidence append; reportHash ${validationReportHash}; sourceHash ${sourceHash}.`;

  collectBlockingIssues(validation, evidenceLint, protocolDoctor, issues);
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
      validatedBeforeCloseEvidenceReportHash: validationReportHash,
      validatedBeforeCloseEvidenceSourceHash: sourceHash,
      validatedBeforeCloseEvidenceHash: validationReportHash
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
      excludedFromCurrentValidationLoop: true,
      validationReportHash,
      sourceHash
    },
    lifecycle: createCloseLifecycleGuidance(taskId, mode),
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
  if (mode === 'execute') {
    if (ok) {
      return [
        {
          id: 'close-evidence-appended',
          kind: 'review',
          required: false,
          message: 'Close audit evidence was appended through the canonical evidence writer.',
          loopBoundary: true
        },
        {
          id: 'audit-close',
          kind: 'command',
          required: false,
          command: `hadara task audit-close --task ${taskId} --json`,
          message: 'Optionally audit the close record in a later read-only pass.'
        }
      ];
    }
    return [
      {
        id: 'resolve-close-blockers',
        kind: 'review',
        required: true,
        message: 'Resolve blocking issues before appending close evidence.'
      }
    ];
  }

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
      id: 'append-close-evidence',
      kind: 'command',
      required: true,
      command: `hadara task close --task ${taskId} --execute --json`,
      message: 'Append close audit evidence after reviewing this dry-run plan.',
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
    validation: {
      ok: false,
      level: 'done',
      issueCount: 0,
      validatedBeforeCloseEvidenceReportHash: 'sha256:missing-task',
      validatedBeforeCloseEvidenceSourceHash: 'sha256:missing-task',
      validatedBeforeCloseEvidenceHash: 'sha256:missing-task'
    },
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
    lifecycle: createCloseLifecycleGuidance(taskId, mode),
    nextActions: [],
    issues
  };
}

function createCloseLifecycleGuidance(taskId: string, mode: TaskCloseMode): TaskCloseLifecycleGuidance {
  return {
    model: 'validation-close-audit',
    reportPhase: mode === 'execute' ? 'close-execute' : 'pre-close-plan',
    nextPhaseAfterSuccess: mode === 'execute' ? 'post-close-audit' : 'close-execute',
    validationPhase: {
      role: 'prove-readiness',
      command: `hadara task close --task ${taskId} --json`,
      includesCloseEvidenceAppend: false
    },
    closePhase: {
      role: 'record-proof',
      command: `hadara task close --task ${taskId} --execute --json`,
      writes: 'close-evidence-only'
    },
    auditPhase: {
      role: 'check-close-record',
      command: `hadara task audit-close --task ${taskId} --json`,
      writes: 'none'
    },
    closeEvidenceLoopBoundary: {
      excludedFromCurrentValidationLoop: true,
      reason: 'Close evidence is appended after validation, so the same validation run must not require the evidence it is about to create.'
    }
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

function hashCloseRelevantSource(projectRoot: string, taskDir: string): string {
  const relativePaths = [
    path.relative(projectRoot, path.join(taskDir, 'TASK.md')),
    path.relative(projectRoot, path.join(taskDir, 'PLAN.md')),
    path.relative(projectRoot, path.join(taskDir, 'CONTEXT.md')),
    path.relative(projectRoot, path.join(taskDir, 'FILES.md')),
    path.relative(projectRoot, path.join(taskDir, 'ACCEPTANCE.md')),
    path.relative(projectRoot, path.join(taskDir, 'TESTS.md')),
    path.relative(projectRoot, path.join(taskDir, 'RISKS.md')),
    path.relative(projectRoot, path.join(taskDir, 'DECISIONS.md')),
    path.relative(projectRoot, path.join(taskDir, 'HANDOFF.md')),
    path.join('docs', 'TASK_BOARD.md')
  ]
    .map(toPortablePath)
    .sort();
  const payload = relativePaths.map((relativePath) => {
    const absolutePath = path.join(projectRoot, relativePath);
    return {
      path: relativePath,
      exists: fs.existsSync(absolutePath),
      sha256: fs.existsSync(absolutePath) ? crypto.createHash('sha256').update(fs.readFileSync(absolutePath)).digest('hex') : null
    };
  });
  return `sha256:${crypto.createHash('sha256').update(JSON.stringify(payload), 'utf8').digest('hex')}`;
}

export function executeTaskCloseEvidence(projectRoot: string, report: TaskCloseReport): void {
  const markdownPath = appendEvidence(projectRoot, {
    taskId: report.taskId,
    kind: 'command-log',
    summary: report.closeEvidence.summary,
    result: report.closeEvidence.result,
    visibility: 'public'
  });
  report.closeEvidence.appended = true;
  report.closeEvidence.markdownPath = toPortablePath(path.relative(projectRoot, markdownPath));
  const task = listTaskCapsules(projectRoot).find((candidate) => candidate.id === report.taskId);
  if (task) {
    report.closeEvidence.evidencePath = toPortablePath(path.relative(projectRoot, path.join(task.dir, 'evidence.jsonl')));
  }
}

export interface TaskAuditCloseReport {
  schemaVersion: 'hadara.task.audit_close.v1';
  command: 'task.audit-close';
  ok: boolean;
  taskId: string;
  projectRoot: string;
  summary: {
    closeEvidenceRecords: number;
    blockers: number;
    warnings: number;
  };
  currentValidationReportHash: string;
  currentSourceHash: string;
  latestCloseEvidence?: {
    time: string;
    summary: string;
    result: string;
    validationReportHash?: string;
    sourceHash?: string;
  };
  auditVerdict: TaskAuditCloseVerdict;
  issues: TaskCloseIssue[];
}

export interface TaskAuditCloseVerdict {
  phase: 'post-close-audit';
  verdict: 'closed-valid' | 'not-closed' | 'close-evidence-invalid' | 'closed-with-drift-warnings';
  closeEvidenceFound: boolean;
  closeEvidenceValid: boolean;
  reportHashMatches?: boolean;
  sourceHashMatches?: boolean;
  recordedValidationReportHash?: string;
  recordedSourceHash?: string;
  currentValidationReportHash: string;
  currentSourceHash: string;
  blockers: number;
  warnings: number;
  writeBoundary: 'read-only';
  model: 'validation-close-audit';
}

export function createTaskAuditCloseReport(projectRoot: string, taskId: string): TaskAuditCloseReport {
  const issues: TaskCloseIssue[] = [];
  const task = listTaskCapsules(projectRoot).find((candidate) => candidate.id === taskId);
  if (!task) {
    issues.push({ severity: 'error', code: 'TASK_NOT_FOUND', message: `Task Capsule not found: ${taskId}` });
    return buildAuditReport(projectRoot, taskId, 'sha256:missing-task', 'sha256:missing-task', [], issues);
  }

  const closePlan = createTaskCloseReport(projectRoot, taskId, 'dry-run');
  const evidencePath = path.join(task.dir, 'evidence.jsonl');
  const records = readCloseEvidenceRecords(evidencePath);
  if (records.length === 0) {
    issues.push({
      severity: 'error',
      code: 'TASK_CLOSE_EVIDENCE_MISSING',
      message: 'No command-log close evidence record was found for this task.',
      path: toPortablePath(path.relative(projectRoot, evidencePath))
    });
  }
  const latest = records.at(-1);
  const latestHash = latest ? extractReportHash(latest.summary) : undefined;
  const latestSourceHash = latest ? extractSourceHash(latest.summary) : undefined;
  if (latest && latest.kind !== 'command-log') {
    issues.push({
      severity: 'error',
      code: 'TASK_CLOSE_EVIDENCE_KIND_INVALID',
      message: 'Close evidence must use command-log kind.',
      path: toPortablePath(path.relative(projectRoot, evidencePath))
    });
  }
  if (latest && latest.result !== 'passed') {
    issues.push({
      severity: 'error',
      code: 'TASK_CLOSE_EVIDENCE_RESULT_INVALID',
      message: 'Close evidence should record a passed result.',
      path: toPortablePath(path.relative(projectRoot, evidencePath))
    });
  }
  if (latest && !latestHash) {
    issues.push({
      severity: 'warning',
      code: 'TASK_CLOSE_EVIDENCE_HASH_MISSING',
      message: 'Latest close evidence does not include a validation report hash.',
      path: toPortablePath(path.relative(projectRoot, evidencePath))
    });
  } else if (latestHash && latestHash !== closePlan.validation.validatedBeforeCloseEvidenceReportHash) {
    issues.push({
      severity: 'warning',
      code: 'TASK_CLOSE_AUDIT_CURRENT_REPORT_HASH_DRIFT',
      message: 'Current diagnostic report hash differs from the latest close evidence hash.',
      path: toPortablePath(path.relative(projectRoot, evidencePath))
    });
  }
  if (latest && !latestSourceHash) {
    issues.push({
      severity: 'warning',
      code: 'TASK_CLOSE_EVIDENCE_SOURCE_HASH_MISSING',
      message: 'Latest close evidence does not include a close-relevant source hash.',
      path: toPortablePath(path.relative(projectRoot, evidencePath))
    });
  } else if (latestSourceHash && latestSourceHash !== closePlan.validation.validatedBeforeCloseEvidenceSourceHash) {
    issues.push({
      severity: 'warning',
      code: 'TASK_CLOSE_AUDIT_SOURCE_HASH_DRIFT',
      message: 'Current close-relevant source hash differs from the latest close evidence source hash.',
      path: toPortablePath(path.relative(projectRoot, evidencePath))
    });
  }

  return buildAuditReport(
    projectRoot,
    taskId,
    closePlan.validation.validatedBeforeCloseEvidenceReportHash,
    closePlan.validation.validatedBeforeCloseEvidenceSourceHash,
    records,
    issues
  );
}

export function formatTaskAuditCloseReport(report: TaskAuditCloseReport): string {
  const lines = [
    `[HADARA] Task Close Audit: ${report.taskId}`,
    '',
    'State',
    `- Closed: ${report.summary.closeEvidenceRecords > 0 ? 'yes' : 'no'}`,
    `- Close evidence records: ${report.summary.closeEvidenceRecords}`,
    '',
    'Close Evidence'
  ];
  if (report.latestCloseEvidence) {
    lines.push(`- Latest: ${report.latestCloseEvidence.result} / ${report.latestCloseEvidence.time}`);
    if (report.latestCloseEvidence.validationReportHash) lines.push(`- Report hash: ${report.latestCloseEvidence.validationReportHash}`);
    if (report.latestCloseEvidence.sourceHash) lines.push(`- Source hash: ${report.latestCloseEvidence.sourceHash}`);
  } else {
    lines.push('- Latest: none');
  }
  lines.push(
    '',
    'Audit',
    `- Verdict: ${report.auditVerdict.verdict}`,
    `- Blockers: ${report.summary.blockers}`,
    `- Warnings: ${report.summary.warnings}`,
    '',
    'Suggested next'
  );
  if (report.ok) {
    lines.push('- No immediate actions.');
  } else {
    lines.push(`1. hadara task close --task ${report.taskId} --json`);
  }
  if (report.issues.length > 0) {
    lines.push('', 'Issues');
    for (const issue of report.issues) lines.push(`- [${issue.severity}] ${issue.code}: ${issue.message}`);
  }
  return lines.join('\n');
}

function buildAuditReport(
  projectRoot: string,
  taskId: string,
  currentHash: string,
  currentSourceHash: string,
  records: Array<{ time: string; kind: string; summary: string; result: string }>,
  issues: TaskCloseIssue[]
): TaskAuditCloseReport {
  const latest = records.at(-1);
  return {
    schemaVersion: 'hadara.task.audit_close.v1',
    command: 'task.audit-close',
    ok: !issues.some((issue) => issue.severity === 'error'),
    taskId,
    projectRoot,
    summary: {
      closeEvidenceRecords: records.length,
      blockers: issues.filter((issue) => issue.severity === 'error').length,
      warnings: issues.filter((issue) => issue.severity === 'warning').length
    },
    currentValidationReportHash: currentHash,
    currentSourceHash,
    ...(latest
      ? {
          latestCloseEvidence: {
            time: latest.time,
            summary: latest.summary,
            result: latest.result,
            ...(extractReportHash(latest.summary) ? { validationReportHash: extractReportHash(latest.summary) } : {}),
            ...(extractSourceHash(latest.summary) ? { sourceHash: extractSourceHash(latest.summary) } : {})
          }
        }
      : {}),
    auditVerdict: createAuditVerdict(currentHash, currentSourceHash, latest, issues),
    issues
  };
}

function createAuditVerdict(
  currentHash: string,
  currentSourceHash: string,
  latest: { time: string; kind: string; summary: string; result: string } | undefined,
  issues: TaskCloseIssue[]
): TaskAuditCloseVerdict {
  const blockers = issues.filter((issue) => issue.severity === 'error').length;
  const warnings = issues.filter((issue) => issue.severity === 'warning').length;
  const recordedValidationReportHash = latest ? extractReportHash(latest.summary) : undefined;
  const recordedSourceHash = latest ? extractSourceHash(latest.summary) : undefined;
  const closeEvidenceFound = latest !== undefined;
  const closeEvidenceValid = closeEvidenceFound && latest.kind === 'command-log' && latest.result === 'passed';
  let verdict: TaskAuditCloseVerdict['verdict'] = 'closed-valid';
  if (!closeEvidenceFound) {
    verdict = 'not-closed';
  } else if (!closeEvidenceValid || blockers > 0) {
    verdict = 'close-evidence-invalid';
  } else if (warnings > 0) {
    verdict = 'closed-with-drift-warnings';
  }

  return {
    phase: 'post-close-audit',
    verdict,
    closeEvidenceFound,
    closeEvidenceValid,
    ...(recordedValidationReportHash ? { recordedValidationReportHash, reportHashMatches: recordedValidationReportHash === currentHash } : {}),
    ...(recordedSourceHash ? { recordedSourceHash, sourceHashMatches: recordedSourceHash === currentSourceHash } : {}),
    currentValidationReportHash: currentHash,
    currentSourceHash,
    blockers,
    warnings,
    writeBoundary: 'read-only',
    model: 'validation-close-audit'
  };
}

function readCloseEvidenceRecords(evidencePath: string): Array<{ time: string; kind: string; summary: string; result: string }> {
  if (!fs.existsSync(evidencePath)) return [];
  return fs
    .readFileSync(evidencePath, 'utf8')
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .flatMap((line) => {
      try {
        const record = JSON.parse(line) as { schemaVersion?: unknown; time?: unknown; kind?: unknown; summary?: unknown; result?: unknown; legacy?: { kind?: unknown; result?: unknown } };
        const kind = record.schemaVersion === 'hadara.evidence.v2' ? record.legacy?.kind : record.kind;
        const result = record.schemaVersion === 'hadara.evidence.v2' ? record.legacy?.result : record.result;
        if (
          typeof record.time === 'string' &&
          typeof kind === 'string' &&
          typeof record.summary === 'string' &&
          typeof result === 'string' &&
          /Task close validation .* before close evidence append/.test(record.summary)
        ) {
          return [{ time: record.time, kind, summary: record.summary, result }];
        }
      } catch {
        return [];
      }
      return [];
    });
}

function extractReportHash(summary: string): string | undefined {
  return summary.match(/reportHash\s+(sha256:[a-f0-9]{64})/)?.[1];
}

function extractSourceHash(summary: string): string | undefined {
  return summary.match(/sourceHash\s+(sha256:[a-f0-9]{64})/)?.[1];
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
