# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current Phase 3 complete state and runtime confusion known problem. | Read |
| docs/AGENT_HANDOFF.md | Latest validation baseline and CLI build path caveats. | Read |
| docs/TASK_BOARD.md | Task queue and capsule paths. | Read |
| docs/IMPLEMENTATION_SOP.md | Docker workflow, evidence, close, and commit rules. | Read |
| docs/DEVELOPMENT_SLICES.md | Phase 3.5 slice registration. | Read |
| docs/ROADMAP.md | Phase ordering before Dashboard/TUI work. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Runtime version reports should be read-only diagnostics. | Operator feedback. | If it mutates git config or build outputs, it crosses into T-0179 scope. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not auto-build or refresh dist. | T-0178 scope. | Report stale state only. |
| Git metadata may require safe-directory handling in Docker mounts. | Validation smoke. | Use `git -c safe.directory=<projectRoot>` for read-only metadata. |
