// Data layer for the HADARA Operator Console (Phase 5.6).
// Read-only. Consumes existing aggregate read models and normalizes the
// bootstrap report, the ops.status fixture, and the inline fallback into one
// in-memory RuntimeState. No browser-persisted project state is created here.

export type SourceKind = 'projection' | 'live-api' | 'live-status' | 'fixture-fallback' | 'inline-fallback' | 'degraded';

export type Health = 'ok' | 'degraded' | 'error' | 'unknown';

export type ProofStatus = 'sufficient' | 'weak' | 'failed' | 'blocked' | 'private-only' | 'unknown';

export type LoadPhase =
  | 'shell'
  | 'bootstrap-loading'
  | 'bootstrap-ready'
  | 'detail-loading'
  | 'detail-ready'
  | 'polling'
  | 'degraded';

export interface SourceMeta {
  kind: SourceKind;
  label: string;
  generatedAt: string | null;
  projectFingerprint: string | null;
}

export interface CacheMeta {
  status: string;
  ttlMs: number | null;
  generatedAt: string | null;
  expiresAt: string | null;
}

export interface ProjectionMeta {
  freshness: 'fresh' | 'stale' | 'missing' | 'unknown';
  refreshState: 'idle' | 'checking' | 'refreshing' | 'failed';
  pendingSections: string[];
  staleSections: string[];
}

export interface TimelineEvent {
  id: string;
  order: number;
  kind: string;
  title: string;
  summary: string;
  severity: 'ok' | 'warning' | 'error' | 'info';
  time?: string | null;
  taskId?: string | null;
  command?: string | null;
  evidenceId?: string | null;
  evidenceIdStability?: string | null;
}

export interface RecentTask {
  id: string;
  title: string;
  status: string;
}

export interface RuntimeState {
  source: SourceMeta;
  cache: CacheMeta | null;
  projection: ProjectionMeta | null;
  ok: boolean;
  health: Health;
  project: { branch: string; phase: string };
  tasks: {
    total: number;
    counts: Record<string, number>;
    nextRecommended: string | null;
    recent: RecentTask[];
    lastCompleted: string[];
  };
  handoff: { currentState: string[]; nextStep: string[] };
  validation: { latestFullCheck: string | null; latestDoneLevelValidation: string | null };
  debt: { total: number; open: number; highOpen: number; bySeverity: Record<string, number>; pending?: boolean };
  mcp: { defaultMode: string; evidenceAttachRequiresApproval: boolean };
  activeRun: { present: boolean; taskId: string | null; status: string | null; staleReason: string | null };
  timeline: TimelineEvent[];
}

export interface TaskDetail {
  ok: boolean;
  taskId: string;
  title: string;
  taskStatus: string;
  capsule: string;
  source: SourceMeta;
  cache: CacheMeta | null;
  proof: {
    status: ProofStatus;
    note: string;
    blocking: boolean;
    auditabilityWarning: boolean;
    substantivePositive: number;
    semanticIssueCodes: string[];
  };
  evidence: { id: string; kind: string; result: string; strength: string; visibility: string; summary: string }[];
  evidenceCount: number;
  timeline: TimelineEvent[];
  commands: { label: string; command: string; source: string }[];
  state: { ready: boolean; closeState: string; blockers: number; warnings: number } | null;
}

