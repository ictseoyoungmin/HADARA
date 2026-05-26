# Tests

## Required

- Docker focused: `npx vitest run tests/unit/tui-cli.test.ts tests/unit/tui-terminal.test.ts tests/unit/tools-list.test.ts`
- Docker full: `npm run check`

## Optional

- Built CLI smoke: `node dist/cli/main.js tui --snapshot --compact --width 86 --height 24 --project /workspace`
- Done-level harness validation: `node dist/cli/main.js harness validate --task T-0107 --level done --json --project /workspace`
