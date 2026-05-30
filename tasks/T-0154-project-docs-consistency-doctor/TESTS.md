# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npx vitest run tests/unit/protocol-consistency.test.ts tests/unit/protocol-cli.test.ts tests/unit/cli-errors.test.ts` | Run focused protocol consistency service, CLI, and error-code coverage. | Yes | Passed | Docker temp-copy passed with 3 files and 13 tests. |
| `npm run check` | Run the full repository check when available. | Yes | Passed | Docker temp-copy passed with 60 files and 432 tests. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Built CLI smoke | Yes | New CLI mode should be verified through the built command surface. | Passed | Built CLI `protocol doctor --scope docs --json --project /workspace` returned `ok: true`; task mode for T-0154 also returned `ok: true`. |
