# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | HADARA workflow and lifecycle requirements. | Read |
| `.hadara/context/HADARA_CONTEXT.md` | Current-state routing. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next Phase 8.2 task. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation baseline. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | TaskStatus/CloseState policy and close lifecycle semantics. | Read |
| docs/specs/0.3.1/rc1/02_Task_Handoff_Current_State_and_CloseState.md | Primary T-0320 spec. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Legacy handoff fixtures may still use a single `Status` row. | Existing tests and historical capsules. | Validator must preserve legacy exact-token compatibility while rejecting stale mixed phrases. |
| CloseState proof remains derived by close/audit commands. | T-0319 policy. | New HANDOFF scaffold can record `not-closed` initially, but audit remains source of truth. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No historical mass migration. | Phase 8.2 spec. | New scaffold and validators only. |
| Validation should be high-confidence. | Phase 8.2 spec. | Catch explicit pending-close phrases and PLAN `In Progress` rows, not broad prose. |
