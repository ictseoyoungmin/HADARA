# Tests

## Required

- Docker `npx vitest run tests/unit/tui-snapshot.test.ts tests/unit/tui-markdown.test.ts`
- Docker `npm run check`

## Optional

- Done-level harness validation: `node dist/cli/main.js harness validate --task T-0103 --level done --json --project /workspace`
