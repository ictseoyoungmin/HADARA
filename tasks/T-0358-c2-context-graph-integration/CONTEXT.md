# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Done |
| docs/AGENT_HANDOFF.md | Current handoff. | Done |
| docs/TASK_BOARD.md | Task queue and status. | Done |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Done |
| docs/TASK_WORKFLOW_COMMANDS.md | Lifecycle command write boundaries and close-source timing. | Done |
| docs/specs/0.3.3/context-routing/00_Context_Routing_Architecture_Overview.md | Context-routing architecture and read-only projection principles. | Done |
| docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md | C1 graph contract that must remain additively compatible. | Done |
| docs/specs/0.3.3/context-routing/02_Code_Link_Layer_Spec.md | C2 code index and graph integration acceptance criteria. | Done |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | C2 capsule ordering and done criteria. | Done |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Code-aware graph output should be opt-in. | C2 spec says to prefer `hadara context graph --include-code --json`; keeping default output unchanged minimizes C1 compatibility risk. | If wrong, default graph consumers could see larger outputs or new node/edge families unexpectedly. |
| Dedicated code commands remain deferred. | C2 spec lists dedicated candidates but says not to add them unless placement is clear. | Adding them now would expand public surface and registry obligations unnecessarily. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Context routing commands remain read-only. | Architecture overview and worker plan. | No graph/cache command may mutate project files. |
| Graph/state projections are rebuildable projections, not truth. | C1/C2 specs. | Canonical truth remains in docs, task capsules, registries, evidence, and source files. |
| New graph types must be additive. | C2 graph integration spec. | Do not break `hadara.contextGraph.v1` consumers. |
