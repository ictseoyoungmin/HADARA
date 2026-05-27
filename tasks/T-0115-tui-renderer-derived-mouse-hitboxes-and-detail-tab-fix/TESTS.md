# Tests

## Required

- Docker focused TUI tests:
  - `npx vitest run tests/unit/tui-snapshot.test.ts tests/unit/tui-terminal.test.ts tests/unit/tui-state.test.ts`
- Docker full check if feasible:
  - `npm run check`
- Done-level harness validation:
  - `node dist/cli/main.js harness validate --task T-0115 --level done --json --project <project-copy>`

## Optional

- Built CLI snapshot smoke:
  - `node dist/cli/main.js tui --snapshot --compact --width 86 --height 24 --project /workspace`
