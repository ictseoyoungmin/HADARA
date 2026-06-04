# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:focused -- tests/unit/release-dry-run.test.ts tests/unit/schema-runtime.test.ts | Validate Python preview parser output and schema compatibility. | Yes | Passed | Docker `/tmp/hadara`: 2 files / 27 tests passed. |
| npm run check | Run the full repository check when available. | Yes | Passed | Docker `/tmp/hadara`: 92 files / 616 tests passed. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI Python preview smoke | Yes | Confirms release dry-run emits Python preview metadata without execution. | Passed | Temp `pyproject.toml` smoke detected package name/version, hatch backend, and planned commands with `willExecute:false`. |
