import { DOCS_REGISTER_ALLOWED_VALUES } from './docs-registry';

/**
 * Single shared source for controlled token vocabularies (FD-006 / FD-009).
 *
 * TASK.md token sets live here and are consumed by `src/harness/validate.ts`;
 * docs-registry vocabularies are re-exposed from their existing source so the
 * `hadara schema` lookup surface and the validators cannot drift apart.
 * Physical extraction to a data file and project-level overrides are 0.5
 * state-first RFC scope, not this module.
 */

export interface VocabularyDomain {
  domain: string;
  field: string;
  surface: string;
  issueCode: string | null;
  allowed: readonly string[];
}

export const TASK_STATUS_TOKENS = ['Draft', 'In Progress', 'Blocked', 'Done', 'Partial', 'Superseded', 'Archived'] as const;
export const PLAN_STATUS_TOKENS = ['Pending', 'In Progress', 'Done', 'Blocked', 'Skipped'] as const;
export const SOURCE_DOCUMENT_ROLE_TOKENS = ['implementation-source', 'reference', 'constraint', 'decision', 'background'] as const;
export const SOURCE_DOCUMENT_AUTHORITY_TOKENS = ['exploratory', 'proposed', 'approved', 'normative', 'implementation-source', 'reference-only', 'historical'] as const;
export const SOURCE_DOCUMENT_STATUS_TOKENS = ['draft', 'review', 'approved', 'implementing', 'implemented', 'superseded', 'drift-risk', 'archived'] as const;
export const ACCEPTANCE_REQUIRED_TOKENS = ['Yes', 'No'] as const;
export const ACCEPTANCE_DECISION_TOKENS = ['Must', 'Optional', 'Follow-up', 'Accepted Risk', 'Not Applicable', 'Superseded'] as const;
export const ACCEPTANCE_STATUS_TOKENS = ['Pending', 'In Progress', 'Met', 'Not Met', 'Blocked', 'Partial', 'Deferred', 'Follow-up Created', 'Accepted Risk', 'Not Applicable', 'Superseded'] as const;
export const ACCEPTANCE_DISPOSITION_TOKENS = ['Required', 'Optional', 'Deferred', 'Accepted Risk', 'Not Applicable', 'Superseded'] as const;
export const VALIDATION_REQUIRED_TOKENS = ['Yes', 'No'] as const;
export const VALIDATION_RESULT_TOKENS = ['Not Run', 'Passed', 'Failed', 'Blocked', 'Skipped', 'Not Applicable'] as const;
export const RISK_KIND_TOKENS = ['Risk', 'Follow-up', 'Question'] as const;
export const RISK_STATE_TOKENS = ['Open', 'Accepted', 'Mitigated', 'Deferred', 'Closed', 'Superseded', 'Rejected'] as const;
export const EVIDENCE_KIND_TOKENS = ['test-log', 'command-log', 'diff-summary', 'screenshot', 'note'] as const;
export const EVIDENCE_RESULT_TOKENS = ['passed', 'failed', 'blocked', 'unknown'] as const;
export const EVIDENCE_VISIBILITY_TOKENS = ['public', 'private'] as const;
export const SLICE_STATUS_TOKENS = ['not-started', 'in-progress', 'done', 'deferred'] as const;

