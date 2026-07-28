# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0724 |
| Title | Expose Close Marker Counts |
| Status | Done |
| Created | 2026-07-28T18:46 |
| Updated | 2026-07-28T18:52 |

## Last Completed

| Item | Evidence |
|---|---|
| Public task-close v3 reports now expose marker persistence counts and rc2 write-summary aliases. | ev:T-0724:069817aa186b4d59b239de54 |
| Full check passed after the marker count/schema changes. | ev:T-0724:acbbf0742ce045ceb14a4c5a |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Add close fault injection for proof-pending and partial recovery paths. | actionable | yes | T-0723/T-0724 covered proof-last ordering and marker count reporting, but the rc2 fault matrix still needs direct recovery/fault coverage. | docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md; src/task/close/execute.ts; tests/unit/task-close.test.ts |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Blocked preflight still records and cleans an initial operation marker on the execute path. | This is visible in counts and may miss the strictest reading of zero marker writes for blocked preflight. | Decide in a focused follow-up whether to delay operation marker creation until after execute preflight definitively passes. |
| Fsync counters are placeholders. | The report shape exists, but target file/directory fsync instrumentation is not yet wired. | Add instrumentation only when the write helper exposes real fsync events; do not fake non-zero values. |
