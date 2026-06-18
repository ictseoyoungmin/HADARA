# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/context-graph-builder.test.ts tests/unit/context-state-projection.test.ts tests/unit/context-graph-schema.test.ts` | Run focused builder/projection/schema coverage. | Yes | Passed: 3 files / 9 tests in Docker `/tmp/hadara`. | ev:T-0351:8783d5087eed426ca228ce02 |
| `npm run build` | Run TypeScript build. | Yes | Passed in Docker `/tmp/hadara`. | ev:T-0351:8783d5087eed426ca228ce02 |
| `npm run check` | Run the full repository check when available. | Yes | Passed: 128 files / 821 tests in Docker `/tmp/hadara`. | ev:T-0351:8783d5087eed426ca228ce02 |
| Built CLI version smoke | Confirm refreshed `/workspace/dist` is not stale. | Yes | Passed: `distLooksStale:false`. | ev:T-0351:8783d5087eed426ca228ce02 |
| `git diff --check` | Check whitespace errors. | Yes | Passed. | ev:T-0351:8783d5087eed426ca228ce02 |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No permission, secret, or storage boundary changed. | Not Run | Not required. |
| Integration smoke | No | No public CLI/read surface added in this capsule. | Not Run | Deferred to CLI integration capsule. |
