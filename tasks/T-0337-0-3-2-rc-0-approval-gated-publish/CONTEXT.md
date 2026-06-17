# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current 0.3.2 release-line state. | Read |
| docs/AGENT_HANDOFF.md | Identifies T-0337 as next active work. | Read |
| docs/TASK_BOARD.md | Confirms T-0337 was newly created. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow and release-capsule required reading. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task lifecycle and evidence command boundaries. | Read |
| docs/DEVELOPMENT_SLICES.md | Shows T-0337 planned after T-0336. | Read |
| docs/specs/0.3.2/02_Worker_Agent_Instructions.md | 0.3.2 release-line boundaries. | Read |
| docs/specs/0.3.2/00_Evidence_v2_Refactor_Release_Design.md | T-0337/T-0338/T-0339 release sequence. | Read |
| docs/specs/0.3.2/capsules/T-0337_0_3_2_rc0_Approval_Gated_Publish.md | Capsule-specific goal, scope, and acceptance. | Read |
| docs/RELEASE_READINESS.md | Current rc0 readiness and publish policy. | Read |
| docs/RELEASE_NOTES.md | 0.3.2-rc.0 release narrative. | Read |
| scripts/release/manual-publish-rc.sh | Approval-gated npm helper behavior. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0336 close proof is current and valid. | `task audit-close --task T-0336 --json` returned `closed-valid`. | T-0337 would start before readiness was closed. |
| Operator will run publish mutation from an authenticated npm environment. | T-0337 prerequisites and manual helper. | Publish command will fail at `npm whoami` or should not proceed. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not publish without explicit operator confirmation. | T-0337 spec and helper `--execute` prompt. | The helper requires typing `publish` before npm mutation. |
| Release candidates publish with npm dist-tag `next`. | `docs/RELEASE_READINESS.md`; helper default tag logic. | `latest` must remain stable `0.3.0`. |
| Do not create GitHub Release unless explicitly requested. | T-0337 out-of-scope boundary. | Helper `--github-draft` remains optional. |
