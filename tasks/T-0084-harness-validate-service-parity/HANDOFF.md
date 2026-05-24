# Handoff

## Last Completed

- Added `src/services/harness-service.ts` with `createHarnessValidateReport()`.
- Routed CLI `harness validate` through the shared harness service.
- Routed read-only MCP `hadara.harness.validate` through the shared harness service.
- Updated CLI/MCP service parity and MCP bridge contract tests to compare harness validate payloads against the shared service.
- Updated MCP `hadara.task.read` with conservative private evidence behavior: private evidence metadata is excluded by default and only returned when `includePrivate: true`.
- Documented that `task.read` `files["evidence.jsonl"]` is a sanitized read-model view rather than byte-for-byte file content.
- Validation passed in Docker:
  - `npx vitest run tests/contract/cli-mcp-service-parity.test.ts tests/contract/mcp-bridge-contract.test.ts tests/harness/harness-validate.test.ts tests/unit/mcp-tools.test.ts`
  - `npm run check`
  - `node dist/cli/main.js harness validate --task T-0084 --level done --json --project /workspace`
  - `npx vitest run tests/unit/task-json.test.ts tests/unit/mcp-tools.test.ts tests/contract/cli-mcp-service-parity.test.ts tests/unit/tools-list.test.ts`
  - `npm run check` after the task.read private evidence policy update

## Next Recommended Step

Continue service parity with operations status extraction, or address redaction policy observability tests before adding security/evidence inspection surfaces.
