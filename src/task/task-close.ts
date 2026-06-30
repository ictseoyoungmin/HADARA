import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { appendEvidenceWithResult } from '../evidence/evidence';
import { createEvidenceLintReport, EvidenceLintReport } from '../services/evidence-lint';
import { createHarnessValidateReport, HarnessValidateResult } from '../services/harness-service';
import type { RemediationHint } from '../harness/validate';
import { createTaskProtocolConsistencyReport, ProtocolConsistencyReport } from '../services/protocol-consistency';
import type { HadaraActorContext } from '../core/actor-context';
import { listTaskCapsules } from './task-capsule';
import { createTaskLifecycleNextAction, defaultTaskLifecycleActor, selectPrimaryNextAction, TaskLifecycleNextAction } from './lifecycle-next-actions';

export type TaskCloseMode = 'dry-run' | 'execute';

export interface TaskCloseReport {
  schemaVersion: 'hadara.task.close.v1';
  command: 'task.close';
  ok: boolean;
  mode: TaskCloseMode;
  taskId: string;
  projectRoot: string;
  actor: HadaraActorContext;
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
    slotRegistryVersion?: number;
    slotRegistryHash: string;
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
    slotRegistryVersion?: number;
    slotRegistryHash?: string;
    markdownPath?: string;
    evidencePath?: string;
  };
  closeEvidenceWrite?: TaskCloseEvidenceWrite;
  lifecycle: TaskCloseLifecycleGuidance;
  nextActions: TaskCloseNextAction[];
  primaryNextAction?: TaskCloseNextAction;
  issues: TaskCloseIssue[];
}

export interface TaskCloseEvidenceWrite {
  idempotencyKey: string;
  duplicateFound: boolean;
  duplicateAction: 'no-op' | 'append' | 'warning';
  supersedes?: string[];
  executeRecheck?: {
    performed: boolean;
    duplicateFound: boolean;
    action: 'no-op' | 'append';
  };
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

export type TaskCloseNextAction = TaskLifecycleNextAction;

export interface TaskCloseIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  path?: string;
  heading?: string;
  fixHint?: string;
  example?: string;
  remediationHint?: RemediationHint;
}

export interface TaskCloseOptions {
  actor?: HadaraActorContext;
}

export function createTaskCloseReport(projectRoot: string, taskId: string, mode: TaskCloseMode, options: TaskCloseOptions = {}): TaskCloseReport {
  const actor = options.actor ?? defaultTaskLifecycleActor();
  const issues: TaskCloseIssue[] = [];
  const task = listTaskCapsules(projectRoot).find((candidate) => candidate.id === taskId);
  if (!task) {
    issues.push({ severity: 'error', code: 'TASK_NOT_FOUND', message: `Task Capsule not found: ${taskId}` });
    return buildMissingTaskReport(projectRoot, taskId, mode, issues, actor);
  }

  const validation = createHarnessValidateReport(projectRoot, taskId, { level: 'done' });
  const evidenceLint = createEvidenceLintReport(projectRoot, taskId);
  const protocolDoctor = createTaskProtocolConsistencyReport(projectRoot, taskId);
  const validationReportHash = hashValidationInputs(validation, evidenceLint, protocolDoctor);
  const sourceHash = hashCloseRelevantSource(projectRoot, task.dir);
  const slotRegistry = readSlotRegistryMetadata(projectRoot);
  const slotRegistryVersion = slotRegistry.slotRegistryVersion == null ? 'unknown' : String(slotRegistry.slotRegistryVersion);
  const closeEvidenceSummary = `Task close validation for ${taskId} returned ${validation.ok ? 'ok:true' : 'ok:false'} before close evidence append; reportHash ${validationReportHash}; sourceHash ${sourceHash}; slotRegistryVersion ${slotRegistryVersion}; slotRegistryHash ${slotRegistry.slotRegistryHash}.`;

  collectBlockingIssues(validation, evidenceLint, protocolDoctor, issues);
  const ok = !issues.some((issue) => issue.severity === 'error');
  const closeEvidenceWrite = createCloseEvidenceWritePlan(path.join(task.dir, 'evidence.jsonl'), taskId, sourceHash, validationReportHash, ok);
  const nextActions = createNextActions(taskId, ok, mode, closeEvidenceWrite);
  return {
    schemaVersion: 'hadara.task.close.v1',
    command: 'task.close',
    ok,
    mode,
    taskId,
    projectRoot,
    actor,
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
      ...(slotRegistry.slotRegistryVersion == null ? {} : { slotRegistryVersion: slotRegistry.slotRegistryVersion }),
      slotRegistryHash: slotRegistry.slotRegistryHash,
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
      planned: ok && closeEvidenceWrite.duplicateAction !== 'no-op',
      appended: false,
      kind: 'command-log',
      result: ok ? 'passed' : 'blocked',
      summary: closeEvidenceSummary,
      excludedFromCurrentValidationLoop: true,
      validationReportHash,
      sourceHash,
      ...(slotRegistry.slotRegistryVersion == null ? {} : { slotRegistryVersion: slotRegistry.slotRegistryVersion }),
      slotRegistryHash: slotRegistry.slotRegistryHash
    },
    closeEvidenceWrite,
    lifecycle: createCloseLifecycleGuidance(taskId, mode),
    nextActions,
    ...(selectPrimaryNextAction(nextActions) ? { primaryNextAction: selectPrimaryNextAction(nextActions) } : {}),
    issues
  };
}

