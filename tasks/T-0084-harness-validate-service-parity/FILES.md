# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/harness-service.ts` | Add | Shared harness validate report builder for CLI and MCP read surfaces. |
| `src/cli/harness.ts` | Update | Route `harness validate` through the shared service. |
| `src/mcp/tool-registry.ts` | Update | Route `hadara.harness.validate` through the shared service. |
| `tests/contract/cli-mcp-service-parity.test.ts` | Update | Compare MCP harness validate payloads against the shared service. |
| `tests/contract/mcp-bridge-contract.test.ts` | Update | Keep MCP bridge contract parity anchored on the shared service. |
| `tasks/T-0084-harness-validate-service-parity/*` | Update | Track scope, validation, evidence, and handoff for this capsule. |
