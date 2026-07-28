import { describe, expect, it } from 'vitest';
import {
  HADARA_ACTOR_ROLES,
  HADARA_MULTI_AGENT_ISSUE_CODES,
  resolveHadaraActorContext
} from '../../src/core/actor-context';
import { createHadaraPlanContext } from '../../src/core/plan-context';
import { HADARA_WRITE_BOUNDARIES, type HadaraNextAction } from '../../src/core/next-action';

describe('Phase 6 multi-agent command context contract', () => {
  it('defaults missing actor context and reports HADARA_ACTOR_CONTEXT_DEFAULTED', () => {
    const report = resolveHadaraActorContext();

    expect(report.actor).toEqual({
      agentId: 'unknown',
      runId: 'local',
      role: 'operator',
      parentRunId: null
    });
    expect(report.issues).toEqual([
      {
        severity: 'warning',
        code: 'HADARA_ACTOR_CONTEXT_DEFAULTED',
        message: 'Actor context defaulted field(s): agentId, runId, role, parentRunId.',
        fields: ['agentId', 'runId', 'role', 'parentRunId']
      }
    ]);
  });

  it('accepts explicit actor context without defaulting issues', () => {
    const report = resolveHadaraActorContext({
      agentId: 'worker-1',
      runId: 'run-0253',
      role: 'worker',
      parentRunId: 'coordinator-run'
    });

    expect(report.actor).toEqual({
      agentId: 'worker-1',
      runId: 'run-0253',
      role: 'worker',
      parentRunId: 'coordinator-run'
    });
    expect(report.issues).toEqual([]);
  });

  it('exports the Phase 6 role, issue-code, and write-boundary vocabularies', () => {
    expect(HADARA_ACTOR_ROLES).toEqual(['operator', 'coordinator', 'worker', 'reviewer', 'unknown']);
    expect(HADARA_WRITE_BOUNDARIES).toContain('shared-doc');
    expect(HADARA_WRITE_BOUNDARIES).toContain('task-close-transaction');
    expect(HADARA_WRITE_BOUNDARIES).toContain('release-mutation');
    expect(HADARA_MULTI_AGENT_ISSUE_CODES).toContain('HADARA_SHARED_DOC_WRITE_REQUIRES_BEFORE_HASH');
  });

  it('creates unreviewed plan metadata with affected files and optional idempotency', () => {
    expect(
      createHadaraPlanContext({
        generatedAt: '2026-06-05T00:00:00.000Z',
        affectedFiles: ['docs/AGENT_HANDOFF.md'],
        beforeHash: 'sha256:abc',
        idempotencyKey: 'task-close-bookkeeping:T-0253'
      })
    ).toEqual({
      planId: 'plan_f0fdb914728c9a25',
      generatedAt: '2026-06-05T00:00:00.000Z',
      affectedFiles: ['docs/AGENT_HANDOFF.md'],
      beforeHash: 'sha256:abc',
      idempotencyKey: 'task-close-bookkeeping:T-0253',
      reviewed: false
    });
  });

  it('defines next actions with actor-role and stale-plan metadata', () => {
    const nextAction: HadaraNextAction = {
      id: 'finish-first',
      command: 'hadara task close --task T-0253 --json',
      summary: 'Preview finish writes before done-level readiness.',
      required: true,
      writeBoundary: 'task-local',
      recommendedActorRole: 'worker',
      requiresBeforeHash: false,
      stalePlanRisk: 'low'
    };

    expect(nextAction.writeBoundary).toBe('task-local');
    expect(nextAction.recommendedActorRole).toBe('worker');
  });
});
