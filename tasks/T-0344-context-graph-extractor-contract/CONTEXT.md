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
| docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md | Extractor contract, deterministic IDs, source-addressability, and C1 scope. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | Recommended C1 capsule order and validation expectations. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The extractor contract can be implemented before source-specific extractors. | Worker implementation plan lists extractor contract before Task Board/Task Capsule extractors. | If wrong, later capsules may need to revise helper signatures. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Context graph commands/projections must remain read-only and non-authoritative. | Architecture overview. | Contract helpers must not write files or create cache state. |
| Deterministic IDs must match the C1 spec. | C1 deterministic ID rules. | Tests cover stable IDs for common entity types and edges. |
