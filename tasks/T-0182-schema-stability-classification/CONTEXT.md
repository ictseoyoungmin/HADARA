# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current Phase 3.5 state and next task. | Read |
| docs/AGENT_HANDOFF.md | Validation baseline and active task guidance. | Read |
| docs/TASK_BOARD.md | Task queue and capsule path/status source. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, evidence, close, and Docker validation rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 3.5 ordering. | Read |
| docs/SCHEMAS.md | Schema fixture and compatibility guidance. | Read |
| src/schemas/task-workbench.schema.json | Active schema with compatibility alias fields. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Field classification can start as documentation metadata. | T-0182 scope and schema fixture posture. | Low; release-gate strictness remains deferred. |
| Workbench schema is the best first classified schema. | T-0177 introduced `state.closed` compatibility alias. | Low; broader classification can follow as consumers appear. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not make schemas strict release gates. | T-0182 is documentation/classification only. | Keep `additionalProperties` fixture posture. |
| Preserve compatibility alias semantics. | Existing consumers may still read `state.closed`. | Mark preferred fields rather than removing alias. |
