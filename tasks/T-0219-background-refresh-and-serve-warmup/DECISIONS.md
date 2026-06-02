# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep refresh status in process memory. | Accepted | Refresh state is operational server metadata, while projection bodies remain in ignored local cache files. | `src/services/dashboard-refresh.ts`. |
| D-2 | Make projection status metadata-only. | Accepted | Status should reveal freshness/presence without leaking cached report bodies or private paths. | `/api/dashboard/projection/status` and tests. |
| D-3 | Coalesce concurrent refresh triggers. | Accepted | Multiple UI refresh/status reads should not spawn duplicate background refreshes. | `triggerDashboardProjectionRefresh`. |
| D-4 | Warm only core projection in T-0219. | Accepted | Timeline/debt and incremental task projections belong to T-0221/T-0220. | T-0219 out-of-scope. |
