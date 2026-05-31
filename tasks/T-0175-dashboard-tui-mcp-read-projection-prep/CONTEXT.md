# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Dashboard selected-task guidance target. | Read |
| docs/MCP_BRIDGE_CONTRACT.md | MCP read-only boundary target. | Read |
| docs/specs/HADARA_Phase3_Task_Operator_Console_Development_Plan.md | Projection prep scope. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Future selected-task consumers can use workbench report instead of raw Markdown parsing. | Phase 3 plan. | Low; documented as guidance only. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not add dashboard/TUI/MCP runtime behavior. | Capsule scope. | Docs-only prep. |
| Preserve read-only boundaries. | Security/SOP posture. | Guidance forbids writes/execution/provider calls. |
