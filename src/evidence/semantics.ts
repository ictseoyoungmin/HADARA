import {
  EvidenceArtifactRef,
  EvidenceCategory,
  EvidenceOutcome,
  EvidenceVisibility,
  NormalizedEvidenceRecord
} from './normalizer';

export type EvidenceStrength =
  | 'substantive-positive'
  | 'substantive-negative'
  | 'blocked'
  | 'record-only'
  | 'weak'
  | 'not-applicable';

export type EvidenceSemanticIssueCode =
  | 'TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE'
  | 'TASK_DONE_WITH_FAILED_EVIDENCE'
  | 'TASK_DONE_WITH_UNEXPLAINED_BLOCKED_EVIDENCE'
  | 'TASK_DONE_WITH_ONLY_WEAK_EVIDENCE'
  | 'TASK_DONE_WITH_PRIVATE_ONLY_EVIDENCE'
  | 'PUBLIC_EVIDENCE_ARTIFACT_MISSING'
  | 'RELEASE_EVIDENCE_SEMANTICS_INVALID'
  | 'LEGACY_RELEASE_EVIDENCE_ACCEPTED'
  | 'LEGACY_EVIDENCE_SCHEMA_PRESENT';

export interface EvidenceSemanticSummary {
  total: number;
  byStrength: Record<EvidenceStrength, number>;
  byCategory: Partial<Record<EvidenceCategory, number>>;
  byOutcome: Partial<Record<EvidenceOutcome, number>>;
  publicRecords: number;
  privateRecords: number;
  legacyRecords: number;
  latestSubstantiveEvidenceId?: string;
}

export interface EvidenceSemanticIssue {
  severity: 'error' | 'warning' | 'info';
  code: EvidenceSemanticIssueCode;
  message: string;
  evidenceId?: string;
  path?: string;
  expected?: string;
  actual?: string;
}

export interface AnalyzeTaskEvidenceSemanticsInput {
  taskId: string;
  taskDir: string;
  taskLooksDone: boolean;
  records: NormalizedEvidenceRecord[];
  taskDocs?: {
    acceptance?: string;
    risks?: string;
    handoff?: string;
  };
}

export const SUBSTANTIVE_EVIDENCE_CATEGORIES = [
  'validation',
  'implementation',
  'release',
  'security',
  'policy',
  'operation'
] as const satisfies readonly EvidenceCategory[];

export const RECORD_ONLY_EVIDENCE_CATEGORIES = ['decision', 'handoff', 'audit', 'note', 'observation'] as const satisfies readonly EvidenceCategory[];

const STRENGTHS: EvidenceStrength[] = [
  'substantive-positive',
  'substantive-negative',
  'blocked',
  'record-only',
  'weak',
  'not-applicable'
];

export function classifyEvidenceStrength(record: NormalizedEvidenceRecord): EvidenceStrength {
  if (record.outcome === 'failed') return 'substantive-negative';
  if (record.outcome === 'blocked') return 'blocked';
  if (record.outcome === 'not-applicable') return 'not-applicable';
  if (record.outcome === 'unknown') return 'weak';
  if (record.outcome === 'passed' && isSubstantiveCategory(record.category)) return 'substantive-positive';
  if ((record.outcome === 'recorded' || record.outcome === 'passed') && isRecordOnlyCategory(record.category)) return 'record-only';
  return 'weak';
}

export function summarizeEvidenceSemantics(records: NormalizedEvidenceRecord[]): EvidenceSemanticSummary {
  const byStrength = Object.fromEntries(STRENGTHS.map((strength) => [strength, 0])) as Record<EvidenceStrength, number>;
  const byCategory: Partial<Record<EvidenceCategory, number>> = {};
  const byOutcome: Partial<Record<EvidenceOutcome, number>> = {};
  let publicRecords = 0;
  let privateRecords = 0;
  let legacyRecords = 0;
  let latestSubstantiveEvidenceId: string | undefined;

  for (const record of records) {
    const strength = classifyEvidenceStrength(record);
    byStrength[strength] += 1;
    byCategory[record.category] = (byCategory[record.category] ?? 0) + 1;
    byOutcome[record.outcome] = (byOutcome[record.outcome] ?? 0) + 1;
    if (record.visibility === 'public') publicRecords += 1;
    if (record.visibility === 'private') privateRecords += 1;
    if (record.persistedSchemaVersion === 'hadara.evidence.v1') legacyRecords += 1;
    if (strength === 'substantive-positive') latestSubstantiveEvidenceId = record.id;
  }

  return {
    total: records.length,
    byStrength,
    byCategory,
    byOutcome,
    publicRecords,
    privateRecords,
    legacyRecords,
    ...(latestSubstantiveEvidenceId ? { latestSubstantiveEvidenceId } : {})
  };
}

