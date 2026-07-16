# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Finalize auto now evaluates post-finish readiness on a virtual overlay before real writes. | ev:T-0626:8eaf357e67434369b24bd278 |
| Clean first-capsule style auto close remains covered. | ev:T-0626:8eaf357e67434369b24bd278 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Implement placeholder semantics cleanup for finalize validation rows. | T-0625 also showed `Not Run` / `TBD` finalizer validation rows being treated as scaffold residue. | `tasks/T-0625-0-4-6-rc1-current-package-codex-dogfood-before-stable/DOGFOOD_REPORT.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Stable still needs delegated dogfood rerun after the next cleanup. | T-0626 fixes the close boundary but does not prove the external workflow end-to-end. | Run the same current-package Codex dogfood from a clean project after T-0627. |
