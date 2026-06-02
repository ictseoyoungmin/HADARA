# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/dashboard-task-projection.test.ts tests/unit/dashboard-refresh.test.ts tests/unit/dashboard-core-route.test.ts` | Run focused incremental task projection and route refresh tests. | Yes | Blocked: host `vitest` not installed (`sh: 1: vitest: not found`). | Command output observed 2026-06-02. |
| `npm run dev:docker-sync-build` | Run Docker build/test/smoke and refresh `dist`. | Yes | Blocked in this environment by Docker escalation usage limit. | Carry-forward validation gap from T-0217/T-0219. |
| `git diff --check` | Check patch whitespace and apply cleanliness. | No | Passed. | Command output observed 2026-06-02. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Unchanged task reuse | Yes | T-0220 performance contract is avoiding rereads for unchanged task bodies. | Covered by focused test file; execution pending Docker availability. | `tests/unit/dashboard-task-projection.test.ts`. |
| Redacted projection storage | Yes | Projection cache must not expose raw project paths. | Covered by focused test file; execution pending Docker availability. | `tests/unit/dashboard-task-projection.test.ts`. |
