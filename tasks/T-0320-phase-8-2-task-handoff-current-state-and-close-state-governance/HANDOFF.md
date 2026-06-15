# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0320 |
| TaskStatus | Done |
| CloseState | not-closed |
| Last Updated | 2026-06-15 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| Handoff scaffold now separates `TaskStatus` and `CloseState`; legacy exact `Status` tokens remain compatible. | `src/task/task-capsule.ts`; `tests/unit/task-capsule.test.ts`; `command:T-0320:docker-focused` |
| Done-level validation rejects stale `pending lifecycle close` wording and `PLAN.md` rows left `In Progress`. | `src/harness/validate.ts`; `tests/harness/harness-validate.test.ts`; `tests/unit/task-ready.test.ts` |
| Full Docker validation passed after dashboard-bootstrap selected-task proof compatibility was made tolerant of historical validation drift. | `command:T-0320:docker-full-sync-build` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start Phase 8.3 Installed-Package Findings Cleanup. | T-0317 carried exact-npx/global-path ambiguity and governed docs doctor warnings; Phase 8.3 should resolve or document those consumer findings. | `docs/specs/0.3.1/rc1/03_Installed_Package_Findings_Cleanup.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| CloseState in this handoff is `not-closed` because close proof is appended after close-source docs are finalized. | Do not treat the handoff row as close evidence. | Use `task close --execute` and `task audit-close` evidence for final CloseState. |