function collectBlockingIssues(validation: HarnessValidateResult, evidenceLint: EvidenceLintReport, protocolDoctor: ProtocolConsistencyReport, issues: TaskCloseIssue[]): void {
  for (const issue of validation.issues) {
    issues.push({
      severity: issue.severity,
      code: `HARNESS_${issue.code}`,
      message: issue.message,
      path: issue.path,
      heading: issue.heading,
      fixHint: issue.fixHint,
      example: issue.example,
      remediationHint: issue.remediationHint
    });
  }
  for (const issue of evidenceLint.issues) {
    issues.push({ severity: issue.severity, code: `EVIDENCE_LINT_${issue.code}`, message: issue.message, path: issue.path });
  }
  for (const issue of protocolDoctor.issues) {
    if (issue.severity !== 'error') continue;
    issues.push({ severity: 'error', code: `PROTOCOL_${issue.code}`, message: issue.message, path: issue.path });
  }
}

function createNextActions(taskId: string, ok: boolean, mode: TaskCloseMode, closeEvidenceWrite?: TaskCloseEvidenceWrite): TaskCloseNextAction[] {
  if (mode === 'execute') {
    if (ok) {
      if (closeEvidenceWrite?.duplicateAction === 'no-op') {
        return [
          {
            id: 'close-evidence-duplicate-noop',
            kind: 'review',
            required: false,
            message: 'Matching close evidence already exists; no duplicate close evidence was appended.',
            summary: 'Matching close evidence already exists; no duplicate close evidence was appended.',
            writeBoundary: 'read-only',
            recommendedActorRole: 'reviewer',
            requiresBeforeHash: false,
            stalePlanRisk: 'none',
            loopBoundary: true
          },
          {
            id: 'audit-close',
            required: false,
            command: `hadara task audit-close --task ${taskId} --json`,
            message: 'Optionally audit the existing close record in a later read-only pass.',
            summary: 'Optionally audit the existing close record in a later read-only pass.',
            writeBoundary: 'read-only',
            recommendedActorRole: 'reviewer',
            requiresBeforeHash: false,
            stalePlanRisk: 'none',
            kind: 'command'
          }
        ];
      }
      return [
        {
          id: 'close-evidence-appended',
          kind: 'review',
          required: false,
          message: 'Close audit evidence was appended through the canonical evidence writer.',
          summary: 'Close audit evidence was appended through the canonical evidence writer.',
          writeBoundary: 'read-only',
          recommendedActorRole: 'reviewer',
          requiresBeforeHash: false,
          stalePlanRisk: 'none',
          loopBoundary: true
        },
        {
          id: 'audit-close',
          required: false,
          command: `hadara task audit-close --task ${taskId} --json`,
          message: 'Optionally audit the close record in a later read-only pass.',
          summary: 'Optionally audit the close record in a later read-only pass.',
          writeBoundary: 'read-only',
          recommendedActorRole: 'reviewer',
          requiresBeforeHash: false,
          stalePlanRisk: 'none',
          kind: 'command'
        }
      ];
    }
    return [
      {
        id: 'resolve-close-blockers',
        kind: 'review',
        required: true,
        message: 'Resolve blocking issues before appending close evidence.',
        summary: 'Resolve blocking issues before appending close evidence.',
        writeBoundary: 'read-only',
        recommendedActorRole: 'worker',
        requiresBeforeHash: false,
        stalePlanRisk: 'none'
      }
    ];
  }

  if (ok) {
    if (closeEvidenceWrite?.duplicateAction === 'no-op') {
      return [
        createTaskLifecycleNextAction({
          id: 'audit-close',
          required: false,
          command: `hadara task audit-close --task ${taskId} --json`,
          message: 'Matching close evidence already exists; audit the existing close record.',
          writeBoundary: 'read-only',
          recommendedActorRole: 'reviewer',
          requiresBeforeHash: false,
          stalePlanRisk: 'none'
        })
      ];
    }
    return [
      createTaskLifecycleNextAction({
        id: 'append-close-evidence',
        required: true,
        command: `hadara task close --task ${taskId} --execute --json`,
        message: 'Append close audit evidence after reviewing this dry-run plan.',
        writeBoundary: 'evidence-append',
        recommendedActorRole: 'worker',
        requiresBeforeHash: false,
        stalePlanRisk: 'low',
        loopBoundary: true
      })
    ];
  }

  return [
    createTaskLifecycleNextAction({
      id: 'run-done-validation',
      required: true,
      command: `hadara harness validate --task ${taskId} --level done --json`,
      message: 'Verify done-level readiness before closing.',
      writeBoundary: 'read-only',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'none'
    }),
    createTaskLifecycleNextAction({
      id: 'run-evidence-lint',
      required: true,
      command: `hadara evidence lint --task ${taskId} --json`,
      message: 'Verify evidence index syntax, enums, task ids, and rough Markdown/JSONL alignment.',
      writeBoundary: 'read-only',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'none'
    }),
    createTaskLifecycleNextAction({
      id: 'resolve-close-blockers',
      required: true,
      message: 'Resolve blocking issues before appending close evidence.',
      writeBoundary: 'read-only',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'none',
      kind: 'review'
    })
  ];
}

