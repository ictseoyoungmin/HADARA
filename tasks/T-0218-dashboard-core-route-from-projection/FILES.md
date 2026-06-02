# Files

| Path | Action | Reason | Status |
|---|---|---|---|
| `src/services/dashboard-core.ts` | Added | Build `hadara.dashboard.core.v1` from bounded docs and local projection summaries, with projection warm reads. | Done |
| `src/cli/dashboard.ts` | Updated | Add `/api/dashboard/core` route and `?cache=bypass` projection recompute behavior. | Done |
| `tests/unit/dashboard-core-route.test.ts` | Added | Verify core route shape, projection warm reads, bypass, HEAD/POST behavior, and no task-capsule scan. | Done |
| `docs/DASHBOARD_READ_MODEL_CONTRACT.md` | Updated | Document T-0218 core route semantics. | Done |
| `docs/TEST_STRATEGY.md` | Updated | Add Phase 5.7 core route validation expectations. | Done |
| `tasks/T-0218-dashboard-core-route-from-projection/*` | Updated | Record plan/context/acceptance/files/tests/risks/decisions/handoff for capsule closure. | In Progress |
