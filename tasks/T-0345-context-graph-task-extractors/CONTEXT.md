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
| docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md | C1 input sources, extractor list, deterministic ID rules, and acceptance criteria. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | Recommended C1 capsule order and validation expectations. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Task Board and Task Capsule extraction can land before graph builder integration. | Worker plan lists Task Board + Task Capsule extractors after extractor contract and before graph builder. | If wrong, extractor outputs may need adaptation when graph builder lands. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Extractors must be read-only and non-authoritative. | Architecture overview. | Implementation only reads project files and returns projection objects. |
| Source-addressed output should include path/hash/line where possible. | C1 spec. | Task Board rows include source line; capsule nodes include TASK.md source hash. |
