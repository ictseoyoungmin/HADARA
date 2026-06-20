# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read current-state and lifecycle workflow context. | Done | AGENTS instructions plus T-0393/T-0394 handoff context. |
| 2 | Implement `task close-repair-plan` read model, schema, CLI route, and registry/docs wiring. | Done | `src/task/task-close-repair-plan.ts`, `src/cli/task.ts`, schema/docs updates. |
| 3 | Add focused tests for repair classifications and CLI JSON output. | Done | `ev:T-0394:f0875b6093844de1ac01053e`. |
| 4 | Run full Docker sync-build and built CLI smoke. | Done | `ev:T-0394:8c47406cc61a4314bde168b0`, `ev:T-0394:a32fcb73ccde4179a56cc267`. |
| 5 | Attach evidence and update capsule/shared handoff docs before close. | Done | `ev:T-0394:e22abfd41b9048a492203406` plus capsule/shared doc updates. |
