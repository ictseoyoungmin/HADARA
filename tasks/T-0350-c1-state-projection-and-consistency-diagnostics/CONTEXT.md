# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Current-state entry point and read-routing. | Read |
| docs/PROJECT_STATE.md | Current project state and latest completed task. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next recommended C1 step. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation expectations. | Read |
| docs/DEVELOPMENT_SLICES.md | Development slice ordering and status tracking. | Read |
| docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md | C1 compact graph/state projection contract. | Read |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | C1 capsule sequencing guidance. | Read |
| docs/specs/tmp_dir_hadara_work_items_architecture_specs/work_items/F_State_Consistency_Projection.md | Original state consistency work item and diagnostics list. | Read |
| src/services/state-projection.ts | Existing Phase 8 state projection report that must not be broken. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The existing Phase 8 state projection report remains canonical for `hadara state verify`. | Existing tests/schema and CLI consumers. | Breaking its shape would regress Phase 8 consumers. |
| The C1 compact projection can be built from `GraphExtractionResult` state sources and graph nodes before a public graph CLI exists. | C1 spec embeds compact state projection in context graph reports. | If graph builder later needs richer details, it can extend this adapter without changing existing state verify. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Read-only diagnostics only. | C1 spec and Work Item F. | No shared docs or task files are repaired by projection code. |
| Keep issue codes within the C1 `StateConsistencyIssueCode` vocabulary. | `src/context/context-graph.ts`. | Lower-level legacy issue codes stay in the existing state verify service. |
| Preserve existing Phase 8 state projection tests. | `tests/unit/state-projection.test.ts`. | Focused validation includes both new and existing projection tests. |
