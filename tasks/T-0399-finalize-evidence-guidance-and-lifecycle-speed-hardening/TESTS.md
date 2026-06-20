# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker temp-copy focused validation: `npm run test:focused -- tests/unit/task-finalize.test.ts tests/unit/task-ready.test.ts tests/unit/schema-fixtures.test.ts` | Validate finalize/ready/schema contract changes. | Yes | Passed: 3 files / 13 tests. | `ev:T-0399:c213cedb4cfe4d20a8858fd9` |
| `npm run dev:docker-sync-build` | Full Docker validation and refreshed `/workspace/dist`. | Yes | First run failed on `dashboard-static` 5s timeout; retry passed 141 files / 929 tests and refreshed `dist`. | Failed `ev:T-0399:eba26dcf11c5461395d90965`; resolved by `ev:T-0399:8aa7e7dc564e429393a1ea67`. |
| `git diff --check` | Whitespace/diff hygiene. | Yes | Passed. | `ev:T-0399:cda485bcea7242448c0da511` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI finalize smoke | Yes | Proves current `dist` reports lazy finish-only evaluation on Draft T-0399. | Passed with expected exit 6, `evaluatedReports:["finish"]`, and skipped ready/close/audit-close. | `ev:T-0399:ac178da8a71f482a9d8e702a` |
| Security smoke | No | No security boundary changed. | Not Run | Not required. |
| Integration smoke | No | No external integration changed. | Not Run | Not required. |
