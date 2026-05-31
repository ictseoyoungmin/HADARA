# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/V1_0_IMPLEMENTATION_SCHEMAS.md | Defines close validation/evidence layer separation. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Close plan may run read-only validation services. | T-0166 design. | If expensive, future optimization may be needed. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| T-0166 must not write close evidence. | Reviewer guidance. | `--execute` remains reserved with an explicit error. |
