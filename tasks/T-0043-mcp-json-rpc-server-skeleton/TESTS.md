# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0043 --level done --json`

## Focused

- `npm test -- tests/unit/mcp-server.test.ts`

## Optional

- Built CLI stdio smoke for `hadara mcp serve` with an `initialize` request.
