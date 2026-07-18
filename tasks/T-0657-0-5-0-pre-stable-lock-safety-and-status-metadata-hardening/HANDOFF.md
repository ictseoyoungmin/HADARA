# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0657 |
| Title | 0.5.0 pre-stable lock safety and status metadata hardening |
| Status | Done |
| Created | 2026-07-18T23:42 |
| Updated | 2026-07-18T23:53 |
## Last Completed

| Item | Evidence |
|---|---|
| Task-close lock reclaim is now conservative: fresh metadata gaps are not reclaimed, live owners are not reclaimed by age alone, stale removal uses quarantine rename, and release requires token proof. | `ev:T-0657:bc6071dc52804e93b3416939` |
| Close operation journal writes are now temp/fsync/rename based instead of direct overwrite. | `ev:T-0657:bc6071dc52804e93b3416939` |
| Project status v2 now marks `hadara init --json` as reviewed project-state write, treats active-work as routing/orientation, and exposes compact full diagnostic summaries. | `ev:T-0657:bc6071dc52804e93b3416939` |
| Focused tests, schema/docs tests, full unit suite, TypeScript build, and Docker sync build passed. | `ev:T-0657:bc6071dc52804e93b3416939` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Prepare a fresh `0.5.0-rc.1` or stable release-readiness/recycle capsule from the current source snapshot. | T-0656 and T-0657 changed source and dist after the published `0.5.0-rc.0`; reuse of rc.0 evidence would be stale. | `tasks/T-0657-0-5-0-pre-stable-lock-safety-and-status-metadata-hardening/TASK.md`, `docs/CLI_JSON_CONTRACT.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| No heartbeat lease renewal exists for long-running task-close locks. | A live process keeps ownership regardless of age; a hung live process requires operator intervention. | Keep task-close operations serialized; add heartbeat lease only in a future explicit hardening capsule. |
| Process-kill crash fault injection is still outside this capsule. | Recovery is safer but not proven against every OS kill interleaving. | Treat current implementation as fail-closed/recovery-capable, not fully crash-atomic. |
| Current source differs from published `0.5.0-rc.0`. | Stable promotion requires fresh artifact evidence. | Run release readiness/recycle after committing T-0657. |
