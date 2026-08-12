import { describe, expect, it } from 'vitest';
import { EvidenceIndexRecord, EvidenceV2IndexRecord } from '../../src/evidence/evidence';
import { normalizeEvidenceRecord } from '../../src/evidence/normalizer';
import {
  analyzeTaskEvidenceSemantics,
  classifyEvidenceStrength,
  findUnresolvedFailedEvidence,
  findUnexplainedBlockedEvidence,
  isLegacyReleaseProofEvidence,
  isReleaseProofEvidence,
  summarizeEvidenceSemantics
} from '../../src/evidence/semantics';

function v1(overrides: Partial<EvidenceIndexRecord> = {}): EvidenceIndexRecord {
  return {
    schemaVersion: 'hadara.evidence.v1',
    time: '2026-06-01T00:00:00.000Z',
    taskId: 'T-0001',
    kind: 'command-log',
    summary: 'npm run check passed',
    result: 'passed',
    visibility: 'public',
    ...overrides
  };
}

function v2(overrides: Partial<EvidenceV2IndexRecord> = {}): EvidenceV2IndexRecord {
  return {
    schemaVersion: 'hadara.evidence.v2',
    id: 'ev:T-0001:aaaaaaaaaaaaaaaaaaaaaaaa',
    fingerprint: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    idSource: 'persisted',
    idStability: 'durable',
    time: '2026-06-01T00:00:00.000Z',
    taskId: 'T-0001',
    category: 'validation',
    outcome: 'passed',
    visibility: 'public',
    summary: 'npm run check passed',
    artifacts: [],
    tags: [],
    legacy: { kind: 'command-log', result: 'passed' },
    ...overrides
  };
}

