# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0661 |
| Title | Continuation model: task-close promotion and idle-precedence fix (Phase C: declarative DAG status redesign) |
| Status | Done |
| Created | 2026-07-20T17:29 |
| Updated | 2026-07-20T17:46 |
## Last Completed

| Item | Evidence |
|---|---|
| Added `continuation` to `ProjectCurrentState`, wired `task close` to promote a closed task's HANDOFF "Next Recommended Step" into it, and made `task-selection-status-v2` route to `continuation-ready` (not `idle`) when an actionable/waiting-for-operator continuation exists and no other recommendation matched. This is the actual fix for the reported bug: a closing session's declared next step is no longer silently lost when `nextWork` is null. Phases A (T-0659), B (T-0660), and C (T-0661) of the Declarative DAG status redesign are now all closed. | ev:T-0661:2e732e9cfe094b8cb249de77, ev:T-0661:e1bca6f6cd1d4612922a405c, ev:T-0661:37bb835634a84762b82c4711 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Run `hadara task status --json` after this close and confirm the reported phase is `continuation-ready` (not `idle`), dogfooding the exact fix on this repository. Then decide whether to continue into Phase D (context route resolver / registry stable id) or stop the redesign here, since the reported bug is now fixed without it. | This close's own HANDOFF next step is the first real end-to-end proof of the fix built in T-0661. | `.hadara/local/tmp_plan/status/redesign_candidate/HADARA_Declarative_DAG_Status_Context_Routing_Design.docx` section 16.3 |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
