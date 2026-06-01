# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Dashboard loading/API timings are measured in Playwright Docker. | Done | Measurement command produced `hadara.dashboard.performanceMeasurement.v1`. |
| AC-2 | Shell, bootstrap, task-detail, and timeline timings are recorded. | Done | `docs/DASHBOARD_PERFORMANCE_MEASUREMENT.md`. |
| AC-3 | Cache states are included. | Done | Report records bypass/miss/hit cache statuses. |
| AC-4 | Measurement is advisory, not a brittle gate. | Done | Script/report/budget notes state this explicitly. |
| AC-5 | Evidence and handoff are updated. | Done | Measurement and Docker validation evidence appended; capsule handoff updated. |
