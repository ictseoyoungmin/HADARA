# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused temp-copy `npm run test:focused -- tests/unit/context-slice.test.ts tests/unit/context-pack.test.ts tests/unit/context-graph-cli.test.ts` | Validate slice/pack/graph boundary adjacency. | Yes | Passed: 3 files / 31 tests. | `ev:T-0387:561d66c217184e529964d5ee` |
| `npm run dev:docker-sync-build` | Full Docker suite and dist refresh. | Yes | Initial run timed out in `tests/unit/protocol-consistency.test.ts` after 137 files passed; retry passed 138 files / 907 tests and refreshed `dist` with `distLooksStale:false`. | `ev:T-0387:2691a5ec97e045d2814f10f7`, `ev:T-0387:561d66c217184e529964d5ee` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Context pack denied-path regression | Yes | Security boundary changes must prove pack does not publish denied raw slice candidates. | Passed in focused context-pack unit tests. | `ev:T-0387:561d66c217184e529964d5ee` |
| Dist freshness smoke | Yes | CLI code changed and Docker sync-build must refresh workspace `dist`. | Passed: retry full sync-build reported `distLooksStale:false`. | `ev:T-0387:561d66c217184e529964d5ee` |
