# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 5 slice ordering and T-0193 planned scope. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/evidence command semantics. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Live binding and read-only dashboard contract. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Phase5_Development_Plan.md | Source plan for Phase 5 dashboard work. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Static HTML remains the right implementation surface for T-0193. | Phase 5 spec recommends static first for T-0193/T-0194. | Introducing a frontend build would add unnecessary complexity and validation scope. |
| `/api/status` already exists and is read-only. | T-0097 dashboard read integration and current `src/cli/dashboard.ts`. | If the route regresses, live binding would fall back to fixture rather than show live state. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Refresh means read-again only. | `docs/DASHBOARD_READ_MODEL_CONTRACT.md` and Phase 5 spec. | Button label should be `Refresh Status`, not run/sync/update wording. |
| No polling/SSE/websocket in T-0193. | Phase 5 spec. | Manual refresh only. |
| No dashboard writes or execution behavior. | HADARA dashboard contract. | Tests should keep forbidden tokens absent. |
