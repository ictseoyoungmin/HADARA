# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npx vitest run tests/unit/protocol-consistency.test.ts tests/unit/protocol-cli.test.ts` | Run focused protocol consistency service and CLI coverage. | Yes | Passed | Docker temp-copy passed with 2 files and 7 tests. Host `npx` was blocked by missing local dependencies after registry retry. |
| `npm run check` | Run the full repository check when available. | Yes | Passed | Docker temp-copy passed with 60 files and 429 tests. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| `node dist/cli/main.js protocol doctor --task T-0153 --json --project /workspace` | Built CLI smoke for the new read-only command. | Yes | Passed | Returned `ok: true`, `scope: "tasks"`, and zero issues. |
| Security smoke | No | No secret, permission, provider, or evidence artifact boundary changes are planned. | Not Run | Not applicable. |
| Integration smoke | No | No MCP/dashboard/provider/release integration surface changes are planned. | Not Run | Not applicable. |
