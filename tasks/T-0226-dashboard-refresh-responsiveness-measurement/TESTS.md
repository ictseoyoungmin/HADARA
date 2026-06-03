# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/dashboard-refresh.test.ts tests/unit/dashboard-task-projection.test.ts tests/unit/dashboard-static.test.ts tests/unit/dashboard-refresh-measurement-script.test.ts` | Focused dashboard refresh, task projection, fixture, and measurement-script checks. | Yes | Passed | Docker focused tests passed 4 files / 23 tests. |
| `npm run dev:docker-sync-build` | Docker full check/build and refresh workspace `dist`. | Yes | Passed | Passed 91 files / 592 tests; built CLI smoke `ok:true`, `distLooksStale:false`. |
| `node scripts/dashboard-refresh-responsiveness.mjs --project /workspace --samples 8 --compare-tmp --json` | Built measurement smoke from Docker workspace path, including `/workspace` vs `/tmp` comparison. | Yes | Passed | `ok:true`; workspace core p50/p95 49.6/62.0 ms; tmp-ext4 core p50/p95 0.5/1.6 ms. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
