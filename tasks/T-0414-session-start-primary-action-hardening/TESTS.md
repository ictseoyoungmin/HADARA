# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `/tmp/hadara` `npm run build` | Type-check and build changed Session Start files. | Yes | Passed | ev:T-0414:598d8358ab004c6faf3164a6 |
| Docker `/tmp/hadara` focused unit tests | Session Start, context CLI, e2e smoke script, and schema fixtures. | Yes | Passed: 4 files / 23 tests | ev:T-0414:598d8358ab004c6faf3164a6 |
| Built CLI Session Start smoke | `node dist/cli/main.js session start --task T-0414 --json`. | Yes | Passed: `guidance.primaryAction.id=task-lifecycle`, `nextCommandArgs` present, no live context writes. | ev:T-0414:598d8358ab004c6faf3164a6 |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Live Session Start smoke | No | This capsule hardens guidance fields, not live context graph behavior. | Not Run | ev:T-0414:598d8358ab004c6faf3164a6 |
