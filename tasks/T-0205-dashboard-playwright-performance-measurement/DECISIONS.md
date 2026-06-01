# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Measure in a minimal `/tmp` copy inside Playwright Docker. | Accepted | Direct bind-mounted workspace did not return promptly enough for stable timings; Docker internal filesystem matches project validation posture better. | Measurement notes |
| D-2 | Keep results advisory. | Accepted | Performance budget says not to enforce brittle wall-clock thresholds. | `docs/DASHBOARD_PERFORMANCE_BUDGET.md` |
