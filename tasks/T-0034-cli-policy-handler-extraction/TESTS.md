# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0034 --level done --json`

## Focused

- Policy JSON unit tests.
- Policy preflight unit tests.
- Built CLI policy check-shell/preflight-shell JSON and text smokes.

## Optional

- LOC check for `src/cli/main.ts`.
