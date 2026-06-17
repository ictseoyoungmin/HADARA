# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | HADARA protocol and required reading. | Read |
| .hadara/context/HADARA_CONTEXT.md | Compact read routing. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next task. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and 0.3.2 required-reading registration. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Lifecycle/evidence command semantics. | Read |
| docs/DEVELOPMENT_SLICES.md | 0.3.2 slice ordering. | Read |
| docs/specs/0.3.2/02_Worker_Agent_Instructions.md | 0.3.2 worker boundaries. | Read |
| docs/specs/0.3.2/00_Evidence_v2_Refactor_Release_Design.md | Evidence v2 release-line behavior contract. | Read |
| docs/specs/0.3.2/capsules/T-0333_Evidence_v2_ID_Visibility_and_List_UX.md | Capsule-specific scope and acceptance. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `evidence list` may add fields additively while preserving existing record shape. | Current schema allows additional properties and consumers already read persisted records. | If a consumer rejects additive fields outside schema, focused schema tests should catch it. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not rewrite `EVIDENCE.md`. | 0.3.2 worker instructions and T-0333 spec. | Only evidence writer may append task evidence. |
| Do not implement `evidence rebuild`. | 0.3.2 worker instructions and T-0333/T-0334 specs. | Runtime surface remains absent. |
| Use durable `ev:` ids in resolution examples. | 0.3.2 design. | Legacy ids are inspection-only. |
