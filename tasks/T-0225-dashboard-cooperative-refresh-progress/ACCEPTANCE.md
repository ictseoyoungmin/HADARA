# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `/api/dashboard/core` returns current projection state without awaiting refresh completion, including stale/pending metadata for incomplete sections. | Done | Built route smoke returned core during refresh with `refreshState:"refreshing"`, `freshness:"stale"`, and stale/pending sections. |
| AC-2 | Task projection rebuild processes tasks in batches and yields between batches while updating progress. | Done | `dashboard-task-projection.test.ts` async batch progress test passed. |
| AC-3 | `/api/dashboard/projection/status` and `/api/dashboard/refresh` expose `currentStage`, `processed`, `total`, and `lastYieldAt`. | Done | `dashboard-refresh.test.ts` and built route smoke observed progress fields. |
| AC-4 | Dashboard UI Refresh triggers projection refresh and keeps stale/current UI visible instead of waiting for completion. | Done | `dashboard/src/app.tsx` uses `triggerProjectionRefresh()` then current core read; static test pins `/api/dashboard/refresh` and rejects `load({ bypass: true })`. |
| AC-5 | Focused tests cover backend progress/yield behavior and frontend route expectations. | Done | Focused Docker tests passed 3 files / 22 tests. |
| AC-6 | Evidence is attached and handoff/state docs are updated. | Done | Evidence appended at 2026-06-03T04:57:30.420Z; project state, slices, handoff, and capsule docs updated. |
