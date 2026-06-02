import fs from 'node:fs';
import path from 'node:path';
import { createDashboardCacheKey, createDashboardProjectReference, disabledDashboardCacheMetadata } from './dashboard-cache';
import { DashboardCoreReport } from './dashboard-core';
import { extractFirstHandoffSectionValue } from './handoff-summary-parser';
import { createDashboardTimelineReport, DashboardTimelineReport } from './dashboard-timeline';
import {
  createDashboardProjectionRecord,
  readDashboardProjection,
  writeDashboardProjection
} from './dashboard-projection-store';
import { createOperationalDebtAggregate, OperationalDebtAggregate, OperationalDebtReport, OPERATIONAL_DEBT_RECORDS } from './operational-debt';

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

export interface DashboardHeavyProjectionOptions {
  core?: DashboardCoreReport;
}

export function refreshDashboardHeavyProjections(projectRoot: string, now = new Date(), options: DashboardHeavyProjectionOptions = {}): DashboardHeavyProjectionRefreshResult {
  return {
    timeline: refreshDashboardTimelineProjection(projectRoot, now, options),
    debt: refreshDashboardDebtProjection(projectRoot, now)
  };
}

export function refreshDashboardTimelineProjection(projectRoot: string, now = new Date(), options: DashboardHeavyProjectionOptions = {}): DashboardTimelineReport {
  const timeline = sanitizeTimelineProjection(projectRoot, createDashboardTimelineReport(projectRoot, {}, now, { core: options.core }), now);
  writeDashboardProjection({ projectRoot }, createDashboardProjectionRecord(projectRoot, 'timeline', 'overview', timeline, timeline.generatedAt));
  return timeline;
}

export function refreshDashboardDebtProjection(projectRoot: string, now = new Date()): DashboardDebtProjectionReport {
  const debt: DashboardDebtProjectionReport = {
    schemaVersion: 'hadara.dashboard.debt_projection.v1',
    command: 'dashboard.debt',
    ok: true,
    generatedAt: now.toISOString(),
    aggregate: createOperationalDebtAggregate(OPERATIONAL_DEBT_RECORDS),
    issues: []
  };

  writeDashboardProjection({ projectRoot }, createDashboardProjectionRecord(projectRoot, 'debt', 'summary', debt, debt.generatedAt));
  return debt;
}

export function createProjectedDashboardTimelineReport(projectRoot: string): DashboardTimelineReport {
  const record = readDashboardProjection<DashboardTimelineReport>({ projectRoot }, 'timeline', 'overview');
  if (record) return sanitizeProjectedTimelineRead(projectRoot, record.body);
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

function sanitizeProjectedTimelineRead(projectRoot: string, report: DashboardTimelineReport): DashboardTimelineReport {
  if (!report.events.some((event) => isMarkdownTableHeaderSummary(event.summary))) return report;
  const replacements = readHandoffTimelineSummaries(projectRoot);
  return {
    ...report,
    events: report.events.map((event) => {
      if (!isMarkdownTableHeaderSummary(event.summary)) return event;
      if (event.title === 'Handoff current state' && replacements.currentState) return { ...event, summary: replacements.currentState };
      if (event.title === 'Next recommended work' && replacements.nextRecommended) return { ...event, summary: replacements.nextRecommended };
      return { ...event, summary: 'Projection summary unavailable; refresh the dashboard projection.' };
    })
  };
}

function readHandoffTimelineSummaries(projectRoot: string): { currentState: string | null; nextRecommended: string | null } {
  const handoffPath = path.join(projectRoot, 'docs', 'AGENT_HANDOFF.md');
  if (!fs.existsSync(handoffPath)) return { currentState: null, nextRecommended: null };
  const content = fs.readFileSync(handoffPath, 'utf8');
  return {
    currentState: extractFirstHandoffSectionValue(content, '## Current State'),
    nextRecommended: extractFirstHandoffSectionValue(content, '## Next Recommended Step')
  };
}

function isMarkdownTableHeaderSummary(summary: string): boolean {
  const trimmed = summary.trim();
  if (!trimmed.startsWith('|')) return false;
  const cells = trimmed
    .slice(1, trimmed.endsWith('|') ? -1 : undefined)
    .split('|')
    .map((cell) => cell.trim().toLowerCase())
    .filter(Boolean);
  if (cells.length < 2) return false;
  return (
    cells.join('|') === 'area|state|notes' ||
    cells.join('|') === 'step|reason|done evidence' ||
    cells.every((cell) => /^[a-z][a-z\s/]+$/.test(cell))
  );
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