describe('evidence semantics', () => {
  it('classifies core strength categories', () => {
    expect(classifyEvidenceStrength(normalizeEvidenceRecord(v1({ kind: 'test-log', result: 'passed' })))).toBe('substantive-positive');
    expect(classifyEvidenceStrength(normalizeEvidenceRecord(v1({ kind: 'diff-summary', result: 'passed' })))).toBe('substantive-positive');
    expect(classifyEvidenceStrength(normalizeEvidenceRecord(v1({ kind: 'note', result: 'passed' })))).toBe('record-only');
    expect(classifyEvidenceStrength(normalizeEvidenceRecord(v1({ kind: 'note', result: 'unknown' })))).toBe('weak');
    expect(classifyEvidenceStrength(normalizeEvidenceRecord(v1({ kind: 'test-log', result: 'failed' })))).toBe('substantive-negative');
    expect(classifyEvidenceStrength(normalizeEvidenceRecord(v1({ kind: 'test-log', result: 'blocked' })))).toBe('blocked');
  });

  it('summarizes records by strength, category, outcome, visibility, and latest substantive evidence', () => {
    const records = [
      normalizeEvidenceRecord(v1({ kind: 'test-log', result: 'passed', visibility: 'public' }), { lineNumber: 1 }),
      normalizeEvidenceRecord(v1({ kind: 'note', result: 'unknown', visibility: 'private' }), { lineNumber: 2 })
    ];

    const summary = summarizeEvidenceSemantics(records);

    expect(summary.total).toBe(2);
    expect(summary.byStrength['substantive-positive']).toBe(1);
    expect(summary.byStrength.weak).toBe(1);
    expect(summary.byCategory.validation).toBe(1);
    expect(summary.byOutcome.passed).toBe(1);
    expect(summary.publicRecords).toBe(1);
    expect(summary.privateRecords).toBe(1);
    expect(summary.legacyRecords).toBe(2);
    expect(summary.latestSubstantiveEvidenceId).toBe(records[0].id);
  });

  it('reports note-only Done tasks as weak evidence', () => {
    const records = [normalizeEvidenceRecord(v1({ kind: 'note', result: 'passed', summary: 'manual note' }))];

    const analysis = analyzeTaskEvidenceSemantics({
      taskId: 'T-0001',
      taskDir: 'tasks/T-0001',
      taskLooksDone: true,
      records
    });

    expect(analysis.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['TASK_DONE_WITHOUT_SUBSTANTIVE_EVIDENCE', 'TASK_DONE_WITH_ONLY_WEAK_EVIDENCE'])
    );
  });

  it('does not report a semantic blocker for substantive passed validation evidence', () => {
    const analysis = analyzeTaskEvidenceSemantics({
      taskId: 'T-0001',
      taskDir: 'tasks/T-0001',
      taskLooksDone: true,
      records: [normalizeEvidenceRecord(v1({ kind: 'test-log', result: 'passed', summary: 'vitest passed' }))]
    });

    expect(analysis.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
  });

  it('requires exact markers or later passed same-category evidence to resolve failed evidence', () => {
    const failed = normalizeEvidenceRecord(v1({ kind: 'test-log', result: 'failed', summary: 'vitest failed loudly' }), {
      lineNumber: 1
    });
    const freeTextOnly = normalizeEvidenceRecord(v1({ kind: 'note', result: 'passed', summary: 'fixed and rerun passed' }), {
      lineNumber: 2
    });
    const exactMarker = {
      ...normalizeEvidenceRecord(v1({ kind: 'note', result: 'passed', summary: `documented resolves:${failed.id}` }), {
        lineNumber: 3
      }),
      tags: [`resolves:${failed.id}`]
    };

    expect(findUnresolvedFailedEvidence([failed, freeTextOnly]).map((record) => record.id)).toEqual([failed.id]);
    expect(findUnresolvedFailedEvidence([failed, exactMarker])).toEqual([]);
    expect(
      findUnresolvedFailedEvidence([
        failed,
        normalizeEvidenceRecord(v1({ kind: 'test-log', result: 'passed', summary: 'vitest rerun passed' }), { lineNumber: 4 })
      ])
    ).toEqual([]);
  });

  it('keeps same-category resolution fallback legacy-only for persisted v2 evidence', () => {
    const failedV2 = normalizeEvidenceRecord(
      v2({
        id: 'ev:T-0001:failedfailedfailedfailed',
        outcome: 'failed',
        summary: 'vitest failed',
        legacy: { kind: 'command-log', result: 'failed' }
      }),
      { lineNumber: 1 }
    );
    const laterPassedV2 = normalizeEvidenceRecord(
      v2({
        id: 'ev:T-0001:passedpassedpassedpassed',
        outcome: 'passed',
        summary: 'vitest passed',
        legacy: { kind: 'command-log', result: 'passed' }
      }),
      { lineNumber: 2 }
    );
    const exactMarkerV2 = {
      ...laterPassedV2,
      tags: [`resolves:${failedV2.id}`]
    };

    expect(findUnresolvedFailedEvidence([failedV2, laterPassedV2]).map((record) => record.id)).toEqual([failedV2.id]);
    expect(findUnresolvedFailedEvidence([failedV2, exactMarkerV2])).toEqual([]);
  });

  it('requires exact v2 resolution markers to come from passed or recorded evidence', () => {
    const failedV2 = normalizeEvidenceRecord(
      v2({
        id: 'ev:T-0001:failedfailedfailedfailed',
        outcome: 'failed',
        summary: 'vitest failed',
        legacy: { kind: 'command-log', result: 'failed' }
      }),
      { lineNumber: 1 }
    );

    for (const outcome of ['failed', 'blocked', 'unknown', 'not-applicable'] as const) {
      const nonResolving = normalizeEvidenceRecord(
        v2({
          id: `ev:T-0001:${outcome.replace('-', '').padEnd(24, 'x').slice(0, 24)}`,
          outcome,
          summary: `${outcome} marker does not resolve`,
          tags: [`resolves:${failedV2.id}`],
          legacy: { kind: 'command-log', result: outcome === 'failed' || outcome === 'blocked' || outcome === 'unknown' ? outcome : 'unknown' }
        }),
        { lineNumber: 2 }
      );
      expect(findUnresolvedFailedEvidence([failedV2, nonResolving]).map((record) => record.id)).toContain(failedV2.id);
    }

    const passedResolution = normalizeEvidenceRecord(
      v2({
        id: 'ev:T-0001:passedpassedpassedpassed',
        outcome: 'passed',
        summary: 'passed marker resolves',
        tags: [`resolves:${failedV2.id}`],
        legacy: { kind: 'command-log', result: 'passed' }
      }),
      { lineNumber: 3 }
    );
    const recordedResolution = normalizeEvidenceRecord(
      v2({
        id: 'ev:T-0001:recordedrecordedrecord',
        category: 'decision',
        outcome: 'recorded',
        summary: 'recorded marker resolves',
        tags: [`supersedes:${failedV2.id}`],
        legacy: { kind: 'command-log', result: 'unknown' }
      }),
      { lineNumber: 4 }
    );

    expect(findUnresolvedFailedEvidence([failedV2, passedResolution])).toEqual([]);
    expect(findUnresolvedFailedEvidence([failedV2, recordedResolution])).toEqual([]);
  });

  it('reports unresolved failed evidence for Done tasks', () => {
    const failed = normalizeEvidenceRecord(v1({ kind: 'test-log', result: 'failed', summary: 'unit tests failed' }));

    const analysis = analyzeTaskEvidenceSemantics({
      taskId: 'T-0001',
      taskDir: 'tasks/T-0001',
      taskLooksDone: true,
      records: [failed]
    });

    expect(analysis.issues.map((issue) => issue.code)).toContain('TASK_DONE_WITH_FAILED_EVIDENCE');
  });

  it('requires blocked evidence explanation', () => {
    const blocked = normalizeEvidenceRecord(v1({ kind: 'test-log', result: 'blocked', summary: 'vitest unavailable' }));
    const explained = normalizeEvidenceRecord(v2({ id: 'ev:T-0001:blockedblockedblockedx', outcome: 'blocked', summary: 'vitest unavailable' }));
    const taskDocs = {
      risks: `| ID | Type | Summary | State | Link |\n|---|---|---|---|---|\n| RF-1 | Risk | Dependency is deferred. | Deferred | ${explained.id} |`
    };

    expect(findUnexplainedBlockedEvidence([blocked])).toEqual([blocked]);
    expect(findUnexplainedBlockedEvidence([explained], taskDocs)).toEqual([]);
  });

  it('does not resolve negated prose and requires exact structured risk links', () => {
    const failed = normalizeEvidenceRecord(v2({ id: 'ev:T-0001:failedfailedfailedfailed', outcome: 'failed', summary: 'command failed' }));
    const blocked = normalizeEvidenceRecord(v2({ id: 'ev:T-0001:blockedblockedblockedx', outcome: 'blocked', summary: 'command blocked' }));
    const negated = { risks: `The failure is not mitigated, not deferred, and not out of scope.` };
    const wrongLink = { risks: `| ID | Type | Summary | State | Link |\n|---|---|---|---|---|\n| RF-1 | Risk | Other issue | Mitigated | ev:T-0001:other |` };

    expect(findUnresolvedFailedEvidence([failed], negated)).toEqual([failed]);
    expect(findUnexplainedBlockedEvidence([blocked], negated)).toEqual([blocked]);
    expect(findUnresolvedFailedEvidence([failed], wrongLink)).toEqual([failed]);
  });

  it('treats exact resolution markers as blocked evidence explanation', () => {
    const blocked = normalizeEvidenceRecord(
      v2({
        id: 'ev:T-0001:blockedblockedblockedx',
        outcome: 'blocked',
        summary: 'runner unavailable',
        legacy: { kind: 'command-log', result: 'blocked' }
      }),
      { lineNumber: 1 }
    );
    const resolved = normalizeEvidenceRecord(
      v2({
        id: 'ev:T-0001:passedpassedpassedpassed',
        outcome: 'passed',
        summary: 'rerun passed',
        tags: [`resolves:${blocked.id}`],
        legacy: { kind: 'command-log', result: 'passed' }
      }),
      { lineNumber: 2 }
    );

    expect(findUnexplainedBlockedEvidence([blocked, resolved])).toEqual([]);
  });

  it('warns when Done tasks only have private substantive evidence', () => {
    const analysis = analyzeTaskEvidenceSemantics({
      taskId: 'T-0001',
      taskDir: 'tasks/T-0001',
      taskLooksDone: true,
      records: [normalizeEvidenceRecord(v1({ kind: 'test-log', result: 'passed', visibility: 'private' }))]
    });

    expect(analysis.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          severity: 'warning',
          code: 'TASK_DONE_WITH_PRIVATE_ONLY_EVIDENCE'
        })
      ])
    );
  });

  it('accepts supported public release evidence and rejects arbitrary command logs', () => {
    const releaseEvidence = normalizeEvidenceRecord(
      v1({
        kind: 'command-log',
        summary: 'release artifact built',
        result: 'passed',
        visibility: 'public',
        evidencePath: 'artifacts/release-artifact/report.json'
      })
    );
    const arbitraryCommand = normalizeEvidenceRecord(v1({ summary: 'listed files successfully', result: 'passed' }));

    expect(isReleaseProofEvidence(releaseEvidence)).toBe(true);
    expect(isLegacyReleaseProofEvidence(releaseEvidence)).toBe(true);
    expect(isReleaseProofEvidence(arbitraryCommand)).toBe(false);
    expect(isLegacyReleaseProofEvidence(arbitraryCommand)).toBe(false);
  });
});
