# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/release-dry-run.test.ts tests/unit/schema-runtime.test.ts | Focus release dry-run provider capabilities and schema compatibility. | Yes | Passed | Docker `/tmp/hadara`: 2 files / 26 tests passed. |
| npm run check | Run the full repository check when available. | Yes | Passed | Docker `/tmp/hadara`: 92 files / 615 tests passed. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI release dry-run smoke | Yes | Confirms public CLI report includes provider capabilities without mutation. | Passed with expected blocker | Built CLI emitted `providerCapabilities`; exit 6 was the expected release artifact freshness blocker for current HEAD. |
