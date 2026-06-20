# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0396 |
| TaskStatus | Done |
| Last Updated | 2026-06-20 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| Added `hadara.task.finalize.v1` and `hadara task finalize --task <id> --json` as a read-only lifecycle plan. | `ev:T-0396:874095dd00434f5195eb144a`, `ev:T-0396:d7b3975a5e4849f9ab74da22` |
| Full Docker sync-build refreshed `dist` and passed 141 files / 925 tests. | `ev:T-0396:1057e733697c467aa0fbc9cd` |
| Built CLI execute-refusal smoke confirmed no finalize writes without reviewed plan hash. | `ev:T-0396:7d3e8d90a33149be8a8e2e94` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Create/start T-0397 Task Finalize Execute Guard. | T-0396 proves the dry-run plan contract; the next budget item can add a guarded execute path or decide to keep execute deferred. | `docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `task finalize --execute` is intentionally refused in T-0396. | Users must still run finish/ready/close/audit manually or through future guarded support. | Use the dry-run report's ordered commands; implement T-0397 if execute compression is still worth it. |
| Incomplete finalize dry-runs return `ok:false` by design. | Automation must inspect `mode`, `steps`, and `nextActions`, not treat incomplete plans as malformed output. | The schema and docs describe `ok` as "all steps satisfied" for this report. |
