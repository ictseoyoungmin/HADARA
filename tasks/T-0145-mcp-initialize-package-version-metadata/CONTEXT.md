# Context

Relevant documents and files:

- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `src/mcp/server.ts`
- `tests/unit/mcp-server.test.ts`
- `package.json`

Current issue:

- `package.json` is `0.1.0-rc.0`, but MCP `initialize` returns `serverInfo.version: "0.0.0-bootstrap"`.

Assumptions:

- MCP `serverInfo.version` should describe the HADARA server package, not an arbitrary project root package when HADARA is pointed at another workspace.
- If package metadata cannot be read, MCP initialize should still respond without enabling any new capabilities.
