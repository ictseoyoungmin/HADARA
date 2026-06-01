# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Phase5_5_Production_Development_Plan.md | T-0202 scope and boundaries. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Existing dashboard fallback behavior can be extended without changing backend routes. | Phase 5/5.5 frontend shape. | If future failures need end-to-end browser assertions, this static test slice may be insufficient. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No browser project-state persistence. | Phase 5.5 browser storage rule. | Load phase and previous view remain in JS memory only. |
| Performance targets are advisory observations. | TEST_STRATEGY. | Unit tests assert deterministic hooks and docs, not wall-clock thresholds. |
