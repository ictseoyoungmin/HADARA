# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state. | Done |
| docs/AGENT_HANDOFF.md | Current handoff. | Done |
| docs/TASK_BOARD.md | Task queue and status. | Done |
| docs/IMPLEMENTATION_SOP.md | Workflow rules. | Done |
| docs/DEVELOPMENT_SLICES.md | Slice order and release-candidate history. | Done |
| docs/TASK_WORKFLOW_COMMANDS.md | Finish/close/audit and release-adjacent workflow semantics. | Done |
| docs/TEST_STRATEGY.md | Docker validation and package-smoke boundaries. | Done |
| docs/SECURITY_MODEL.md | Secret and mutation boundaries. | Done |
| docs/RELEASE_READINESS.md | Current release metadata, target, token, and publish boundaries. | Done |
| docs/RELEASE_NOTES.md | Release-candidate notes. | Done |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| T-0272 through T-0274 fixed the rc.0 recycle findings intended for rc.1. | Project state and handoff. | Publishing rc.0 would omit those fixes. |
| The operator wants a state where npm login plus the manual helper `--execute` can publish. | User request. | This capsule must leave clear evidence and instructions, but the agent must not publish. |
| A clean committed source state is required before real publish. | Release artifact dirty-worktree guard and manual helper preflight. | Evidence writes will dirty the worktree during preparation; operator should commit final state before running `--execute`. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not print or store npm/GitHub token values. | SECURITY_MODEL and RELEASE_READINESS. | Token checks may report only present/missing status. |
| Do not run `npm publish` or create GitHub Releases in this agent pass. | User boundary and capsule scope. | Manual helper is prepared but final mutation remains operator-only. |
| Use Docker validation as the baseline. | TEST_STRATEGY and AGENT_HANDOFF. | Host Node/npm state is disposable. |
