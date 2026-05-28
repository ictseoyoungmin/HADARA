# Tests

## Required

- Docker focused: `npx vitest run tests/unit/package-smoke-dry-run.test.ts tests/unit/clean-checkout-smoke.test.ts tests/unit/schema-runtime.test.ts tests/unit/schema-fixtures.test.ts`
- Docker full: `npm run check`
- Built CLI package-smoke attach-evidence smoke.
- Built CLI strict release gate smoke.
- Done-level harness validation for T-0136.

## Optional

- Built CLI clean-checkout attach-evidence smoke if time allows; this is heavier because it runs a clean `npm ci`/build/check sequence.
