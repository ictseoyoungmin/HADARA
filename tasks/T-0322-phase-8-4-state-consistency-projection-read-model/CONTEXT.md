# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Standard task lifecycle. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 8.4 slice order. | Read |
| docs/specs/0.3.1/rc1/04_State_Consistency_Projection_Read_Model.md | T-0322 primary scope. | Read |
| docs/specs/0.3.1/rc1/00_HADARA_0_3_1_rc1_Status_Governance_Implementation_Plan.md | rc1 capsule boundary. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Projection should remain service-level in this capsule. | rc1 implementation plan separates read-only projection from advisory integration. | Adding CLI/CI now would blur Phase 8.4/8.5 boundaries. |
| Missing optional files should degrade with warnings. | Phase 8.4 spec. | Projection could crash in partial projects if not handled. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read-only only. | Phase 8.4 spec. | Do not add repair/execute behavior. |
| Include source paths and fix hints for issues. | Phase 8.4 done criteria. | Worker-facing diagnostics must be actionable. |
| Use Docker validation for runtime changes. | AGENTS.md / SOP. | Host node_modules may be unreliable. |
