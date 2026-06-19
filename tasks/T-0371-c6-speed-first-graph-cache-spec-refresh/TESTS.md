# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `git diff --check` | Validate whitespace/conflict-marker hygiene for docs-only changes. | Yes | Passed: no output before and after shared-doc updates. | `ev:T-0371:32ca91e0fcb248688b17900b`, `ev:T-0371:51dca176e5404df3b17795be` |
| Targeted registry/path checks | Confirm the new spec is discoverable from docs registry and C6 read-routing surfaces. | Yes | Passed: JSON parse and `rg` checks confirmed references. | `ev:T-0371:32ca91e0fcb248688b17900b`, `ev:T-0371:51dca176e5404df3b17795be` |
| Runtime test suite | Not required for docs-only spec/registry changes. | No | Not Run | N/A |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No runtime permission, secret, MCP, or execution boundary changed. | Not Run | N/A |
| Integration smoke | No | No public command behavior changed. | Not Run | N/A |
