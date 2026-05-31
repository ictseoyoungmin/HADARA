# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:unit -- tests/unit/task-workbench.test.ts tests/unit/workbench-next-actions.test.ts tests/unit/schema-fixtures.test.ts | Focus workbench service/action/schema regressions. | Yes | Passed: 56 files / 422 tests | T-0177 evidence at 2026-05-31T09:13:12.768Z |
| npm run check | Run TypeScript build plus all tests in Docker. | Yes | Passed: 68 files / 499 tests | T-0177 evidence at 2026-05-31T09:13:20.553Z |
| node /workspace/dist/cli/main.js task status --task T-0177 --json --project /workspace | Built CLI smoke for the hardened report. | Yes | Passed | T-0177 evidence at 2026-05-31T09:13:31.069Z |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Done-level harness validate T-0177 | Yes | Capsule completion gate. | Passed | T-0177 evidence at 2026-05-31T09:15:54.936Z |
| Close audit T-0177 | Yes | Post-close audit after evidence is recorded. | Passed | T-0177 evidence at 2026-05-31T09:16:35.387Z |
