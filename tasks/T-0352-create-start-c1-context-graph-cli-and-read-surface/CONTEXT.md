# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Project-local read routing. | Complete |
| docs/PROJECT_STATE.md | Current project state. | Complete |
| docs/AGENT_HANDOFF.md | Current handoff. | Complete |
| docs/TASK_BOARD.md | Task queue and status. | Complete |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Complete |
| docs/DEVELOPMENT_SLICES.md | C1/C2 prerequisite ordering. | Complete |
| docs/specs/0.3.3/context-routing/00_Context_Routing_Architecture_Overview.md | Context routing architecture constraints. | Complete |
| docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md | CLI/read surface contract and schema expectations. | Complete |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | Worker-facing implementation order and validation expectations. | Complete |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Public command should use T-0351 builder directly. | T-0351 handoff and source. | If builder semantics change, CLI tests should fail rather than duplicating assembly logic. |
| Task mode is selected by `--task T-XXXX`. | C1 spec CLI surface. | If future UX wants `context task`, add an alias later without changing this schema. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Context commands must be read-only. | C1 worker plan. | No evidence append, validation execution, cache write, or document patching. |
| New public commands need command registry metadata. | C1 spec and command registry governance. | Update registry and command registry tests with implementation. |
| Persistent cache remains out of scope. | T-0351 builder decisions. | Keep `cache.used:false` until a cache capsule lands. |
