# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused protocol/schema tests | Validate the changed contract surface quickly. | Yes | Passed | `npx vitest run tests/unit/schema-fixtures.test.ts tests/unit/protocol-consistency.test.ts tests/unit/protocol-remediation.test.ts tests/unit/protocol-cli.test.ts` passed with 4 files / 34 tests. |
| Docker `npm run check` | Run the full repository check. | Yes | Passed | 61 files / 455 tests passed. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI schema smoke | Yes | CLI behavior changed only through schema registration/docs, but built CLI should still emit schema-valid protocol JSON. | Passed | `node /workspace/dist/cli/main.js protocol doctor --task T-0159 --json --project /workspace` returned `ok: true`; remediation dry-run returned `hadara.protocol.remediation.v1`. |
| Done-level harness and protocol doctors | Yes | Confirm completion state after docs and capsule updates. | Passed | Built CLI done-level harness returned `ok: true`; task protocol doctor returned `ok: true`; docs protocol doctor returned `ok: true` with two known historical warnings. |
| Security smoke | No | No security boundary changes. | Not Run | Not applicable. |
| Integration smoke | No | No MCP/provider/dashboard integration surface changes. | Not Run | Not applicable. |
