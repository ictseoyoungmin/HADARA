# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task workflow command semantics. | Read |
| docs/CLI_JSON_CONTRACT.md | CLI JSON and Phase 6 schema semantics. | Read |
| docs/specs/agent-ux/HADARA_Phase6_Operator_Workflow_Compression_Multi_Agent_Compatibility_Spec.md | T-0257 requirements. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Handoff suggestions should be read-only even when `--execute` is supplied. | Phase 6 spec and task workflow docs. | Hidden shared-doc mutation would violate the coordinator review boundary. |
| The selected task snapshot can be summarized from the current Task Capsule and latest public evidence. | Existing task capsule/evidence read models. | Suggestions might be vague if task evidence is missing, but they remain safe and read-only. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not write `docs/AGENT_HANDOFF.md` from `handoff suggest`. | Phase 6 spec. | Report only section fragments and target before-hash. |
| Preserve existing `handoff update` behavior. | CLI compatibility. | Add a subcommand route without changing update semantics. |
| Use Docker sync-build for validation and dist refresh. | IMPLEMENTATION_SOP. | Host-local Node/npm state is not the validation baseline. |
