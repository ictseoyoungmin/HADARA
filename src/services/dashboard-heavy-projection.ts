import { createDashboardCacheKey, createDashboardProjectReference, disabledDashboardCacheMetadata } from './dashboard-cache';
import { createDashboardTimelineReport, DashboardTimelineReport } from './dashboard-timeline';
import {
  createDashboardProjectionRecord,
  readDashboardProjection,
  writeDashboardProjection
} from './dashboard-projection-store';
import { createOperationalDebtReport, OperationalDebtAggregate, OperationalDebtReport } from './operational-debt';

export interface DashboardDebtProjectionReport {
  schemaVersion: 'hadara.dashboard.debt_projection.v1';
  command: 'dashboard.debt';
  ok: boolean;
  generatedAt: string;
  aggregate: OperationalDebtAggregate;
  issues: OperationalDebtReport['issues'];
}

export interface DashboardHeavyProjectionRefreshResult {
  timeline: DashboardTimelineReport;
  debt: DashboardDebtProjectionReport;
}

export function refreshDashboardHeavyProjections(projectRoot: string, now = new Date()): DashboardHeavyProjectionRefreshResult {
  const timeline = sanitizeTimelineProjection(projectRoot, createDashboardTimelineReport(projectRoot, {}, now), now);
  const debtReport = createOperationalDebtReport(projectRoot);
  const debt: DashboardDebtProjectionReport = {
    schemaVersion: 'hadara.dashboard.debt_projection.v1',
    command: 'dashboard.debt',
    ok: true,
    generatedAt: now.toISOString(),
    aggregate: debtReport.aggregate,
    issues: debtReport.issues
  };

  writeDashboardProjection({ projectRoot }, createDashboardProjectionRecord(projectRoot, 'timeline', 'overview', timeline, timeline.generatedAt));
  writeDashboardProjection({ projectRoot }, createDashboardProjectionRecord(projectRoot, 'debt', 'summary', debt, debt.generatedAt));
  return { timeline, debt };
}

export function createProjectedDashboardTimelineReport(projectRoot: string): DashboardTimelineReport {
  const record = readDashboardProjection<DashboardTimelineReport>({ projectRoot }, 'timeline', 'overview');
  if (record) return record.body;
  const generatedAt = new Date().toISOString();
  return {
    schemaVersion: 'hadara.dashboard.timeline.v1',
    command: 'dashboard.timeline',
    ok: true,
    generatedAt,
    source: {
      projectRoot: '.',
      projectRootRedacted: true,
      project: createDashboardProjectReference(projectRoot),
      live: false
    },
    cache: disabledDashboardCacheMetadata(createDashboardCacheKey(projectRoot, 'timeline', 'overview'), generatedAt),
    events: [],
    issues: [
      {
        severity: 'warning',
        code: 'TIMELINE_PROJECTION_MISSING',
        message: 'Dashboard timeline projection is missing; background refresh should rebuild it.'
      }
    ]
  };
}

export function createProjectedDashboardDebtReport(projectRoot: string): DashboardDebtProjectionReport {
  const record = readDashboardProjection<DashboardDebtProjectionReport>({ projectRoot }, 'debt', 'summary');
  if (record) return record.body;
  return {
    schemaVersion: 'hadara.dashboard.debt_projection.v1',
    command: 'dashboard.debt',
    ok: true,
    generatedAt: new Date().toISOString(),
    aggregate: {
      total: 0,
      open: 0,
      tracked: 0,
      mitigated: 0,
      candidate: 0,
      highOpen: 0,
      bySeverity: { high: 0, medium: 0, low: 0 }
    },
    issues: [
      {
        severity: 'warning',
        code: 'DEBT_PROJECTION_MISSING',
        message: 'Dashboard debt projection is missing; background refresh should rebuild it.'
      }
    ]
  };
}

function sanitizeTimelineProjection(projectRoot: string, report: DashboardTimelineReport, now: Date): DashboardTimelineReport {
  return {
    ...report,
    generatedAt: now.toISOString(),
    source: {
      ...report.source,
      projectRoot: '.',
      projectRootRedacted: true,
      live: false
    },
    cache: disabledDashboardCacheMetadata(createDashboardCacheKey(projectRoot, 'timeline', 'overview'), now.toISOString())
  };
}
