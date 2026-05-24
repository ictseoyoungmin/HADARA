# Tests

## Required

- Docker focused tests:
  - `npx vitest run tests/unit/active-run-state.test.ts tests/unit/schema-fixtures.test.ts tests/unit/mcp-tools.test.ts tests/contract/mcp-bridge-contract.test.ts`
- Docker full check:
  - `npm run check`
- Done-level harness validation:
  - `node dist/cli/main.js harness validate --task T-0088 --level done --json --project /workspace`

## Optional

- Built CLI smoke for `run-state resume --json`.
