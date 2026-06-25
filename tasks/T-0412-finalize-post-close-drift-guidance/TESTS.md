# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `npm run build` in `/tmp/hadara` | Typecheck/build changed lifecycle code. | Yes | Passed | `ev:T-0412:32fdb139512446aaa3806924` |
| Docker `npm test -- --run tests/unit/task-finalize.test.ts tests/unit/task-lifecycle.test.ts` | Focused finalize/lifecycle drift guidance coverage. | Yes | Passed: 2 files / 14 tests | `ev:T-0412:32fdb139512446aaa3806924` |
| Docker `npm test -- --run tests/unit/task-workflow-docs.test.ts` | Focused workflow docs coverage after repair guidance docs update. | Yes | Passed: 1 file / 4 tests | `ev:T-0412:d5c2e7a5d463479c95fe684a` |
| Built CLI `task finalize --task T-0412 --json` and `task lifecycle --task T-0412 --json` | Verify workspace `dist` command still returns expected Draft-task lifecycle guidance. | Yes | Passed with expected finish-required guidance | `ev:T-0412:32fdb139512446aaa3806924` |
| `git diff --check` | Whitespace sanity. | Yes | Passed | `ev:T-0412:32fdb139512446aaa3806924` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full Docker sync-build | No | Focused lifecycle read-model change; T-0409 records current full-suite timeout limitation. | Not Run | `tasks/T-0409-handoff-stale-known-problem-detector/TESTS.md` |
| Security smoke | No | No permission, storage, secret, or execution boundary changed. | Not Run | N/A |
