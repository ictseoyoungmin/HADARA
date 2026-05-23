# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0061 --level done --json`

## Focused

- Docker `npm test -- tests/harness/harness-validate.test.ts tests/unit/evidence-json.test.ts`

## Optional

- Manual scan for `timestamp` in recent Task Capsule evidence indexes.
