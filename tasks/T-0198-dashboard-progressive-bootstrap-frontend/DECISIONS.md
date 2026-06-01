# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep `/api/status -> fixture -> inline` as fallback after bootstrap failure. | Accepted | T-0198 should improve first paint without removing Phase 5 resilience. | `loadDashboardWithFallback()` falls back to `loadStatusWithFallback()`. |
| D-2 | Use in-memory previous successful state only. | Accepted | Phase 5.5 forbids browser project-state persistence while still wanting degraded refresh behavior. | `lastSuccessfulRuntimeState` is a JS variable only. |
| D-3 | Keep selected-task detail fan-out until T-0199. | Accepted | T-0198 scope is first-paint progressive loading; task-detail aggregate is the next capsule. | `selectTask()` still reads workbench/lint/evidence separately. |
