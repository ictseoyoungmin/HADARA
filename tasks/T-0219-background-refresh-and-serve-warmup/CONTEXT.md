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
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Dashboard projection refresh contract. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Read_Model_Performance_Redesign.md | Background refresh and projection route plan. | Read |
| src/services/dashboard-core.ts | Refresh target for core projection. | Read |
| src/services/dashboard-projection-store.ts | Local projection write boundary. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0219 refresh warms core projection only; timeline/debt projection generation remains deferred. | T-0219 out-of-scope and T-0221 scope. | Refresh could be mistaken as complete heavy-section materialization. |
| A process-memory refresh state map is sufficient before persistent source-signal work. | T-0219 scope excludes file watcher and incremental changed-task refresh. | Refresh state resets on server restart. |
| Serve-start warmup must not start broad task/timeline/debt projection scans immediately. | Post-T-0223 performance review found the previous `setTimeout(0)` full refresh could block first dashboard requests on the same Node event loop. | If warmup reintroduces full refresh, `/api/dashboard/core` can still feel slow despite being projection-first. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not mutate project docs, Task Capsules, evidence, handoff, MCP, provider, shell, release, or browser state. | Dashboard authority model. | Refresh writes only ignored local projection cache files. |
| Do not expose cached projection bodies through projection status. | Phase 5.7 spec. | Status route returns metadata only. |
| Do not implement file watchers. | T-0219 out of scope. | Trigger is serve-start or explicit refresh route. |
| Keep serve-start warmup lightweight. | First paint must not wait behind heavy projection scans. | Warmup may refresh core only; task/timeline/debt refresh stays on explicit refresh or future cooperative refresh work. |
