# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0031 --level done --json`

## Focused

- Init unit tests.
- Run scaffold unit tests.

## Optional

- Built CLI smoke for `init --profile full`.
- Built CLI smoke for `run scaffold` followed by scaffolded `run`.
