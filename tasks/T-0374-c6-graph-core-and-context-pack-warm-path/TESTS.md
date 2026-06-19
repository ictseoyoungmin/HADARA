# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/context-cache-store.test.ts tests/unit/context-pack.test.ts tests/unit/context-graph-builder.test.ts tests/unit/context-graph-cli.test.ts` | Focused cache/graph/pack/CLI regression coverage. | Yes | Passed in Docker: 4 files / 33 tests. Host attempt failed because `vitest` was not installed. | `ev:T-0374:860bb8bc1a8845eb8fd03eb8` |
| `npm run dev:docker-sync-build` | Full Docker sync-build and dist refresh for CLI changes. | Yes | Passed in Docker: 134 files / 882 tests; `dist` refreshed and freshness smoke passed. | `ev:T-0374:86aabccd90cc46b3875731f7` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI cache warm/graph/pack smoke | Yes | Proves warmed read behavior from refreshed `dist`. | Passed from Docker against `/workspace/dist`: graph-core executed, graph cache mode `graph-core` hit true, pack cache mode `graph-core` hit true, `pack.ok:true`. Host nested `spawnSync node` smoke failed with environment `EPERM`, so Docker workspace-dist smoke is the authoritative built proof. | `ev:T-0374:1500f663db95403ea409838c` |
| `git diff --check` | Yes | Prevents whitespace drift in docs/code. | Passed. | `ev:T-0374:1500f663db95403ea409838c` |
