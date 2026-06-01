# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DASHBOARD_PERFORMANCE_BUDGET.md | Measurement targets and evidence guidance. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Advisory route timing is sufficient for this follow-up. | User asked whether load durations had been checked, then asked to use Playwright Docker. | Does not prove paint timing or user-perceived interaction latency. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Measurements are not release gates. | Performance budget guidance. | Record observed timings and environment. |
| Do not commit raw private logs or local traces. | Performance evidence guidance. | Commit summary Markdown only. |
