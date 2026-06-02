# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/dashboard-refresh.test.ts tests/unit/dashboard-core-route.test.ts tests/unit/dashboard-projection-store.test.ts` | Run focused Phase 5.7 projection route tests. | Yes | Blocked: host `vitest` not installed (`sh: 1: vitest: not found`). | Command output observed 2026-06-02. |
| `npm run dev:docker-sync-build` | Run Docker build/test/smoke and refresh `dist`. | Yes | Passed: 90 test files / 582 tests; built CLI version smoke `ok:true`; `distLooksStale:false`. | Command output observed 2026-06-02 after follow-up. |
| `git diff --check` | Check patch whitespace and apply cleanliness. | No | Passed. | Command exited 0 after follow-up. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Refresh coalescing | Yes | Concurrent refresh triggers should not spawn duplicate work. | Passed in Docker sync-build. | `tests/unit/dashboard-refresh.test.ts`. |
| Metadata-only projection status | Yes | Status route must not expose cached projection bodies. | Passed in Docker sync-build. | `tests/unit/dashboard-refresh.test.ts`. |
| Yielded manual refresh stages | Yes | Full manual refresh should not run task/heavy/core projection stages in one event-loop turn. | Passed in Docker sync-build. | `tests/unit/dashboard-refresh.test.ts`. |
