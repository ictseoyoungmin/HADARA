# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Compact context anchor and read routing. | Read |
| docs/PROJECT_STATE.md | Current project state and release-line notes. | Read |
| docs/AGENT_HANDOFF.md | Current handoff, known problems, and stale T-0418 wording to correct. | Read |
| docs/TASK_BOARD.md | Task queue and T-0418/T-0422 state. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and required-reading registry. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finalize-first lifecycle and evidence rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Release-line slice history and T-0413 package recycle context. | Read |
| docs/specs/0.3.4/agent-ux/00_Agent_UX_Hardening_Spec.md | 0.3.4 scope and installed-package recycle workstream. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `hadara@0.3.4-rc.0` is published on npm with `next`. | T-0418 publish note and reviewer direction. | Recycle will fail at registry version or install steps. |
| Stable `0.3.4` should not be decided until this recycle passes. | Reviewer direction and handoff known problem. | Premature stable readiness decision without consumer install proof. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Use installed-package consumer proof, not source checkout proof. | Agent UX spec Workstream E and reviewer direction. | Use `hadara package recycle --execute --package hadara@next --expected-version 0.3.4-rc.0`. |
| Do not publish or mutate release tags. | T-0422 scope. | This task verifies only. |
| Record failed or blocked checks honestly. | AGENTS/HADARA rules. | If npm network/install fails, attach failed evidence rather than rewriting history. |
