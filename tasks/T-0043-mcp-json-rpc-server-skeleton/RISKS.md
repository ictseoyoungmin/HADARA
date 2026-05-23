# Risks

| Risk | Mitigation |
|---|---|
| Server skeleton accidentally grows into read tool implementation before T-0044. | Limit T-0043 to lifecycle/discovery and return not-implemented for `tools/call`. |
| MCP bridge exposes write or execution behavior too early. | Advertise only read-only tools and do not add shell, provider, or mutation code paths. |
| JSON-RPC framing diverges from MCP stdio expectations. | Use newline-delimited JSON objects for this bootstrap skeleton and cover request/response behavior with focused tests. |
