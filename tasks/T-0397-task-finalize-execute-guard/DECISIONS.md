# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Implement guarded execute in the existing `hadara.task.finalize.v1` report instead of a new schema id. | Accepted | The schema is additive: mode/readOnly expand, and execution metadata is optional. | `ev:T-0397:fd38f35a791e4b179285cc9d` |
| D-2 | Recompute and compare the current dry-run `planHash` before any writer call. | Accepted | This is the main guard against stale reviewed plans. | `ev:T-0397:454daf3e664843cba5db3b1a` |
| D-3 | Call existing finish and close writer paths rather than adding new file mutation code. | Accepted | Preserves canonical lifecycle write boundaries and close evidence semantics. | `tests/unit/task-finalize.test.ts` |
