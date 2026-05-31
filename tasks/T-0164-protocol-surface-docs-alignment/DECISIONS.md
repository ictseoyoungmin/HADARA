# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Document task reports via `--task <id>`, not `--scope tasks`. | Accepted | The schema allows `tasks` as a report scope, but the CLI implements task-specific reports through `--task`. | Help smoke passed. |
| D-2 | Keep `--issue` remediation documented only as future convenience. | Accepted | Current safe execution surface remains `protocol remediate --fix`; issue-id writes remain deferred. | CLI JSON contract and implementation notes updated. |
