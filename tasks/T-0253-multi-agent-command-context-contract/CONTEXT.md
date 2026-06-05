# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and Phase 6 entry conditions. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and T-0253 next recommendation. | Read |
| docs/TASK_BOARD.md | Task queue and new capsule row state. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow, Docker validation, evidence, and close rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Slice ordering and state-update requirement. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit command semantics and Phase 6 docs target. | Read |
| docs/CLI_JSON_CONTRACT.md | JSON/schema compatibility rules and future option naming. | Read |
| docs/SCHEMAS.md | Existing schema registry/documentation posture. | Read |
| docs/specs/agent-ux/HADARA_Phase6_Operator_Workflow_Compression_Multi_Agent_Compatibility_Spec.md | Source specification for T-0253 through T-0260. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0253 should not change existing command parsing or outputs. | Phase 6 spec says no runtime behavior changes for this capsule. | Later commands might lack actor fields until T-0254+ adoption, which is intentional. |
| Common schemas can be registered as standalone fixture schemas with `schemaVersion` while embedded report fields omit nested `schemaVersion`. | Existing schema fixture test pattern requires registered schemas to expose `schemaVersion`. | Future embedding may need `$defs` or schema composition if stricter validation is added. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No multi-agent scheduler or `task complete --execute`. | Phase 6 spec out-of-scope list. | Contract-only slice. |
| Shared-doc writes stay manual/coordinator-oriented. | Phase 6 design principles. | Docs updates are manual capsule work, not a new command. |
| Use Docker for validation/build. | SOP and handoff. | Host `node_modules` is unavailable. |
