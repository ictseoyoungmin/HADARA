# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current release/package state and T-0244 completion. | Read |
| docs/AGENT_HANDOFF.md | Current next step and stale artifact evidence warning. | Read |
| docs/TASK_BOARD.md | Task queue and T-0245 capsule row. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker/built CLI expectations. | Read |
| docs/RELEASE_READINESS.md | Release artifact evidence command and mutation boundary. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Package-smoke and clean-checkout smoke evidence remain current enough for release dry-run. | Latest built dry-run after T-0244 reported both checks passed. | If they become stale, this capsule may need to record the remaining blocker rather than forcing broader smoke regeneration. |
| Release artifact refresh must start from a clean git worktree. | T-0243 guard and handoff. | Running before committing scaffold/scope will fail with `RELEASE_ARTIFACT_WORKTREE_DIRTY`. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| No publish/deploy mutation. | Release readiness boundary. | The artifact command may stage package files locally and run `npm pack`, but must not publish or call registries/GitHub/Docker. |
| Public evidence must be reduced. | Evidence/release artifact contracts. | Attach only reduced report artifacts under the task capsule. |
| Use built workspace CLI after Docker sync-build. | AGENTS.md. | T-0244 refreshed `dist`; run `node dist/cli/main.js ...`. |
