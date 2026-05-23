# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0052 --level done --json`

## Focused

- `npm test -- tests/contract/mcp-evidence-attach-guard.test.ts tests/contract/mcp-evidence-attach-safety.test.ts tests/unit/mcp-server.test.ts`

## Optional

- N/A
