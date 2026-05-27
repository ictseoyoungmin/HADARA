# Tests

## Required

- Docker focused harness test:
  - `npx vitest run tests/harness/dogfooding-e2e-fixture.test.ts`
  - Covers detailed temporary capsule file assertions, explicit allowed/requested/blocked policy status assertions, and built CLI JSON smoke when `dist/cli/main.js` exists.
- Docker clean-copy validation:
  - `npm run check`
- Done-level Task Capsule validation:
  - `node dist/cli/main.js harness validate --task T-0120 --level done --json --project /workspace`

## Optional

- Built CLI context or TUI smoke if dogfooding fixture grows new public surfaces.
