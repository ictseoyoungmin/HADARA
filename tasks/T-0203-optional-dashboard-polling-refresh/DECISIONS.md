# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Use `setTimeout` scheduling instead of `setInterval`. | Accepted | Lets each read complete before scheduling the next and makes backoff straightforward. | `docs/design/dashboard/index.html` |
| D-2 | Keep polling off by default. | Accepted | Manual refresh remains the safe baseline; polling is operator opt-in. | Dashboard button starts as `Auto Refresh Off`. |
| D-3 | Pause polling while the document is hidden. | Accepted | Avoids background request churn without browser storage. | `visibilitychange` handler |
