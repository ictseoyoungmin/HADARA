# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0322 |
| TaskStatus | Done |
| CloseState | not-closed |
| Last Updated | 2026-06-15 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| T-0321 closed Phase 8.3 findings cleanup. | `fc536a4`; T-0321 audit-close returned `closed-valid`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open Phase 8.5 state verify, doctor, and advisory integration. | T-0322 added the service/schema read model; operator visibility and advisory rollout are the next capsule. | `docs/specs/0.3.1/rc1/05_State_Verify_Doctor_and_CI_Integration.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| State projection is service-only in T-0322. | Operators do not yet have a first-class CLI/doctor/CI surface for it. | Phase 8.5 should expose it as advisory without hidden writes. |
