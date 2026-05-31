# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused vitest | Validate close/audit/schema/ready behavior. | Yes | Passed | `npx vitest run tests/unit/task-close.test.ts tests/unit/schema-fixtures.test.ts tests/unit/task-ready.test.ts` passed with 3 files / 8 tests. |
| Docker npm run check | Run the full repository check. | Yes | Passed | `npm run check` passed with 66 files / 483 tests. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI task close/audit smoke | Yes | CLI surface and dist refresh changed. | Passed | Built CLI `task close --json`, `task close --execute --json`, and `task audit-close --json` returned `ok:true`; execute output included append paths and audit nextAction. |
| Done-level harness | Yes | Required before marking done. | Passed | Built CLI `harness validate --task T-0170 --level done --json` returned `ok:true`. |
