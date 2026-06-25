# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Legacy dashboard `/api/debt` no longer runs the full operational-debt scan on the dashboard API hot path. | Met | `src/cli/dashboard.ts` |
| AC-2 | Dashboard API route tests are aligned to the fast debt projection contract. | Met | `tests/unit/dashboard-static.test.ts`; `ev:T-0421:98e0dd670b3c489484bdebfb` |
| AC-3 | Clean-checkout validation confirms `npm run check` no longer fails at the dashboard API route timeout. | Met | `ev:T-0421:88bc742a31814e089efcdb66` |
| AC-4 | Release retry remains assigned to T-0418, not this hotfix capsule. | Met | `HANDOFF.md`; `docs/AGENT_HANDOFF.md` |
