# Tests

## Required

- Docker focused: `npx vitest run tests/unit/tui-terminal.test.ts tests/unit/tui-state.test.ts tests/unit/tui-snapshot.test.ts tests/unit/tui-read-model.test.ts`
- Docker full: `npm run check`

## Optional

- Done-level harness validation: `node dist/cli/main.js harness validate --task T-0106 --level done --json --project /workspace`
