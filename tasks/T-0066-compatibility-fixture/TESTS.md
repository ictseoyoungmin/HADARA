# Tests

## Required

- Docker `npm test -- tests/contract/hermes-compatibility-fixture.test.ts`.
- Docker `npm run check`.
- Docker `node dist/cli/main.js harness validate --task T-0066 --level done --json`.

## Focused

- Fixture replay verifies exported context text and MCP read tool payload schemas.

## Optional

- Manual review of fixture wording before adding broader compatibility scenarios.
