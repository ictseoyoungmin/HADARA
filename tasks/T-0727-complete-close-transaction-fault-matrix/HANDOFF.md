# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0727 |
| Title | Complete Close Transaction Fault Matrix |
| Status | Done |
| Created | 2026-07-28T19:10 |
| Updated | 2026-07-28T19:10 |

## Last Completed

| Item | Evidence |
|---|---|
| `Residual` risk-state token hotfix implemented. | ev:T-0727:f4aa70c758294555b604f2ed |
| Remaining rc2 fault seams added to non-public close hooks and guarded writes. | ev:T-0727:f4aa70c758294555b604f2ed; ev:T-0727:43d9a8cfb2e041f68b3c20b9 |
| Full validation passed. | ev:T-0727:052bdd94ac694187aa457e95 |
| Fixed-count capsule guidance cleanup passed. | ev:T-0727:9afaf13d82eb4cea9ccb03ef |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Commit `T-0727 Complete Close Transaction Fault Matrix` after close succeeds. | terminal | no | The requested rc2 follow-up is implemented and validated in this capsule. | docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md; docs/TASK_WORKFLOW_COMMANDS.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Installed-package synthetic fault coverage is not repeated for every hook row. | Source-level fault hooks cover the matrix while T-0726 already proved installed clean/blocked/retry dogfood. | Recorded as residual risk in T-0727 and covered by full source validation. |
