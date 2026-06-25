# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker `npm run build` in `/tmp/hadara` | Typecheck/build changed CLI/service/schema code. | Yes | Passed | `ev:T-0411:0072b5ef53bb42378fe5c58b` |
| Docker `npm test -- --run tests/unit/evidence-summary.test.ts tests/unit/evidence-json.test.ts tests/unit/schema-fixtures.test.ts` | Focused evidence summary, existing evidence CLI, and schema fixture coverage. | Yes | Passed: 3 files / 27 tests | `ev:T-0411:0072b5ef53bb42378fe5c58b` |
| Docker `npm test -- --run tests/unit/task-workflow-docs.test.ts tests/unit/schema-stability-docs.test.ts` | Focused workflow docs and schema docs coverage. | Yes | Passed: 2 files / 5 tests | `ev:T-0411:6f895f21f1de4a4d829b3c17` |
| Built CLI `evidence summary --task T-0410 --json` and text mode | Verify workspace `dist` command returns compact id/copy-hint reports. | Yes | Passed | `ev:T-0411:0072b5ef53bb42378fe5c58b` |
| `git diff --check` | Whitespace sanity. | Yes | Passed | `ev:T-0411:0072b5ef53bb42378fe5c58b` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full Docker sync-build | No | T-0411 is a focused read-only UX addition; T-0409 records the current full-suite timeout limitation. | Not Run | `tasks/T-0409-handoff-stale-known-problem-detector/TESTS.md` |
| Security smoke | No | No permission, secret, storage, or execution boundary changed. | Not Run | N/A |
