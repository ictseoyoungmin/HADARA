# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Focused Docker vitest | Validate execute append and schema alignment. | Yes | Passed | `npx vitest run tests/unit/task-close.test.ts tests/unit/schema-fixtures.test.ts` passed with 2 files / 4 tests. |
| npm run check | Run the full repository check when available. | Before final close sequence | Deferred | Full check will run after all planned close-model capsules. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI task close execute smoke | Yes | Verify canonical close evidence append. | Passed | `task close --task T-0167 --execute --json --project /workspace` returned `ok:true` and `closeEvidence.appended:true`, and appended command-log close evidence. |
| Done-level harness | Yes | Verify completed capsule after close evidence append. | Passed | `harness validate --task T-0167 --level done --json --project /workspace` returned `ok:true`. |
| Security smoke | No | Write boundary is existing evidence writer only. | Not Run | Not applicable. |
| Integration smoke | No | No external integration changed. | Not Run | Not applicable. |
