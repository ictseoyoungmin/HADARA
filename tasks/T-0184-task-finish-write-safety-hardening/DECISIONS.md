# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Reuse temp-file/rename plus rollback-attempt semantics. | Accepted | Matches existing protocol remediation and scaffold upgrade write patterns. | `src/task/task-finish.ts`. |
| D-2 | Keep `hadara.task.finish.v1` additive for write metadata. | Accepted | Hash/existence fields are additive and schema remains fixture-level. | `docs/CLI_JSON_CONTRACT.md`. |
| D-3 | Refuse malformed Task Board frames instead of appending. | Accepted | Avoids making broken bookkeeping harder to repair. | `tests/unit/task-finish.test.ts`. |
