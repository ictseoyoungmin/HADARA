# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and T-0253 completed context contract. | Read |
| docs/AGENT_HANDOFF.md | Current next recommended step T-0254 and validation baseline. | Read |
| docs/TASK_BOARD.md | Task queue and capsule status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, Docker validation, evidence, and close rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 6 ordering and state update requirement. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Lifecycle command semantics and Phase 6 metadata vocabulary. | Read |
| docs/CLI_JSON_CONTRACT.md | JSON compatibility and common context schema guidance. | Read |
| docs/specs/agent-ux/HADARA_Phase6_Operator_Workflow_Compression_Multi_Agent_Compatibility_Spec.md | Source specification for T-0254 acceptance criteria. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Additive actor/next-action fields can be added to existing task lifecycle schema ids. | T-0254 scope says schema compatibility remains additive. | External consumers ignoring unknown fields remain compatible; stricter consumers should use schema fixtures. |
| Existing command invocations should not require actor CLI options yet. | T-0253/T-0254 scope. | Reports default actor context until future command-specific option adoption. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No command execution orchestration. | Phase 6 spec and T-0254 AC-5. | Reports only suggest commands. |
| Shared-doc writes remain coordinator-oriented. | Phase 6 shared-doc boundary. | `update-state-docs` is a review action with shared-doc boundary metadata, not an apply command. |
