# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| rg reviewer-aligned caution phrases | Verify the accepted cautions are present in operator docs. | Yes | Passed. | `ev:T-0241:3583c782400b4da19ef41f8f`. |
| git diff --check | Verify Markdown/code whitespace sanity. | Yes | Passed. | `ev:T-0241:3583c782400b4da19ef41f8f`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full Docker suite | No | Documentation-only alignment; no runtime code changed. | Not Run | Not required. |
| Security smoke | No | No secrets, permissions, provider, MCP, or artifact boundary changed. | Not Run | Not applicable. |
| Integration smoke | No | No dashboard/TUI/MCP/provider runtime integration changed. | Not Run | Not applicable. |
