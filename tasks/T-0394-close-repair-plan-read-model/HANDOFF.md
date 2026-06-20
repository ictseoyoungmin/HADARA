# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0394 |
| TaskStatus | Done |
| Last Updated | 2026-06-20 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| Added read-only `hadara task close-repair-plan --task T-XXXX --json` over `hadara.task.closeRepairPlan.v1`. | `ev:T-0394:a32fcb73ccde4179a56cc267` |
| Covered close repair classifications and CLI JSON output with focused tests. | `ev:T-0394:f0875b6093844de1ac01053e` |
| Full Docker sync-build refreshed `dist`. | `ev:T-0394:8c47406cc61a4314bde168b0` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Continue with T-0395 Lifecycle Guidance Dedup Hardening. | T-0394 is implemented and closed; the next lifecycle budget item is reducing redundant ready/close next-action guidance. | `docs/specs/0.3.3/lifecycle/00_Lifecycle_Workflow_Agent_Convenience_Spec.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `task close-repair-plan` is read-only and can still report readiness blockers for Draft capsules. | A `not-closed` classification before finish is expected, not a command failure. | Finish capsule docs and Task Board first, then rerun ready/close/audit. |
