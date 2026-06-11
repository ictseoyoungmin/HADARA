# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/specs/0.3.0/05_Phase_7_4_Managed_Sections_and_Safe_Patch_Plans.md | Phase 7.4 requirements. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Managed patches are section-body bounded. | Phase 7.4 boundary rules. | Full-file rewrites or broad prose updates would violate the phase. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Execute requires reviewed target before-hash. | Phase 7.4 acceptance. | Mismatch fails closed with no write. |
| Fresh markers are limited to generated/table sections. | Phase 7.4 non-goals. | Broad architecture/decision/security prose remains unmanaged. |
