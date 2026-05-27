# Tests

## Required

- Docker focused harness test:
  - `npx vitest run tests/harness/harness-validate.test.ts tests/harness/dogfooding-e2e-fixture.test.ts`
- Docker clean-copy validation:
  - `npm run check`
- Done-level Task Capsule validation:
  - `node dist/cli/main.js harness validate --task T-0121 --level done --json --project /workspace`

## Optional

- Built CLI harness smoke against a synthetic scaffold capsule if the focused tests need diagnosis.
