# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| CLI entry now normalizes known leading global options before command dispatch. | ev:T-0460:708e920cff184178b4a650d5 |
| Built CLI smokes passed for `--json --project . version` and `--project <tmp> init --profile basic --json`. | ev:T-0460:4951e6416ffc4c0bad478427 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Run done-level validation and finalize T-0460 after shared state docs are current. | Capsule implementation and evidence are complete; close proof still needs lifecycle finalization. | docs/TASK_WORKFLOW_COMMANDS.md |
| Consider a small follow-up only if more global options need command-independent placement. | T-0460 intentionally covered `--project` and `--json` only. | src/cli/main.ts |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Host `npm run test:focused` and `npm run build` are not usable in this workspace without dependencies. | Host attempts failed with `vitest: not found` and `tsc: not found`. | Use Docker temp-copy validation as recorded in ev:T-0460:708e920cff184178b4a650d5. |
