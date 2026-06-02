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
| Recorded build validation gap. | Host dashboard build failed due missing esbuild; Docker escalation remains blocked. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start T-0223 Projection Validation and Visual/A11y States. | Authored frontend now points at projection routes, but static bundle rebuild and visual/a11y validation remain blocked/pending. | `dashboard/src/model.ts`, `dashboard/src/app.tsx`, `tests/unit/dashboard-static.test.ts`, T-0222 TESTS/RISKS, Phase 5.7 spec. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Static dashboard bundle was not rebuilt for T-0222. | Served dashboard HTML may not reflect core/heavy merge source changes. | T-0223 must rebuild via Docker/deps before visual/a11y lock if approval/usage is available. |
| Full Docker sync-build did not run for T-0222. | TypeScript/Vitest regressions may remain until Docker validation is available. | Run `npm run dev:docker-sync-build` during T-0223 and include all Phase 5.7 projection/frontend tests. |
