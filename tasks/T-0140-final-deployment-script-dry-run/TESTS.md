# Tests

## Required

- Docker focused: `npx vitest run tests/unit/release-dry-run.test.ts tests/unit/release-artifact.test.ts tests/unit/schema-runtime.test.ts tests/unit/schema-fixtures.test.ts tests/unit/tools-list.test.ts`
- Docker full: `npm run check`
- Docker built CLI: `node dist/cli/main.js release dry-run --json --project /workspace`
- Docker built CLI: `node dist/cli/main.js harness validate --task T-0140 --level done --json --project /workspace`

## Optional

- Focused schema/tooling tests after docs-only changes.
