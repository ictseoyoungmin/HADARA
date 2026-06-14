# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused Vitest | `npm run test:focused -- tests/unit/docs-patch.test.ts tests/unit/core-fs.test.ts tests/unit/init.test.ts tests/unit/evidence-parallel-append.test.ts` in Docker temp copy. | Yes | Passed: 4 files / 31 tests. | `command:T-0314:validation` |
| npm run dev:docker-sync-build | Full Docker build/test and workspace `dist` refresh. | Yes | Passed: 118 files / 763 tests; runtime smoke `distLooksStale:false`. | `command:T-0314:validation` |
| Built CLI docs patch smoke | Fresh standard init, `docs patch` dry-run, execute with reviewed before-hash, and Task Board content assertion. | Yes | Passed: `ok:true`, issues 0, changed true, target contained patched row. | `command:T-0314:validation` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Host `npm run test:focused` | No | Host `node_modules` are not the validation baseline. | Failed before Docker because `vitest` was not installed on host. | Recorded in notes; Docker focused passed. |
| First Docker full run | No | Diagnostic only. | Failed once: stale README rc.1 test expectation and transient evidence contention timeout; both passed after correction/rerun. | `command:T-0314:validation` |
