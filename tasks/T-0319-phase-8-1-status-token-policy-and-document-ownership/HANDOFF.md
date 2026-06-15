# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0319 |
| Status | Done |
| Last Updated | 2026-06-15 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| Status token and ownership policy documented | `docs/TASK_WORKFLOW_COMMANDS.md` and `docs/IMPLEMENTATION_SOP.md` define TaskStatus, CloseState, DocStatus, EvidenceOutcome, and write ownership boundaries. |
| Generated init guidance aligned | `src/cli/init.ts` and `tests/unit/init.test.ts` cover generated SOP/workflow policy text. |
| Validation recorded | `command:T-0319:status-token-policy-validation`; full Docker timeout retained as `command:T-0319:docker-sync-build-full-timeout`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start Phase 8.2 Task Handoff Current-State and Close-State Governance. | Handoff/task projections still need structural separation between persistent TaskStatus and derived CloseState. | `docs/specs/0.3.1/rc1/02_Task_Handoff_Current_State_and_CloseState.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Full Docker wrapper timed out on existing docs archive/required-reading 5s tests. | This task does not establish a clean full-suite baseline. | Use focused Docker init/template validation and T-0315 stable full-source baseline for this docs/template capsule; `command:T-0319:policy-timeout-resolution` records the non-blocking scope decision. Revisit timeout behavior in the review/hardening capsule if it recurs. |
| Handoff scaffold still has a single `Status` field. | Future workers can accidentally mix lifecycle status with close proof state. | Phase 8.2 owns generated handoff/current-state separation. |
