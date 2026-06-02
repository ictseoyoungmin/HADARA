# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/dashboard-refresh.test.ts tests/unit/dashboard-core-route.test.ts tests/unit/dashboard-projection-store.test.ts` | Run focused Phase 5.7 projection route tests. | Yes | Blocked: host `vitest` not installed (`sh: 1: vitest: not found`). | Command output observed 2026-06-02. |
| `npm run dev:docker-sync-build` | Run Docker build/test/smoke and refresh `dist`. | Yes | Blocked in this environment by Docker escalation usage limit. | Carry-forward validation gap from T-0217/T-0218. |
| `git diff --check` | Check patch whitespace and apply cleanliness. | No | Passed. | Command output observed 2026-06-02. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Refresh coalescing | Yes | Concurrent refresh triggers should not spawn duplicate work. | Covered by focused test file; execution pending Docker availability. | `tests/unit/dashboard-refresh.test.ts`. |
| Metadata-only projection status | Yes | Status route must not expose cached projection bodies. | Covered by focused test file; execution pending Docker availability. | `tests/unit/dashboard-refresh.test.ts`. |
