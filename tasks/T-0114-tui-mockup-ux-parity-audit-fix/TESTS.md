# Tests

## Required

- Docker temp-copy focused TUI regression:
  `npx vitest run tests/unit/tui-snapshot.test.ts tests/unit/tui-state.test.ts tests/unit/tui-terminal.test.ts`
- Docker temp-copy full check:
  `npm run check`
- Done-level harness validation:
  `node dist/cli/main.js harness validate --task T-0114 --level done --json --project <temp-copy>`

## Optional

- Built CLI snapshot smoke against `/workspace`.
