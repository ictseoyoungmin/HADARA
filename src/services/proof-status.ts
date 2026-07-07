import path from 'node:path';
import { normalizeEvidenceRecordsInMemoryOrder, NormalizedEvidenceRecord } from '../evidence/normalizer';
import { classifyEvidenceStrength } from '../evidence/semantics';
import { findTaskCapsule } from '../task/task-capsule';
import { closeRelevantSourceRelativePaths, createTaskAuditCloseReport } from '../task/task-close';
import { createEvidenceLintReport, EvidenceLintIssue } from './evidence-lint';

export type ProofVerdict = 'sufficient' | 'insufficient' | 'blocked' | 'warning' | 'unknown';
export type ProofFreshnessStatus = 'fresh' | 'stale' | 'missing' | 'unknown';

export interface ProofEvidenceSummary {
  passed: number;
  failed: number;
  blocked: number;
  privateOnlySubstantive: number;
  substantivePositive: number;
}

export interface ProofEvidenceRef {
  id: string;
  time: string;
  category: string;
  outcome: string;
  visibility: string;
  summary: string;
}

export interface ProofIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  evidenceId?: string;
  path?: string;
}

export interface ProofNextAction {
  id: string;
  command?: string;
  message: string;
}

export interface ProofStatusReport {
  schemaVersion: 'hadara.proof.status.v1' | 'hadara.proof.explain.v1';
  command: 'proof.status' | 'proof.explain';
  ok: boolean;
  taskId: string;
  target: {
    kind: 'task';
    taskId: string;
  };
  claim: 'task-readiness';
  verdict: ProofVerdict;
  freshness: {
    status: ProofFreshnessStatus;
    checkedSources: string[];
    closeVerdict?: string;
    reportHashMatches?: boolean;
    sourceHashMatches?: boolean;
  };
  summary: ProofEvidenceSummary;
  supportingEvidence: ProofEvidenceRef[];
  blockers: ProofIssue[];
  warnings: ProofIssue[];
  nextActions: ProofNextAction[];
  explanation?: {
    rules: string[];
    semanticIssueCodes: string[];
    freshnessIssueCodes: string[];
  };
}

export function createProofStatusReport(projectRoot: string, taskId: string, mode: 'status' | 'explain' = 'status'): ProofStatusReport {
  const task = findTaskCapsule(projectRoot, taskId);
  if (!task) {
    return {
      schemaVersion: mode === 'explain' ? 'hadara.proof.explain.v1' : 'hadara.proof.status.v1',
      command: mode === 'explain' ? 'proof.explain' : 'proof.status',
      ok: false,
      taskId,
      target: { kind: 'task', taskId },
      claim: 'task-readiness',
      verdict: 'unknown',
      freshness: { status: 'unknown', checkedSources: [] },
      summary: { passed: 0, failed: 0, blocked: 0, privateOnlySubstantive: 0, substantivePositive: 0 },
      supportingEvidence: [],
      blockers: [{ severity: 'error', code: 'TASK_NOT_FOUND', message: `Task Capsule not found: ${taskId}` }],
      warnings: [],
      nextActions: [{ id: 'create-task', message: `Create or select an existing Task Capsule for ${taskId}.` }],
      ...(mode === 'explain' ? { explanation: createExplanation([], []) } : {})
    };
  }

  const lint = createEvidenceLintReport(projectRoot, taskId);
  const audit = createTaskAuditCloseReport(projectRoot, taskId);
  const normalized = normalizeEvidenceRecordsInMemoryOrder(lint.records, { taskDir: task.dir });
  const semanticIssues = lint.issues.filter((issue) => issue.code.startsWith('TASK_DONE_'));
  const freshnessIssues = audit.issues.map((issue) => ({
    severity: 'warning' as const,
    code: issue.code,
    message: issue.message,
    path: issue.path
  }));
  const blockers = semanticIssues.filter((issue) => issue.severity === 'error').map(toProofIssue);
  const warnings = [...semanticIssues.filter((issue) => issue.severity === 'warning').map(toProofIssue), ...freshnessIssues];
  const summary = summarizeProofEvidence(normalized);
  const freshness = createFreshness(projectRoot, task.dir, audit);
  const verdict = selectVerdict({ blockers, warnings, summary, freshnessStatus: freshness.status });

  return {
    schemaVersion: mode === 'explain' ? 'hadara.proof.explain.v1' : 'hadara.proof.status.v1',
    command: mode === 'explain' ? 'proof.explain' : 'proof.status',
    ok: blockers.length === 0,
    taskId,
    target: { kind: 'task', taskId },
    claim: 'task-readiness',
    verdict,
    freshness,
    summary,
    supportingEvidence: normalized.filter((record) => classifyEvidenceStrength(record) === 'substantive-positive').slice(-5).map(toEvidenceRef),
    blockers,
    warnings,
    nextActions: createNextActions(taskId, verdict, blockers, freshness.status),
    ...(mode === 'explain' ? { explanation: createExplanation(semanticIssues, freshnessIssues) } : {})
  };
}

