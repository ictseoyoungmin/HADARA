# Tests

## Required

- Docker `npx vitest run tests/unit/active-run-state.test.ts tests/unit/mcp-tools.test.ts tests/unit/tools-list.test.ts tests/contract/mcp-bridge-contract.test.ts`
- Docker `npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0086 --level done --json --project /workspace`

## Optional

- Built CLI smoke for `run-state show --json`
