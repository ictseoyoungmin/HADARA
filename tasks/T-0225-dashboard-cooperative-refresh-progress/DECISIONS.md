# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep `/api/dashboard/refresh` as a non-blocking trigger/status endpoint. | Accepted | The browser must never wait for projection rebuild completion before showing current state. | `src/services/dashboard-refresh.ts`, built route smoke. |
| D-2 | Report progress on the refresh state object, not as cached projection bodies. | Accepted | Status remains metadata-only and does not expose cached report bodies. | `DashboardProjectionStatusReport.refresh`. |
| D-3 | Use cheap timestamp/progress-derived freshness for dashboard status. | Accepted | Avoids reintroducing all-capsule scans into core/status reads. | `projectionFreshness` in `src/services/dashboard-refresh.ts`. |
| D-4 | UI Refresh triggers projection refresh rather than core bypass. | Accepted | Core bypass is a live recompute path; manual UI refresh should keep stale/current UI visible while background refresh runs. | `dashboard/src/app.tsx`, `dashboard-static.test.ts`. |
