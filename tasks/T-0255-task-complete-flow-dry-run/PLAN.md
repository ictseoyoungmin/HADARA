# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read HADARA protocol docs and Phase 6 spec. | Done | Required reading completed before implementation. |
| 2 | Implement read-only task complete flow service and CLI route. | Done | `src/task/task-complete-flow.ts`, `src/cli/task.ts`, `src/cli/main.ts`. |
| 3 | Register the `hadara.task.complete_flow.v1` schema and docs. | Done | Schema index, runtime loader, workflow docs, and schema docs updated. |
| 4 | Add focused tests for stages, read-only behavior, execute rejection, and CLI routing. | Done | `tests/unit/task-complete-flow.test.ts`. |
| 5 | Run Docker validation and built CLI smoke. | Done | Docker sync-build passed; built CLI returned complete-flow JSON for T-0255. |
| 6 | Update capsule and handoff state before close. | Done | Capsule docs, Project State, Development Slices, and Agent Handoff updated. |
