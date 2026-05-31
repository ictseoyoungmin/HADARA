# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/V1_0_IMPLEMENTATION_SCHEMAS.md | Defines ready/close separation. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Ready can reuse close dry-run checks. | T-0166/T-0167 implementation. | Keeps blocker semantics aligned. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Ready is read-only. | Reviewer guidance. | No evidence append or status changes. |
