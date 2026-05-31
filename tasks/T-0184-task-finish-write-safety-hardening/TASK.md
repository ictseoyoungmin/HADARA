# T-0184 Task Finish Write Safety Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0184 |
| Title | Task Finish Write Safety Hardening |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Harden `task finish --execute` writes. | Add hash-based conflict guards, temp-file/rename writes, malformed Task Board refusal, no-op detection, and shell-quoted `task next` createCommand output. |

## Scope

| In Scope | Reason |
|---|---|
| `task finish` write metadata. | Include before/after hashes and expected existence in planned writes. |
| Atomic-ish execute path. | Prepare temp files, rename only after conflict checks pass, and attempt rollback on failure. |
| Malformed frame and no-op guards. | Refuse ambiguous Task Board or TASK.md frame states. |
| `task next` createCommand quoting. | Generated command should survive titles containing double quotes. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Broadening `task finish` write scope. | Finish remains bounded to `TASK.md` and Task Board only. |
| Full transactional filesystem guarantees. | This is temp-file/rename plus rollback-attempt hardening, matching existing repo patterns. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31 | Draft | Initial task scaffold. | Task Capsule created. |
| 2026-05-31 | Done | Write safety hardening, tests, validation, and evidence completed. | T-0184 evidence records. |
