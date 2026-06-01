# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement timeline as a generated read model, not a stream. | Accepted | T-0196 explicitly excludes SSE, polling, and persistence. | `createDashboardTimelineReport`. |
| D-2 | Use existing read models as timeline sources. | Accepted | Dashboard should not add a new source of truth. | Timeline service composes status, task workbench/list, and evidence list reports. |
