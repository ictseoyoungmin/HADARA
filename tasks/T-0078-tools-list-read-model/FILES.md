# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/tools-list.ts` | Add | Shared tools-list read model. |
| `src/cli/tools.ts` | Add | CLI handler for `hadara tools list`. |
| `src/cli/main.ts` | Update | Register CLI command and help text. |
| `src/mcp/tool-schemas.ts` | Update | Advertise read-only `hadara.tools.list`. |
| `src/mcp/tool-registry.ts` | Update | Dispatch MCP tool to shared report builder. |
| `tests/unit/tools-list.test.ts` | Add | Validate read model and CLI JSON handler. |
| `tests/unit/mcp-tools.test.ts` | Update | Validate MCP payload for `hadara.tools.list`. |
| `tests/unit/mcp-server.test.ts` | Update | Include tool in default MCP advertisement. |
| `docs/CLI_JSON_CONTRACT.md` | Update | Mark `hadara.tools.list.v1` as implemented command-specific schema. |
| `docs/MCP_BRIDGE_CONTRACT.md` | Update | Document `hadara.tools.list` input/output contract. |
| `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` | Update | Record implemented notes for the slice. |
