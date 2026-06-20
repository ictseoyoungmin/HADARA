# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused temp-copy test | Validate close repair plan, task close/lifecycle, command registry, and schema fixtures. | Yes | Passed: 5 files / 28 tests. | `ev:T-0394:f0875b6093844de1ac01053e` |
| `npm run dev:docker-sync-build` | Run full Docker build/test and refresh workspace `dist`. | Yes | Passed: 140 files / 921 tests; `distLooksStale:false`. | `ev:T-0394:8c47406cc61a4314bde168b0` |
| Built CLI smoke | Prove `node dist/cli/main.js task close-repair-plan --task T-0394 --json` emits the new schema and read-only report. | Yes | Passed: schema `hadara.task.closeRepairPlan.v1`, `ok:true`, `readOnly:true`, `classification:"not-closed"`. | `ev:T-0394:a32fcb73ccde4179a56cc267` |
| `git diff --check` | Check whitespace/diff hygiene. | Yes | Passed. | `ev:T-0394:e22abfd41b9048a492203406` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Security smoke | No | No permission, secret, raw read, or execution boundary changed. | Not applicable. | Covered by scope. |
| Integration smoke | Yes | CLI command surface changed. | Built CLI smoke passed. | `ev:T-0394:a32fcb73ccde4179a56cc267` |
