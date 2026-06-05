# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused release dry-run/schema tests | Verify additive warning/advisory behavior and schema runtime compatibility. | Yes | Passed | `docker exec hadara-dev ... npm run test:focused -- tests/unit/release-dry-run.test.ts tests/unit/schema-runtime.test.ts` passed 2 files / 31 tests. |
| Docker npm run check | Run the full repository check in the Docker temp-copy baseline. | Yes | Passed | `docker exec hadara-dev ... npm run check` passed 92 files / 626 tests; `/workspace/dist` refreshed from the Docker build output. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Built CLI release dry-run smoke | Yes | Confirms refreshed `/workspace/dist` emits the additive diagnostics field. | Passed with expected blocker | Built `release dry-run --json --project /workspace` emitted `diagnostics.advisories: []`; exit 6 was expected because release artifact evidence is stale for the current development commit. |
