# Files

| Path | Action | Reason |
|---|---|---|
| `src/services/task-read-model.ts` | Add | Shared task list/show/read report builder for CLI and MCP read surfaces. |
| `src/cli/task-json.ts` | Update | Preserve existing CLI import path by re-exporting shared task service reports. |
| `src/mcp/tool-registry.ts` | Update | Route `hadara.task.list` and `hadara.task.read` through the shared task service. |
| `tests/contract/cli-mcp-service-parity.test.ts` | Update | Prove MCP task read/list parity with shared service builders. |
| `tasks/T-0080-service-parity-expansion/*` | Update | Track scope, validation, evidence, and handoff for this capsule. |