type AnyObj = Record<string, any>;

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}
function asNumber(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
function asArray<T = any>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function normalizeHealth(v: unknown): Health {
  return v === 'ok' || v === 'degraded' || v === 'error' ? v : 'unknown';
}

function normalizeTimeline(events: AnyObj[]): TimelineEvent[] {
  return events.map((e, i) => ({
    id: asString(e.id, `event-${i + 1}`),
    order: asNumber(e.order, i + 1),
    kind: asString(e.kind, 'info'),
    title: asString(e.title, 'Event'),
    summary: asString(e.summary, ''),
    severity: (['ok', 'warning', 'error', 'info'].includes(e.severity) ? e.severity : 'info') as TimelineEvent['severity'],
    time: typeof e.time === 'string' ? e.time : null,
    taskId: typeof e.taskId === 'string' ? e.taskId : null,
    command: typeof e.command === 'string' ? e.command : null,
    evidenceId: typeof e.evidenceId === 'string' ? e.evidenceId : null,
    evidenceIdStability: typeof e.evidenceIdStability === 'string' ? e.evidenceIdStability : null
  }));
}

function cacheFrom(raw: AnyObj | undefined | null): CacheMeta | null {
  if (!raw || typeof raw !== 'object') return null;
  if (raw.status === 'disabled' && raw.ttlMs == null) return { status: 'disabled', ttlMs: null, generatedAt: null, expiresAt: null };
  return {
    status: asString(raw.status, 'unknown'),
    ttlMs: typeof raw.ttlMs === 'number' ? raw.ttlMs : null,
    generatedAt: typeof raw.generatedAt === 'string' ? raw.generatedAt : null,
    expiresAt: typeof raw.expiresAt === 'string' ? raw.expiresAt : null
  };
}

// status block can be the top-level ops.status report (fixture/inline) or
// bootstrap.status. taskSummary/timelineOverview/etc. only exist on bootstrap.
function normalizeStatusBlock(status: AnyObj, kind: SourceKind, label: string, extras?: AnyObj): RuntimeState {
  const tasks = (status.tasks ?? {}) as AnyObj;
  const handoff = (status.handoff ?? {}) as AnyObj;
  const validation = (status.validation ?? {}) as AnyObj;
  const debt = (status.debt ?? {}) as AnyObj;
  const mcp = (status.mcp ?? {}) as AnyObj;
  const project = (status.project ?? {}) as AnyObj;

  const taskSummary = (extras?.taskSummary ?? {}) as AnyObj;
  const recent = asArray<AnyObj>(taskSummary.recent).map((t) => ({
    id: asString(t.id),
    title: asString(t.title),
    status: asString(t.status)
  }));

  const activeRunSummary = (extras?.activeRunSummary ?? {}) as AnyObj;
  const debtSummary = (extras?.debtSummary ?? debt) as AnyObj;

  return {
    source: {
      kind,
      label,
      generatedAt: typeof extras?.generatedAt === 'string' ? extras.generatedAt : typeof status.generatedAt === 'string' ? status.generatedAt : null,
      projectFingerprint:
        extras?.source?.project?.fingerprint && typeof extras.source.project.fingerprint === 'string' ? extras.source.project.fingerprint : null
    },
    cache: cacheFrom(extras?.cache),
    projection: null,
    ok: status.ok !== false,
    health: normalizeHealth(status.health),
    project: { branch: asString(project.branch, 'unknown'), phase: asString(project.phase, 'unknown') },
    tasks: {
      total: asNumber(taskSummary.total, asNumber(tasks.count)),
      counts: (tasks.counts ?? {}) as Record<string, number>,
      nextRecommended:
        typeof taskSummary.nextRecommended === 'string' ? taskSummary.nextRecommended : typeof tasks.nextRecommended === 'string' ? tasks.nextRecommended : null,
      recent,
      lastCompleted: asArray<string>(tasks.lastCompleted)
    },
    handoff: {
      currentState: asArray<string>(handoff.currentState),
      nextStep: asArray<string>(handoff.nextRecommendedStep ?? handoff.nextStep)
    },
    validation: {
      latestFullCheck: typeof validation.latestFullCheck === 'string' ? validation.latestFullCheck : null,
      latestDoneLevelValidation: typeof validation.latestDoneLevelValidation === 'string' ? validation.latestDoneLevelValidation : null
    },
    debt: {
      total: asNumber(debtSummary.total),
      open: asNumber(debtSummary.open),
      highOpen: asNumber(debtSummary.highOpen),
      bySeverity: (debtSummary.bySeverity ?? {}) as Record<string, number>,
      pending: debtSummary.pending === true
    },
    mcp: {
      defaultMode: asString(mcp.defaultMode, 'read-only'),
      evidenceAttachRequiresApproval: mcp?.evidenceAttach?.requiresApproval !== false
    },
    activeRun: {
      present: activeRunSummary.present === true,
      taskId: typeof activeRunSummary.taskId === 'string' ? activeRunSummary.taskId : null,
      status: typeof activeRunSummary.status === 'string' ? activeRunSummary.status : null,
      staleReason: typeof activeRunSummary.staleReason === 'string' ? activeRunSummary.staleReason : null
    },
    timeline: normalizeTimeline(asArray<AnyObj>(extras?.timelineOverview?.events))
  };
}

export function normalizeBootstrap(report: AnyObj): RuntimeState {
  return normalizeStatusBlock(report.status ?? {}, 'live-api', 'Live dashboard aggregate read', {
    taskSummary: report.taskSummary,
    timelineOverview: report.timelineOverview,
    activeRunSummary: report.activeRunSummary,
    debtSummary: report.debtSummary,
    cache: report.cache,
    source: report.source,
    generatedAt: report.generatedAt
  });
}

export function normalizeCore(report: AnyObj): RuntimeState {
  const core = (report.core ?? {}) as AnyObj;
  const taskSummary = (core.taskSummary ?? {}) as AnyObj;
  const handoffSummary = (core.handoffSummary ?? {}) as AnyObj;
  const validationSummary = (core.validationSummary ?? {}) as AnyObj;
  const debtSummary = (core.debtSummary ?? {}) as AnyObj;
  const activeRunSummary = (core.activeRunSummary ?? {}) as AnyObj;
  const sourceKind = report.source?.kind === 'projection' ? 'projection' : 'live-api';
  const projection = (report.projection ?? {}) as AnyObj;
  return {
    source: {
      kind: sourceKind,
      label: sourceKind === 'projection' ? 'Local dashboard core projection' : 'Live dashboard core read',
      generatedAt: typeof report.generatedAt === 'string' ? report.generatedAt : null,
      projectFingerprint: typeof report.source?.project?.fingerprint === 'string' ? report.source.project.fingerprint : null
    },
    cache: null,
    projection: {
      freshness: (['fresh', 'stale', 'missing', 'unknown'].includes(projection.freshness) ? projection.freshness : 'unknown') as ProjectionMeta['freshness'],
      refreshState: (['idle', 'checking', 'refreshing', 'failed'].includes(projection.refreshState) ? projection.refreshState : 'idle') as ProjectionMeta['refreshState'],
      pendingSections: asArray<string>(projection.pendingSections),
      staleSections: asArray<string>(projection.staleSections)
    },
    ok: report.ok !== false,
    health: normalizeHealth(core.health),
    project: { branch: 'unknown', phase: 'dashboard projection' },
    tasks: {
      total: asNumber(taskSummary.total),
      counts: (taskSummary.counts ?? {}) as Record<string, number>,
      nextRecommended: typeof taskSummary.nextRecommended === 'string' ? taskSummary.nextRecommended : null,
      recent: asArray<AnyObj>(taskSummary.recent).map((t) => ({ id: asString(t.id), title: asString(t.title), status: asString(t.status) })),
      lastCompleted: asArray<string>(taskSummary.lastCompleted)
    },
    handoff: {
      currentState: asArray<string>(handoffSummary.currentState),
      nextStep: asArray<string>(handoffSummary.nextRecommendedStep)
    },
    validation: {
      latestFullCheck: typeof validationSummary.latestFullCheck === 'string' ? validationSummary.latestFullCheck : null,
      latestDoneLevelValidation: typeof validationSummary.latestDoneLevelValidation === 'string' ? validationSummary.latestDoneLevelValidation : null
    },
    debt: {
      total: asNumber(debtSummary.total),
      open: asNumber(debtSummary.open),
      highOpen: asNumber(debtSummary.highOpen),
      bySeverity: (debtSummary.bySeverity ?? {}) as Record<string, number>,
      pending: debtSummary.pending !== false
    },
    mcp: { defaultMode: 'read-only', evidenceAttachRequiresApproval: true },
    activeRun: {
      present: activeRunSummary.present === true,
      taskId: typeof activeRunSummary.taskId === 'string' ? activeRunSummary.taskId : null,
      status: typeof activeRunSummary.status === 'string' ? activeRunSummary.status : null,
      staleReason: typeof activeRunSummary.staleReason === 'string' ? activeRunSummary.staleReason : null
    },
    timeline: []
  };
}

export function normalizeOpsStatus(report: AnyObj, kind: SourceKind, label: string): RuntimeState {
  return normalizeStatusBlock(report, kind, label, { generatedAt: report.generatedAt });
}

export function normalizeTaskDetail(report: AnyObj): TaskDetail {
  const wb = (report.workbench ?? {}) as AnyObj;
  const task = (wb.task ?? {}) as AnyObj;
  const proof = (report.proof ?? {}) as AnyObj;
  const records = asArray<AnyObj>(report.evidenceList?.records);
  const evidence = records.slice(0, 12).map((r, i) => ({
    id: asString(r.id ?? r.evidenceId, `record-${i + 1}`),
    kind: asString(r.kind ?? r.artifactType, 'unknown'),
    result: asString(r.result ?? r.outcome, 'unknown'),
    strength: asString(r.strength ?? r.semanticStrength, ''),
    visibility: asString(r.visibility, 'unknown'),
    summary: asString(r.summary ?? r.message ?? r.note, '')
  }));
  const commands = asArray<AnyObj>(report.commandGuidance ?? report.commands).map((c) => ({
    label: asString(c.label, 'command'),
    command: asString(c.command),
    source: asString(c.source, 'protocol')
  }));
  const state = report.workbench?.state
    ? {
        ready: wb.state.ready === true,
        closeState: asString(wb.state.closeState, 'unknown'),
        blockers: asNumber(wb.state.blockers),
        warnings: asNumber(wb.state.warnings)
      }
    : null;

  return {
    ok: report.ok !== false,
    taskId: asString(report.taskId, asString(task.id)),
    title: asString(task.title),
    taskStatus: asString(task.taskStatus ?? task.status, 'unknown'),
    capsule: asString(task.capsule),
    source: {
      kind: 'live-api',
      label: 'Live task detail aggregate read',
      generatedAt: typeof report.generatedAt === 'string' ? report.generatedAt : null,
      projectFingerprint: typeof report.source?.project?.fingerprint === 'string' ? report.source.project.fingerprint : null
    },
    cache: cacheFrom(report.cache),
    proof: {
      status: (['sufficient', 'weak', 'failed', 'blocked', 'private-only', 'unknown'].includes(proof.status) ? proof.status : 'unknown') as ProofStatus,
      note: asString(proof.note),
      blocking: proof.blocking === true,
      auditabilityWarning: proof.auditabilityWarning === true,
      substantivePositive: asNumber(proof.substantivePositive),
      semanticIssueCodes: asArray<string>(proof.semanticIssueCodes)
    },
    evidence,
    evidenceCount: asNumber(report.evidenceList?.count, evidence.length),
    timeline: normalizeTimeline(asArray<AnyObj>(report.timeline?.events)),
    commands,
    state
  };
}

// --- read-only fetch with bootstrap-first fallback chain --------------------

const coreUrl = '/api/dashboard/core';
const liveBootstrapUrl = '/api/dashboard/bootstrap';
const liveStatusUrl = '/api/status';
const fixtureUrl = 'fixtures/hadara.ops.status.sample.json';

// Generous enough that a genuinely slow first read (large repos on networked or
// NTFS filesystems can take many seconds) still completes and upgrades the
// instant inline preview to live — rather than being aborted into permanent
// offline. A hung/unreachable server still degrades after this bound.
const FETCH_TIMEOUT_MS = 30000;

// A stalled read must degrade to the next source, never freeze the console.
async function tryFetchJson(url: string): Promise<AnyObj | null> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
    if (!response.ok) return null;
    return (await response.json()) as AnyObj;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

function readInlineFallback(): AnyObj | null {
  const el = document.getElementById('fallback-status-json');
  if (!el || !el.textContent) return null;
  try {
    return JSON.parse(el.textContent) as AnyObj;
  } catch {
    return null;
  }
}

export function isLiveSource(kind: SourceKind): boolean {
  return kind === 'projection' || kind === 'live-api' || kind === 'live-status';
}

// Synchronous, no-network inline fallback used for an instant offline preview
// while the live read is still in flight (perceived-speed first paint).
export function readInlineRuntime(): RuntimeState | null {
  const inline = readInlineFallback();
  return inline ? normalizeOpsStatus(inline, 'inline-fallback', 'Offline inline fallback (not live data)') : null;
}

// Live sources only: projection core, aggregate bootstrap, then plain status. Returns null if
// neither live read succeeds so the caller can decide how to degrade.
export async function loadLiveRuntime(options: { bypass?: boolean } = {}): Promise<RuntimeState | null> {
  const coreRequestUrl = options.bypass ? `${coreUrl}?cache=bypass` : coreUrl;
  const core = await tryFetchJson(coreRequestUrl);
  if (core && core.schemaVersion === 'hadara.dashboard.core.v1') {
    return normalizeCore(core);
  }

  const params = new URLSearchParams({ tier: 'core' });
  if (options.bypass) params.set('cache', 'bypass');
  const bootstrapUrl = `${liveBootstrapUrl}?${params.toString()}`;
  const bootstrap = await tryFetchJson(bootstrapUrl);
  if (bootstrap && bootstrap.schemaVersion === 'hadara.dashboard.bootstrap.v1') {
    return normalizeBootstrap(bootstrap);
  }

  const status = await tryFetchJson(liveStatusUrl);
  if (status && status.schemaVersion === 'hadara.ops.status.v1') {
    return normalizeOpsStatus(status, 'live-status', 'Live status read (aggregate unavailable)');
  }

  return null;
}

// Non-live fallback: served sample fixture, then inline. The result is always
// flagged with a non-live source kind so the UI can show a degraded/offline banner.
export async function loadFallbackRuntime(): Promise<RuntimeState | null> {
  const fixture = await tryFetchJson(fixtureUrl);
  if (fixture && fixture.schemaVersion === 'hadara.ops.status.v1') {
    return normalizeOpsStatus(fixture, 'fixture-fallback', 'Sample fixture (not live data)');
  }
  return readInlineRuntime();
}

export async function triggerProjectionRefresh(): Promise<AnyObj | null> {
  const report = await tryFetchJson('/api/dashboard/refresh');
  return report && report.schemaVersion === 'hadara.dashboard.projection_status.v1' ? report : null;
}

export interface DebtAggregate {
  total: number;
  open: number;
  highOpen: number;
  bySeverity: Record<string, number>;
}

// Background backfill for the debt metric that the core bootstrap tier defers.
export async function loadDebt(): Promise<DebtAggregate | null> {
  const report = await tryFetchJson('/api/dashboard/debt');
  if (!report || report.schemaVersion !== 'hadara.dashboard.debt_projection.v1') return null;
  const agg = (report.aggregate ?? {}) as AnyObj;
  return {
    total: asNumber(agg.total),
    open: asNumber(agg.open),
    highOpen: asNumber(agg.highOpen),
    bySeverity: (agg.bySeverity ?? {}) as Record<string, number>
  };
}

export async function loadTimeline(): Promise<TimelineEvent[] | null> {
  const report = await tryFetchJson('/api/dashboard/timeline');
  if (!report || report.schemaVersion !== 'hadara.dashboard.timeline.v1') return null;
  return normalizeTimeline(asArray<AnyObj>(report.events));
}

export async function loadTaskDetail(taskId: string, options: { bypass?: boolean } = {}): Promise<TaskDetail | null> {
  const base = `/api/dashboard/task-detail?taskId=${encodeURIComponent(taskId)}`;
  const url = options.bypass ? `${base}&cache=bypass` : base;
  const report = await tryFetchJson(url);
  if (report && report.schemaVersion === 'hadara.dashboard.task_detail.v1') {
    return normalizeTaskDetail(report);
  }
  return null;
}
