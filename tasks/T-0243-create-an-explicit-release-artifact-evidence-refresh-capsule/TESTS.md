# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run dev:docker-check` | Validate build and full test suite without host `node_modules`. | Yes | Passed: 92 files, 612 tests. | Docker check output. |
| `npm run dev:docker-sync-build` | Validate full suite and refresh `/workspace/dist`. | Yes | Passed: 92 files, 612 tests; `distLooksStale:false`. | Docker sync-build output. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI release artifact blocked-refresh smoke | Yes | Confirms the guard blocks misleading release evidence from the current dirty worktree. | Passed as expected with exit 6: `RELEASE_ARTIFACT_WORKTREE_DIRTY`, `npmPackExecuted:false`, no artifacts generated. | `node dist/cli/main.js release artifact --execute --json --output dist-release --attach-evidence --task T-0243`. |
| Security smoke | No | No token, publish, GitHub Release, Docker image, installer, or permission boundary was added. | Not Run | Constraint recorded. |
| Integration smoke | No | Actual release artifact refresh is deferred until the worktree is clean. | Not Run | Blocked by dirty-worktree guard. |
