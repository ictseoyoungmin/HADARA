# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Done |
| docs/AGENT_HANDOFF.md | Current handoff. | Done |
| docs/TASK_BOARD.md | Task queue and status. | Done |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Done |
| docs/DEVELOPMENT_SLICES.md | Roadmap and completion state. | Done |
| docs/TASK_WORKFLOW_COMMANDS.md | Current lifecycle command semantics. | Done |
| docs/TEST_STRATEGY.md | Validation baseline and Docker guidance. | Done |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `hadara init` docs should be self-sufficient for new projects. | User report and current root SOP. | New users keep following outdated lifecycle guidance. |
| The command implementations are already current. | T-0238/T-0255/T-0274 lifecycle history and tests. | A broader command behavior change would expand scope unnecessarily. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Generated docs must stay profile-aware. | Existing init profile tests. | Basic profile should not reference optional standard/governed docs. |
| Workflow commands must remain explicit and non-overlapping. | `docs/TASK_WORKFLOW_COMMANDS.md`. | No generated guidance should imply hidden completion execution. |
