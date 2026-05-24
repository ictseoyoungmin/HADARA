# Tests

## Required

- Docker `npm test -- tests/contract/cli-mcp-service-parity.test.ts`.
- Docker `npm run check`.
- Docker `node dist/cli/main.js harness validate --task T-0067 --level done --json`.

## Focused

- Parity test compares MCP payloads against shared services and CLI/domain report builders.

## Optional

- Broaden parity tests when more CLI read commands are promoted to shared services.
