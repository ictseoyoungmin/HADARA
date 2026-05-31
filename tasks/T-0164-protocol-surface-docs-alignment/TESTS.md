# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| Docker npm run check | Run full repository build and tests. | Yes | Passed | `npm run check` passed with 63 files / 472 tests in `/tmp/hadara`. |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Built CLI help smoke | Yes | Verify executable help matches docs. | Passed | Built CLI `--help` output listed `task upgrade-scaffold`, `protocol doctor [--json]`, and `--scope docs|profile|all`. |
| Built dist refresh | Yes | Help text changed. | Passed | `/workspace/dist` refreshed from `/tmp/hadara/dist`. |
| Done-level harness | Yes | Verify completed capsule and project tracking are consistent. | Passed | Built CLI `harness validate --task T-0164 --level done --json --project /workspace` returned `ok: true` with no issues. |
| Security smoke | No | No security boundary changed. | Not Run | Not applicable. |
| Integration smoke | No | No integration surface changed. | Not Run | Not applicable. |
