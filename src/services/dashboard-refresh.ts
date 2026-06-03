import { createDashboardProjectFingerprint, createDashboardProjectReference, DashboardProjectReference } from './dashboard-cache';
import { createDashboardCoreReport } from './dashboard-core';
import { refreshDashboardDebtProjection, refreshDashboardTimelineProjection } from './dashboard-heavy-projection';
import { readDashboardProjection } from './dashboard-projection-store';
import { refreshDashboardTaskProjectionIndexAsync } from './dashboard-task-projection';

export type DashboardRefreshState = 'idle' | 'checking' | 'refreshing' | 'failed';

export interface DashboardProjectionStatusReport {
  schemaVersion: 'hadara.dashboard.projection_status.v1';
  command: 'dashboard.projection.status';
  ok: boolean;
  generatedAt: string;
  project: DashboardProjectReference;
  refresh: {
    state: DashboardRefreshState;
    reason: string | null;
    startedAt: string | null;
    finishedAt: string | null;
    lastError: string | null;
    runs: number;
    currentStage: string | null;
    processed: number | null;
    total: number | null;
    lastYieldAt: string | null;
  };
  projections: {
    core: {
      present: boolean;
      generatedAt: string | null;
      freshness: 'fresh' | 'stale' | 'missing' | 'unknown';
      completeness: 'core' | 'partial' | 'complete' | 'unknown';
    };
    timeline: {
      present: boolean;
      generatedAt: string | null;
      freshness: 'fresh' | 'stale' | 'missing' | 'unknown';
    };
    debt: {
      present: boolean;
      generatedAt: string | null;
      freshness: 'fresh' | 'stale' | 'missing' | 'unknown';
    };
  };
  pendingSections: string[];
  staleSections: string[];
  issues: Array<{
    severity: 'warning' | 'error';
    code: string;
    message: string;
  }>;
}

export interface DashboardRefreshTriggerReport extends Omit<DashboardProjectionStatusReport, 'command'> {
  command: 'dashboard.refresh';
  accepted: boolean;
}

interface RefreshStateRecord {
  state: DashboardRefreshState;
  reason: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  lastError: string | null;
  runs: number;
  currentStage: string | null;
  processed: number | null;
  total: number | null;
  lastYieldAt: string | null;
}

interface DashboardRefreshOptions {
  includeHeavy?: boolean;
  delayMs?: number;
}

interface DashboardRefreshStepContext {
  updateProgress: (progress: Partial<Pick<RefreshStateRecord, 'processed' | 'total' | 'lastYieldAt'>>) => void;
}

interface DashboardRefreshStep {
  stage: string;
  run: (context: DashboardRefreshStepContext) => void | Promise<void>;
}

const refreshStates = new Map<string, RefreshStateRecord>();

export function warmDashboardProjections(projectRoot: string): DashboardRefreshTriggerReport {
  return triggerDashboardProjectionRefresh(projectRoot, 'serve-start', { includeHeavy: false, delayMs: 250 });
}

export function triggerDashboardProjectionRefresh(
  projectRoot: string,
  reason = 'manual',
  options: DashboardRefreshOptions = {}
): DashboardRefreshTriggerReport {
  const key = createDashboardProjectFingerprint(projectRoot);
  const current = getRefreshState(projectRoot);
  if (current.state === 'checking' || current.state === 'refreshing') {
    return {
      ...createDashboardProjectionStatusReport(projectRoot),
      schemaVersion: 'hadara.dashboard.projection_status.v1',
      command: 'dashboard.refresh',
      accepted: false
    };
  }

  const startedAt = new Date().toISOString();
  refreshStates.set(key, {
    state: 'refreshing',
    reason,
    startedAt,
    finishedAt: null,
    lastError: null,
    runs: current.runs,
    currentStage: null,
    processed: null,
    total: null,
    lastYieldAt: null
  });

  scheduleRefreshSteps(projectRoot, key, reason, startedAt, createRefreshSteps(projectRoot, options), options.delayMs ?? 0);

  return {
    ...createDashboardProjectionStatusReport(projectRoot),
    schemaVersion: 'hadara.dashboard.projection_status.v1',
    command: 'dashboard.refresh',
    accepted: true
  };
}

