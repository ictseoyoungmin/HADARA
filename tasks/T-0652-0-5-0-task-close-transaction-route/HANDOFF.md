# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0652 |
| Title | 0.5.0 task close transaction route |
| Status | Done |
| Created | 2026-07-18T20:05 |
| Updated | 2026-07-18T21:12 |
## Last Completed

| Item | Evidence |
|---|---|
| Implemented public `hadara task close --task T-XXXX --json` transaction route returning `hadara.task.close.v2`. | `ev:T-0652:beaeb111205a471689c2c4bc` |
| Added schema, command registry/help, lifecycle docs, init templates, package smoke/recycle coverage, and focused tests. | `ev:T-0652:87b7e888c7c14107a1cd687b` |
| Refreshed workspace `dist` through Docker sync-build and confirmed built CLI close dry-run emits v2 without finalize recovery leakage. | `ev:T-0652:beaeb111205a471689c2c4bc` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Run `hadara task close --task T-0652 --json`. | Capsule docs and validation evidence are ready; close should let the new public route finish/status-sync and append close proof. | `docs/TASK_WORKFLOW_COMMANDS.md`, `tasks/T-0652-0-5-0-task-close-transaction-route/TASK.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `task.finalize` remains available as compatibility/debug. | Agents should not treat it as the primary 0.5 close path. | Prefer `task close` in docs/help/status guidance; keep finalize mentions scoped to compatibility/debug text. |
| Evidence appends were intentionally lock-protected and two parallel evidence commands reported contention warnings. | Evidence records are durable and serialized, but same-task evidence writes should be submitted sequentially. | Serialize future same-task evidence appends. |
