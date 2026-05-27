# Tests

## Required

- Docker temp-copy `npx vitest run tests/unit/tui-read-model.test.ts tests/unit/tui-cache.test.ts tests/unit/tui-terminal.test.ts`
- Docker temp-copy `npm run check`

## Optional

- `/workspace` timing measurement for full read, fast read, cache fast hit, terminal startup, terminal refresh, and terminal selected-detail refresh.
