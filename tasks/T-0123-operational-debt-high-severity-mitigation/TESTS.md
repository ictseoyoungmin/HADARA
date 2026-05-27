# Tests

## Required

- Docker focused: `npx vitest run tests/unit/operational-debt.test.ts`
- Docker full: `npm run check`
- Docker built CLI: `node dist/cli/main.js release gate --mode strict --json --project /workspace`
- Docker built CLI: `node dist/cli/main.js harness validate --task T-0123 --level done --json --project /workspace`

## Optional

- `node dist/cli/main.js debt list --json --project /workspace`
