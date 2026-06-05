# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and Phase 6 status. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next-task guidance. | Read |
| docs/TASK_BOARD.md | Task queue and active capsule registration. | Read |
| docs/IMPLEMENTATION_SOP.md | Docker validation and capsule workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task lifecycle command semantics and close loop. | Read |
| docs/CLI_JSON_CONTRACT.md | JSON command contract and write-boundary rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 6 slice order and completion state. | Read |
| docs/specs/agent-ux/HADARA_Phase6_Operator_Workflow_Compression_Multi_Agent_Compatibility_Spec.md | T-0255 command, schema, and non-goal requirements. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Existing lifecycle reports are the source of truth. | Phase 6 spec and T-0254 implementation. | Low; tests assert `task complete` composes shared finish/ready/close/audit builders. |
| `task complete` should be useful even while a task is incomplete. | Workflow compression goal. | Low; report exits with task-style failure code while still returning the schema. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No execute mode. | T-0255 spec. | `--execute` returns a blocked read-only complete-flow report and performs no writes. |
| No evidence append or state-doc mutation. | T-0255 spec and HADARA protocol. | The command reports shared-doc state and next actions only. |
| Keep schema additive and fixture-level. | `docs/SCHEMAS.md`. | Runtime loader registration is added for validation, but broad schema enforcement remains out of scope. |
