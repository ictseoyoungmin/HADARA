# T-0177 Task Workbench Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0177 |
| Title | Task Workbench Hardening |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Harden Phase 3 task workbench semantics after review. | Make Task Board status come from `docs/TASK_BOARD.md`, normalize optional nextAction fields before raw schema validation, and split close evidence presence from valid closure. |

## Scope

| In Scope | Reason |
|---|---|
| Task Board projection hardening | `task.status` must not label capsule `TASK.md` status as Task Board status. |
| Workbench drift issues | Operators need explicit Task Board row missing, status drift, and capsule drift issues in the workbench report. |
| Next action normalization | Optional undefined fields must not break raw report schema validation. |
| Close evidence state semantics | A blocked or malformed close evidence record must not display as valid closure. |
| Workbench contract/docs/tests | Additive report fields and intended `ok` semantics should be documented and regression-tested. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Automatic Task Board remediation execution | `task status` remains read-only and only suggests bounded commands. |
| Shell-executing evidence capture | T-0176 keeps this as design-only future work. |
| Commit creation | Operator explicitly requested this hardening without a git commit. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31 | Draft | Initial task scaffold. | Task creation output. |
| 2026-05-31 | Active | Started operator-requested Phase 3 hardening. | This capsule. |
| 2026-05-31 | Done | Workbench hardening implemented and validated without commit. | T-0177 evidence records. |
