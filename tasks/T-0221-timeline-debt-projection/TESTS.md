# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/dashboard-heavy-projection.test.ts tests/unit/dashboard-refresh.test.ts` | Run focused heavy projection tests. | Yes | Blocked: host `vitest` not installed (`sh: 1: vitest: not found`). | Command output observed 2026-06-02. |
| `npm run dev:docker-sync-build` | Run Docker build/test/smoke and refresh `dist`. | Yes | Passed: 90 test files / 582 tests; built CLI version smoke `ok:true`; `distLooksStale:false`. | Command output observed 2026-06-02 after follow-up. |
| `git diff --check` | Check patch whitespace and apply cleanliness. | No | Passed. | Command exited 0 after follow-up. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Missing projection no-scan | Yes | New projection routes must not compute heavy reads on foreground request. | Passed in Docker sync-build. | `tests/unit/dashboard-heavy-projection.test.ts`. |
| Redacted heavy projection storage | Yes | Timeline/debt projection files must not include raw project roots. | Passed in Docker sync-build. | `tests/unit/dashboard-heavy-projection.test.ts`. |
