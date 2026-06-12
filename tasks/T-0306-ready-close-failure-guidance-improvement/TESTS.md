# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `rg --files tests | rg 'task-ready|harness|task-close|schema'` | Resolve focused test files before implementation. | Yes | Passed. | Command output listed schema, task-ready, task-close, and harness test files. |
| Docker `npm run test:focused -- tests/unit/task-ready.test.ts tests/unit/task-close.test.ts tests/harness/harness-validate.test.ts tests/unit/schema-fixtures.test.ts tests/unit/schema-runtime.test.ts` | Validate ready/close/harness/schema behavior. | Yes | Passed: 5 files / 57 tests. | `ev:T-0306:79d346d1f54c4d6d8f3667c3` |
| Docker `npm run build` plus workspace `dist` refresh | Verify TypeScript build and refresh built CLI after CLI behavior changes. | Yes | Passed. | `ev:T-0306:79d346d1f54c4d6d8f3667c3` |
| Built CLI blocked ready/close smoke | Exercise additive hints through `node dist/cli/main.js`. | Yes | Passed: blocked ready and close reports exposed heading/fix hints for acceptance blockers. | `ev:T-0306:79d346d1f54c4d6d8f3667c3` |
| git diff --check | Check whitespace hygiene. | Yes | Passed. | `ev:T-0306:79d346d1f54c4d6d8f3667c3` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | Only if security boundary changes. | Not Run | TBD |
| Integration smoke | No | Only if integration surface changes. | Not Run | TBD |
