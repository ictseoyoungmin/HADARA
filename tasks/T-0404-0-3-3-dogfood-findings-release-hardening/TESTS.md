# Tests

## Routine Checks

| Command | Purpose | Required For Done | Latest Result | Evidence |
|---|---|---|---|---|
| `npm run test:focused -- tests/unit/context-state-projection.test.ts tests/unit/workbench-next-actions.test.ts` | Validate PF-F-012 and PF-F-010 regressions on the host if dependencies are present. | No | Failed: host `vitest` missing. | `ev:T-0404:4afea4d96bd147a198cc2a92` |
| `node dist/cli/main.js dev docker-check --focused tests/unit/context-state-projection.test.ts tests/unit/workbench-next-actions.test.ts --sync-dist --before-hash <hash> --json --project /mnt/f/NowWorking/HADARA-dev` | Validate PF-F-012 and PF-F-010 regressions in the HADARA-dev Docker baseline and refresh `dist`. | Yes | Passed. | `ev:T-0404:b6deb46e7b9d4a3283f88d57` |
| `node dist/cli/main.js task status --task T-0022 --json --project /tmp/patternforge-work/patternforge` | Verify built CLI no longer requires warning-only handoff refresh for a closed-valid dogfood task. | Yes | Passed: status `closed-valid`; next action only audit-close. | `ev:T-0404:b6deb46e7b9d4a3283f88d57` |
| `node dist/cli/main.js context pack --task T-0017 --json --project /tmp/patternforge-work/patternforge` | Verify built CLI no longer reports the observed false `STATE_TASK_BOARD_MISSING_ROW` warning. | Yes | Passed: no `STATE_TASK_BOARD_MISSING_ROW` issue. | `ev:T-0404:b6deb46e7b9d4a3283f88d57` |
| `git diff --check` | Check whitespace before close. | Yes | Passed. | `ev:T-0404:b6deb46e7b9d4a3283f88d57` |

## Special Checks

| Check | Required? | Reason | Latest Result | Evidence |
|---|---|---|---|---|
| Full Docker sync-build | Later release-readiness capsule | This capsule uses focused validation; full release gate follows before stable publish. | Not Run | Deferred to stable release readiness. |
| Published package smoke | No | Source hardening is not yet published. | Not Run | Not applicable. |
