# Tests

## Required

- Docker focused: `npx vitest run tests/unit/release-publish.test.ts tests/unit/schema-runtime.test.ts tests/unit/schema-fixtures.test.ts tests/unit/tools-list.test.ts`
- Docker full: `npm run check`
- Docker built CLI smoke: `node dist/cli/main.js release publish --mode dry-run --json --project /workspace`
- Docker done-level harness: `node dist/cli/main.js harness validate --task T-0141 --level done --json --project /workspace`

## Optional

- `hadara release publish --mode execute --approval-actor <name> --approval-reason <text> --confirm publish-deploy --json` can be used to verify blocked execute audit behavior without mutation.
