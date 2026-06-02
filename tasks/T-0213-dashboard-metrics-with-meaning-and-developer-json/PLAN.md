# Plan

| Step | Status | Evidence |
|---|---|---|
| Build MetricStat/MetricsRow with tone + context. | Done | ui.tsx MetricStat/MetricsRow. |
| Add the collapsed read-only DeveloperJSON disclosure. | Done | ui.tsx DeveloperJSON. |
| Remove inspector vocabulary; assert its absence in tests. | Done | dashboard-static.test.ts forbids parser-row/Bottom Inspector/Inspect JSON. |
| Verify metrics carry context in the visual gate. | Done | Visual gate metric-context check. |
