# Tests

## Required

- Docker focused: `npx vitest run tests/unit/package-smoke-schema.test.ts tests/unit/schema-runtime.test.ts tests/unit/schema-fixtures.test.ts tests/unit/operational-debt.test.ts`
- Docker full: `npm run check`
- Built CLI: `node dist/cli/main.js release gate --mode strict --json --project <temp-copy>`
- Done-level harness: `node dist/cli/main.js harness validate --task T-0132 --level done --json --project /workspace`

## Optional

- Built CLI schema sanity if a package-smoke command is added later. Not applicable in T-0132 because no package-smoke CLI exists.
