# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/CLI_JSON_CONTRACT.md | CLI JSON semantics. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Workflow command boundaries. | Read |
| docs/specs/agent-ux/HADARA_Phase6_Operator_Workflow_Compression_Multi_Agent_Compatibility_Spec.md | T-0259 requirements. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Templates should reduce repeated authoring but remain Draft scaffolds. | T-0259 spec. | If templates imply completion, validation/evidence integrity is weakened. |
| Unknown templates should fail before any writes. | T-0259 spec. | A typo could otherwise create the wrong capsule. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not attach evidence from templates. | T-0259 acceptance. | Evidence remains operator-recorded after real checks. |
| Do not mark tasks Done from templates. | T-0259 acceptance. | Finish/ready/close workflow remains required. |
| Preserve ordinary `task create <title>` behavior. | Compatibility. | Template support is additive. |
