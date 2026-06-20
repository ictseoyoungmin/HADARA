# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker temp-copy focused `npm run test:focused -- tests/unit/context-pack.test.ts tests/unit/context-graph-cli.test.ts tests/unit/session-start.test.ts tests/unit/schema-fixtures.test.ts` | Verify context pack metadata, CLI/schema adjacency, and Session Start compatibility. | Yes | Passed: 4 files / 27 tests. | `ev:T-0388:d63eccfe33c34ca3a3990647` |
| `npm run dev:docker-sync-build` | Full Docker suite, build, dist refresh, and built CLI version smoke. | Yes | Initial run timed out one unrelated `evidence-parallel-append` concurrency test after 137 files / 907 tests passed; retry passed 138 files / 908 tests and `distLooksStale:false`. | `ev:T-0388:7faddfa5522e43c9adbb2988`, `ev:T-0388:d63eccfe33c34ca3a3990647` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Context pack source-access regression | Yes | This task changes how read recommendations expose raw slice boundary information. | Passed in focused context-pack tests. | `ev:T-0388:d63eccfe33c34ca3a3990647` |
| Built CLI dist freshness smoke | Yes | CLI/source/schema changed and workspace `dist` must be current. | Passed: full sync-build retry refreshed dist and version smoke reported `distLooksStale:false`. | `ev:T-0388:d63eccfe33c34ca3a3990647` |
