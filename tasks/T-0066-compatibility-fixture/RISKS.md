# Risks

| Risk | Mitigation |
|---|---|
| The fixture could become too synthetic. | Replay it against implemented context export and MCP dispatch rather than only scanning JSON. |
| Compatibility could imply write-capable MCP support. | Include forbidden write/execution-like MCP tool checks in the contract test. |
