# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused temp-copy test | Validate close/lifecycle/complete-flow/ready behavior around close guidance. | Yes | Passed: 4 files / 24 tests. | `ev:T-0395:0bfa119bfc5e43a489d31794` |
| `npm run dev:docker-sync-build` | Run full Docker build/test and refresh workspace `dist`. | Yes | Passed: 140 files / 921 tests; `distLooksStale:false`. | `ev:T-0395:6c210dc953974c32acf008b7` |
| Built CLI smoke | Confirm close dry-run now returns one primary `append-close-evidence` next action and omits redundant validation actions. | Yes | Passed. | `ev:T-0395:a2c33196f7704223ae5e0044` |
| `git diff --check` | Check whitespace/diff hygiene. | Yes | Passed. | `ev:T-0395:7626ac62b2db4570ac2a87c8` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No security, permission, secret, or raw read boundary changed. | Not applicable. | Scope review. |
| Integration smoke | Yes | Agent-facing CLI JSON guidance changed. | Built CLI smoke passed. | `ev:T-0395:a2c33196f7704223ae5e0044` |
