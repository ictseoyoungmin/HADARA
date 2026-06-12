# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `npm run test:focused -- tests/unit/task-finish.test.ts tests/unit/task-workflow-docs.test.ts tests/unit/init.test.ts` | Validate focused task finish behavior and docs generation. | Yes | Passed: 3 files / 38 tests. | `ev:T-0305:1c0b3d64e7354e098c26e53e` |
| Docker `npm run build` plus workspace `dist` refresh | Verify TypeScript build and refresh built CLI after CLI behavior changes. | Yes | Passed. | `ev:T-0305:1c0b3d64e7354e098c26e53e` |
| Built CLI Task Board preservation smoke | Exercise `task finish --execute` through `node dist/cli/main.js`. | Yes | Passed: preserved escaped-pipe note and extra owner cell. | `ev:T-0305:1c0b3d64e7354e098c26e53e` |
| git diff --check | Check whitespace hygiene. | Yes | Passed. | `ev:T-0305:1c0b3d64e7354e098c26e53e` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
