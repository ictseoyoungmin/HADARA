# Tests

## Required

- Docker focused policy tests: `npx vitest run tests/unit/policy.test.ts tests/unit/policy-preflight.test.ts tests/unit/policy-json.test.ts tests/unit/fake-shell.test.ts`
- Docker full check: `npm run check`
- Done-level harness validation: `node dist/cli/main.js harness validate --task T-0090 --level done --json --project /workspace`

## Optional
- CLI policy smoke for representative matrix decisions.
