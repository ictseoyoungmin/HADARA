# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm test | Run the default project test suite. | Yes | Blocked | Host dependencies are unavailable; focused Vitest command failed with `sh: 1: vitest: not found`. |
| npm run check | Run the full repository check when available. | Yes | Blocked | Docker validation was already blocked by approval usage limit in this session; full suite must run when Docker access is restored. |
| `git diff --check` | Check patch whitespace. | Yes | Passed | Command exited 0. |
| `node --check dashboard/visual-check.mjs` | Check visual gate JavaScript syntax without Playwright dependencies. | Yes | Passed | Command exited 0. |
| `node -e "...fixture parse/redaction..."` | Parse new projection fixtures and assert no raw project path strings. | Yes | Passed | Printed `visual projection fixtures parse and are redacted`. |
| `npm run test:focused -- tests/unit/dashboard-static.test.ts tests/unit/dashboard-core-route.test.ts tests/unit/dashboard-projection-store.test.ts` | Focused projection validation tests. | Yes | Blocked | Failed before tests because host `vitest` is not installed. |
| `npm run dashboard:build` | Rebuild static dashboard bundle. | Yes | Blocked | Failed because `node_modules/esbuild/lib/main.js` is missing. |
| `npm run dashboard:visual:docker` | Run Playwright/axe visual gate. | Yes | Blocked | Failed at Docker socket permission; prior escalated Docker validation was rejected by usage limit. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Projection fixtures are read-only/redacted; no new mutation surface. | Covered by redaction/static checks | Fixture strings are path-redacted and static tests assert no browser storage/mutation patterns. |
| Integration smoke | No | Integration surface is the visual gate runner; Docker execution blocked in this environment. | Blocked | Re-run Playwright/axe gate when Docker access is available. |
