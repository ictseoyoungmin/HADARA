# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task lifecycle command semantics. | Read |
| docs/specs/0.3.3/context-routing/00_Context_Routing_Architecture_Overview.md | Context routing principles and non-goals. | Read |
| docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md | C1 source list, Document/Command nodes, and extractor order. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | Recommended C1 capsule order and validation expectations. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Docs registry and command registry extraction can land before evidence extraction. | Worker plan lists docs registry + command registry extractors before evidence extractor. | If wrong, extractor order may need adjustment in graph builder. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Extractors must stay read-only and projection-only. | Architecture overview. | Implementation reads registry data and returns nodes/edges/state only. |
| Command registry source is TypeScript, not a JSON artifact. | Current command registry implementation. | Extractor uses the existing runtime registry API and source file hash for source addressing. |
