# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/DEVELOPMENT_SLICES.md | T-0162 planned slice. | Read |
| docs/TEST_STRATEGY.md | Protocol hardening validation expectations. | Read |
| docs/V1_0_IMPLEMENTATION_SCHEMAS.md | Detailed T-0162 implementation target. | Read |
| docs/specs/HADARA_Project_Protocol_Consistency_Layer_Phase2_Development_Plan.md | Original AC-6 remediation plan context. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Doctor reports can add optional fields without a new schema id. | T-0159 fixture-level additive schema posture. | Consumers might ignore hints; safe because remediations array also carries commands. |
| Existing `protocol remediate --fix` remains the execution path. | T-0157/T-0158 safe remediation boundary. | Adding `--issue` now would expand scope and risk ambiguous writes. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Doctor remains read-only. | Phase 2 command boundary. | No call to remediation execute path from doctor. |
| Safe hints must point to dry-run commands. | T-0162 acceptance. | `--execute` is mentioned only as explicit follow-up. |
