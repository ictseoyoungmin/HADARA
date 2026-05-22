# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0035 --level done --json`

## Focused

- Hermes JSON unit tests.
- Built CLI Hermes detect/export-context JSON and text smokes.
- Built CLI handoff update smoke.

## Optional

- LOC check for `src/cli/main.ts`.
