# Tests

## Required

- Docker `npx vitest run tests/unit/tui-read-model.test.ts`
- Docker `npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0100 --level done --json --project /workspace`

## Optional

- Manual inspection of `src/tui/read-model.ts` aggregate shape before renderer work.