export function hasSubstantivePositiveEvidence(records: NormalizedEvidenceRecord[]): boolean {
  return records.some((record) => classifyEvidenceStrength(record) === 'substantive-positive');
}

export function findUnresolvedFailedEvidence(
  records: NormalizedEvidenceRecord[],
  taskDocs: AnalyzeTaskEvidenceSemanticsInput['taskDocs'] = {}
): NormalizedEvidenceRecord[] {
  return records.filter((record, index) => {
    if (record.outcome !== 'failed') return false;
    const laterRecords = records.slice(index + 1);
    if (laterRecords.some((candidate) => hasExactResolutionMarker(candidate, record.id))) return false;
    if (usesLegacySameCategoryFallback(record, laterRecords)) return false;
    if (hasResidualRiskDocumentation(record, taskDocs)) return false;
    return true;
  });
}

export function findUnexplainedBlockedEvidence(
  records: NormalizedEvidenceRecord[],
  taskDocs: AnalyzeTaskEvidenceSemanticsInput['taskDocs'] = {}
): NormalizedEvidenceRecord[] {
  return records.filter((record) => {
    if (record.outcome !== 'blocked') return false;
    if (/\b(blocked because|blocked:|cannot|deferred|out of scope)\b/i.test(record.summary)) return false;
    if (record.issues.length > 0) return false;
    if (hasBlockedDocumentation(record, taskDocs)) return false;
    return true;
  });
}

export function analyzeTaskEvidenceSemantics(input: AnalyzeTaskEvidenceSemanticsInput): {
  summary: EvidenceSemanticSummary;
  issues: EvidenceSemanticIssue[];
} {
  const summary = summarizeEvidenceSemantics(input.records);
  const issues: EvidenceSemanticIssue[] = [];

  if (!input.taskLooksDone) return { summary, issues };

  const hasSubstantive = hasSubstantivePositiveEvidence(input.records);
  if (!hasSubstantive) {
    issues.push({
      severity: 'error',
      code: 'TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE',
      message: 'Task is marked Done but has no substantive positive evidence record.',
      path: `${input.taskDir}/evidence.jsonl`,
      expected: 'at least one substantive positive evidence record',
      actual: input.records.length === 0 ? 'no evidence records' : 'no substantive positive evidence'
    });
  }

  if (input.records.length > 0 && input.records.every((record) => classifyEvidenceStrength(record) !== 'substantive-positive')) {
    issues.push({
      severity: 'error',
      code: 'TASK_DONE_WITH_ONLY_WEAK_EVIDENCE',
      message: 'Task has evidence records, but none are strong enough to support Done status.',
      path: `${input.taskDir}/evidence.jsonl`,
      expected: 'substantive positive evidence',
      actual: 'only weak, record-only, blocked, failed, or not-applicable evidence'
    });
  }

  for (const record of findUnresolvedFailedEvidence(input.records, input.taskDocs)) {
    issues.push({
      severity: 'error',
      code: 'TASK_DONE_WITH_FAILED_EVIDENCE',
      message: 'Task has unresolved failed evidence while marked Done.',
      evidenceId: record.id,
      path: `${input.taskDir}/evidence.jsonl`,
      expected: `supersedes:${record.id}, resolves:${record.id}, legacy same-category passed evidence, or explicit residual-risk documentation`,
      actual: 'failed evidence has no resolution signal'
    });
  }

  for (const record of findUnexplainedBlockedEvidence(input.records, input.taskDocs)) {
    issues.push({
      severity: 'error',
      code: 'TASK_DONE_WITH_UNEXPLAINED_BLOCKED_EVIDENCE',
      message: 'Task has blocked evidence without explanation while marked Done.',
      evidenceId: record.id,
      path: `${input.taskDir}/evidence.jsonl`,
      expected: 'blocked reason, residual risk, or next step',
      actual: 'blocked evidence has no explanation signal'
    });
  }

  const substantiveRecords = input.records.filter((record) => classifyEvidenceStrength(record) === 'substantive-positive');
  if (substantiveRecords.length > 0 && substantiveRecords.every((record) => record.visibility === 'private')) {
    issues.push({
      severity: 'warning',
      code: 'TASK_DONE_WITH_PRIVATE_ONLY_EVIDENCE',
      message: 'Task has substantive evidence, but all substantive evidence is private.',
      path: `${input.taskDir}/evidence.jsonl`,
      expected: 'safe public summary evidence',
      actual: 'only private substantive evidence records'
    });
  }

  if (input.records.length > 0 && input.records.every((record) => record.persistedSchemaVersion === 'hadara.evidence.v1')) {
    issues.push({
      severity: 'info',
      code: 'LEGACY_EVIDENCE_SCHEMA_PRESENT',
      message: 'Task evidence uses legacy v1 records normalized through compatibility semantics.',
      path: `${input.taskDir}/evidence.jsonl`
    });
  }

  return { summary, issues };
}

