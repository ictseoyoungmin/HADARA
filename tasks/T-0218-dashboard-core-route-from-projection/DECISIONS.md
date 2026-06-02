# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Build core task summaries from `docs/TASK_BOARD.md` rows. | Accepted | T-0218 must avoid broad capsule scans; Task Board is the bounded source until incremental task projection exists. | `src/services/dashboard-core.ts`. |
| D-2 | Write `core/index.json` on cheap live core recompute and serve it on warm reads. | Accepted | Gives fast first reads after route warmup without adding T-0219 background workers yet. | `/api/dashboard/core` route and tests. |
| D-3 | Mark warm projection freshness as `unknown`. | Accepted | Source-signal validation is not implemented until later Phase 5.7 slices, so the route should not overclaim freshness. | `reportFromProjection`. |
