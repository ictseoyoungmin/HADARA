# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0048 --level done --json`

## Focused

- `npm test -- tests/contract/mcp-evidence-attach-guard.test.ts`

## Optional

- Built CLI smoke for `hadara mcp serve --enable-evidence-attach`.
