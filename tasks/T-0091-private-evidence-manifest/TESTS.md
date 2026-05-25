# Tests

## Required

- Docker focused tests: `npx vitest run tests/unit/evidence-json.test.ts tests/unit/evidence-list.test.ts tests/unit/hermes-json.test.ts`
- Docker full check: `npm run check`
- Done-level harness validation: `node dist/cli/main.js harness validate --task T-0091 --level done --json --project /workspace`

## Optional

- CLI evidence collect smoke for private evidence with a readable source path.
