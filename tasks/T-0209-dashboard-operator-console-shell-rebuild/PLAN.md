# Plan

| Step | Status | Evidence |
|---|---|---|
| Build the data layer (normalize + bootstrap-first fallback + abort timeout). | Done | dashboard/src/model.ts. |
| Build the shell (sidebar, topbar verdict/provenance, responsive grid, skeletons). | Done | dashboard/src/app.tsx, ui.tsx, app.css. |
| Verify one verdict + one provenance + no chip strips. | Done | Visual gate checks. |
| Confirm no browser-persisted project state and AA a11y on home. | Done | Visual gate + axe home pass. |

## Post-Review Fix Pass (2026-06-02)

Hands-on Docker UX review (`docs/specs/dashboard/HADARA_Dashboard_Phase5_6_UX_Diagnosis.md`) found shell-level gaps; fixed here:

| Finding | Fix | Evidence |
|---|---|---|
| F-1 (regression) sidebar tabs changed only highlight | `renderView` now renders distinct content per view (board/capsule/evidence/handoff/harness/mcp/release) with per-view title/subtitle. | Probe: Board→counts-grid, Handoff→row-list, Harness→view-note; content differs Home↔Harness. |
| F-2 degraded banner unreachable | Split live (`loadLiveRuntime`) vs fallback (`loadFallbackRuntime`); refresh failure retains last good live view + raises degraded banner; initial-only fallback shows offline banner. | Probe: live→fail→Refresh shows "Refresh failed — showing the last good live read"; Retry recovers. |
| F-3 + loading optimization | Per-source timeout 6s→2.5s; instant inline preview at 350 ms; `syncing…` indicator; Refresh disabled while busy. | Skeleton-first preserved; preview skipped on fast loads. |
| F-6 mobile nav cramped | Sticky horizontal scrolling nav strip under 768 px. | `ux-evidence/fix-mobile.png`. |

## Loading Performance Fix (2026-06-02)

Reviewer saw `53` (offline sample) instead of live `203`. Root cause: a ~26 s uncached bootstrap read on `/mnt/f` (NTFS/WSL2) was aborted by the 2.5 s client timeout → permanent offline fallback; the timeline also re-ran ops-status/task-list (double scan).

| Fix | File | Result |
|---|---|---|
| Timeline reuses precomputed status/task-list (optional `deps`) | `src/services/dashboard-timeline.ts`, `src/services/dashboard-bootstrap.ts` | 26 s → ~17 s |
| Client fetch timeout 2.5 s → 30 s (live completes, upgrades inline preview) | `dashboard/src/model.ts` | live 203 loads (~16 s) instead of stuck offline |
| Cache TTLs raised (bootstrap/timeline 15 s, taskDetail 30 s) | `src/services/dashboard-cache.ts` | warm navigation/refresh |
| Recommendation | — | serve from WSL-native ext4 for ~175 ms first load (vs ~17 s on `/mnt/f`) |

Verified end-to-end: offline preview @~1.1 s → LIVE (203 tasks, 5 activity events) @~16 s; Docker suite 84 files / 562 tests.

## Progressive (Tiered) Loading (2026-06-02)

Answer to "show available data fast and finish loading the rest in the background." Debt is ~15s of the ~25s read, so it is deferred.

| Change | File | Effect |
|---|---|---|
| `createOpsStatusReport(root, { includeDebt:false })` | `src/services/operations-status-service.ts` | skips the dominant operational-debt scan |
| `createDashboardBootstrapReport(root, { tier:'core' })` → `debtSummary.pending`, `tier` | `src/services/dashboard-bootstrap.ts` | fast core report |
| `GET /api/dashboard/bootstrap?tier=core` (own cache key) | `src/cli/dashboard.ts` | served core tier |
| `loadLiveRuntime` requests core; `loadDebt()` backfills | `dashboard/src/model.ts` | core-first, debt background |
| background debt merge | `dashboard/src/app.tsx` | merges debt into in-memory view |
| "Open debt" tile shows `loading…` until backfilled | `dashboard/src/ui.tsx` | honest pending state |

Measured (`/mnt/f`): core ~4.5s (real 203 tasks + activity) vs full ~25s; debt backfills ~15s later. ~5.6× faster first live paint. Docker 84/562 pass; visual+a11y green.
