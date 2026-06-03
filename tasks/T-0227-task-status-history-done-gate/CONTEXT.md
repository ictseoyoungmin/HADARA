# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and Docker validation baseline. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow and Docker validation rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit semantics. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `TASK.md` Status History should be a completion audit trail, not optional prose. | User reported T-0226 history ending at In Progress. | Done-level readiness can claim completion while history says otherwise. |
| `task finish` is the right bounded write point for the Done history row. | Existing finish command already syncs TASK status and Task Board status. | Manual history updates remain easy to forget. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Keep `task finish` writes bounded to `TASK.md` and `docs/TASK_BOARD.md`. | TASK_WORKFLOW_COMMANDS.md | Do not expand finish into broad docs. |
| Preserve existing Status History table format. | Existing capsule scaffold. | Avoid schema redesign or historical migration in this task. |
