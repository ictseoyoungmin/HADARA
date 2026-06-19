# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Compact current-state routing and operating rules. | Read |
| docs/PROJECT_STATE.md | Current C1-C3/C6 implementation state and next planned line. | Read |
| docs/AGENT_HANDOFF.md | Latest C6.2 validation baseline and next recommended C6.3 work. | Read |
| docs/TASK_BOARD.md | Confirms T-0365 exists as the active Draft capsule. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules, required reading, Docker validation constraints. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Evidence and task lifecycle semantics. | Read |
| docs/specs/0.3.3/context-routing/00_Context_Routing_Architecture_Overview.md | Context routing principles: graph/cache are projections, not truth. | Read |
| docs/specs/0.3.3/context-routing/05_Indexing_Cache_Invalidation_and_Performance_Spec.md | Compact cache contract and degraded-mode requirements. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | C6 capsule order and validation expectations. | Read |
| docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md | Target spec being hardened. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `07_C6_Fast...` is the correct C6 spec file to update rather than creating a duplicate. | It is already registered in SOP and docs registry as the detailed C6 implementation spec. | Duplicate specs would fragment implementation guidance. |
| This slice should remain documentation-only. | User requested an MD spec; no behavior change was requested in this turn. | If implementation starts here, the capsule scope becomes too broad. |
| Graphify should inform cache/update strategy but not define HADARA semantics. | HADARA architecture says graph/cache are rebuildable projections, not truth. | Copying Graphify's committed output model would violate local optional cache boundaries. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Cache artifacts must remain optional, local, ignored, and rebuildable. | C6 specs and architecture overview. | No committed generated graph/cache output. |
| Context read commands must remain non-mutating. | Architecture overview and C6 spec. | Writes belong behind explicit warm/execute surfaces. |
| No provider/LLM/vector dependency for C6. | Architecture overview. | C6 must be deterministic and offline. |
