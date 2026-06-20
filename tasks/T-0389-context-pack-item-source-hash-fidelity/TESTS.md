# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `timeout 300 docker exec hadara-dev bash -lc '... npm run test:focused -- tests/unit/context-pack.test.ts'` | Focused context pack regression test in Docker temp copy. | Yes | Passed: 1 file / 8 tests. | `ev:T-0389:61eafa48eb174f6ea4051e36` |
| `npm run dev:docker-sync-build` | Full Docker check/build/dist refresh. | Yes | Passed: 138 files / 909 tests; `distLooksStale:false`. | `ev:T-0389:7e68c43ca20f44409d090d95` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No read boundary policy changed. | Not Run | Not required |
| Integration smoke | No | Full Docker sync-build covered schema and command adjacency. | Not Run | Not required |