function createRefreshSteps(projectRoot: string, options: DashboardRefreshOptions): DashboardRefreshStep[] {
  const steps: DashboardRefreshStep[] = [];
  if (options.includeHeavy !== false) {
    steps.push({
      stage: 'task-signals',
      run: async ({ updateProgress }) => {
        await refreshDashboardTaskProjectionIndexAsync(projectRoot, new Date(), {
          onProgress: (progress) => updateProgress(progress)
        });
      }
    });
    steps.push({
      stage: 'core-before-heavy',
      run: ({ updateProgress }) => {
        updateProgress({ processed: 0, total: 1 });
        createDashboardCoreReport(projectRoot, { bypassProjection: true });
        updateProgress({ processed: 1, total: 1, lastYieldAt: new Date().toISOString() });
      }
    });
    steps.push({
      stage: 'timeline',
      run: ({ updateProgress }) => {
        updateProgress({ processed: 0, total: 1 });
        const core = createDashboardCoreReport(projectRoot);
        refreshDashboardTimelineProjection(projectRoot, new Date(), { core });
        updateProgress({ processed: 1, total: 1, lastYieldAt: new Date().toISOString() });
      }
    });
    steps.push({
      stage: 'debt',
      run: ({ updateProgress }) => {
        updateProgress({ processed: 0, total: 1 });
        refreshDashboardDebtProjection(projectRoot);
        updateProgress({ processed: 1, total: 1, lastYieldAt: new Date().toISOString() });
      }
    });
  }
  steps.push({
    stage: 'core-final',
    run: ({ updateProgress }) => {
      updateProgress({ processed: 0, total: 1 });
      createDashboardCoreReport(projectRoot, { bypassProjection: true });
      updateProgress({ processed: 1, total: 1, lastYieldAt: new Date().toISOString() });
    }
  });
  return steps;
}

function scheduleRefreshSteps(
  projectRoot: string,
  key: string,
  reason: string,
  startedAt: string,
  steps: DashboardRefreshStep[],
  delayMs: number
): void {
  let index = 0;
  const runNext = async () => {
    try {
      const step = steps[index];
      if (step) {
        setRefreshStage(key, projectRoot, step.stage);
        await step.run({
          updateProgress: (progress) => updateRefreshProgress(key, projectRoot, progress)
        });
        index += 1;
        setTimeout(runNext, 0);
        return;
      }

      const previous = getRefreshState(projectRoot);
      refreshStates.set(key, {
        state: 'idle',
        reason,
        startedAt,
        finishedAt: new Date().toISOString(),
        lastError: null,
        runs: previous.runs + 1,
        currentStage: null,
        processed: null,
        total: null,
        lastYieldAt: previous.lastYieldAt
      });
    } catch (error) {
      const previous = getRefreshState(projectRoot);
      refreshStates.set(key, {
        state: 'failed',
        reason,
        startedAt,
        finishedAt: new Date().toISOString(),
        lastError: error instanceof Error ? error.message : String(error),
        runs: previous.runs,
        currentStage: previous.currentStage,
        processed: previous.processed,
        total: previous.total,
        lastYieldAt: previous.lastYieldAt
      });
    }
  };

  setTimeout(runNext, delayMs);
}

export function createDashboardProjectionStatusReport(projectRoot: string, now = new Date()): DashboardProjectionStatusReport {
  const core = readDashboardProjection({ projectRoot }, 'core', 'index');
  const timeline = readDashboardProjection({ projectRoot }, 'timeline', 'overview');
  const debt = readDashboardProjection({ projectRoot }, 'debt', 'summary');
  const state = getRefreshState(projectRoot);
  const projection = projectionMetadata(core?.body);
  const coreFreshness = projectionFreshness(core?.generatedAt ?? null, state);
  const timelineFreshness = projectionFreshness(timeline?.generatedAt ?? null, state);
  const debtFreshness = projectionFreshness(debt?.generatedAt ?? null, state);
  const pendingSections = mergeUnique([
    ...(projection ? projectionStringArray(projection, 'pendingSections') : ['core']),
    ...missingSections({ core: coreFreshness, timeline: timelineFreshness, debt: debtFreshness })
  ]);
  const staleSections = mergeUnique([
    ...(projection ? projectionStringArray(projection, 'staleSections') : []),
    ...staleProjectionSections({ core: coreFreshness, timeline: timelineFreshness, debt: debtFreshness })
  ]);
  const completeness = projection ? projectionCompleteness(projection) : 'unknown';

  return {
    schemaVersion: 'hadara.dashboard.projection_status.v1',
    command: 'dashboard.projection.status',
    ok: state.state !== 'failed',
    generatedAt: now.toISOString(),
    project: createDashboardProjectReference(projectRoot),
    refresh: state,
    projections: {
      core: {
        present: Boolean(core),
        generatedAt: core?.generatedAt ?? null,
        freshness: coreFreshness,
        completeness
      },
      timeline: {
        present: Boolean(timeline),
        generatedAt: timeline?.generatedAt ?? null,
        freshness: timelineFreshness
      },
      debt: {
        present: Boolean(debt),
        generatedAt: debt?.generatedAt ?? null,
        freshness: debtFreshness
      }
    },
    pendingSections,
    staleSections,
    issues:
      state.state === 'failed' && state.lastError
        ? [
            {
              severity: 'warning',
              code: 'DASHBOARD_REFRESH_FAILED',
              message: state.lastError
            }
          ]
        : []
  };
}

