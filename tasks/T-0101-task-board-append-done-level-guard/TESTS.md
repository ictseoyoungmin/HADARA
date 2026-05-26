# Tests

## Required

- Docker `npx vitest run tests/harness/harness-validate.test.ts`
- Docker `npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0101 --level done --json --project /workspace`

## Optional

- Manual inspection of `docs/TASK_BOARD.md` for a single T-0101 Done row.
