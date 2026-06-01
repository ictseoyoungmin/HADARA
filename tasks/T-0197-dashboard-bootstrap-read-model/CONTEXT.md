# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 5.5 slice order and T-0197 acceptance. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Dashboard API/read-model boundaries. | Read |
| docs/SCHEMAS.md | Schema fixture registration posture. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Phase5_5_Production_Development_Plan.md | Source plan for T-0197. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0197 should not change frontend loading yet. | Phase 5.5 plan assigns frontend progressive bootstrap to T-0198. | Premature UI changes could blur capsule boundaries. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No mutation, polling, streaming, or browser storage. | Phase 5.5 non-negotiable boundaries. | Route/service are read-only and tests retain dashboard route method boundaries. |
| No deep selected-task evidence payload in bootstrap. | T-0197 acceptance criteria. | Selected task summary carries proof metadata and issue codes only. |
