# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0062 --level done --json`

## Focused

- Docker `npm test -- tests/unit/dashboard-static.test.ts tests/harness/harness-validate.test.ts`

## Optional

- Manual browser/server smoke remains optional.
