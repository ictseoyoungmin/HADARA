# Tests

## Required

- Docker focused: `npx vitest run tests/unit/operational-debt.test.ts`
- Docker full: `npm run check`
- Built CLI smoke: `node dist/cli/main.js release gate --mode strict --json --project /workspace`
- Done-level harness validation: `node dist/cli/main.js harness validate --task T-0125 --level done --json --project /workspace`

## Optional

- `node dist/cli/main.js ops status --json --project /workspace`
