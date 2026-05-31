# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/V1_0_IMPLEMENTATION_SCHEMAS.md | Defines close execute write boundary. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0166 close plan report is stable enough to execute. | T-0166 validation. | Execute should only add close evidence. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Close execute writes only close evidence. | Reviewer guidance. | No status or project-doc mutation in T-0167. |
