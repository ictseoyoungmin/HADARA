# Tests

## Required

- Docker `npx vitest run tests/unit/write-preflight.test.ts`
- Docker `npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0098 --level done --json --project /workspace`

## Optional

- Built CLI smoke for `write preflight task create ... --json`
