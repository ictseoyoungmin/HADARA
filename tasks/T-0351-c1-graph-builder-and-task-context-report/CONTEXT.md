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
| docs/specs/0.3.3/context-routing/01_Project_Context_Graph_Foundation_and_State_Projection_Spec.md | C1 graph and state projection scope. | Complete |
| docs/specs/0.3.3/context-routing/06_Worker_Agent_Implementation_Plan.md | Worker-facing context report expectations. | Complete |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| C1 builder should not expose a public command yet. | Worker implementation plan and prior extractor capsules. | Later CLI integration may need a small adapter layer. |
| Existing extractor outputs are the source of truth for this capsule. | Current C1 extractor code. | Missing signals should be added to extractors in later hardening capsules, not ad hoc in the builder. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not hand-edit `evidence.jsonl`. | AGENTS.md / IMPLEMENTATION_SOP | Record evidence through HADARA command output. |
| Keep work inside this Task Capsule. | AGENTS.md | Shared docs update only when tracked state changes. |
| Preserve graph vocabulary unless the spec requires expansion. | C1 schema/spec | Task context derives from existing node and edge types. |
