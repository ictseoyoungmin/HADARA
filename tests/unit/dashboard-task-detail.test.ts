import { describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';
import { createDashboardTaskDetailReport } from '../../src/services/dashboard-task-detail';

describe('dashboard task detail read model', () => {
  it('builds a selected-task aggregate from shared read models', () => {
    const report = createDashboardTaskDetailReport(process.cwd(), 'T-0198', new Date('2026-06-01T00:00:00.000Z'));

    expect(report).toMatchObject({
      schemaVersion: 'hadara.dashboard.task_detail.v1',
      command: 'dashboard.task-detail',
      taskId: 'T-0198',
      generatedAt: '2026-06-01T00:00:00.000Z',
      source: {
        kind: 'live-api',
        readOnly: true
      },
      workbench: {
        schemaVersion: 'hadara.task.workbench.v1',
        task: expect.objectContaining({ id: 'T-0198' })
      },
      evidenceLint: {
        schemaVersion: 'hadara.evidence.lint.v1',
        taskId: 'T-0198'
      },
      evidenceList: {
        schemaVersion: 'hadara.evidence.list.v1',
        taskId: 'T-0198'
      },
      timeline: {
        schemaVersion: 'hadara.dashboard.timeline.v1',
        taskId: 'T-0198'
      },
      proof: expect.objectContaining({
        status: expect.stringMatching(/^(sufficient|weak|failed|blocked|private-only|unknown)$/),
        blocking: expect.any(Boolean),
        auditabilityWarning: expect.any(Boolean)
      })
    });
    expect(report.commandGuidance.every((action) => action.readOnly === true)).toBe(true);
    expect(JSON.stringify(report)).not.toContain('.hadara/local');
    expect(validateSchema('hadara.dashboard.task_detail.v1', report).ok).toBe(true);
  });

  it('degrades missing task detail requests through aggregate issues', () => {
    const report = createDashboardTaskDetailReport(process.cwd(), 'T-9999', new Date('2026-06-01T00:00:00.000Z'));

    expect(report.ok).toBe(false);
    expect(report.proof.status).toBe('unknown');
    expect(report.proof.auditabilityWarning).toBe(false);
    expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ code: 'EVIDENCE_LINT_TASK_NOT_FOUND' })]));
    expect(validateSchema('hadara.dashboard.task_detail.v1', report).ok).toBe(true);
  });
});
