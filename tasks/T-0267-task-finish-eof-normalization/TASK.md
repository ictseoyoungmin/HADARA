# T-0267 Task Finish EOF Normalization

## Metadata

| Field | Value |
|---|---|
| ID | T-0267 |
| Title | Task Finish EOF Normalization |
| Status | Done |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |

## Goal

| Goal | Notes |
|---|---|
| Normalize task finish atomic text writes to avoid trailing blank EOF lines. | Prevent repeated `git diff --check` cleanup and close hash churn after `task finish --execute`. |

## Scope

| In Scope | Reason |
|---|---|
| `task finish` text write EOF normalization. | The repeated issue came from finish-generated `TASK.md` trailing blank lines. |
| Regression coverage for finish execute output. | Prevents recurrence without changing close/audit semantics. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| No hidden task completion execution | Template boundary. |
| No shared-doc writes outside bounded workflow commands | Template boundary. |
| No evidence append outside explicit evidence/close commands | Template boundary. |
| No broad formatting rewrite of historical capsules. | This hotfix should affect future finish writes only. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold from template. | Template defaults. |
| 2026-06-05T09:20:00.000Z | In Progress | Started task finish EOF normalization hotfix. | Repeated T-0265/T-0266 `TASK.md` EOF blank-line cleanup observed. |
| 2026-06-05 | Done | Finished task capsule. | `hadara task finish --execute` |
