# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `docker exec hadara-dev bash -lc 'cd /tmp/hadara && npm test -- --run tests/unit/dashboard-static.test.ts'` | Run the dashboard static/API regression file in the Docker validation copy. | Yes | Passed: 15 tests, route test 945ms, file 3.31s. | `ev:T-0419:e37deeb8c81f4c19a6bea6e2` |
| `docker exec hadara-dev bash -lc 'cp -R /tmp/hadara/dist/. /workspace/dist/'` | Refresh workspace `dist` after CLI code changes. | Yes | Passed. | `ev:T-0419:b1f6d6d0181f402589a639fe` |
| `git diff --check` | Check whitespace before finalize/commit. | Yes | Passed. | `ev:T-0419:d0d48622b5b94495b1f0d2c2` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Timeout reproduction | Yes | Confirms the fix addresses the observed publish-blocking dashboard route timeout. | Failed first focused validation reproduced timeout; later passed evidence resolves it. | `ev:T-0419:f78eb0dda4304353b04e7e79`, `ev:T-0419:058774b754bf45f2b904e093` |
| Full repository suite | No | The requested scope is a publish-blocking focused dashboard bottleneck; T-0418 publish helper can rerun full checks after clone refresh. | Not Run in this capsule. | Scope note |
