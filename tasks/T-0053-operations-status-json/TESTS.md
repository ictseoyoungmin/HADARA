# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0053 --level done --json`

## Focused

- `npm test -- tests/unit/status-json.test.ts`

## Optional

- Built CLI smoke for `status --json`.
- Built CLI smoke for `ops status --json`.
