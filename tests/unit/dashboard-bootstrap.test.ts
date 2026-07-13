import { describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { createDashboardBootstrapReport } from '../../src/services/dashboard-bootstrap';

describe('dashboard bootstrap read model', () => {
  it('builds a compact first-paint aggregate report', () => {
    const report = createDashboardBootstrapReport(process.cwd(), {}, new Date('2026-06-01T00:00:00.000Z'));

    expect(report).toMatchObject({
      schemaVersion: 'hadara.dashboard.bootstrap.v1',
      command: 'dashboard.bootstrap',
      generatedAt: '2026-06-01T00:00:00.000Z',
      source: {
        kind: 'live-api',
        label: 'Live dashboard aggregate read',
        projectRootRedacted: true,
        project: expect.objectContaining({
          kind: 'project-root',
          pathRedacted: true,
          fingerprint: expect.stringMatching(/^sha256:[a-f0-9]{12}$/)
        })
      },
      cache: {
        status: 'disabled',
        key: expect.stringMatching(/^dashboard:sha256:[a-f0-9]{12}:bootstrap:core$/),
        ttlMs: null,
        generatedAt: '2026-06-01T00:00:00.000Z',
        expiresAt: null
      },
      tier: 'core',
      status: {
        schemaVersion: 'hadara.ops.status.v1',
        command: 'ops.status'
      },
      timelineOverview: {
        schemaVersion: 'hadara.dashboard.timeline.v1'
      }
    });
    expect(report.taskSummary.total).toBeGreaterThan(0);
    expect(report.taskSummary.recent.length).toBeLessThanOrEqual(8);
    expect(report.timelineOverview.events.every((event) => event.readOnly === true)).toBe(true);
    expect(report.debtSummary.pending).toBe(true);
    expect(report.selectedTask).toBeNull();
    expect(JSON.stringify(report)).not.toContain('artifacts/');
    expect(validateSchema('hadara.dashboard.bootstrap.v1', report).ok).toBe(true);
  }, 60000);

  it('includes only compact selected-task proof metadata when requested', () => {
    const report = createDashboardBootstrapReport(process.cwd(), { selectedTaskId: 'T-0196' }, new Date('2026-06-01T00:00:00.000Z'));

    expect(report.cache.key).toMatch(/^dashboard:sha256:[a-f0-9]{12}:bootstrap:core:selected:T-0196$/);
    expect(report.selectedTask).toMatchObject({
      requestedTaskId: 'T-0196',
      ok: expect.any(Boolean),
      task: expect.objectContaining({
        id: 'T-0196',
        taskStatus: 'Done'
      }),
      state: expect.objectContaining({
        evidenceRecords: expect.any(Number)
      }),
      proof: expect.objectContaining({
        status: expect.stringMatching(/^(sufficient|weak|failed|blocked|private-only|unknown)$/),
        semanticIssueCodes: expect.any(Array)
      })
    });
    expect(JSON.stringify(report.selectedTask)).not.toContain('records');
    expect(JSON.stringify(report.selectedTask)).not.toContain('evidencePath');
    expect(validateSchema('hadara.dashboard.bootstrap.v1', report).ok).toBe(true);
  });

  it('degrades invalid selected-task requests with issues instead of throwing', () => {
    const report = createDashboardBootstrapReport(process.cwd(), { selectedTaskId: 'T-9999' }, new Date('2026-06-01T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.selectedTask).toMatchObject({
      requestedTaskId: 'T-9999',
      ok: false,
      task: null,
      proof: expect.objectContaining({ status: 'unknown' })
    });
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'SELECTED_TASK_UNAVAILABLE' })]));
    expect(validateSchema('hadara.dashboard.bootstrap.v1', report).ok).toBe(true);
  }, 120000);
});
