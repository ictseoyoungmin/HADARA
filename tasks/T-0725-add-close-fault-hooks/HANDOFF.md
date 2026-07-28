# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0725 |
| Title | Add Close Fault Hooks |
| Status | Done |
| Created | 2026-07-28T18:53 |
| Updated | 2026-07-28T18:57 |

## Last Completed

| Item | Evidence |
|---|---|
| Internal task-close fault hooks cover after-proof-append and before-terminal-cleanup interruption. | ev:T-0725:fbccac6c872147da8ab63f1a |
| Full check passed after fault hook coverage. | ev:T-0725:cd358b81b5cd44f096d16135 |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Run installed-package task-close transaction dogfood for clean, blocked, race/retry, and recovery paths. | actionable | yes | User requested all rc2 task-close work within four capsules; T-0726 should be the fourth and final capsule, focused on installed dogfood proof and residual-risk reporting. | docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md; docs/TASK_WORKFLOW_COMMANDS.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The remaining user budget is one capsule. | Avoid opening broad refactors; use installed-package dogfood and document residuals instead. | Keep T-0726 focused on proof, small fixes only if dogfood exposes an immediate blocker. |
