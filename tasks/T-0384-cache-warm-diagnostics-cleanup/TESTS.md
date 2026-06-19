# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run dev:docker-check` | Full Docker validation without dist sync. | Yes | Passed: 137 files / 902 tests. | `ev:T-0384:5cf534a97e2c4ff7a8355fd6` |
| `npm run dev:docker-sync-build` | Full Docker validation and dist refresh. | Yes | Passed: 137 files / 902 tests; `distLooksStale:false`. | `ev:T-0384:5cf534a97e2c4ff7a8355fd6` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Schema JSON parse | Yes | Diagnostics schemas must remain valid JSON. | Passed. | `ev:T-0384:5cf534a97e2c4ff7a8355fd6` |
| `node dist/cli/main.js context cache status --json` | Yes | Built CLI should emit diagnostics from refreshed dist. | Passed: emitted `diagnostics.state:"stale"`, mounted/fullManifestBuilt metadata, manifest counts, planned shard keys, and command args. | `ev:T-0384:5cf534a97e2c4ff7a8355fd6` |
