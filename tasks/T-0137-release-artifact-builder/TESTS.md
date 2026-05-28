# Tests

## Required

- Docker focused: `npx vitest run tests/unit/release-artifact.test.ts tests/unit/schema-runtime.test.ts tests/unit/schema-fixtures.test.ts tests/unit/tools-list.test.ts`
- Docker full: `npm run check`
- Built CLI `release artifact --execute --json` smoke.
- Built CLI strict release gate smoke.
- Done-level harness validation for T-0137.

## Optional

- Built CLI explicit `--output` smoke in a disposable temp project if artifact retention needs manual inspection.
