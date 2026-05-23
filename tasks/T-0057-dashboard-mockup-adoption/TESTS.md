# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0057 --level done --json`

## Focused

- `npm test -- tests/unit/dashboard-static.test.ts tests/unit/status-json.test.ts`

## Optional

- Browser screenshot review for visual polish can be added in a later dashboard fixture smoke slice.
