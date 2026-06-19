# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused temp-workspace `npm run build` + `npm run test:focused -- tests/unit/code-index.test.ts tests/unit/context-cache-store.test.ts` | Focused C6/code-index cache regression coverage. | Yes | Passed: 2 files / 26 tests | `ev:T-0377:0dc1b0f01e0f4902aebe2b82` |
| Docker ext4 temp-workspace `npm run build` | TypeScript/schema validation before dist sync. | Yes | Passed through sync-build | `ev:T-0377:d6bf4440e99f41938bef26e7` |
| Docker ext4 temp-workspace `npm run check` | Full repository regression validation. | Yes | Passed: 135 files / 891 tests | `ev:T-0377:d6bf4440e99f41938bef26e7` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI `version --verbose --json` | Yes | Confirms refreshed `dist` after CLI/source changes. | Passed through sync-build; `distLooksStale:false` | `ev:T-0377:d6bf4440e99f41938bef26e7` |
| Built CLI `context cache warm --execute --json` smoke | Yes | Confirms public warm execute still writes valid cache output. | Passed; code-index per-file stats reported on warm item | `ev:T-0377:b6d0843a157743f7b681170c` |
| Built CLI `context graph --include-code --json` smoke | Yes | Confirms read-only include-code path still consumes fresh shard. | Passed for task `T-0377`; output `ok:true` | `ev:T-0377:811d2af2ef5142b4be235cc2` |
| `git diff --check` | Yes | Prevents whitespace drift. | Passed | `ev:T-0377:96876f787b9c4600a3b65f28` |

## Failed/Retried Checks

| Command | Result | Follow-up |
|---|---|---|
| Initial `npm run dev:docker-check` | Failed before import fix: `context-cache-store.test.ts` imported `codeIndexFileSummaryCachePath` from the wrong module; `release-dry-run` also timed out in that run. | Fixed import, reran focused Docker validation and full sync-build successfully. Evidence: `ev:T-0377:c42f2d5964644b8a9167277f`. |
