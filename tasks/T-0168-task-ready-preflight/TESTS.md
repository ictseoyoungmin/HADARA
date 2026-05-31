# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Focused Docker vitest | Validate ready/close/schema behavior. | Yes | Passed | `npx vitest run tests/unit/task-ready.test.ts tests/unit/task-close.test.ts tests/unit/schema-fixtures.test.ts` passed with 3 files / 6 tests. |
| npm run check | Run the full repository check when available. | Before final close sequence | Deferred | Full check will run after T-0169. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI task ready smoke | Yes | Verify executable ready surface. | Passed | `task ready --task T-0168 --level done --json --project /workspace` returned `ok:true` and `ready:true`. |
| Done-level harness | Yes | Verify completed capsule. | Passed | `harness validate --task T-0168 --level done --json --project /workspace` returned `ok:true`. |
| Security smoke | No | Read-only command. | Not Run | Not applicable. |
| Integration smoke | No | No external integration changed. | Not Run | Not applicable. |