function buildMissingTaskReport(projectRoot: string, taskId: string, mode: TaskCloseMode, issues: TaskCloseIssue[], actor: HadaraActorContext = defaultTaskLifecycleActor()): TaskCloseReport {
  return {
    schemaVersion: 'hadara.task.close.v1',
    command: 'task.close',
    ok: false,
    mode,
    taskId,
    projectRoot,
    actor,
    summary: { blockers: issues.length, warnings: 0, nextActions: 0 },
    validation: {
      ok: false,
      level: 'done',
      issueCount: 0,
      validatedBeforeCloseEvidenceReportHash: 'sha256:missing-task',
      validatedBeforeCloseEvidenceSourceHash: 'sha256:missing-task',
      slotRegistryHash: 'sha256:missing-task',
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

export function closeRelevantSourceRelativePaths(projectRoot: string, taskDir: string): string[] {
  return [
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
}

function hashCloseRelevantSource(projectRoot: string, taskDir: string): string {
  const relativePaths = closeRelevantSourceRelativePaths(projectRoot, taskDir);
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

interface SlotRegistryMetadata {
  slotRegistryVersion?: number;
  slotRegistryHash: string;
}

function readSlotRegistryMetadata(projectRoot: string): SlotRegistryMetadata {
  const registryPath = path.join(projectRoot, '.hadara', 'slot-registry.json');
  if (!fs.existsSync(registryPath)) {
    return { slotRegistryHash: hashText(JSON.stringify({ path: '.hadara/slot-registry.json', missing: true })) };
  }
  const content = fs.readFileSync(registryPath, 'utf8');
  let slotRegistryVersion: number | undefined;
  try {
    const parsed = JSON.parse(content) as { registryVersion?: unknown };
    if (typeof parsed.registryVersion === 'number') slotRegistryVersion = parsed.registryVersion;
  } catch {
    // Hash still records the exact registry bytes even when the registry is malformed.
  }
  return {
    ...(slotRegistryVersion == null ? {} : { slotRegistryVersion }),
    slotRegistryHash: hashText(content)
  };
}

function hashText(content: string): string {
  return `sha256:${crypto.createHash('sha256').update(content, 'utf8').digest('hex')}`;
}

export function executeTaskCloseEvidence(projectRoot: string, report: TaskCloseReport): void {
  if (report.closeEvidenceWrite?.duplicateAction === 'no-op') {
    report.closeEvidence.appended = false;
    return;
  }
  const task = listTaskCapsules(projectRoot).find((candidate) => candidate.id === report.taskId);
  const recheckedWrite = task
    ? createCloseEvidenceWritePlan(
        path.join(task.dir, 'evidence.jsonl'),
        report.taskId,
        report.validation.validatedBeforeCloseEvidenceSourceHash,
        report.validation.validatedBeforeCloseEvidenceReportHash,
        report.ok
      )
    : undefined;
  if (recheckedWrite) {
    if (recheckedWrite.duplicateAction === 'no-op') {
      report.closeEvidenceWrite = {
        ...recheckedWrite,
        executeRecheck: {
          performed: true,
          duplicateFound: true,
          action: 'no-op'
        }
      };
      report.closeEvidence.planned = false;
      report.closeEvidence.appended = false;
      report.nextActions = createNextActions(report.taskId, report.ok, report.mode, report.closeEvidenceWrite);
      const primaryNextAction = selectPrimaryNextAction(report.nextActions);
      if (primaryNextAction) report.primaryNextAction = primaryNextAction;
      return;
    }
    report.closeEvidenceWrite = {
      ...recheckedWrite,
      executeRecheck: {
        performed: true,
        duplicateFound: false,
        action: 'append'
      }
    };
  }
  const result = appendEvidenceWithResult(projectRoot, {
    taskId: report.taskId,
    kind: 'command-log',
    summary: report.closeEvidence.summary,
    result: report.closeEvidence.result,
    visibility: 'public',
    tags: createCloseEvidenceTags(report),
    idempotencyKey: report.closeEvidenceWrite?.idempotencyKey,
    actor: report.actor
  });
  report.closeEvidence.appended = true;
  report.closeEvidence.markdownPath = toPortablePath(path.relative(projectRoot, result.markdownPath));
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
  actor: HadaraActorContext;
  summary: {
    closeEvidenceRecords: number;
    blockers: number;
    warnings: number;
  };
  currentValidationReportHash: string;
  currentSourceHash: string;
  currentSlotRegistryHash: string;
  currentSlotRegistryVersion?: number;
  latestCloseEvidence?: {
    time: string;
    id?: string;
    summary: string;
    result: string;
    validationReportHash?: string;
    sourceHash?: string;
    slotRegistryHash?: string;
    slotRegistryVersion?: number;
  };
  auditVerdict: TaskAuditCloseVerdict;
  closeEvidenceAudit?: TaskCloseEvidenceAudit;
  nextActions: TaskCloseNextAction[];
  primaryNextAction?: TaskCloseNextAction;
  issues: TaskCloseIssue[];
}

export interface TaskCloseEvidenceAudit {
  latestCloseEvidenceId?: string;
  supersededCloseEvidenceIds: string[];
  duplicateCloseEvidenceCount: number;
  verdict: 'valid' | 'not-closed' | 'duplicate-warning' | 'stale' | 'unknown';
}

export interface TaskAuditCloseVerdict {
  phase: 'post-close-audit';
  verdict: 'closed-valid' | 'not-closed' | 'close-evidence-invalid' | 'closed-with-drift-warnings';
  closeEvidenceFound: boolean;
  closeEvidenceValid: boolean;
  reportHashMatches?: boolean;
  sourceHashMatches?: boolean;
  slotRegistryHashMatches?: boolean;
  recordedValidationReportHash?: string;
  recordedSourceHash?: string;
  recordedSlotRegistryHash?: string;
  recordedSlotRegistryVersion?: number;
  currentValidationReportHash: string;
  currentSourceHash: string;
  currentSlotRegistryHash: string;
  currentSlotRegistryVersion?: number;
  blockers: number;
  warnings: number;
  writeBoundary: 'read-only';
  model: 'validation-close-audit';
}

export interface TaskAuditCloseOptions {
  actor?: HadaraActorContext;
}

export function createTaskAuditCloseReport(projectRoot: string, taskId: string, options: TaskAuditCloseOptions = {}): TaskAuditCloseReport {
  const actor = options.actor ?? defaultTaskLifecycleActor();
  const issues: TaskCloseIssue[] = [];
  const task = listTaskCapsules(projectRoot).find((candidate) => candidate.id === taskId);
  if (!task) {
    issues.push({ severity: 'error', code: 'TASK_NOT_FOUND', message: `Task Capsule not found: ${taskId}` });
    return buildAuditReport(projectRoot, taskId, 'sha256:missing-task', 'sha256:missing-task', 'sha256:missing-task', undefined, [], issues, undefined, actor);
  }

  const closePlan = createTaskCloseReport(projectRoot, taskId, 'dry-run', { actor });
  const evidencePath = path.join(task.dir, 'evidence.jsonl');
  const records = readCloseEvidenceRecords(evidencePath);
  const closeEvidenceAudit = createCloseEvidenceAudit(records, taskId);
  if (records.length === 0) {
    issues.push({
      severity: 'error',
      code: 'TASK_CLOSE_EVIDENCE_MISSING',
      message: 'No command-log close evidence record was found for this task.',
      path: toPortablePath(path.relative(projectRoot, evidencePath))
    });
  }
  const latest = closeEvidenceAudit.latestRecord;
  const latestHash = latest ? extractReportHash(latest.summary) : undefined;
  const latestSourceHash = latest ? extractSourceHash(latest.summary) : undefined;
  const latestSlotRegistryHash = latest ? extractSlotRegistryHash(latest.summary) : undefined;
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
  if (latest && !latestSlotRegistryHash) {
    issues.push({
      severity: 'warning',
      code: 'SLOT_REGISTRY_HASH_MISSING_IN_CLOSE_PROOF',
      message: 'Latest close evidence does not include a slot registry hash.',
      path: toPortablePath(path.relative(projectRoot, evidencePath))
    });
  } else if (latestSlotRegistryHash && latestSlotRegistryHash !== closePlan.validation.slotRegistryHash) {
    issues.push({
      severity: 'warning',
      code: 'TASK_CLOSE_AUDIT_SLOT_REGISTRY_HASH_DRIFT',
      message: 'Current slot registry hash differs from the latest close evidence slot registry hash.',
      path: toPortablePath(path.relative(projectRoot, evidencePath))
    });
  }

  return buildAuditReport(
    projectRoot,
    taskId,
    closePlan.validation.validatedBeforeCloseEvidenceReportHash,
    closePlan.validation.validatedBeforeCloseEvidenceSourceHash,
    closePlan.validation.slotRegistryHash,
    closePlan.validation.slotRegistryVersion,
    records,
    issues,
    closeEvidenceAudit,
    actor
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
    if (report.latestCloseEvidence.slotRegistryHash) lines.push(`- Slot registry hash: ${report.latestCloseEvidence.slotRegistryHash}`);
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
  currentSlotRegistryHash: string,
  currentSlotRegistryVersion: number | undefined,
  records: CloseEvidenceRecord[],
  issues: TaskCloseIssue[],
  closeEvidenceAudit?: InternalCloseEvidenceAudit,
  actor: HadaraActorContext = defaultTaskLifecycleActor()
): TaskAuditCloseReport {
  const latest = closeEvidenceAudit?.latestRecord ?? records.at(-1);
  const nextActions = createAuditNextActions(taskId, latest === undefined);
  const auditVerdict = createAuditVerdict(currentHash, currentSourceHash, currentSlotRegistryHash, currentSlotRegistryVersion, latest, issues);
  return {
    schemaVersion: 'hadara.task.audit_close.v1',
    command: 'task.audit-close',
    ok: !issues.some((issue) => issue.severity === 'error'),
    taskId,
    projectRoot,
    actor,
    summary: {
      closeEvidenceRecords: records.length,
      blockers: issues.filter((issue) => issue.severity === 'error').length,
      warnings: issues.filter((issue) => issue.severity === 'warning').length
    },
    currentValidationReportHash: currentHash,
    currentSourceHash,
    currentSlotRegistryHash,
    ...(currentSlotRegistryVersion == null ? {} : { currentSlotRegistryVersion }),
    ...(latest
      ? {
          latestCloseEvidence: {
            time: latest.time,
            ...(latest.id ? { id: latest.id } : {}),
            summary: latest.summary,
            result: latest.result,
            ...(extractReportHash(latest.summary) ? { validationReportHash: extractReportHash(latest.summary) } : {}),
            ...(extractSourceHash(latest.summary) ? { sourceHash: extractSourceHash(latest.summary) } : {}),
            ...(extractSlotRegistryHash(latest.summary) ? { slotRegistryHash: extractSlotRegistryHash(latest.summary) } : {}),
            ...(extractSlotRegistryVersion(latest.summary) == null ? {} : { slotRegistryVersion: extractSlotRegistryVersion(latest.summary) })
          }
        }
      : {}),
    auditVerdict,
    ...(closeEvidenceAudit
      ? {
          closeEvidenceAudit: {
            ...(closeEvidenceAudit.latestRecord?.id ? { latestCloseEvidenceId: closeEvidenceAudit.latestRecord.id } : {}),
            supersededCloseEvidenceIds: closeEvidenceAudit.supersededCloseEvidenceIds,
            duplicateCloseEvidenceCount: closeEvidenceAudit.duplicateCloseEvidenceCount,
            verdict: createCloseEvidenceAuditVerdict(auditVerdict, closeEvidenceAudit.duplicateCloseEvidenceCount)
          }
        }
      : {}),
    nextActions,
    ...(selectPrimaryNextAction(nextActions) ? { primaryNextAction: selectPrimaryNextAction(nextActions) } : {}),
    issues
  };
}

function createAuditNextActions(taskId: string, closeMissing: boolean): TaskCloseNextAction[] {
  if (!closeMissing) return [];
  return [
    createTaskLifecycleNextAction({
      id: 'close-first',
      required: true,
      command: `hadara task close --task ${taskId} --json`,
      message: 'Preview close evidence before audit-close.',
      writeBoundary: 'read-only',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'none'
    })
  ];
}

function createAuditVerdict(
  currentHash: string,
  currentSourceHash: string,
  currentSlotRegistryHash: string,
  currentSlotRegistryVersion: number | undefined,
  latest: CloseEvidenceRecord | undefined,
  issues: TaskCloseIssue[]
): TaskAuditCloseVerdict {
  const blockers = issues.filter((issue) => issue.severity === 'error').length;
  const warnings = issues.filter((issue) => issue.severity === 'warning').length;
  const recordedValidationReportHash = latest ? extractReportHash(latest.summary) : undefined;
  const recordedSourceHash = latest ? extractSourceHash(latest.summary) : undefined;
  const recordedSlotRegistryHash = latest ? extractSlotRegistryHash(latest.summary) : undefined;
  const recordedSlotRegistryVersion = latest ? extractSlotRegistryVersion(latest.summary) : undefined;
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
    ...(recordedSlotRegistryHash ? { recordedSlotRegistryHash, slotRegistryHashMatches: recordedSlotRegistryHash === currentSlotRegistryHash } : {}),
    ...(recordedSlotRegistryVersion == null ? {} : { recordedSlotRegistryVersion }),
    currentValidationReportHash: currentHash,
    currentSourceHash,
    currentSlotRegistryHash,
    ...(currentSlotRegistryVersion == null ? {} : { currentSlotRegistryVersion }),
    blockers,
    warnings,
    writeBoundary: 'read-only',
    model: 'validation-close-audit'
  };
}

function readCloseEvidenceRecords(evidencePath: string): CloseEvidenceRecord[] {
  if (!fs.existsSync(evidencePath)) return [];
  return fs
    .readFileSync(evidencePath, 'utf8')
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .flatMap((line) => {
      try {
        const record = JSON.parse(line) as {
          schemaVersion?: unknown;
          id?: unknown;
          time?: unknown;
          kind?: unknown;
          summary?: unknown;
          result?: unknown;
          tags?: unknown;
          idempotencyKey?: unknown;
          legacy?: { kind?: unknown; result?: unknown };
        };
        const kind = record.schemaVersion === 'hadara.evidence.v2' ? record.legacy?.kind : record.kind;
        const result = record.schemaVersion === 'hadara.evidence.v2' ? record.legacy?.result : record.result;
        const tags = Array.isArray(record.tags) ? record.tags.map(String) : [];
        if (
          typeof record.time === 'string' &&
          typeof kind === 'string' &&
          typeof record.summary === 'string' &&
          typeof result === 'string' &&
          /Task close validation .* before close evidence append/.test(record.summary)
        ) {
          return [
            {
              ...(typeof record.id === 'string' ? { id: record.id } : {}),
              time: record.time,
              kind,
              summary: record.summary,
              result,
              tags,
              ...(typeof record.idempotencyKey === 'string' ? { idempotencyKey: record.idempotencyKey } : {})
            }
          ];
        }
      } catch {
        return [];
      }
      return [];
    });
}

interface CloseEvidenceRecord {
  id?: string;
  time: string;
  kind: string;
  summary: string;
  result: string;
  tags: string[];
  idempotencyKey?: string;
}

interface InternalCloseEvidenceAudit {
  latestRecord?: CloseEvidenceRecord;
  supersededCloseEvidenceIds: string[];
  duplicateCloseEvidenceCount: number;
}

function createCloseEvidenceWritePlan(evidencePath: string, taskId: string, sourceHash: string, reportHash: string, ok: boolean): TaskCloseEvidenceWrite {
  const idempotencyKey = createCloseEvidenceIdempotencyKey(taskId, sourceHash, reportHash);
  if (!ok) return { idempotencyKey, duplicateFound: false, duplicateAction: 'warning' };

  const records = readCloseEvidenceRecords(evidencePath);
  const duplicateFound = records.some((record) => closeEvidenceRecordKey(record, taskId) === idempotencyKey);
  if (duplicateFound) return { idempotencyKey, duplicateFound: true, duplicateAction: 'no-op' };

  const audit = createCloseEvidenceAudit(records, taskId);
  const supersedes = audit.latestRecord?.id ? [audit.latestRecord.id] : [];
  return {
    idempotencyKey,
    duplicateFound: false,
    duplicateAction: 'append',
    ...(supersedes.length > 0 ? { supersedes } : {})
  };
}

function createCloseEvidenceIdempotencyKey(taskId: string, sourceHash: string, reportHash: string): string {
  return `close:${taskId}:${sourceHash}:${reportHash}`;
}

function createCloseEvidenceTags(report: TaskCloseReport): string[] {
  const tags = ['close-proof'];
  if (report.closeEvidenceWrite?.idempotencyKey) tags.push(`idempotency:${report.closeEvidenceWrite.idempotencyKey}`);
  for (const supersededId of report.closeEvidenceWrite?.supersedes ?? []) tags.push(`supersedes:${supersededId}`);
  return tags;
}

function closeEvidenceRecordKey(record: CloseEvidenceRecord, taskId: string): string | undefined {
  if (record.idempotencyKey) return record.idempotencyKey;
  const idempotencyTag = record.tags.find((tag) => tag.startsWith('idempotency:close:'));
  if (idempotencyTag) return idempotencyTag.replace(/^idempotency:/, '');
  const sourceHash = extractSourceHash(record.summary);
  const reportHash = extractReportHash(record.summary);
  if (sourceHash && reportHash) return createCloseEvidenceIdempotencyKey(taskId, sourceHash, reportHash);
  return undefined;
}

function createCloseEvidenceAudit(records: CloseEvidenceRecord[], taskId: string): InternalCloseEvidenceAudit {
  const superseded = new Set<string>();
  for (const record of records) {
    for (const tag of record.tags) {
      if (tag.startsWith('supersedes:')) superseded.add(tag.slice('supersedes:'.length));
    }
  }
  const latestRecord = [...records].reverse().find((record) => !record.id || !superseded.has(record.id)) ?? records.at(-1);
  const keyCounts = new Map<string, number>();
  for (const record of records) {
    const key = closeEvidenceRecordKey(record, taskId);
    if (!key) continue;
    keyCounts.set(key, (keyCounts.get(key) ?? 0) + 1);
  }
  const duplicateCloseEvidenceCount = Array.from(keyCounts.values()).reduce((total, count) => total + Math.max(0, count - 1), 0);
  return {
    latestRecord,
    supersededCloseEvidenceIds: Array.from(superseded),
    duplicateCloseEvidenceCount
  };
}

function createCloseEvidenceAuditVerdict(auditVerdict: TaskAuditCloseVerdict, duplicateCloseEvidenceCount: number): TaskCloseEvidenceAudit['verdict'] {
  if (!auditVerdict.closeEvidenceFound) return 'not-closed';
  if (duplicateCloseEvidenceCount > 0) return 'duplicate-warning';
  if (auditVerdict.verdict === 'closed-valid') return 'valid';
  if (auditVerdict.verdict === 'closed-with-drift-warnings' || auditVerdict.verdict === 'close-evidence-invalid') return 'stale';
  return 'unknown';
}

function extractReportHash(summary: string): string | undefined {
  return summary.match(/reportHash\s+(sha256:[a-f0-9]{64})/)?.[1];
}

function extractSourceHash(summary: string): string | undefined {
  return summary.match(/sourceHash\s+(sha256:[a-f0-9]{64})/)?.[1];
}

function extractSlotRegistryHash(summary: string): string | undefined {
  return summary.match(/slotRegistryHash\s+(sha256:[a-f0-9]{64})/)?.[1];
}

function extractSlotRegistryVersion(summary: string): number | undefined {
  const value = summary.match(/slotRegistryVersion\s+([0-9]+)/)?.[1];
  return value ? Number(value) : undefined;
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
