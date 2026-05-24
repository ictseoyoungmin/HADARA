# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/policy-service.ts` | Add | Shared policy check/evaluate report builders for CLI and MCP read surfaces. |
| `src/cli/policy-json.ts` | Update | Preserve existing CLI import path while moving policy check report construction to the shared service. |
| `src/cli/policy.ts` | Update | Route `policy preflight-shell` through the shared policy service. |
| `src/mcp/tool-registry.ts` | Update | Route `hadara.policy.evaluate` through the shared policy service. |
| `tests/contract/cli-mcp-service-parity.test.ts` | Update | Compare MCP policy evaluate payloads against the shared service report builder. |
| `tasks/T-0081-policy-service-parity/*` | Update | Track scope, validation, evidence, and handoff for this capsule. |
