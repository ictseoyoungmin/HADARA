# Tests

## Required

- Docker `npx vitest run tests/unit/tui-snapshot.test.ts`
- Docker `npm run check`
- Docker `node dist/cli/main.js harness validate --task T-0102 --level done --json --project /workspace`

## Optional

- Manual inspection of snapshot text for narrow and wide widths.
