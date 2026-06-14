# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| `.hadara/context/HADARA_CONTEXT.md` | Current-state routing and docs registry anchor. | Read |
| docs/PROJECT_STATE.md | Establishes rc.2 publish/recycle and T-0313/T-0314 follow-up state. | Read |
| docs/AGENT_HANDOFF.md | Records no immediate rc.2 blocker and next stable hardening/readiness selection. | Read |
| docs/TASK_BOARD.md | Task queue and T-0315 row. | Read |
| docs/IMPLEMENTATION_SOP.md | Docker validation and release workflow constraints. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/ready/close/audit lifecycle and write-boundary rules. | Read |
| docs/RELEASE_READINESS.md | Release target, evidence, and mutation boundaries. | Read |
| docs/RELEASE_NOTES.md | Release note history and stable entry target. | Read |
| Reviewer feedback attachment | Defines T-0315/T-0316 split and validation plan. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Stable 0.3.0 can proceed without another RC if readiness evidence passes. | Reviewer feedback and current handoff. | If validation exposes product risk, stable publish must stop and a new hardening/recycle capsule should be opened. |
| T-0315 must not mutate npm/GitHub/Docker/PyPI registries. | README/release readiness boundaries. | Mixing readiness with publish would weaken HADARA release discipline. |
| Release artifact may require a clean committed source candidate. | Release artifact dirty-worktree guard. | T-0315 may need a source-candidate checkpoint before release artifact evidence refresh. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Publish mutation is out of scope. | Reviewer feedback. | T-0316 handles approval-gated publish only after T-0315 closes. |
| Docker is the reproducible validation baseline. | AGENTS/SOP/Handoff. | Host Node dependencies may be unreliable on `/mnt/f`. |
| Release evidence must be reduced/public and token-free. | Release readiness docs. | No token values, private logs, or registry mutation evidence in T-0315. |
