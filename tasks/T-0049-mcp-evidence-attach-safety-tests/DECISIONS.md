# Decisions

| Decision | Rationale |
|---|---|
| Keep artifact safety failures inside the evidence collect report payload. | The MCP adapter successfully called a valid tool; the underlying HADARA command report should carry command-level issues. |
| Keep malformed MCP input as JSON-RPC `TOOL_INPUT_INVALID`. | Adapter-level schema failures happen before a HADARA command report can be built. |
