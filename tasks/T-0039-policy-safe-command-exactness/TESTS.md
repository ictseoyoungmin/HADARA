# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0039 --level done --json`

## Focused

- Policy unit tests for exact safe command matching.
- Built CLI smoke for `policy check-shell "npm run check extra" --mode auto --json`.

## Optional

- Release mode classification smoke.
