# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next task. | Read |
| docs/TASK_BOARD.md | Task queue and capsule path. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit command loop. | Read |
| docs/specs/agent-ux/HADARA_Phase6_1_Reviewer_Feedback_Hardening_Spec.md | T-0266 reviewer feedback scope. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Handoff suggestion remains a coordinator-reviewed read-only report. | Phase 6.1 spec and existing T-0257/T-0262 behavior. | Accidental write behavior would violate shared-doc boundary. |
| Additive section fields are acceptable under fixture-level schema compatibility. | Existing schema uses `additionalProperties:true`. | Breaking consumers would require a new schema id. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No automatic shared-doc writes. | Phase 6.1 spec. | `handoff suggest --execute` still returns unsupported. |
| Preserve before-hash metadata. | T-0257/T-0266 acceptance. | Sections now repeat the exact target before-hash for manual review. |
