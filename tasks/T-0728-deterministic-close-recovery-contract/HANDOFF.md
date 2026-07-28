# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0728 |
| Title | Deterministic Close Recovery Contract |
| Status | Done |
| Created | 2026-07-28T19:58 |
| Updated | 2026-07-28T20:09 |

## Last Completed

| Item | Evidence |
|---|---|
| Persisted close operation intent now includes close source hash, write set hash, expected guarded writes, intended final state, and proof intent. | ev:T-0728:a9679622095d4e91b4832742 |
| Malformed operation markers fail closed with zero lifecycle/evidence writes and one read-only recovery action. | ev:T-0728:a9679622095d4e91b4832742 |
| Durable `proof-pending` is recorded before close proof append, and recovery avoids duplicate close proof. | ev:T-0728:a9679622095d4e91b4832742 |
| Full validation passed. | ev:T-0728:f8980b9bf7c7456eaeee86ab |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Continue with deterministic partial-write reconciliation and `bookkeeping` domain removal. | actionable | yes | T-0728 persisted the write-set/proof intent and fail-closed marker behavior; the remaining spec gap is prefix/non-prefix reconciliation and replacing the legacy bookkeeping report/domain with generic close writes. | docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md; docs/TASK_WORKFLOW_COMMANDS.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `bookkeeping.ts` still exists as the guarded write planner/executor source. | AC-4's full naming/domain removal remains incomplete even though marker intent no longer depends on step-only bookkeeping state. | Next capsule should move the remaining planner/executor surface toward generic close writes. |
| Prefix/non-prefix partial-write reconciliation is not implemented. | A real process interruption after some renames still needs a stronger descriptor-based resume classifier. | Use the persisted expected writes and hashes added here as the basis for reconciliation. |