export function clearDashboardRefreshStateForTests(): void {
  refreshStates.clear();
}

function getRefreshState(projectRoot: string): RefreshStateRecord {
  return (
    refreshStates.get(createDashboardProjectFingerprint(projectRoot)) ?? {
      state: 'idle',
      reason: null,
      startedAt: null,
      finishedAt: null,
      lastError: null,
      runs: 0,
      currentStage: null,
      processed: null,
      total: null,
      lastYieldAt: null
    }
  );
}

function setRefreshStage(key: string, projectRoot: string, stage: string): void {
  const previous = getRefreshState(projectRoot);
  refreshStates.set(key, {
    ...previous,
    currentStage: stage,
    processed: 0,
    total: null,
    lastYieldAt: previous.lastYieldAt
  });
}

function updateRefreshProgress(
  key: string,
  projectRoot: string,
  progress: Partial<Pick<RefreshStateRecord, 'processed' | 'total' | 'lastYieldAt'>>
): void {
  const previous = getRefreshState(projectRoot);
  refreshStates.set(key, {
    ...previous,
    processed: progress.processed ?? previous.processed,
    total: progress.total ?? previous.total,
    lastYieldAt: progress.lastYieldAt ?? previous.lastYieldAt
  });
}

function projectionFreshness(
  generatedAt: string | null,
  state: RefreshStateRecord
): 'fresh' | 'stale' | 'missing' | 'unknown' {
  if (!generatedAt) return 'missing';
  if (state.state === 'refreshing' || state.state === 'checking') {
    return state.startedAt && generatedAt < state.startedAt ? 'stale' : 'unknown';
  }
  if (state.state === 'failed') return 'stale';
  if (!state.startedAt || !state.finishedAt) return 'unknown';
  return generatedAt >= state.startedAt ? 'fresh' : 'stale';
}

function projectionStringArray(value: unknown, key: 'pendingSections' | 'staleSections'): string[] {
  if (typeof value !== 'object' || value === null) return [];
  const candidate = (value as Record<string, unknown>)[key];
  return Array.isArray(candidate) ? candidate.filter((item): item is string => typeof item === 'string') : [];
}

function projectionMetadata(body: unknown): unknown {
  if (typeof body !== 'object' || body === null) return null;
  return (body as Record<string, unknown>).projection ?? null;
}

function projectionCompleteness(value: unknown): 'core' | 'partial' | 'complete' | 'unknown' {
  if (typeof value !== 'object' || value === null) return 'unknown';
  const candidate = (value as Record<string, unknown>).completeness;
  return candidate === 'core' || candidate === 'partial' || candidate === 'complete' ? candidate : 'unknown';
}

function mergeUnique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function missingSections(freshness: Record<'core' | 'timeline' | 'debt', 'fresh' | 'stale' | 'missing' | 'unknown'>): string[] {
  return Object.entries(freshness)
    .filter(([, value]) => value === 'missing')
    .map(([key]) => key);
}

function staleProjectionSections(freshness: Record<'core' | 'timeline' | 'debt', 'fresh' | 'stale' | 'missing' | 'unknown'>): string[] {
  return Object.entries(freshness)
    .filter(([, value]) => value === 'stale')
    .map(([key]) => key);
}
