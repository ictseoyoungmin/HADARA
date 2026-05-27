# Tests

## Required

- Docker focused harness test:
  - `npx vitest run tests/harness/dogfooding-e2e-fixture.test.ts`
- Docker clean-copy validation:
  - `npm run check`
- Done-level Task Capsule validation:
  - `node dist/cli/main.js harness validate --task T-0120 --level done --json --project /workspace`

## Optional

- Built CLI context or TUI smoke if dogfooding fixture grows new public surfaces.
