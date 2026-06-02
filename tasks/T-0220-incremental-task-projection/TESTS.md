# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/dashboard-task-projection.test.ts tests/unit/dashboard-refresh.test.ts tests/unit/dashboard-core-route.test.ts` | Run focused incremental task projection and route refresh tests. | Yes | Blocked: host `vitest` not installed (`sh: 1: vitest: not found`). | Command output observed 2026-06-02. |
| `npm run dev:docker-sync-build` | Run Docker build/test/smoke and refresh `dist`. | Yes | Passed: 90 test files / 582 tests; built CLI version smoke `ok:true`; `distLooksStale:false`. | Command output observed 2026-06-02 after follow-up. |
| `git diff --check` | Check patch whitespace and apply cleanliness. | No | Passed. | Command exited 0 after follow-up. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Unchanged task reuse | Yes | T-0220 performance contract is avoiding rereads for unchanged task bodies. | Passed in Docker sync-build. | `tests/unit/dashboard-task-projection.test.ts`. |
| Redacted projection storage | Yes | Projection cache must not expose raw project paths. | Passed in Docker sync-build. | `tests/unit/dashboard-task-projection.test.ts`. |
