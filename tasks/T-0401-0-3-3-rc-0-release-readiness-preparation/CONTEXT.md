# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| .hadara/context/HADARA_CONTEXT.md | Current-state read-routing anchor. | Read |
| docs/PROJECT_STATE.md | Current project state. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and validation constraints. | Read |
| docs/TASK_BOARD.md | Task queue and status. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation requirement. | Read |
| docs/TASK_WORKFLOW_COMMANDS.md | Finalize-first task lifecycle and close-source timing. | Read |
| docs/RELEASE_READINESS.md | Release metadata/readiness source. | Read |
| docs/RELEASE_NOTES.md | Release narrative source. | Read |
| tasks/T-0336-0-3-2-rc-0-release-readiness-preparation/* | Previous rc release-readiness pattern. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| `0.3.3-rc.0` should be prepared before stable `0.3.3`. | User accepted rc-first recommendation. | Publishing stable directly would skip recycle validation for major context/lifecycle behavior changes. |
| Release artifact generation requires a clean worktree. | docs/AGENT_HANDOFF.md and T-0336 pattern. | Source-candidate changes may need a checkpoint commit before artifact generation. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No publish mutation in this capsule. | T-0401 scope and release policy. | Only dry-run publish checks are allowed. |
| Use Docker validation and refreshed `dist` for HADARA-dev CLI changes. | AGENTS.md and handoff. | Built CLI release smokes must use current dist. |
| Record failed environment checks honestly. | AGENTS.md. | Sandbox npm/cache failures can be non-release blockers if rerun evidence passes. |
