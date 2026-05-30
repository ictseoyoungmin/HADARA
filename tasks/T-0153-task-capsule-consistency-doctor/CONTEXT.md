# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Done |
| docs/AGENT_HANDOFF.md | Current handoff. | Done |
| docs/TASK_BOARD.md | Task queue and status. | Done |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Done |
| docs/DEVELOPMENT_SLICES.md | Phase 2 ordering and T-0153 scope. | Done |
| docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md | Source design for protocol consistency command/report shape. | Done |
| docs/V1_0_IMPLEMENTATION_SCHEMAS.md | Schema/service boundary reference for consistency work. | Done |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The first protocol doctor slice should be task-scoped only. | Phase 2 plan and `docs/DEVELOPMENT_SLICES.md` list project-wide checks as T-0154. | Implementing cross-doc/profile checks here would blur slice boundaries. |
| The command should be read-only and should not remediate. | Phase 2 plan separates `protocol doctor` from `protocol remediate`. | Any write behavior would require additional safety design and acceptance. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Preserve legacy Task Capsule compatibility. | T-0152 and project handoff. | Historical capsules should be diagnosable without forced migration. |
| Host `node_modules` may be unavailable. | `docs/AGENT_HANDOFF.md`. | Use Docker workflow for validation if host checks cannot run. |
