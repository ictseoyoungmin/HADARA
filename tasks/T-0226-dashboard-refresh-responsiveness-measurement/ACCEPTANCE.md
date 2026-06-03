# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `/api/dashboard/projection/status` exposes current stage timing and completed stage duration metadata: `stageStartedAt`, `stageFinishedAt`, `stageDurationMs`, `stageDurations`, and `slowStageWarnings`. | Done | Focused Docker tests; `src/services/dashboard-refresh.ts`. |
| AC-2 | A repeatable dashboard refresh measurement command records `/api/dashboard/core` p50/p95 during refresh, task-signals progress samples, stage durations, and optional `/mnt/f` vs `/tmp` comparison. | Done | Built measurement smoke evidence. |
| AC-3 | Measurement docs describe how to identify whether blocking comes from core, task-signals, timeline, debt, or core-final. | Done | `docs/DASHBOARD_REFRESH_RESPONSIVENESS_MEASUREMENT.md`. |
| AC-4 | Focused tests cover refresh duration metadata and the measurement script contract. | Done | Focused Docker tests passed 4 files / 23 tests. |
| AC-5 | Evidence is attached through HADARA evidence commands and handoff is updated. | Done | Evidence entries plus close/audit-close passed; project handoff updated. |
