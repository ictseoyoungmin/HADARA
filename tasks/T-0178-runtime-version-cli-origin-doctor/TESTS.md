# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| npm run test:unit -- tests/unit/runtime-version.test.ts tests/unit/schema-fixtures.test.ts | Focus runtime report and schema coverage. | Yes | Passed: 57 files / 425 tests | T-0178 evidence |
| npm run check | Run TypeScript build plus all tests in Docker. | Yes | Passed: 69 files / 502 tests | T-0178 evidence |
| node /workspace/dist/cli/main.js version --verbose --json --project /workspace | Built CLI smoke for runtime origin report. | Yes | Passed | T-0178 evidence |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Done-level harness validate T-0178 | Yes | Capsule completion gate. | Passed | T-0178 evidence at 2026-05-31T09:55:48.299Z |
| Close audit T-0178 | Yes | Post-close audit after evidence is recorded. | Passed | Close audit returned ok:true with one close evidence record and zero warnings. |
