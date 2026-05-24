# Risks

| Risk | Mitigation |
|---|---|
| Changing public artifact policy could accidentally allow high-risk secrets. | Default blocking threshold is `high`, preserving current high/critical default detector behavior. |
| Existing callers rely on `containsSecret()` returning true for any finding. | Keep `containsSecret()` unchanged and add a separate policy helper. |
| Internal redaction reports could leak if exposed directly in CLI/MCP output. | Store the report on the internal error, but keep current user-facing evidence collect issues to code/message only. |
| Future low/medium patterns could create diagnostics while copying original public artifact content. | Document non-blocking findings as diagnostics only and preserve the block-or-copy evidence integrity model. |
| Planning docs could imply implemented MCP tools that do not exist yet. | Mark active-run/context export updates as future planning only and avoid adding tool dispatch behavior. |

| Risk | Mitigation |
|---|---|
