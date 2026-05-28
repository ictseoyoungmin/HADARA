# Tests

## Required

- Docker focused release-gate regression: `npx vitest run tests/unit/operational-debt.test.ts`
- Docker focused schema regression: `npx vitest run tests/unit/schema-fixtures.test.ts tests/unit/schema-runtime.test.ts`
- Docker full check: `npm run check`
- Docker built CLI smoke: `node dist/cli/main.js release gate --mode strict --json --project /workspace`
- Docker built CLI done validation: `node dist/cli/main.js harness validate --task T-0128 --level done --json --project /workspace`

## Optional

- Confirm no installer scripts or portable launcher files were created in this capsule.
