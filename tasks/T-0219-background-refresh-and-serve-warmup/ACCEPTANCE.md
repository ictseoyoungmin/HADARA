# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Serve-start warmup trigger exists without immediate heavy projection refresh. | Done | `serveDashboard` calls `warmDashboardProjections(projectRoot)` after listen; warmup now schedules a delayed core-only projection refresh so task/timeline/debt scans do not start on the first event-loop tick. |
| AC-2 | Refresh/status read surfaces exist. | Done | `/api/dashboard/refresh` and `/api/dashboard/projection/status` added in `src/cli/dashboard.ts`. |
| AC-3 | Refresh state is read-only metadata and coalesces concurrent triggers. | Done | `src/services/dashboard-refresh.ts`; focused test covers accepted/accepted:false behavior, metadata-only status, and yielded manual refresh stages. Manual `/api/dashboard/refresh` performs full projection refresh as task, heavy, and core stages separated by event-loop yields. |
| AC-4 | Tests or explicit constraints are recorded. | Done | Focused test file added; host Vitest unavailable and Docker approval limit recorded. |
| AC-5 | Evidence is attached. | Done | Public command evidence attached with `evidence.add-command` at 2026-06-02T03:14:16.983Z. |
| AC-6 | Handoff is updated. | Done | Task handoff records T-0220 as next step; follow-up validation evidence records the later Docker sync-build pass. |
