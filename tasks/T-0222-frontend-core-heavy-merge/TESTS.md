# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/dashboard-static.test.ts` | Run focused frontend/static source tests. | Yes | Blocked: host `vitest` not installed (`sh: 1: vitest: not found`). | Command output observed 2026-06-02. |
| `npm run dashboard:build` | Rebuild static dashboard bundle. | Yes | Blocked: missing host `node_modules/esbuild`. | Command output observed 2026-06-02. |
| `npm run dev:docker-sync-build` | Run Docker build/test/smoke and refresh `dist`. | Yes | Blocked in this environment by Docker escalation usage limit. | Carry-forward validation gap from T-0217/T-0221. |
| `git diff --check` | Check patch whitespace and apply cleanliness. | No | Passed. | Command output observed 2026-06-02. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Browser storage scan | Yes | Frontend must remain memory-only. | Covered by static source test; execution pending dependencies/Docker. | `tests/unit/dashboard-static.test.ts`. |
| Bundle refresh | Yes | Served HTML must reflect authored source. | Blocked by missing esbuild/Docker. | Carry forward to T-0223. |
