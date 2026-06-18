# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| .hadara/context/HADARA_CONTEXT.md | Session routing and compact current-state anchor. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close workflow and evidence boundaries. | Read |
| docs/specs/0.3.3/context-routing/00_Context_Routing_Architecture_Overview.md | Context-routing scope and C1-C6 relationship. | Read |
| docs/specs/0.3.3/context-routing/05_Indexing_Cache_Invalidation_and_Performance_Spec.md | Cache invalidation and performance constraints. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | Worker slice routing and implementation order. | Read |
| docs/specs/0.3.3/context-routing/07_C6_Fast_Context_Cache_and_Performance_Implementation_Spec.md | C6 source manifest/cache design and speed targets. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| C6 should precede C4 slicing because T-0362 measured broad live reads on mounted workspace paths. | T-0362 built smokes and project handoff. | C4 could add another slow read path if built before shared discovery/cache. |
| A first manifest pass may be metadata-only and not prove every same-size/same-mtime content change. | C6 spec speed-first design. | Future warm cache/content-hash work must strengthen stale detection where needed. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not write local cache files in this slice. | C6.1 scope boundary. | Cache writes/status are C6.2. |
| Keep the manifest portable and project-relative. | HADARA portable/project-store boundary. | No absolute workspace paths in committed schema fixtures or report payloads. |
| Preserve read-only discovery behavior. | Context graph/code index architecture. | Helper reads metadata and optional prior manifest only; it does not mutate project docs or cache. |
