# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current 0.3.2 release-line state after T-0337 publish. | Pending |
| docs/AGENT_HANDOFF.md | Current handoff to T-0338. | Pending |
| docs/TASK_BOARD.md | Task queue and status. | Pending |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Pending |
| docs/specs/0.3.2/capsules/T-0338_0_3_2_rc0_Post_Publish_Installed_Package_Recycle.md | Capsule-specific installed-package recycle requirements. | Pending |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `hadara@0.3.2-rc.0` is visible on npm with `next` tag. | T-0337 evidence. | Recycle cannot install the intended package. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Primary proof must come from installed package paths. | T-0338 spec. | Avoid source checkout masking packaging issues. |