function summarizeProofEvidence(records: NormalizedEvidenceRecord[]): ProofEvidenceSummary {
  const substantive = records.filter((record) => classifyEvidenceStrength(record) === 'substantive-positive');
  return {
    passed: records.filter((record) => record.outcome === 'passed').length,
    failed: records.filter((record) => record.outcome === 'failed').length,
    blocked: records.filter((record) => record.outcome === 'blocked').length,
    privateOnlySubstantive: substantive.length > 0 && substantive.every((record) => record.visibility === 'private') ? substantive.length : 0,
    substantivePositive: substantive.length
  };
}

function createFreshness(projectRoot: string, taskDir: string, audit: ReturnType<typeof createTaskAuditCloseReport>): ProofStatusReport['freshness'] {
  // Freshness is derived from the task close audit, whose source hash covers the full
  // close-relevant document set; expose that same set plus the evidence files the proof reads.
  const checkedSources = Array.from(
    new Set([
      ...closeRelevantSourceRelativePaths(projectRoot, taskDir),
      toPortablePath(path.relative(projectRoot, path.join(taskDir, 'evidence.jsonl'))),
      toPortablePath(path.relative(projectRoot, path.join(taskDir, 'EVIDENCE.md')))
    ])
  ).sort();
  const verdict = audit.auditVerdict.verdict;
  const status: ProofFreshnessStatus = !audit.auditVerdict.closeEvidenceFound
    ? 'missing'
    : audit.auditVerdict.verdict === 'closed-valid'
      ? 'fresh'
      : 'stale';
  return {
    status,
    checkedSources,
    closeVerdict: verdict,
    ...(audit.auditVerdict.reportHashMatches !== undefined ? { reportHashMatches: audit.auditVerdict.reportHashMatches } : {}),
    ...(audit.auditVerdict.sourceHashMatches !== undefined ? { sourceHashMatches: audit.auditVerdict.sourceHashMatches } : {})
  };
}

function selectVerdict(input: {
  blockers: ProofIssue[];
  warnings: ProofIssue[];
  summary: ProofEvidenceSummary;
  freshnessStatus: ProofFreshnessStatus;
}): ProofVerdict {
  const codes = new Set(input.blockers.map((issue) => issue.code));
  if (codes.has('TASK_DONE_WITH_FAILED_EVIDENCE') || codes.has('TASK_DONE_WITH_UNEXPLAINED_BLOCKED_EVIDENCE')) return 'blocked';
  if (input.summary.substantivePositive === 0 || codes.has('TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE') || codes.has('TASK_DONE_WITH_ONLY_WEAK_EVIDENCE')) {
    return 'insufficient';
  }
  if (input.blockers.length > 0) return 'blocked';
  if (input.warnings.length > 0 || input.summary.privateOnlySubstantive > 0 || input.freshnessStatus !== 'fresh') return 'warning';
  return 'sufficient';
}

function createNextActions(taskId: string, verdict: ProofVerdict, blockers: ProofIssue[], freshnessStatus: ProofFreshnessStatus): ProofNextAction[] {
  const actions: ProofNextAction[] = [];
  if (blockers.length > 0) actions.push({ id: 'inspect-evidence-lint', command: `hadara evidence lint --task ${taskId} --json`, message: 'Inspect semantic evidence blockers.' });
  if (freshnessStatus !== 'fresh') actions.push({ id: 'refresh-close-proof', command: `hadara task finalize --task ${taskId} --json`, message: 'Review close proof freshness and rerun guarded finalize when appropriate.' });
  if (verdict === 'insufficient') actions.push({ id: 'add-substantive-evidence', command: `hadara evidence add-command --task ${taskId} --summary "..." --result passed --json`, message: 'Record substantive public evidence for the readiness claim.' });
  return actions;
}

function createExplanation(semanticIssues: EvidenceLintIssue[], freshnessIssues: ProofIssue[]): ProofStatusReport['explanation'] {
  return {
    rules: [
      'Substantive passed evidence is required for a sufficient task-readiness claim.',
      'Unresolved failed or unexplained blocked evidence makes the proof blocked.',
      'Private-only substantive evidence and stale or missing close proof produce warnings.',
      'Freshness is derived from task close audit source/report hash comparison.'
    ],
    semanticIssueCodes: semanticIssues.map((issue) => issue.code),
    freshnessIssueCodes: freshnessIssues.map((issue) => issue.code)
  };
}

function toProofIssue(issue: EvidenceLintIssue): ProofIssue {
  return {
    severity: issue.severity,
    code: issue.code,
    message: issue.message,
    ...(issue.evidenceId ? { evidenceId: issue.evidenceId } : {}),
    ...(issue.path ? { path: issue.path } : {})
  };
}

function toEvidenceRef(record: NormalizedEvidenceRecord): ProofEvidenceRef {
  return {
    id: record.id,
    time: record.time,
    category: record.category,
    outcome: record.outcome,
    visibility: record.visibility,
    summary: record.summary
  };
}

function toPortablePath(value: string): string {
  return value.split(path.sep).join('/');
}
