# Tests

## Required

- Docker focused: `npx vitest run tests/unit/package-smoke-dry-run.test.ts tests/unit/package-smoke-schema.test.ts tests/unit/schema-runtime.test.ts tests/unit/schema-fixtures.test.ts tests/unit/tools-list.test.ts`
- Docker full: `npm run check`
- Built CLI dry-run smoke: `node dist/cli/main.js package smoke --dry-run --json --project <temp-copy>`
- Built CLI strict release gate: `node dist/cli/main.js release gate --mode strict --json --project <temp-copy>`
- Done-level harness: `node dist/cli/main.js harness validate --task T-0133 --level done --json --project /workspace`

## Optional

- Future local package-smoke execution tests are out of scope for T-0133.
