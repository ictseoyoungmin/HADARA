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
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Core/heavy route contract. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Read_Model_Performance_Redesign.md | Frontend merge plan. | Read |
| dashboard/src/model.ts | Frontend data layer. | Read |
| dashboard/src/app.tsx | Runtime merge behavior. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Authored source and served bundle can diverge if the bundle is not rebuilt. | Host lacks dependencies by default, so Docker build is the reliable path. | Served HTML was rebuilt through Docker after the follow-up, closing the stale-bundle risk for this state. |
| Projection source should be treated as live local read, not offline fallback. | T-0218/T-0221 route semantics. | UI could otherwise show misleading offline banners. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not add browser project-state storage. | Dashboard boundary. | No storage APIs introduced. |
| Do not add write/action behavior. | T-0222 out of scope. | Data fetch/merge only. |
| Do not create backend routes. | T-0222 out of scope. | Backend routes landed in T-0218 through T-0221. |
