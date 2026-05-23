# Handoff

## Last Completed

- Split MCP tool schemas, registry, and dispatch out of `src/mcp/server.ts`.
- Implemented read-only MCP tools: task list/read, handoff read, project state read, policy evaluate, and harness validate.
- Added strict `tools/call` shape and argument validation.
- Documented JSON-RPC notification no-response behavior and dispatch issue codes in `docs/MCP_BRIDGE_CONTRACT.md`.
- Docker `npm ci && npm run check` passed with 24 test files and 122 tests.
- Docker built CLI `hadara mcp serve` `tools/call` smoke returned `hadara.task.list` as one MCP JSON text payload.
- Docker built CLI `harness validate --task T-0044 --level done --json` returned `ok: true`.

## Next Recommended Step

Continue with T-0045 MCP Bridge Harness Tests. Validate MCP tool payloads against existing CLI JSON contracts and keep all bridge behavior read-only.
