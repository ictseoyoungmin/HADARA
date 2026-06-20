# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and lifecycle spec. | Done | `.hadara/context/HADARA_CONTEXT.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/IMPLEMENTATION_SOP.md`, `docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md` |
| 2 | Implement `hadara.task.lifecycle.v1` report composition. | Done | `src/task/task-lifecycle.ts`, `src/schemas/task-lifecycle.schema.json` |
| 3 | Add CLI/registry/schema/docs wiring. | Done | `src/cli/task.ts`, `src/services/capability-registry.ts`, docs updates |
| 4 | Add focused unit and schema coverage. | Done | `tests/unit/task-lifecycle.test.ts`, `tests/unit/schema-fixtures.test.ts` |
| 5 | Run focused/full validation and built CLI smoke. | Done | `ev:T-0393:bc944ecc2c894e869dd7e557`, `ev:T-0393:5ec89716142c4e19b7e3abe0`, `ev:T-0393:03d977cfde444c83862cfd3c` |
| 6 | Update capsule docs and shared state before finish/close. | Done | Capsule docs, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/DEVELOPMENT_SLICES.md` |
