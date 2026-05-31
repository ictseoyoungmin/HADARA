# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/SECURITY_MODEL.md | Shell execution and evidence safety boundaries. | Read |
| docs/CLI_JSON_CONTRACT.md | CLI surface contract. | Read |
| docs/specs/HADARA_Phase3_Task_Operator_Console_Development_Plan.md | Evidence from-command design scope. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Phase 3 should not implement shell evidence capture. | Phase 3 plan. | Low; docs explicitly defer execution. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Shell execution is high-risk. | Security model. | Require future explicit implementation capsule and policy gates. |
| MCP execution remains excluded. | MCP/security posture. | Design doc forbids MCP default exposure. |
