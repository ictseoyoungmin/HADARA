# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0222 |
| Status | Done |
| Last Updated | 2026-06-02 |

## Last Completed

| Item | Evidence |
|---|---|
| Updated authored frontend data layer. | `dashboard/src/model.ts` now loads core first and projection debt/timeline routes for heavy sections. |
| Updated app merge behavior. | `dashboard/src/app.tsx` backfills timeline after core render. |
| Updated static source expectation. | `tests/unit/dashboard-static.test.ts` checks core-before-bootstrap authored source order. |
| Closed build validation gap. | Docker dashboard build rebuilt served HTML; Docker sync-build passed 90 files / 586 tests with built CLI smoke `ok:true`. |
| Serve-start warmup blocker clarified. | Authored source is core-first, but first paint also depends on the served bundle being rebuilt and the server event loop not being monopolized by warmup; T-0219 now uses delayed core-only warmup. |
| Selected detail follow-up fixed. | `/api/dashboard/task-detail?taskId=T-0223` now uses selected-task fast workbench/timeline data and returned `ok:true` in 1852 ms in built `dist` smoke. |
| Handoff table parsing fixed. | Dashboard handoff summaries now parse table data rows instead of surfacing Markdown header text such as `| Area | State | Notes |`. |
| Evidence label follow-up fixed. | Evidence cards now display `kind/result/visibility` instead of `unknown/public` when canonical evidence records lack semantic-strength fields. |
| Stale projected timeline header follow-up fixed. | `/api/dashboard/timeline` sanitizes cached projection header summaries at read time, so Home activity no longer depends solely on projection refresh timing. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Keep projection/detail validation current when frontend routes change. | Core-first and selected-detail paths are validated through Docker and built `dist` smokes, but future frontend route changes should preserve those assumptions. | `dashboard/src/model.ts`, `dashboard/src/app.tsx`, `src/services/dashboard-task-detail.ts`, `tests/unit/dashboard-static.test.ts`, T-0222 TESTS/RISKS, Phase 5.7 spec. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Host build remains dependency-sensitive. | Host `npm run dashboard:build` still needs local `node_modules`. | Use `npm run dashboard:build:docker` unless host dependencies are intentionally installed. |
