# Decisions

| Decision | Rationale |
|---|---|
| Implement the skeleton without an external MCP SDK dependency. | The repo currently has no runtime dependencies; the first slice only needs JSON-RPC lifecycle/discovery behavior. |
| Return JSON-RPC method-not-found for unimplemented tool calls. | T-0044 owns read tool implementations, so T-0043 should fail clearly without side effects. |
