# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/session-start.test.ts tests/unit/context-pack.test.ts tests/unit/context-cache-store.test.ts` | Host focused attempt before Docker validation. | No | Failed: host `vitest` was unavailable in this workspace; Docker is the project baseline. | Not recorded |
| `npm run dev:docker-check` | Build and run full Docker validation. | Yes | Passed: 136 files / 897 tests. | `ev:T-0379:752358a1a77147e6a2d52a04` |
| `npm run dev:docker-sync-build` | Build, run full Docker validation, and refresh workspace `dist`. | Yes | Passed: 136 files / 897 tests; `dist` refreshed and version smoke reported `build.distLooksStale:false`. | `ev:T-0379:e80bf2ffaa394eb899ef88b3` |
| `node dist/cli/main.js evidence lint --task T-0379 --json` | Verify task evidence JSONL/Markdown consistency. | Yes | Passed: 3 records, 3 Markdown rows, 0 errors, 0 warnings before the lint evidence record was appended. | `ev:T-0379:ef7d014317e24701bd2b61a8` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI warm/session-start smoke | Yes | Prove refreshed `dist` can warm graph-core/code-index cache and default Session Start consumes it read-only. | Passed: `context cache warm --execute` wrote graph-core/code-index shards, then `session start --task T-0379 --include-code` returned `ok:true`, `cache.mode:"graph-core+code-index"`, and `sourceManifestFastPath:"hit"`. | `ev:T-0379:fb174f9ca4254d2b9aa4bec9` |
| Security smoke | No | No new permission, secret, or local-private read surface was added. | Not Run | N/A |
| Integration smoke | No | Covered by built CLI warm/session-start smoke. | Passed | `ev:T-0379:fb174f9ca4254d2b9aa4bec9` |
