# Files

| Path | Action | Reason |
|---|---|---|
| `src/hermes/context-export.ts` | Update | Split memory content/report generation from file-writing export behavior. |
| `src/mcp/tool-schemas.ts` | Update | Advertise read-only `hadara.context.export`. |
| `src/mcp/tool-registry.ts` | Update | Dispatch `hadara.context.export` to the shared report builder. |
| `tests/unit/hermes-json.test.ts` | Update | Preserve CLI file-writing behavior and add memory report coverage. |
| `tests/unit/mcp-server.test.ts` | Update | Assert tool advertisement includes the new read-only tool. |
| `tests/unit/mcp-tools.test.ts` | Update | Assert MCP memory payload shape and no context file write. |
| `docs/*` and `tasks/T-0077-*/*` | Update | Record task state, evidence, slice progress, and handoff. |
