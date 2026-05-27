# Tests

## Required

- Docker focused: `npx vitest run tests/unit/tui-markdown.test.ts tests/unit/tui-read-model.test.ts tests/unit/tui-snapshot.test.ts tests/unit/tui-terminal.test.ts`
- Docker full: `npm run check`

## Optional

- Built CLI snapshot smoke: `node dist/cli/main.js tui --snapshot --width 150 --height 30 --project /workspace`
