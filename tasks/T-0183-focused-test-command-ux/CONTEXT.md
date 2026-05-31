# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current Phase 3.5 state. | Read |
| docs/AGENT_HANDOFF.md | Validation baseline and host dependency caveat. | Read |
| docs/TASK_BOARD.md | Task queue and status source. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow and validation guidance. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 3.5 ordering. | Read |
| docs/TEST_STRATEGY.md | Test suite command documentation. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| A focused test command should pass paths directly to Vitest. | User feedback from prior focused check confusion. | Low; implemented as `vitest run`. |
| Full Docker validation remains required for Done. | HADARA protocol and current handoff. | Low; focused command is supplemental. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Host workspace has no `node_modules`. | Handoff and observed command failures. | Use Docker temp-copy for validation evidence. |
| Avoid broad test command ambiguity. | `test:unit` supplies `tests/unit` already. | Document `test:focused` for file-specific runs. |
