import { describe, expect, it } from 'vitest';
import { createDashboardTimelineReport } from '../../src/services/dashboard-timeline';
import { validateSchema } from '../../src/core/schema';

describe('dashboard timeline read model', () => {
  it('builds a deterministic read-only dashboard timeline report', () => {
    const report = createDashboardTimelineReport(process.cwd(), { taskId: 'T-0195' }, new Date('2026-06-01T00:00:00.000Z'));

    expect(report).toMatchObject({
      schemaVersion: 'hadara.dashboard.timeline.v1',
      command: 'dashboard.timeline',
      ok: true,
      taskId: 'T-0195',
      generatedAt: '2026-06-01T00:00:00.000Z',
      source: {
        live: true,
        projectRootRedacted: true,
        project: expect.objectContaining({
          kind: 'project-root',
          pathRedacted: true,
          fingerprint: expect.stringMatching(/^sha256:[a-f0-9]{12}$/)
        })
      }
    });
    expect(report.events.length).toBeGreaterThan(3);
    expect(report.events.every((event) => event.readOnly === true)).toBe(true);
    expect(report.events.map((event) => event.order)).toEqual(report.events.map((_, index) => index + 1));
    expect(report.events.some((event) => event.kind === 'evidence' && event.taskId === 'T-0195')).toBe(true);
    const evidenceEvent = report.events.find((event) => event.kind === 'evidence' && event.taskId === 'T-0195');
    expect(evidenceEvent).toMatchObject({
      evidenceId: expect.stringMatching(/^legacy:/),
      evidenceFingerprint: expect.any(String),
      evidenceSourceLine: expect.any(Number),
      evidenceIdSource: 'line-fallback',
      evidenceIdStability: 'unstable-on-reorder'
    });
    expect(evidenceEvent?.id).toBe(evidenceEvent?.evidenceId);
    expect(evidenceEvent?.evidenceId).not.toMatch(/^artifact-/);
    expect(JSON.stringify(report)).not.toContain('.hadara/local');
    expect(validateSchema('hadara.dashboard.timeline.v1', report).ok).toBe(true);
  });
});
