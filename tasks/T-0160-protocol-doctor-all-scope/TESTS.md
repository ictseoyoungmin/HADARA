# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused protocol tests | Validate all-scope protocol behavior. | Yes | Passed | `npx vitest run tests/unit/protocol-consistency.test.ts tests/unit/protocol-cli.test.ts` passed with 2 files / 27 tests. |
| Docker `npm run check` | Full repository validation. | Yes | Passed | 61 files / 459 tests passed. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI all-scope smoke | Yes | Verify refreshed workspace CLI supports the new scope. | Passed | `protocol doctor --scope all --json` and default `protocol doctor --json` both returned `scope: all`, `ok: true`. |
| Done-level harness and protocol doctors | Yes | Confirm completion state after docs and capsule updates. | Passed | Built CLI done-level harness returned `ok: true`; task, all-scope, and docs-scope protocol doctors returned `ok: true`. |
| Security smoke | No | No security boundary changes. | Not Run | Not applicable. |
| Integration smoke | No | No MCP/provider/dashboard surface changes. | Not Run | Not applicable. |
