# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0223 |
| Status | Done |
| Last Updated | 2026-06-02 |

## Last Completed

| Item | Evidence |
|---|---|
| Projection visual/a11y gate extended | `dashboard/visual-check.mjs` now stubs `/api/dashboard/core`, `/api/dashboard/timeline`, `/api/dashboard/debt`, and `/api/dashboard/projection/status` with redacted fixtures and captures projection-ready/detail/stale/refreshing/missing/offline/degraded states. |
| Static validation added | `tests/unit/dashboard-static.test.ts` checks projection fixture schema/redaction and visual gate route/state coverage. |
| Dependency blockers resolved through Docker | Docker sync-build passed 90 files / 585 tests with built CLI smoke `ok:true`; Docker dashboard build rebuilt served HTML; Docker visual/a11y gate passed all projection states. |
| Serve-start blocking refresh follow-up applied | `warmDashboardProjections` now schedules delayed core-only warmup, so first dashboard requests are no longer queued behind immediate task/timeline/debt projection scans; manual refresh yields between task/heavy/core stages. |
| Selected detail unavailable follow-up fixed | `/api/dashboard/task-detail?taskId=T-0223` now uses selected-task fast workbench data and task-scoped timeline events; built `dist` smoke returned `statusCode:200`, `ok:true`, `closeState:closed-valid` in 1852 ms. |
| Summary table parsing follow-up fixed | Dashboard core and operations status handoff section parsing now skip Markdown table headers/delimiters and summarize actual data rows. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Maintain Docker validation/build as the authoritative path while host dependencies are absent. | Follow-up Docker sync-build, dashboard build, visual/a11y gate, selected-detail smoke, and handoff parsing smoke all passed; host `node_modules` remains absent. | `docs/TEST_STRATEGY.md`, `tasks/T-0223.../TESTS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Host dependency gap remains. | Host `vitest`/`esbuild` commands still fail without local `node_modules`. | Use Docker validation/build workflows unless host dependencies are intentionally installed. |
| Manual projection refresh stages remain internally synchronous. | Explicit refresh can still block during an individual broad projection stage. | Future core refactor should chunk task discovery/stat walks or offload projection rebuilds if `/mnt/f` metadata cost remains too high. |
| Detail fast path intentionally does not run global protocol doctors. | Capsule detail now stays responsive by avoiding docs/profile all-scope checks on click. | Use `task ready`, `task close`, and `task audit-close` for closure-grade protocol validation; dashboard detail remains read-only selected-capsule proof display. |
