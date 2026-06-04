# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/package-smoke-dry-run.test.ts tests/unit/package-smoke-schema.test.ts tests/unit/schema-runtime.test.ts | Validate Python package smoke dry-run/local report and schema compatibility. | Yes | Passed | Docker `/tmp/hadara`: 3 files / 41 tests passed. |
| npm run check | Run the full repository check when available. | Yes | Passed | Docker `/tmp/hadara`: 92 files / 619 tests passed. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI Python package smoke dry-run | Yes | Confirms public CLI report emits Python planned steps without execution. | Passed | `package smoke --provider python --json` returned planned Python steps and all execution/publish flags false. |
