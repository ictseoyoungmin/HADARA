import { describe, expect, it } from 'vitest';
import { analyzeAcceptanceReadiness } from '../../src/task/acceptance';

describe('acceptance readiness parser', () => {
  it('keeps legacy acceptance tables strict by default', () => {
    const report = analyzeAcceptanceReadiness(`# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Finish the required work. | In Progress | TBD |
`);

    expect(report.summary).toMatchObject({
      total: 1,
      required: 1,
      unresolvedRequired: 1
    });
    expect(report.blockers).toEqual([
      expect.objectContaining({
        code: 'ACCEPTANCE_REQUIRED_UNRESOLVED',
        row: expect.objectContaining({ id: 'AC-1', required: true, deferrable: false, status: 'In Progress' })
      })
    ]);
  });

  it('allows a non-required deferrable follow-up row with decision and follow-up references', () => {
    const report = analyzeAcceptanceReadiness(`# Acceptance Criteria

| ID | Criterion | Origin | Required | Deferrable | Status | Evidence | Decision / Risk / Follow-up |
|---|---|---|---|---|---|---|---|
| AC-1 | Core scope is complete. | original | Yes | No | Met | ev:T-0386:abc123 | |
| AC-2 | Parser-backed migration can be richer later. | discovered | No | Yes | Follow-up Created | ev:T-0386:def456 | D-0386-01; T-0399 |
`);

    expect(report.blockers).toEqual([]);
    expect(report.summary).toMatchObject({
      total: 2,
      required: 1,
      met: 1,
      followUps: 1
    });
  });

  it('blocks non-deferrable deferred acceptance and unsupported accepted risk rows', () => {
    const report = analyzeAcceptanceReadiness(`# Acceptance Criteria

| ID | Criterion | Origin | Required | Deferrable | Status | Evidence | Decision / Risk / Follow-up |
|---|---|---|---|---|---|---|---|
| AC-1 | Required scope cannot move. | original | Yes | No | Deferred | ev:T-0386:abc123 | D-0386-01 |
| AC-2 | Risk needs an explicit risk record. | discovered | No | Yes | Accepted Risk | ev:T-0386:def456 | D-0386-02 |
`);

    expect(report.blockers.map((blocker) => blocker.code)).toEqual(
      expect.arrayContaining(['ACCEPTANCE_NONDEFERRABLE_DEFERRED', 'ACCEPTANCE_ACCEPTED_RISK_WITHOUT_RISK_RECORD'])
    );
  });
});
