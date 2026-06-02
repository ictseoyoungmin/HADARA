# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Try `/api/dashboard/core` before bootstrap/status. | Accepted | Core route is the Phase 5.7 first-actionable read path. | `dashboard/src/model.ts`. |
| D-2 | Treat projection source as live local read. | Accepted | Projection is not an offline fixture; provenance should not show stale sample labels. | `isLiveSource`. |
| D-3 | Backfill timeline independently from `/api/dashboard/timeline`. | Accepted | Activity should merge after core rather than blocking first render. | `dashboard/src/app.tsx`. |
| D-4 | Defer static bundle rebuild until dependencies/Docker are available. | Accepted | Host build lacks esbuild and Docker escalation is blocked by usage limit. | TESTS/RISKS. |
