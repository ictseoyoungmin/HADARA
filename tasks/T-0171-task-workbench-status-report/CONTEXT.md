# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase ordering and capsule sequence. | Read |
| docs/specs/HADARA_Phase3_Task_Operator_Console_Development_Plan.md | Source plan for Phase 3 operator console. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0170 already completed close/audit preflight work. | Project handoff and Phase 3 plan. | Low; current code includes `task audit-close`. |
| `task close` dry-run can be used as the single done-level validation source. | Phase 3 plan. | Medium; covered by call-count test. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve read-only behavior for `task status`. | Phase 3 plan. | No evidence append, task mutation, project-doc mutation, shell execution, provider calls, or MCP writes. |
| Avoid duplicate done-level validation. | Phase 3 plan. | Workbench calls close dry-run once and does not call harness directly. |