export function isReleaseProofEvidence(record: NormalizedEvidenceRecord): boolean {
  return (
    record.category === 'release' &&
    record.outcome === 'passed' &&
    record.visibility === 'public' &&
    record.artifacts.some(isSupportedReleaseArtifact)
  );
}

export function isLegacyReleaseProofEvidence(record: NormalizedEvidenceRecord): boolean {
  return (
    record.persistedSchemaVersion === 'hadara.evidence.v1' &&
    (record.legacy.kind === 'command-log' || record.legacy.kind === 'test-log') &&
    isReleaseProofEvidence(record)
  );
}

function isSubstantiveCategory(category: EvidenceCategory): boolean {
  return (SUBSTANTIVE_EVIDENCE_CATEGORIES as readonly string[]).includes(category);
}

function isRecordOnlyCategory(category: EvidenceCategory): boolean {
  return (RECORD_ONLY_EVIDENCE_CATEGORIES as readonly string[]).includes(category);
}

function hasExactResolutionMarker(record: NormalizedEvidenceRecord, evidenceId: string): boolean {
  if (record.outcome !== 'passed' && record.outcome !== 'recorded') return false;
  return record.tags.includes(`supersedes:${evidenceId}`) || record.tags.includes(`resolves:${evidenceId}`);
}

function usesLegacySameCategoryFallback(record: NormalizedEvidenceRecord, laterRecords: NormalizedEvidenceRecord[]): boolean {
  if (record.persistedSchemaVersion !== 'hadara.evidence.v1') return false;
  return laterRecords.some(
    (candidate) =>
      candidate.persistedSchemaVersion === 'hadara.evidence.v1' &&
      candidate.outcome === 'passed' &&
      candidate.category === record.category
  );
}

function hasResidualRiskDocumentation(
  record: NormalizedEvidenceRecord,
  taskDocs: AnalyzeTaskEvidenceSemanticsInput['taskDocs']
): boolean {
  const content = joinTaskDocs(taskDocs);
  if (!content) return false;
  if (!mentionsRecord(content, record)) return false;
  return /\b(residual risk|accepted risk|risk accepted|known failure|deferred|out of scope)\b/i.test(content);
}

function hasBlockedDocumentation(record: NormalizedEvidenceRecord, taskDocs: AnalyzeTaskEvidenceSemanticsInput['taskDocs']): boolean {
  const content = joinTaskDocs(taskDocs);
  if (!content) return false;
  if (!mentionsRecord(content, record) && !/\b(blocked|deferred|not applicable|accepted risk|out of scope)\b/i.test(content)) return false;
  return /\b(blocked|deferred|not applicable|accepted risk|out of scope|next step)\b/i.test(content);
}

function mentionsRecord(content: string, record: NormalizedEvidenceRecord): boolean {
  const lowered = content.toLowerCase();
  if (lowered.includes(record.id.toLowerCase())) return true;
  const fragment = record.summary.toLowerCase().replace(/\s+/g, ' ').slice(0, 32).trim();
  return fragment.length >= 12 && lowered.includes(fragment);
}

function joinTaskDocs(taskDocs: AnalyzeTaskEvidenceSemanticsInput['taskDocs']): string {
  return [taskDocs?.acceptance, taskDocs?.risks, taskDocs?.handoff].filter(Boolean).join('\n');
}

function isSupportedReleaseArtifact(artifact: EvidenceArtifactRef): boolean {
  if (artifact.schemaVersion === 'hadara.smokeEvidenceSummary.v1') return true;
  if (artifact.schemaVersion === 'hadara.releaseArtifact.v1') return true;
  if (artifact.schemaVersion === 'hadara.releaseArtifact.manifest.v1') return true;
  return /(^|\/)(package-smoke|clean-checkout|release-artifact)(\/|$)/.test(artifact.path);
}
