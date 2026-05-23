# Files

| Path | Action | Reason |
|---|---|---|
| src/mcp/tool-schemas.ts | Add | Hold MCP tool metadata and input schemas. |
| src/mcp/tool-registry.ts | Add | Register read-only tool handlers. |
| src/mcp/tool-dispatch.ts | Add | Validate `tools/call` params and wrap HADARA reports as MCP JSON text content. |
| src/mcp/server.ts | Update | Delegate tool listing and calls to the registry/dispatch layer. |
| src/cli/mcp.ts | Update | Pass project root into the stdio MCP server. |
| tests/unit/mcp-server.test.ts | Update | Keep lifecycle/discovery/notification coverage aligned with the new modules. |
| tests/unit/mcp-tools.test.ts | Add | Cover read-only tool outputs and dispatch error mapping. |
| docs/MCP_BRIDGE_CONTRACT.md | Update | Document notification behavior and dispatch error mapping. |
| docs/TASK_BOARD.md | Update | Track T-0044 status. |
| docs/DEVELOPMENT_SLICES.md | Update | Record T-0044 completion state when done. |
| docs/PROJECT_STATE.md | Update | Record implemented MCP read tools when done. |
| docs/AGENT_HANDOFF.md | Update | Refresh next-session handoff. |
| tasks/T-0044-mcp-read-tools-implementation/* | Add/Update | Track task capsule and evidence. |
