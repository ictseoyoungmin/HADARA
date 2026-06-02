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
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Dashboard core route contract. | Read |
| docs/TEST_STRATEGY.md | Dashboard validation expectations. | Read |
| docs/specs/dashboard/HADARA_Dashboard_Read_Model_Performance_Redesign.md | Phase 5.7 architecture. | Read |
| src/services/dashboard-projection-store.ts | Local projection store dependency. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Task Board rows are the bounded source for core task counts and recent summaries until incremental task projections exist. | T-0218 scope and Phase 5.7 redesign. | Counts may drift from individual `TASK.md` files until T-0220 adds incremental projections. |
| Warm `/api/dashboard/core` reads may return local projection bodies without source-signal validation until T-0219/T-0220. | T-0218 out-of-scope excludes background refresh. | Freshness must be marked conservatively when served from projection. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not scan every Task Capsule directory on the core route request path. | T-0218 scope. | Test spies on `tasks/` readdir/readFile calls. |
| Do not implement background refresh. | T-0218 out of scope. | Deferred to T-0219. |
| Do not migrate frontend. | T-0218 out of scope. | Deferred to T-0222. |
