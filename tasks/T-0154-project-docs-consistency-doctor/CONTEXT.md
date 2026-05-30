# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `docs/PROJECT_STATE.md` | Current project state and Phase 2 capability boundary. | Read |
| `docs/AGENT_HANDOFF.md` | Identifies T-0154 as the next recommended task after T-0153. | Read |
| `docs/TASK_BOARD.md` | Task queue and Task Capsule paths. | Read |
| `docs/IMPLEMENTATION_SOP.md` | Workflow rules, validation expectations, and Docker fallback. | Read |
| `docs/DEVELOPMENT_SLICES.md` | Phase 2 ordering and T-0154 slice scope. | Read |
| `docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md` | Source design for protocol consistency checks and report shape. | Read |
| `tasks/T-0153-task-capsule-consistency-doctor/TASK.md` | Confirms T-0153 remains task-scoped and remediation-free. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0154 should preserve the existing `hadara.protocol.consistency.v1` shape. | T-0153 implementation and Phase 2 spec. | Consumers may break if docs-scope reports diverge unnecessarily. |
| Remediations should remain an empty array in this slice. | User direction and T-0153/T-0155/T-0156 split. | Users could expect write guidance too early. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read-only command surface only. | Phase 2 plan. | No file mutation from `protocol doctor`. |
| Host Node/npm may be unavailable. | `docs/AGENT_HANDOFF.md`. | Use Docker workflow for validation if host checks fail. |
| Keep scope to docs-level consistency. | `docs/DEVELOPMENT_SLICES.md`. | Profile drift and remediation remain future slices. |
