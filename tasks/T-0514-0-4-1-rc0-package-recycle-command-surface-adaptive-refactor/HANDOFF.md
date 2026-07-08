# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Package recycle now reads installed `commands --json`, prefers current `task status --task <id> --json`, and falls back to legacy `task lifecycle` only when `task.status` is unavailable. | `ev:T-0514:1083145ebdba460894fab691` |
| `hadara.packageRecycle.v1` reports additive `commandSurfaceExecuted` and `taskStatusExecuted` flags while preserving `taskLifecycleExecuted` for older consumers. | `ev:T-0514:1083145ebdba460894fab691` |
| Focused tests, schema fixture validation, TypeScript build, and built CLI dry-run passed. | `ev:T-0514:1083145ebdba460894fab691`, `ev:T-0514:dd3b69febfc54c98aeeb4741`, `ev:T-0514:8c6f62d144b74da281d7880f` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Decide whether to run another live installed-package recycle before 0.4.1 stable planning. | T-0513 already proved `0.4.1-rc.0`; T-0514 only refactors source/helper behavior and validates it with focused tests/dry-run. | `docs/RELEASE_READINESS.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Legacy fallback intentionally calls `task lifecycle` only for older installed packages without `task.status`. | Current packages must not use removed lifecycle surfaces in recycle. | Keep the current-surface regression test in `tests/unit/package-recycle.test.ts`. |
