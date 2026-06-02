# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/dashboard-heavy-projection.test.ts tests/unit/dashboard-refresh.test.ts` | Run focused heavy projection tests. | Yes | Blocked: host `vitest` not installed (`sh: 1: vitest: not found`). | Command output observed 2026-06-02. |
| `npm run dev:docker-sync-build` | Run Docker build/test/smoke and refresh `dist`. | Yes | Blocked in this environment by Docker escalation usage limit. | Carry-forward validation gap from T-0217/T-0220. |
| `git diff --check` | Check patch whitespace and apply cleanliness. | No | Passed. | Command output observed 2026-06-02. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Missing projection no-scan | Yes | New projection routes must not compute heavy reads on foreground request. | Covered by focused test file; execution pending Docker availability. | `tests/unit/dashboard-heavy-projection.test.ts`. |
| Redacted heavy projection storage | Yes | Timeline/debt projection files must not include raw project roots. | Covered by focused test file; execution pending Docker availability. | `tests/unit/dashboard-heavy-projection.test.ts`. |
