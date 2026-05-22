# Tests

## Required

- Docker `npm ci && npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0036 --level done --json`

## Focused

- Run CLI unit tests.
- Doctor and task JSON unit tests.
- Built CLI smokes for init, doctor, task, mcp, and run.

## Optional

- LOC check for `src/cli/main.ts`.
