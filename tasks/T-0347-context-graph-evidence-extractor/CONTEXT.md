# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and 0.3.3 context-routing sequence. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and validation baseline. | Read |
| docs/TASK_BOARD.md | Task queue and capsule paths. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/specs/0.3.3/context-routing/00_Context_Routing_Architecture_Overview.md | Context-routing architecture boundary. | Read |
| docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md | Defines Evidence nodes, evidence id policy, extractor contract, and C1 sequence. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | Worker order lists Evidence extractor after docs/command registry extraction. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Evidence nodes should reuse normalized evidence ids directly. | Context graph spec Evidence ID Policy and `src/evidence/normalizer.ts`. | Legacy ids are compatibility-only; mitigation is to expose `idStability` metadata and not mark legacy ids durable. |
| Close proof edges can be detected from `close-proof` tags. | Current close evidence writer output. | If older evidence lacks tags, close state may remain graph-builder/state-projection scope. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Extraction is read-only. | Context-routing architecture and C1 scope. | Do not append, migrate, or repair evidence. |
| Keep graph assembly and public CLI integration out of this capsule. | Worker implementation order. | Add only source extractor and focused tests. |
