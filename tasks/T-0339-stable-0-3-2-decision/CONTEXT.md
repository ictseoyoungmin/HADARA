# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| AGENTS.md | Root HADARA protocol and required reading. | Read |
| .hadara/context/HADARA_CONTEXT.md | Compact current-state routing. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and next task. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Task lifecycle semantics. | Read |
| docs/DEVELOPMENT_SLICES.md | T-0339 planned slice status. | Read |
| docs/specs/0.3.2/02_Worker_Agent_Instructions.md | 0.3.2 release-line worker routing and docs-only validation policy. | Read |
| docs/specs/0.3.2/00_Evidence_v2_Refactor_Release_Design.md | Release-line design and T-0339 sequencing. | Read |
| docs/specs/0.3.2/capsules/T-0339_Stable_0_3_2_Decision.md | Capsule-specific decision inputs and acceptance. | Read |
| docs/RELEASE_READINESS.md | Release-candidate line wording being corrected. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0338 is complete and not active. | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, T-0338 capsule. | Release decision inputs could incorrectly imply recycle is still underway. |
| This first T-0339 slice can be docs-only. | User request and T-0339 spec inputs. | Stable publish decision still needs explicit follow-up if not completed here. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No publish or registry mutation in this cleanup. | T-0339 spec and release policy. | Stable publish, rc1, or deferral remains decision work. |
| Use docs-only validation unless runtime/generated docs change. | `docs/specs/0.3.2/02_Worker_Agent_Instructions.md`. | Run `git diff --check` and targeted text checks. |
