# Context

## Required Reading Used

| Document | Why It Matters | Read Status |
|---|---|---|
| docs/PROJECT_STATE.md | Current project state and release readiness context. | Read |
| docs/AGENT_HANDOFF.md | Current handoff and release artifact refresh next step. | Read |
| docs/TASK_BOARD.md | Task queue and capsule registration. | Read |
| docs/IMPLEMENTATION_SOP.md | Workflow rules and Docker validation path. | Read |
| docs/TEST_STRATEGY.md | Release artifact evidence flow and non-publish boundary. | Read |
| src/services/release-artifact.ts | Release artifact builder implementation and mutation boundary. | Read |
| src/services/release-artifact-evidence.ts | Evidence attachment and git commit metadata behavior. | Read |

## Assumptions

| Assumption | Source | Risk If Wrong |
|---|---|---|
| Release artifact evidence `gitCommit` should only be attached when the worktree is clean. | T-0242 release dry-run freshness check compares artifact git commit to current HEAD. | Dirty-worktree artifacts could appear fresh even when contents include uncommitted changes. |
| Blocking the refresh is preferable to creating false freshness. | Release readiness safety posture. | Operators may need an extra clean/commit step before evidence refresh. |

## Constraints

| Constraint | Source | Notes |
|---|---|---|
| Do not publish, create GitHub Releases, build Docker images, or run installers. | Release artifact service contract and TEST_STRATEGY. | The builder only stages package files, runs `npm pack`, and writes local artifacts when allowed. |
| Do not force-clean or commit unrelated work. | HADARA working tree safety rules. | Actual artifact refresh is deferred until the operator provides a clean worktree. |
