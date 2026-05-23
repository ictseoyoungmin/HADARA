# Context

T-0042 completed the read-only MCP bridge contract in `docs/MCP_BRIDGE_CONTRACT.md`.

The first implementation slice must stay below the full read-tools implementation. It may expose server discovery and read-only capability metadata, but it must not read Task Capsule contents through MCP tools yet and must not write files, run shell commands, or call model providers.

Relevant docs:

- `docs/CLI_JSON_CONTRACT.md`
- `docs/MCP_BRIDGE_CONTRACT.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/AGENT_HANDOFF.md`
