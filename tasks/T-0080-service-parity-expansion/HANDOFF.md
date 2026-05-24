# Handoff

## Last Completed

- Added `src/services/task-read-model.ts` as the shared task list/show/read report service.
- Kept `src/cli/task-json.ts` as a compatibility facade for existing CLI imports.
- Routed read-only MCP `hadara.task.list` and `hadara.task.read` through the shared task service.
- Added parity coverage for MCP task read output against `createTaskReadReport`.
- Validation passed in Docker:
  - `npx vitest run tests/contract/cli-mcp-service-parity.test.ts tests/unit/task-json.test.ts tests/unit/mcp-tools.test.ts`
  - `npm run check`
  - `node dist/cli/main.js harness validate --task T-0080 --level done --json --project /workspace`

## Next Recommended Step

Continue Service Parity Expansion in a new focused capsule by moving the next read surface, likely policy evaluate or harness validate, behind a named shared service while keeping CLI and MCP transport envelopes separate.
