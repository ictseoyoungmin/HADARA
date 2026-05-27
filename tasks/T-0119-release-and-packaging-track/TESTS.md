# Tests

## Required

- Docker focused unit test:
  - `npx vitest run tests/unit/operational-debt.test.ts`
- Docker clean-copy validation:
  - `npm run build`
  - `node dist/cli/main.js release gate --json --project /workspace`
  - `node dist/cli/main.js release gate --mode strict --json --project /workspace`

## Optional

- npm run check
