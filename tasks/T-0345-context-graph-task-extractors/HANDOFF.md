# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0345 |
| TaskStatus | Done |
| Last Updated | 2026-06-18 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| Added `extractTaskBoard()` to emit Task nodes and a task-board `StateSource` from `docs/TASK_BOARD.md`, including row line refs and source hash. | `src/context/task-extractors.ts`; `ev:T-0345:e510d77f85444cbe9f00dccb`. |
| Added `extractTaskCapsules()` to emit Task nodes and task-capsule `StateSource` records from `tasks/T-*/TASK.md` and `HANDOFF.md`. | `src/context/task-extractors.ts`; `ev:T-0345:e510d77f85444cbe9f00dccb`. |
| Docker focused tests, Docker full `npm run check`, Docker build/dist refresh, built CLI version smoke, and `git diff --check` passed. | `ev:T-0345:e510d77f85444cbe9f00dccb`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Create/implement the next C1 capsule for docs registry + command registry extractors. | Task extraction now exists; the next source-specific step should add Document and Command nodes before evidence/managed-section extractors. | `docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md`; `docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md`. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Duplicate Task node ids across task-board and task-capsule extractors are intentional for now. | Graph builder must define merge precedence to avoid losing richer capsule metadata. | Carry this into the graph builder capsule. |
| No public context graph CLI exists yet. | Users cannot request a full graph report until more C1 capsules land. | Continue through docs/command/evidence/managed/release extractors, graph builder, state projection, task context, and CLI/read surface capsules. |
