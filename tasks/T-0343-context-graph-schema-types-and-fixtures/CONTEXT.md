# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task lifecycle command semantics. | Read |
| docs/TEST_STRATEGY.md | Validation baseline and Docker preference. | Read |
| docs/specs/0.3.3/context-routing/00_Context_Routing_Architecture_Overview.md | Overall context-routing principles and non-goals. | Read |
| docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md | C1 JSON contracts and acceptance criteria. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | C1 capsule order and validation expectations. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| C1 schema/types can be added without public CLI commands. | Worker implementation plan separates schema/types from extractor and CLI capsules. | If wrong, command registry/help surfaces would be missing. |
| Existing `hadara.stateProjection.v1` should not be replaced in this capsule. | Current code already has a Phase 8 state projection schema/service. | Replacing it now would over-scope this contract capsule and risk regressions. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Context routing projections are read-only and non-authoritative. | Architecture overview. | This capsule only adds contracts; no writes or cache behavior. |
| New public schemas must be registered in schema index and runtime loader. | Existing schema fixture tests. | Focused validation covers registry alignment. |
