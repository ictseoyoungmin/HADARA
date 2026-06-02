# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | HADARA protocol and required reading. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/audit workflow. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 5.7 ordering. | Read |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Timeline/debt projection contract. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Read_Model_Performance_Redesign.md | Heavy projection architecture. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Legacy `/api/timeline` and `/api/debt` can remain compatibility routes. | T-0221 focuses Phase 5.7 projection routes. | Existing consumers may still use heavier legacy routes until frontend migration. |
| Timeline/debt generation is allowed in background refresh. | T-0221 goal. | Refresh remains slow on NTFS but no longer foreground for new routes. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not add live streaming/SSE/WebSocket. | T-0221 out of scope. | Projection routes are ordinary GET/HEAD JSON. |
| Do not expose raw project paths in projection files. | Projection store boundary. | Timeline projection source is sanitized before write. |
| Do not migrate frontend. | T-0221 out of scope. | Deferred to T-0222. |
