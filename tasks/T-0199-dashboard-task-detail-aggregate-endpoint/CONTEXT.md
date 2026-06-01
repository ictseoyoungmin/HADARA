# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 5.5 T-0199 scope and ordering. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Dashboard task-detail aggregate and no-raw-proof guidance. | Read |
| docs/SCHEMAS.md | Schema fixture registration posture. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Phase5_5_Production_Development_Plan.md | T-0199 source plan and acceptance criteria. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0198 frontend is already bootstrap-first. | Previous capsule completed first-paint aggregate consumption. | If not true, selected-task aggregate still works but latency story remains incomplete. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No mutation or execution. | Dashboard contract and Phase 5.5 boundaries. | Route composes read-model services only. |
| No raw private paths. | Evidence/security boundary. | Use sanitized evidence list defaults and tests for private local path leakage. |
