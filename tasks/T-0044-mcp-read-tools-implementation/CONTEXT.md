# Context

T-0043 added a stdio JSON-RPC MCP server skeleton. It supports lifecycle/discovery requests, advertises read-only tools, and returns a clear not-implemented error for `tools/call`.

T-0044 implements only the read-only tools already documented in `docs/MCP_BRIDGE_CONTRACT.md`. This task also records the notification policy from T-0043: JSON-RPC notifications have no `id` and produce no response.

Tool dispatch failures should keep MCP/JSON-RPC transport separate from HADARA issue semantics by returning JSON-RPC errors with a `data.issue` object containing the HADARA issue code.
