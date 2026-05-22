# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0026 --json`

## Focused

- Agent loop evidence attachment unit tests.
- Run CLI JSON evidence metadata regression tests.

## Optional

- Built CLI smoke for `hadara run --task T-0026 --script ... --fake-shell-fixtures ... --json`.
