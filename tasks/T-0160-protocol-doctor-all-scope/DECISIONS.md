# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| TD-1 | All-scope protocol doctor aggregates docs, profile, and active-task detail. | Accepted | Docs scope already checks all Task Board/capsule cross-document drift; running every task-scoped done-level-like check for all historical capsules is too noisy and slow for the broad default doctor. | Focused tests and built CLI all-scope smoke passed. |
