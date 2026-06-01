# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | First render uses `/api/dashboard/bootstrap` and no longer waits for selected-task detail. | Done | HTML uses `loadDashboardWithFallback()` over `liveBootstrapUrl`; selected-task detail remains async and separate. |
| AC-2 | Dashboard renders agent lane, workstream, and task summary from bootstrap when available. | Done | `render()` unwraps `hadara.dashboard.bootstrap.v1` and uses `taskSummary` plus `timelineOverview`. |
| AC-3 | Refresh does not blank previous view on failure. | Done | `lastSuccessfulRuntimeState` keeps the previous in-memory view when refresh throws. |
| AC-4 | Stale Workstream subtitle is replaced. | Done | Subtitle now describes bootstrap timeline overview and selected-task detail split. |
| AC-5 | Browser storage is not used for project state. | Done | Tests keep `localStorage`, `indexedDB`, and related storage patterns forbidden. |
| AC-6 | Existing live/fixture/inline fallback behavior remains. | Done | `loadStatusWithFallback()` remains as fallback after bootstrap read failure. |
