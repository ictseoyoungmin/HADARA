# Tests

## Required

- Docker focused unit/contract tests:
  - `npx vitest run tests/unit/operational-debt.test.ts tests/unit/status-json.test.ts tests/unit/mcp-tools.test.ts tests/contract/mcp-bridge-contract.test.ts tests/unit/tools-list.test.ts`
- Docker full check:
  - `npm run check`
- Done-level harness validation:
  - `node dist/cli/main.js harness validate --task T-0087 --level done --json --project /workspace`

## Optional

- Built CLI smokes for debt list/show, release gate, and ops status.
- Focused regression: `createReleaseGateReport(root, 'strict')` returns `ok: false` and error status when high-severity debt remains open.
