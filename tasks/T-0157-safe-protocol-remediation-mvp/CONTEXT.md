# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and protocol doctor status. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and Docker workflow constraints. | Read |
| docs/TASK_BOARD.md | Task queue and T-0157 capsule path. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation workflow. | Read |
| docs/DEVELOPMENT_SLICES.md | T-0157 slice scope and prerequisite order. | Read |
| docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md | T-0157 planned acceptance and exclusions. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Remediation command must be dry-run-first. | Phase 2 plan and project safety pattern. | Accidental writes would violate user trust and protocol doctor boundaries. |
| MVP means only four bounded fixes. | Phase 2 plan explicitly lists the acceptance. | Broad rewrite behavior would exceed capsule scope. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No deletes, acceptance status changes, or summary rewrites. | Phase 2 exclusions. | Implement only additive/exact low-risk edits. |
| Use Docker workflow for validation. | AGENT_HANDOFF / SOP. | Host dependencies are unreliable. |
