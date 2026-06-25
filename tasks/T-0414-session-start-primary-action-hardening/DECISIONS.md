# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Keep `primaryNextAction` as a compatibility category and add `primaryAction` for the concrete command. | Accepted | Existing consumers may rely on the categorical field; agents need structured command data. | ev:T-0414:598d8358ab004c6faf3164a6 |
| D-2 | Use `task lifecycle --task <id> --json` as the task-scoped primary action. | Accepted | It is read-only and tells agents the current phase/blockers before edits or finalize attempts. | ev:T-0414:598d8358ab004c6faf3164a6 |
| D-3 | Include `avoidForNow` in Session Start guidance. | Accepted | Dogfooding showed agents need anti-actions as much as next commands, especially around premature finalize and live graph reads. | ev:T-0414:598d8358ab004c6faf3164a6 |
