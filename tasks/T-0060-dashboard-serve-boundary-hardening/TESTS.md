# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0060 --level done --json`

## Focused

- Docker `npm test -- tests/unit/dashboard-static.test.ts tests/unit/status-json.test.ts`

## Optional

- Manual local server smoke remains optional.
