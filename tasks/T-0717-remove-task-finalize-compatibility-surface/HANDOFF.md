# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0717 |
| Title | Remove Task Finalize Compatibility Surface |
| Status | Done |
| Created | 2026-07-28T14:45 |
| Updated | 2026-07-28T14:53 |

## Last Completed

| Item | Evidence |
|---|---|
| Removed `task finalize` from the public command surface, registry/help/docs, and generated workflow templates while preserving the internal finalize engine behind `task close`. | `ev:T-0717:744c806073b2440d9618d375` |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Decide whether to clean historical release/history documents that still mention past `task finalize` behavior. | waiting-for-operator | no | Current/public routing is fixed, but historical notes and closed historical capsules still describe the older surface. | `tasks/T-0717-remove-task-finalize-compatibility-surface/TASK.md`, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Historical docs and closed historical capsules still mention `task finalize` as past behavior. | Grep-based audits over the whole repository will still find old references even though the current public CLI surface is clean. | Treat history cleanup as a separate scoped documentation task; do not mutate already-closed capsules or historical release notes casually. |
