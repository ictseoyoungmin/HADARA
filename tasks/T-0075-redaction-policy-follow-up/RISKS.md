# Risks

| Risk | Mitigation |
|---|---|
| Changing public artifact policy could accidentally allow high-risk secrets. | Default blocking threshold is `high`, preserving current high/critical default detector behavior. |
| Existing callers rely on `containsSecret()` returning true for any finding. | Keep `containsSecret()` unchanged and add a separate policy helper. |
| Planning docs could imply implemented MCP tools that do not exist yet. | Mark active-run/context export updates as future planning only and avoid adding tool dispatch behavior. |

| Risk | Mitigation |
|---|---|
