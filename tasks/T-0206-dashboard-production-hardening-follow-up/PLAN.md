# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read dashboard hardening request and current dashboard/cache/read-model surfaces. | Done | Inspected dashboard services, schemas, static HTML, and tests. |
| 2 | Implement project-fingerprinted dashboard cache keys and redacted project source metadata. | Done | `src/services/dashboard-cache.ts`, dashboard aggregate services, schemas, and tests updated. |
| 3 | Fix sidebar navigation so non-Home entries switch dashboard views. | Done | `docs/design/dashboard/index.html` now has `data-view-target`, `data-view-section`, active-view state, and debug snapshot visibility. |
| 4 | Polish first-viewport screenshot issues around long badges/source chips. | Done | Badge/source-chip max widths and ellipsis added. |
| 5 | Run validation. | Done | `npm run dev:docker-sync-build` passed with 84 files and 563 tests. |
| 6 | Attach evidence and close capsule. | Partial | Evidence attached; finish/close pending. |
