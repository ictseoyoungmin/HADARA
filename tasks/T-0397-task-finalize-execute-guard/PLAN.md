# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read lifecycle convenience spec, T-0396 implementation, and lifecycle writer boundaries. | Done | `docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md`, `src/task/task-finalize.ts`, `src/task/task-finish.ts`, `src/task/task-close.ts` |
| 2 | Implement guarded execute mode with plan-hash match, serial execution, and stop-on-blocker. | Done | `src/task/task-finalize.ts` |
| 3 | Update schema, command registry, CLI JSON docs, workflow docs, and schema docs. | Done | `src/schemas/task-finalize.schema.json`, `src/services/capability-registry.ts`, `docs/CLI_JSON_CONTRACT.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/SCHEMAS.md` |
| 4 | Validate focused tests, full Docker sync-build, built CLI guard smokes, and diff cleanliness. | Done | `ev:T-0397:59085932aced47be89c4532d`, `ev:T-0397:fd38f35a791e4b179285cc9d`, `ev:T-0397:924236021b714ecaa783c7ec`, `ev:T-0397:454daf3e664843cba5db3b1a`, `ev:T-0397:3436c55fab2344789c6183b9` |
| 5 | Update capsule and shared handoff/state docs, then close using the guarded finalize path. | Done | This capsule, shared docs, and final lifecycle close/audit proof. |
