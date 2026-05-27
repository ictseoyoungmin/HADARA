# Tests

## Required

- Docker focused: `npx vitest run tests/unit/operational-debt.test.ts`
- Docker full: `npm run check`
- Docker built CLI smoke: `node dist/cli/main.js release gate --json --project /workspace`
- Docker built CLI smoke: `node dist/cli/main.js release gate --mode strict --json --project /workspace` exits 6 because high operational debt remains open
- Docker done-level harness: `node dist/cli/main.js harness validate --task T-0122 --level done --json --project /workspace`

## Optional

- GitHub Actions API observation for latest `main` workflow run and job steps.
