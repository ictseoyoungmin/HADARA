# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Read |
| docs/specs/rc3-proof-reliability/04_RC3_Readiness_and_Recycle.md | rc3 readiness and recycle scope. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `0.2.0-rc.3` is a source publish candidate, not a published npm package. | README and release readiness boundary. | Users could try to install an unpublished package if docs overclaim. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No publish, registry mutation, GitHub Release, Docker image, or token loading. | Release boundary. | This capsule is readiness-only. |
| `release artifact` requires a clean git worktree. | Dirty-worktree guard. | Requires a checkpoint commit before artifact refresh. |
