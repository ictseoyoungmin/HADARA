# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0255 |
| Status | Done |
| Last Updated | 2026-06-05 |

## Last Completed

| Item | Evidence |
|---|---|
| Added `hadara task complete --task <id> --json` read-only complete-flow report. | Service/CLI/schema/tests/docs implemented. |
| Docker sync-build passed and refreshed `dist`. | 94 test files / 638 tests passed; built CLI version smoke reported `distLooksStale:false`. |
| Built CLI smoke exercised active T-0255 complete-flow output. | Report returned `hadara.task.complete_flow.v1`, `stage: finish-required`, and primary next action `execute-finish` before finish/close. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Continue with T-0256 Close Evidence Idempotency / Supersedes. | Phase 6 next slice after complete-flow dry-run. | Phase 6 agent-UX spec T-0256, `docs/TASK_WORKFLOW_COMMANDS.md`, `docs/CLI_JSON_CONTRACT.md`. |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `task complete` remains read-only and intentionally exits non-zero until the task is fully closed/audited. | Operators should not treat exit 6 as a malformed JSON failure; it can still return useful stage and next-action guidance. | Inspect `stage`, `primaryNextAction`, and `issues`. |
| Mounted `/workspace` npm install failed with esbuild symlink `EPERM`. | Focused tests should use the temp-copy Docker workflow unless the mounted workspace has valid dependencies. | Use `npm run dev:docker-sync-build` for reproducible build/test/dist refresh. |
