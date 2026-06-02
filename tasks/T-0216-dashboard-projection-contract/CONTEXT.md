# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Pending |
| docs/AGENT_HANDOFF.md | Current handoff. | Pending |
| docs/TASK_BOARD.md | Task queue and status. | Pending |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Pending |
| docs/DEVELOPMENT_SLICES.md | Phase 5.7 task order. | Pending |
| docs/DASHBOARD_READ_MODEL_CONTRACT.md | Existing dashboard read-model and bootstrap/task-detail contracts. | Pending |
| docs/specs/dashboard/HADARA_Dashboard_Read_Model_Performance_Redesign.md | Source design for projection architecture and T-0216 acceptance. | Pending |
| docs/specs/dashboard/HADARA_Dashboard_Phase5_6_UX_Diagnosis.md | Measured slow-mount problem motivating the contract. | Pending |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Existing `hadara.dashboard.bootstrap.v1` consumers need compatibility during transition. | Dashboard read-model contract. | Breaking bootstrap would regress current dashboard behavior. |
| Projection metadata should be additive and explicit before storage/routes are implemented. | Phase 5.7 redesign. | Later slices may encode incompatible freshness semantics. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Contract-first only. | T-0216 scope. | No `.hadara/local/cache/dashboard` implementation yet. |
| Dashboard remains read-only. | Dashboard contracts. | No shell execution, provider calls, MCP writes, task mutation, or evidence writes from UI. |
| No browser-persisted project state. | Dashboard contracts. | Projection cache is server-local state only and starts in T-0217. |
