# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current 0.3.2 release-line state after T-0337 publish. | Read |
| docs/AGENT_HANDOFF.md | Current handoff to T-0338. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close and Evidence v2 workflow command semantics. | Read |
| docs/DEVELOPMENT_SLICES.md | Active release-line slice ordering and completion evidence expectations. | Read |
| docs/TEST_STRATEGY.md | Installed package consumer proof guidance. | Read |
| docs/specs/0.3.2/02_Worker_Agent_Instructions.md | 0.3.2 Evidence v2 boundaries and validation policy. | Read |
| docs/specs/0.3.2/00_Evidence_v2_Refactor_Release_Design.md | Release-line Evidence v2 id/list/resolution contract. | Read |
| docs/specs/0.3.2/capsules/T-0338_0_3_2_rc0_Post_Publish_Installed_Package_Recycle.md | Capsule-specific installed-package recycle requirements. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `hadara@0.3.2-rc.0` is visible on npm with `next` tag. | `npm --cache /tmp/hadara-npm-cache view hadara@0.3.2-rc.0 version dist-tags --json`. | Recycle cannot install the intended package. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Primary proof must come from installed package paths. | T-0338 spec. | Avoid source checkout masking packaging issues. |
| Exact `npx` may be environment-sensitive. | `docs/TEST_STRATEGY.md` installed package consumer proof. | Treat temp-prefix installed bin as canonical proof. |
