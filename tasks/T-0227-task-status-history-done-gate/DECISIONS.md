# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | `task finish` owns appending the canonical Done Status History row. | Accepted | Finish is already the bounded status synchronization command, so operators do not need a separate manual history edit. | `src/task/task-finish.ts`; focused tests. |
| D-2 | Done-level validation requires the latest Status History row to be Done. | Accepted | TASK.md status and Task Board status are insufficient if the audit trail still ends at Draft/In Progress. | `src/harness/validate.ts`; focused tests. |
