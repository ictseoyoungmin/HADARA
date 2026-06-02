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
}

interface DashboardRefreshOptions {
  includeHeavy?: boolean;
  delayMs?: number;
}

type DashboardRefreshStep = () => void | Promise<void>;

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
    runs: current.runs
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
    steps.push(async () => {
      await refreshDashboardTaskProjectionIndexAsync(projectRoot);
    });
    steps.push(() => {
      createDashboardCoreReport(projectRoot, { bypassProjection: true });
    });
    steps.push(() => {
      const core = createDashboardCoreReport(projectRoot);
      refreshDashboardTimelineProjection(projectRoot, new Date(), { core });
    });
    steps.push(() => {
      refreshDashboardDebtProjection(projectRoot);
    });
  }
  steps.push(() => {
    createDashboardCoreReport(projectRoot, { bypassProjection: true });
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
        await step();
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
        runs: previous.runs + 1
      });
    } catch (error) {
      const previous = getRefreshState(projectRoot);
      refreshStates.set(key, {
        state: 'failed',
        reason,
        startedAt,
        finishedAt: new Date().toISOString(),
        lastError: error instanceof Error ? error.message : String(error),
        runs: previous.runs
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
  const pendingSections = projection ? projectionStringArray(projection, 'pendingSections') : ['core'];
  const staleSections = projection ? projectionStringArray(projection, 'staleSections') : [];
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
        freshness: core ? 'unknown' : 'missing',
        completeness
      },
      timeline: {
        present: Boolean(timeline),
        generatedAt: timeline?.generatedAt ?? null,
        freshness: timeline ? 'unknown' : 'missing'
      },
      debt: {
        present: Boolean(debt),
        generatedAt: debt?.generatedAt ?? null,
        freshness: debt ? 'unknown' : 'missing'
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
      runs: 0
    }
  );
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
