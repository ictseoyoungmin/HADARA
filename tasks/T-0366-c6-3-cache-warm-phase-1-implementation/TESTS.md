# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run dev:docker-check` | Full Docker validation before `dist` refresh. | Yes | Passed: 133 files, 861 tests. | `ev:T-0366:bb820cfa71dd40659552eb35` |
| `npm run dev:docker-sync-build` | Full Docker validation, `dist` refresh, and built CLI version smoke for CLI changes. | Yes | Passed: 133 files, 861 tests; `distLooksStale:false`. | `ev:T-0366:35afe89a67644c92b2434ef6` |
| Built CLI smokes | Verify `context cache warm --json`, `--execute --json`, fresh no-op, and status hit from `dist`. | Yes | Passed: dry-run planned write, execute wrote source manifest, status reported hit, second execute skipped fresh cache. | `ev:T-0366:4f6faf93c8a545c3bd703eef` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Writes stay in ignored local cache via existing atomic helper. | Covered by code review and CLI smoke; no source/docs mutation from warm execute. | `ev:T-0366:4f6faf93c8a545c3bd703eef` |
| Integration smoke | Yes | Public CLI write surface changes. | Passed via built CLI smokes. | `ev:T-0366:4f6faf93c8a545c3bd703eef` |
