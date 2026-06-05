# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation expectations. | Read |
| docs/TEST_STRATEGY.md | Validation baseline and Docker helper guidance. | Read |
| docs/CLI_JSON_CONTRACT.md | CLI JSON semantics. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Workflow and Phase 6 metadata rules. | Read |
| docs/specs/agent-ux/HADARA_Phase6_Operator_Workflow_Compression_Multi_Agent_Compatibility_Spec.md | T-0258 requirements. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| The wrapper can execute Docker subprocesses because validation already depends on Docker helper workflows. | T-0258 spec and SOP. | If Docker is unavailable, command reports failure without raw logs. |
| Dist sync should be explicit and limited to `dist`. | T-0258 spec. | Hidden dist writes would undermine operator review of built CLI freshness. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Omit raw subprocess logs from JSON reports. | T-0258 privacy requirement. | Report step status and compact issues only. |
| Redact workspace paths in JSON reports. | T-0258 privacy requirement. | Use booleans and hashes instead of raw project paths. |
| Keep npm helper scripts. | Backward compatibility. | Add CLI wrapper without removing existing helpers. |
