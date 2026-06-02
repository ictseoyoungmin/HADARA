# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/dashboard-core-route.test.ts tests/unit/dashboard-projection-store.test.ts` | Run focused core route and projection store tests. | Yes | Blocked: host `vitest` not installed (`sh: 1: vitest: not found`). | Command output observed 2026-06-02. |
| `npm run dev:docker-sync-build` | Run Docker build/test/smoke and refresh `dist`. | Yes | Blocked in this environment by Docker escalation usage limit carried from T-0217. | Recorded as carry-forward validation gap. |
| `git diff --check` | Check patch whitespace and apply cleanliness. | No | Passed. | Command output observed 2026-06-02. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Request-path scan guard | Yes | T-0218 performance contract is no all-capsule scan on `/api/dashboard/core`. | Covered by focused test file; execution pending Docker availability. | `tests/unit/dashboard-core-route.test.ts`. |
| Projection warm read | Yes | Core route should return immediately from local projection after first cheap read. | Covered by focused test file; execution pending Docker availability. | `tests/unit/dashboard-core-route.test.ts`. |
