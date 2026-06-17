# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | HADARA protocol and required reading rules. | Read |
| .hadara/context/HADARA_CONTEXT.md | Current-state routing guide. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next task routing. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task lifecycle and evidence rules. | Read |
| docs/DEVELOPMENT_SLICES.md | 0.3.2 slice order. | Read |
| docs/RELEASE_READINESS.md | Release readiness source and boundaries. | Read |
| docs/RELEASE_NOTES.md | Release narrative. | Read |
| scripts/release/manual-publish-rc.sh | Approval-gated publish helper boundaries. | Read |
| docs/specs/0.3.2/capsules/T-0336_0_3_2_rc0_Release_Readiness_Preparation.md | T-0336 acceptance and validation matrix. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Publish remains out of scope. | T-0336 spec | Accidentally publishing would violate release boundary. |
| Docker validation should refresh `dist` after version/source changes. | SOP/T-0336 spec | Stale dist would invalidate package/release evidence. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not run npm publish or GitHub Release creation. | T-0336 out of scope | T-0337 owns publish. |
| Record release evidence through HADARA commands. | T-0336 validation matrix | Release dry-run expects attached public evidence. |
