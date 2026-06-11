# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/specs/0.3.0/04_Phase_7_3_Document_Registry_and_Docs_Doctor.md | Phase 7.3 requirements. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Phase 7.3 is classification/diagnostics first. | Spec non-goals. | Do not implement archive moves or managed patch execution in this capsule. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| New docs surfaces are read-only. | Phase 7.3 command requirements. | `docs list`, `docs doctor`, and `docs explain` do not write project files. |
| Init registry writes stay scaffold/profile-upgrade scoped. | HADARA protocol write boundaries. | Fresh init creates registry/projection; upgrade appends missing seed entries only. |
