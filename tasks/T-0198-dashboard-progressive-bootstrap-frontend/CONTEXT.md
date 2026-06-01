# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 5.5 T-0198 scope and ordering. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Dashboard route, cache, fallback, and read-only boundaries. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Phase5_5_Production_Development_Plan.md | T-0198 source plan and acceptance criteria. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The T-0197 bootstrap endpoint is available. | T-0197 committed `hadara.dashboard.bootstrap.v1` and `/api/dashboard/bootstrap`. | If missing, frontend would fall back to status path. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No browser project-state persistence. | Phase 5.5 browser storage rule. | Only in-memory JS variables are used. |
| Refresh means read again, not execute checks. | Dashboard contract. | Refresh still calls read-only endpoints/fallbacks only. |
