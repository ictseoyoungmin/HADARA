# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read lifecycle spec and current T-0394 handoff state. | Done | Current docs and `docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md`. |
| 2 | Update close dry-run next-action generation. | Done | `src/task/task-close.ts`. |
| 3 | Update tests for deduped primary action and compatibility. | Done | `tests/unit/task-close.test.ts`, `ev:T-0395:0bfa119bfc5e43a489d31794`. |
| 4 | Run full Docker sync-build and built CLI smoke. | Done | `ev:T-0395:6c210dc953974c32acf008b7`, `ev:T-0395:a2c33196f7704223ae5e0044`. |
| 5 | Update capsule/shared docs before close. | Done | T-0395 capsule docs and shared state docs. |
