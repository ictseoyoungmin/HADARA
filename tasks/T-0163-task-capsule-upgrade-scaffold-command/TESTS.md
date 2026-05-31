# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker focused vitest | Validate upgrade-scaffold service, CLI, and schema fixture. | Yes | Passed | `npx vitest run tests/unit/task-upgrade-scaffold.test.ts tests/unit/schema-fixtures.test.ts tests/unit/task-json.test.ts` passed with 3 files / 11 tests. |
| Docker npm run check | Run full repository build and tests. | Yes | Passed | `npm run check` passed with 63 files / 472 tests in `/tmp/hadara`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI dry-run smoke | Yes | Verify command surface through refreshed dist. | Passed | Built CLI `task upgrade-scaffold --task T-0163 --json --project /workspace` returned `schemaVersion: hadara.task.upgrade_scaffold.v1`, `ok: true`, and no writes. |
| Built dist refresh | Yes | CLI command changed. | Passed | `/workspace/dist` refreshed from `/tmp/hadara/dist`. |
| Built CLI done-level harness | Yes | Prove capsule completion state. | Passed | `harness validate --task T-0163 --level done --json --project /workspace` returned `ok: true`. |
| Security smoke | No | No security boundary changed. | Not Run | Not applicable. |
| Integration smoke | No | No integration surface changed. | Not Run | Not applicable. |
