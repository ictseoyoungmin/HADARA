# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0325 |
| TaskStatus | Done |
| Last Updated | 2026-06-15 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| Removed persistent `CloseState` from new task handoff scaffolds and made done-level validation reject stored close proof state in HANDOFF. | `src/task/task-capsule.ts`; `src/harness/validate.ts`; `command:T-0325:focused-docker` |
| Updated state projection and Phase 8/workflow docs so CloseState is derived from status/audit/proof/state read models. | `src/services/state-projection.ts`; `docs/TASK_WORKFLOW_COMMANDS.md`; Phase 8 specs |
| Removed stale `CloseState` rows from T-0320 through T-0325 handoff current-state tables. | Recent Phase 8 handoff docs |
| Hardened `findTaskCapsule()` to skip same-id leftovers without `TASK.md` while finding a later real capsule. | `src/task/task-capsule.ts`; `command:T-0325:focused-docker` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Proceed only to a dedicated `0.3.1-rc1` release-readiness/prep capsule if packaging is desired. | T-0325 completes the CloseState derived-state cleanup; version bump, release artifact refresh, publish, and installed-package recycle remain separate release work. | `docs/specs/0.3.1/rc1/00_HADARA_0_3_1_rc1_Status_Governance_Implementation_Plan.md`; `docs/RELEASE_READINESS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Historical close proofs for edited T-0320 through T-0324 handoffs may become stale if audited directly. | Their HANDOFF.md close-source content changed to remove stale stored close state. | Use T-0325 as the current cleanup proof; only re-close historical tasks intentionally if an operator needs fresh per-task historical proofs. |
