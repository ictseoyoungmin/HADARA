# Acceptance Criteria

- [x] `hadara mcp serve` starts a stdio JSON-RPC server skeleton.
- [x] Server handles `initialize`, `notifications/initialized`, `tools/list`, and basic unknown-method errors.
- [x] Server reports read-only capability metadata.
- [x] Server advertises only the read-only tool names documented in `docs/MCP_BRIDGE_CONTRACT.md`.
- [x] `tools/call` returns a clear not-implemented error without mutating files or executing commands.
- [x] No write tools, shell execution, provider calls, or read tool implementations are added.
- [x] Focused tests cover the server skeleton behavior.
- [x] Required Docker validation passes.
- [x] Done-level capsule validation passes.
- [x] Evidence and handoff documents are updated.
