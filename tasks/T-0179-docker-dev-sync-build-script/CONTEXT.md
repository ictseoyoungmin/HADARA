# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Phase 3.5 active state and next task. | Read |
| docs/AGENT_HANDOFF.md | Runtime origin and Docker workflow known problems. | Read |
| docs/TASK_BOARD.md | Task queue and capsule path. | Read |
| docs/IMPLEMENTATION_SOP.md | Existing reusable Docker workflow and dist refresh rules. | Read |
| docs/TEST_STRATEGY.md | Docker validation baseline. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| A repo script is safer than a self-hosted `hadara dev sync-build` command for the first iteration. | Operator feedback. | A CLI command could be confusing while rebuilding itself. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Helper must not run release/package/publish behavior. | T-0179 scope. | Local dev validation only. |
| Helper should exclude `.git`, `.hadara`, `node_modules`, and `dist` from temp-copy sync. | T-0178/T-0179 runtime friction. | Keeps copies smaller and avoids local/private state. |
