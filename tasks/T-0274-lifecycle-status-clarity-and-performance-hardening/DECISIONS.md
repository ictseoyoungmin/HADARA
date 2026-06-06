# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-0274-1 | Add `findTaskCapsule()` for single-task commands instead of reusing `listTaskCapsules().find(...)`. | Accepted | Single-task commands should avoid reading every task `TASK.md` on mounted workspaces. | `tests/unit/task-finish.test.ts` direct lookup regression. |
| D-0274-2 | Keep `state.ready` semantics and add `state.readiness` as an additive clarity object. | Accepted | Existing consumers keep working while new consumers can distinguish current readiness from close proof validity. | `task-workbench.schema.json` and focused tests. |
| D-0274-3 | Keep Docker JSON raw-log privacy and expose only failed step, exit code, and debug hint. | Accepted | This improves diagnosis without leaking private paths, environment details, or command output. | `dev-docker-check.test.ts` and built CLI smoke. |
