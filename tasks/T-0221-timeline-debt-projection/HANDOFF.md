# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0221 |
| Status | Done |
| Last Updated | 2026-06-02 |

## Last Completed

| Item | Evidence |
|---|---|
| Added timeline/debt projection service. | `src/services/dashboard-heavy-projection.ts` writes/reads redacted heavy projections. |
| Added projection-first heavy routes. | `/api/dashboard/timeline` and `/api/dashboard/debt` read cached projections or missing warnings. |
| Integrated manual background refresh. | `/api/dashboard/refresh` materializes task, timeline, debt, then core projections through yielded stages; serve-start warmup avoids this heavy path and refreshes core only. |
| Added focused tests. | `tests/unit/dashboard-heavy-projection.test.ts` covers redacted writes and missing-projection no-scan behavior. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start T-0222 Frontend Core + Heavy Merge. | Core, task, timeline, and debt projection routes now exist; frontend can render core first and merge heavy sections. | `dashboard/src/model.ts`, `src/cli/dashboard.ts`, `src/services/dashboard-core.ts`, `src/services/dashboard-heavy-projection.ts`, Phase 5.7 spec. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Full Docker sync-build did not run for T-0221 because Docker escalation remains blocked by usage limit. | TypeScript/Vitest regressions may remain until Docker validation is available. | Run `npm run dev:docker-sync-build` before or during T-0222 and include all Phase 5.7 projection tests. |
| Legacy heavy routes still compute live reads. | Existing consumers may remain slow until migration. | T-0222 moved authored frontend to `/api/dashboard/core`, `/api/dashboard/timeline`, and `/api/dashboard/debt`; rebuild the served bundle when dependency/Docker access is available. |
| Heavy projection stage remains internally synchronous. | Explicit refresh yields between major stages, but the heavy projection stage can still block while it runs. | Future core refactor should derive timeline/debt from compact projections or offload rebuilds to a worker if needed. |
