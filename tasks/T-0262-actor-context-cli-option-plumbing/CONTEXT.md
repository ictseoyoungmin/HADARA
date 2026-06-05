# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Phase 6 command metadata vocabulary and task close loop. | Read |
| docs/CLI_JSON_CONTRACT.md | CLI JSON compatibility expectations for report fields. | Read |
| docs/specs/agent-ux/HADARA_Phase6_1_Reviewer_Feedback_Hardening_Spec.md | Defines T-0262 scope and non-goals. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Actor options should be additive and optional. | Phase 6.1 spec and existing default actor reports. | Existing consumers could break if actor defaults or schemas change incompatibly. |
| Invalid actor roles should not silently enter reports. | `HADARA_ACTOR_ROLES` contract. | A mistyped role could weaken coordination metadata. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No scheduler or assignment service. | Phase 6.1 non-goals. | CLI option plumbing only. |
| No hidden shared-doc writes. | SOP and task workflow docs. | `handoff suggest` stays read-only. |
| Preserve existing actor defaults. | Phase 6 metadata vocabulary. | Missing options still emit unknown/local/operator/null. |
