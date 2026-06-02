# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/dashboard-core-route.test.ts tests/unit/dashboard-projection-store.test.ts` | Run focused core route and projection store tests. | Yes | Blocked: host `vitest` not installed (`sh: 1: vitest: not found`). | Command output observed 2026-06-02. |
| `npm run dev:docker-sync-build` | Run Docker build/test/smoke and refresh `dist`. | Yes | Passed: 90 test files / 582 tests; built CLI version smoke `ok:true`; `distLooksStale:false`. | Command output observed 2026-06-02 after follow-up. |
| `git diff --check` | Check patch whitespace and apply cleanliness. | No | Passed. | Command exited 0 after follow-up. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Request-path scan guard | Yes | T-0218 performance contract is no all-capsule scan on `/api/dashboard/core`. | Passed in Docker sync-build. | `tests/unit/dashboard-core-route.test.ts`. |
| Projection warm read | Yes | Core route should return immediately from local projection after first cheap read. | Passed in Docker sync-build. | `tests/unit/dashboard-core-route.test.ts`. |
