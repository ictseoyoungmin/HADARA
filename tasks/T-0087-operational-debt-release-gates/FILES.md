# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/operational-debt.ts` | Update | Add debt severity/aggregate/show report and release-gate debt checks. |
| `src/cli/debt.ts` | Add | Provide CLI debt list/show read surface. |
| `src/cli/release-gate.ts` | Add | Provide read-only release-gate warning report. |
| `src/cli/main.ts` | Update | Route debt and release-gate commands. |
| `src/services/operations-status-service.ts` | Update | Include debt aggregates in operations status. |
| `src/services/capability-registry.ts` | Update | Register CLI/MCP debt and release-gate read surfaces. |
| `src/mcp/tool-registry.ts` | Update | Route read-only debt MCP tools. |
| `docs/CLI_JSON_CONTRACT.md` | Update | Document new JSON surfaces. |
| `docs/MCP_BRIDGE_CONTRACT.md` | Update | Document read-only debt MCP tools. |
| `docs/OPERATIONAL_DEBT.md` | Update | Document debt severity and release-gate warning behavior. |
| `tests/unit/operational-debt.test.ts` | Update | Cover debt aggregates, show report, and release-gate warnings. |
| `tests/unit/status-json.test.ts` | Update | Cover ops debt aggregate fields. |
| `tests/unit/mcp-tools.test.ts` | Update | Cover read-only debt MCP tools and capability discovery. |
| `tests/contract/mcp-bridge-contract.test.ts` | Update | Cover MCP debt payload parity. |
