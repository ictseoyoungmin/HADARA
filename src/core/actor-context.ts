export const HADARA_ACTOR_ROLES = ['operator', 'coordinator', 'worker', 'reviewer', 'unknown'] as const;

export type HadaraActorRole = (typeof HADARA_ACTOR_ROLES)[number];

export interface HadaraActorContext {
  agentId: string;
  runId: string;
  role: HadaraActorRole;
  parentRunId: string | null;
}

export type HadaraContextIssueSeverity = 'info' | 'warning' | 'error';

export interface HadaraContextIssue {
  severity: HadaraContextIssueSeverity;
  code: HadaraMultiAgentIssueCode;
  message: string;
  fields?: string[];
}

export interface ResolveActorContextOptions {
  agentId?: string | null;
  runId?: string | null;
  role?: string | null;
  parentRunId?: string | null;
}

export const DEFAULT_HADARA_ACTOR_CONTEXT: HadaraActorContext = {
  agentId: 'unknown',
  runId: 'local',
  role: 'operator',
  parentRunId: null
};

export const HADARA_MULTI_AGENT_ISSUE_CODES = [
  'HADARA_ACTOR_CONTEXT_DEFAULTED',
  'HADARA_ACTOR_CONTEXT_MISSING',
  'HADARA_RUN_ID_MISSING',
  'HADARA_STALE_PLAN_HASH',
  'HADARA_CONCURRENT_TASK_ACTIVITY',
  'HADARA_SHARED_DOC_COORDINATOR_RECOMMENDED',
  'HADARA_IDEMPOTENCY_KEY_REUSED',
  'HADARA_SUPERSEDED_EVIDENCE_FOUND',
  'HADARA_DIST_SYNC_CONFLICT',
  'HADARA_HANDOFF_PATCH_STALE',
  'HADARA_TASK_LOCAL_WRITE_WITHOUT_PLAN',
  'HADARA_SHARED_DOC_WRITE_REQUIRES_BEFORE_HASH'
] as const;

export type HadaraMultiAgentIssueCode = (typeof HADARA_MULTI_AGENT_ISSUE_CODES)[number];

export function isHadaraActorRole(value: string): value is HadaraActorRole {
  return HADARA_ACTOR_ROLES.includes(value as HadaraActorRole);
}

export function resolveHadaraActorContext(options: ResolveActorContextOptions = {}): {
  actor: HadaraActorContext;
  issues: HadaraContextIssue[];
} {
  const defaultedFields: string[] = [];
  const agentId = normalizeOptionalString(options.agentId) ?? trackDefault('agentId', defaultedFields, DEFAULT_HADARA_ACTOR_CONTEXT.agentId);
  const runId = normalizeOptionalString(options.runId) ?? trackDefault('runId', defaultedFields, DEFAULT_HADARA_ACTOR_CONTEXT.runId);
  const parentRunId = normalizeOptionalString(options.parentRunId) ?? null;
  const rawRole = normalizeOptionalString(options.role);
  const role = rawRole && isHadaraActorRole(rawRole) ? rawRole : trackDefault('role', defaultedFields, DEFAULT_HADARA_ACTOR_CONTEXT.role);

  if (options.parentRunId === undefined) {
    defaultedFields.push('parentRunId');
  }

  const issues: HadaraContextIssue[] = [];
  if (defaultedFields.length > 0) {
    issues.push({
      severity: 'warning',
      code: 'HADARA_ACTOR_CONTEXT_DEFAULTED',
      message: `Actor context defaulted field(s): ${defaultedFields.join(', ')}.`,
      fields: defaultedFields
    });
  }

  return {
    actor: {
      agentId,
      runId,
      role,
      parentRunId
    },
    issues
  };
}

function normalizeOptionalString(value: string | null | undefined): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function trackDefault<T extends string>(field: string, fields: string[], value: T): T {
  fields.push(field);
  return value;
}
