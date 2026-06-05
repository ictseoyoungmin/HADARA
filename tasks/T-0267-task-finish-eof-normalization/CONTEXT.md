# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task finish/ready/close/audit semantics. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The unwanted blank EOF line is created by finish-generated text, not by close evidence. | T-0265/T-0266 workflow observations and `task-finish.ts` inspection. | Fixing close would not prevent recurrence. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve dry-run/execute hash consistency. | Task finish write safety. | Normalize before planned `afterHash` and execute write comparison. |
| Avoid historical broad formatting changes. | Hotfix scope. | Only future `task finish` generated writes are normalized. |
