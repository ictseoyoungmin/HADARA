# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run dev:docker-sync-build` | Full Docker validation and dist refresh. | Yes | Passed: 137 files / 901 tests; `distLooksStale:false`. | `ev:T-0383:d013f3d6e2be494bb6372a41` |
| `tests/unit/context-routing-e2e-smoke-script.test.ts` in full Docker suite | Focused script/context-routing adjacency. | Yes | Passed: 3 tests, including full fake CLI profile. | `ev:T-0383:d013f3d6e2be494bb6372a41` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| `node scripts/context-routing-e2e-smoke.mjs --task T-0383 --timeout-ms 20000` | Built CLI fast E2E smoke for Session Start and Slice plus cache fingerprint boundary. | Yes | Passed: 4 workloads, cache unchanged, 15.7s after dist refresh. | `ev:T-0383:d013f3d6e2be494bb6372a41` |
| Extended mounted probes | No | Cache/graph/pack are selectable but too slow for fast default. | Observed 20s timeout for cache status/warm, graph task, graph include-code, and context pack; cache unchanged. | `ev:T-0383:d013f3d6e2be494bb6372a41` |
