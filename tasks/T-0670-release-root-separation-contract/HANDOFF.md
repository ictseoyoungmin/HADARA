# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0670 |
| Title | Release root separation contract |
| Status | Done |
| Created | 2026-07-21T21:50 |
| Updated | 2026-07-21T22:10 |
## Last Completed

| Item | Evidence |
|---|---|
| Implemented root-role separation for `smoke package` and `package recycle`. | ev:T-0670:455c6f9b9c8a4ca986844853, ev:T-0670:a0db4de46a804dacac1d6aab |
| Documented public root-role contract in command registry, schemas, CLI JSON contract, and release readiness guidance. | ev:T-0670:455c6f9b9c8a4ca986844853, ev:T-0670:e2ca46f628b54ac588f271ab |
| Refreshed built CLI from Docker after source changes. | ev:T-0670:9912888711ee486e8844c6c0 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Close T-0670 and commit, then start T-0671 Release Artifact Evidence Journal. | T-0670 validation is complete; remaining reviewer capsules are separate release-readiness recycle work. | `docs/TASK_WORKFLOW_COMMANDS.md`, reviewer release recycle plan |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Full `npm run check` failed once in sandbox with `spawnSync git EPERM` inside `status-adapters.test.ts`. | Not a T-0670 code failure; sandbox blocked test-local `git init`. | Approved external rerun passed 166 files / 1226 tests. |
| T-0671 through T-0675 remain unstarted. | Release-readiness recycle design is not complete after T-0670 alone. | Continue with T-0671 Release Artifact Evidence Journal next. |
