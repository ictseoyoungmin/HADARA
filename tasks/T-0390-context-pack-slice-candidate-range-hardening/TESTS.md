# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `timeout 300 docker exec hadara-dev bash -lc 'set -euo pipefail; workdir=/tmp/hadara-t0390-focused; rm -rf "$workdir"; mkdir -p "$workdir"; tar --exclude=.git --exclude=.hadara --exclude=node_modules --exclude=dist -cf - -C /workspace . \| tar -xf - -C "$workdir"; cd "$workdir"; npm ci --progress=false; npm run test:focused -- tests/unit/context-pack.test.ts tests/unit/context-slice.test.ts'` | Run focused context pack/slice regression coverage in a Docker temp copy. | Yes | Passed: 2 files / 19 tests. | `ev:T-0390:d6ab0cb842d3479faf06b351` |
| `npm run dev:docker-sync-build` | Run full Docker suite and refresh built `dist`. | Yes | Passed: 138 files / 909 tests; built version smoke reported `distLooksStale:false`. | `ev:T-0390:3696103d7d274411b7cc706f` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | This task did not change raw read boundaries. | Not Run | Not applicable. |
| Dogfood scenario | Yes | The scenario was `context pack` slice candidates followed by `context slice --task --candidate`. | Passed by inspection and unit regression: candidate ranges now default to bounded windows instead of one-line anchors. | `ev:T-0390:d6ab0cb842d3479faf06b351` |
