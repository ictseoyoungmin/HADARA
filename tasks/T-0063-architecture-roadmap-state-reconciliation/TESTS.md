# Tests

## Required

- Docker `npm run build`
- Docker `node dist/cli/main.js harness validate --task T-0063 --level done --json`

## Focused

- Text scan confirming `ARCHITECTURE.md` no longer contains stale full-unimplemented Dashboard/MCP server bullets.

## Optional

- Full Docker `npm ci && npm run check` if documentation-only validation needs broader confirmation.
