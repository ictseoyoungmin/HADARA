import { describe, expect, it } from 'vitest';
import { validateSchema } from '../../src/core/schema';

function sampleCoreReport() {
  return {
    schemaVersion: 'hadara.dashboard.core.v1',
    command: 'dashboard.core',
    ok: true,
    generatedAt: '2026-06-02T00:00:00.000Z',
    source: {
      kind: 'projection',
      label: 'Local dashboard projection',
      projectRootRedacted: true,
      project: {
        kind: 'project-root',
        pathRedacted: true,
        fingerprint: 'sha256:012345abcdef'
      }
    },
    projection: {
      freshness: 'stale',
      completeness: 'core',
      refreshState: 'refreshing',
      generatedAt: '2026-06-02T00:00:00.000Z',
      pendingSections: ['timeline', 'debt'],
      staleSections: ['timeline'],
      sourceSignals: {
        taskBoard: 'known',
        handoff: 'known',
        projectState: 'known',
        capsules: 'checking',
        debt: 'checking'
      }
    },
    core: {
      health: 'ok',
      taskSummary: {
        total: 203,
        counts: { done: 203, partial: 0 },
        lastCompleted: ['T-0215'],
        nextRecommended: 'T-0216 Dashboard Projection Contract',
        recent: [{ id: 'T-0215', title: 'Phase 5.6 Close / Handoff Sync', status: 'Done' }]
      },
      handoffSummary: {
        currentState: ['Phase 5.7 starts with T-0216.'],
        knownProblems: ['Slow /mnt/f cold reads remain until projections land.'],
        nextRecommendedStep: ['Start T-0216 Dashboard Projection Contract.']
      },
      validationSummary: {
        latestFullCheck: 'Phase 5.6 Docker validation passed with 84 files / 562 tests.'
      }
    },
    issues: []
  };
}

describe('dashboard core projection contract', () => {
  it('accepts a first-actionable core projection with freshness metadata', () => {
    const report = sampleCoreReport();

    expect(validateSchema('hadara.dashboard.core.v1', report)).toMatchObject({ ok: true });
  });

  it('requires explicit projection freshness so stale data cannot masquerade as live state', () => {
    const report = sampleCoreReport();
    delete (report.projection as Partial<typeof report.projection>).freshness;

    const result = validateSchema('hadara.dashboard.core.v1', report);

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: '$.projection.freshness',
          code: 'SCHEMA_REQUIRED_MISSING'
        })
      ])
    );
  });
});