export const VOCABULARY_DOMAINS: readonly VocabularyDomain[] = [
  { domain: 'task.status', field: 'Status', surface: 'TASK.md ## Identity Status row (case-insensitive)', issueCode: 'TASK_STATUS_INVALID_TOKEN', allowed: TASK_STATUS_TOKENS },
  { domain: 'task.plan.status', field: 'Status', surface: 'TASK.md ## Plan Status column', issueCode: 'TASK_PLAN_STATUS_INVALID_TOKEN', allowed: PLAN_STATUS_TOKENS },
  { domain: 'task.source.role', field: 'Role', surface: 'TASK.md ## Inputs / Constraints Role (or Type) column', issueCode: 'TASK_SOURCE_DOCUMENT_ROLE_INVALID_TOKEN', allowed: SOURCE_DOCUMENT_ROLE_TOKENS },
  { domain: 'task.source.authority', field: 'Authority', surface: 'TASK.md ## Inputs / Constraints Authority column (legacy layouts)', issueCode: 'TASK_SOURCE_DOCUMENT_AUTHORITY_INVALID_TOKEN', allowed: SOURCE_DOCUMENT_AUTHORITY_TOKENS },
  { domain: 'task.source.state', field: 'State', surface: 'TASK.md ## Inputs / Constraints State (or Status) column', issueCode: 'TASK_SOURCE_DOCUMENT_STATUS_INVALID_TOKEN', allowed: SOURCE_DOCUMENT_STATUS_TOKENS },
  { domain: 'task.acceptance.required', field: 'Required', surface: 'TASK.md ## Acceptance Required column (legacy layouts)', issueCode: 'ACCEPTANCE_REQUIRED_INVALID_TOKEN', allowed: ACCEPTANCE_REQUIRED_TOKENS },
  { domain: 'task.acceptance.decision', field: 'Decision', surface: 'TASK.md ## Acceptance Decision column (legacy layouts)', issueCode: 'ACCEPTANCE_DECISION_INVALID_TOKEN', allowed: ACCEPTANCE_DECISION_TOKENS },
  { domain: 'task.acceptance.state', field: 'State', surface: 'TASK.md ## Acceptance State (or Status) column', issueCode: 'ACCEPTANCE_STATUS_INVALID_TOKEN', allowed: ACCEPTANCE_STATUS_TOKENS },
  { domain: 'task.acceptance.disposition', field: 'Disposition', surface: 'TASK.md ## Acceptance Disposition column (legacy layouts)', issueCode: 'ACCEPTANCE_DISPOSITION_INVALID_TOKEN', allowed: ACCEPTANCE_DISPOSITION_TOKENS },
  { domain: 'task.validation.gate', field: 'Gate', surface: 'TASK.md ## Validation Gate (or Required) column', issueCode: 'VALIDATION_REQUIRED_INVALID_TOKEN', allowed: VALIDATION_REQUIRED_TOKENS },
  { domain: 'task.validation.result', field: 'Result', surface: 'TASK.md ## Validation Result column', issueCode: 'VALIDATION_RESULT_INVALID_TOKEN', allowed: VALIDATION_RESULT_TOKENS },
  { domain: 'task.risk.kind', field: 'Type', surface: 'TASK.md ## Risks / Follow-ups Type (or Kind) column', issueCode: 'TASK_RISK_KIND_INVALID_TOKEN', allowed: RISK_KIND_TOKENS },
  { domain: 'task.risk.state', field: 'State', surface: 'TASK.md ## Risks / Follow-ups State column', issueCode: 'TASK_RISK_STATE_INVALID_TOKEN', allowed: RISK_STATE_TOKENS },
  { domain: 'evidence.kind', field: 'kind', surface: 'evidence.jsonl record kind', issueCode: 'EVIDENCE_INDEX_INVALID', allowed: EVIDENCE_KIND_TOKENS },
  { domain: 'evidence.result', field: 'result', surface: 'evidence.jsonl record result', issueCode: 'EVIDENCE_INDEX_INVALID', allowed: EVIDENCE_RESULT_TOKENS },
  { domain: 'evidence.visibility', field: 'visibility', surface: 'evidence.jsonl record visibility', issueCode: 'EVIDENCE_INDEX_INVALID', allowed: EVIDENCE_VISIBILITY_TOKENS },
  { domain: 'slices.status', field: 'status', surface: 'slices state entry status (hadara slice add/set --status)', issueCode: 'SLICE_STATUS_INVALID_TOKEN', allowed: SLICE_STATUS_TOKENS },
  { domain: 'docs.kind', field: 'kind', surface: 'docs registry entry kind (`docs register --kind`)', issueCode: 'DOC_UNKNOWN_KIND', allowed: DOCS_REGISTER_ALLOWED_VALUES.kind },
  { domain: 'docs.status', field: 'status', surface: 'docs registry entry status (`docs register --status`, `docs mark --status`)', issueCode: 'DOC_UNKNOWN_STATUS', allowed: DOCS_REGISTER_ALLOWED_VALUES.status },
  { domain: 'docs.readWhen', field: 'readWhen', surface: 'docs registry entry readWhen (`docs register --read-when`)', issueCode: 'DOC_UNKNOWN_READ_WHEN', allowed: DOCS_REGISTER_ALLOWED_VALUES.readWhen },
  { domain: 'docs.readTier', field: 'readTier', surface: 'docs registry entry readTier (`docs register --read-tier`)', issueCode: 'DOC_READ_TIER_INVALID_TOKEN', allowed: DOCS_REGISTER_ALLOWED_VALUES.readTier },
  { domain: 'docs.authority', field: 'authority', surface: 'docs registry entry authority (`docs register --authority`)', issueCode: 'DOC_AUTHORITY_INVALID_TOKEN', allowed: DOCS_REGISTER_ALLOWED_VALUES.authority },
  { domain: 'docs.editPolicy', field: 'editPolicy', surface: 'docs registry entry editPolicy (`docs register --edit-policy`)', issueCode: 'DOC_EDIT_POLICY_INVALID_TOKEN', allowed: DOCS_REGISTER_ALLOWED_VALUES.editPolicy },
  { domain: 'docs.driftRisk', field: 'driftRisk', surface: 'docs registry entry driftRisk (`docs register --drift`)', issueCode: 'DOC_DRIFT_RISK_INVALID_TOKEN', allowed: DOCS_REGISTER_ALLOWED_VALUES.driftRisk }
];

export function findVocabularyDomain(domain: string): VocabularyDomain | undefined {
  return VOCABULARY_DOMAINS.find((entry) => entry.domain === domain);
}

export interface VocabularyIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  field?: string;
  received?: string;
  allowedValues?: string[];
}

export interface VocabularyReport {
  schemaVersion: 'hadara.schema.vocabulary.v1';
  command: 'schema';
  ok: boolean;
  filter: string | null;
  domains: Array<{
    domain: string;
    field: string;
    surface: string;
    issueCode: string | null;
    allowed: string[];
  }>;
  issues: VocabularyIssue[];
}

export function createVocabularyReport(domainFilter?: string): VocabularyReport {
  const issues: VocabularyIssue[] = [];
  let domains = VOCABULARY_DOMAINS;
  if (domainFilter) {
    const match = findVocabularyDomain(domainFilter);
    if (!match) {
      issues.push({
        severity: 'error',
        code: 'SCHEMA_DOMAIN_NOT_FOUND',
        message: `Unknown vocabulary domain: ${domainFilter}. Allowed domains: ${VOCABULARY_DOMAINS.map((entry) => entry.domain).join(', ')}.`,
        field: 'domain',
        received: domainFilter,
        allowedValues: VOCABULARY_DOMAINS.map((entry) => entry.domain)
      });
      domains = [];
    } else {
      domains = [match];
    }
  }
  return {
    schemaVersion: 'hadara.schema.vocabulary.v1',
    command: 'schema',
    ok: issues.every((issue) => issue.severity !== 'error'),
    filter: domainFilter ?? null,
    domains: domains.map((entry) => ({
      domain: entry.domain,
      field: entry.field,
      surface: entry.surface,
      issueCode: entry.issueCode,
      allowed: [...entry.allowed]
    })),
    issues
  };
}
