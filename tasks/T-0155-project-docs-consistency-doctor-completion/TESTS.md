# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npx vitest run tests/unit/protocol-consistency.test.ts tests/unit/protocol-cli.test.ts tests/unit/cli-errors.test.ts` | Run focused protocol consistency, CLI, and error-code coverage. | Yes | Passed | Docker temp-copy passed with 3 files and 15 tests. |
| `npm run check` | Run the full repository check in Docker. | Yes | Passed | Docker temp-copy passed with 60 files and 434 tests. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Built CLI smoke | Yes | Verify refreshed `/workspace/dist` after CLI changes. | Passed | `/workspace/dist` refreshed from `/tmp/hadara/dist`; docs/task doctor smokes returned `ok: true`, and `--task` plus `--scope` returned `CLI_OPTION_INVALID_VALUE`. |
