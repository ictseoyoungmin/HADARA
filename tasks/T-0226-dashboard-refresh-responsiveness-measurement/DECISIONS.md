# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep refresh responsiveness thresholds advisory and observable instead of making them hard test failures in this capsule. | Accepted | Mounted filesystem timing is environment-sensitive; T-0226 needs stable operations data and stage attribution before enforcing duration budgets. | `docs/DASHBOARD_REFRESH_RESPONSIVENESS_MEASUREMENT.md`; built measurement smoke evidence. |
| D-2 | Measure dashboard refresh through the built route handler and optional `/tmp` project-data copy. | Accepted | Direct route-handler measurement isolates core route responsiveness and event-loop gaps while the `/tmp` comparison highlights mounted-filesystem read costs. | `scripts/dashboard-refresh-responsiveness.mjs`; measurement smoke evidence. |
