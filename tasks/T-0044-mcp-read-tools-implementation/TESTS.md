# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0044 --level done --json`

## Focused

- `npm test -- tests/unit/mcp-server.test.ts tests/unit/mcp-tools.test.ts`

## Optional

- Built CLI stdio smoke for `hadara mcp serve` with `tools/list` and `tools/call`.
