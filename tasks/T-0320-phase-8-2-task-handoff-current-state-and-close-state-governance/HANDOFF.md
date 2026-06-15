# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0320 |
| TaskStatus | Done |
| Last Updated | 2026-06-15 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| Handoff scaffold now separates persistent `TaskStatus` from derived close proof state; legacy exact `Status` tokens remain compatible. | `src/task/task-capsule.ts`; `tests/unit/task-capsule.test.ts`; `command:T-0320:docker-focused` |
| Done-level validation rejects stale `pending lifecycle close` wording and `PLAN.md` rows left `In Progress`. | `src/harness/validate.ts`; `tests/harness/harness-validate.test.ts`; `tests/unit/task-ready.test.ts` |
| Full Docker validation passed after dashboard-bootstrap selected-task proof compatibility was made tolerant of historical validation drift. | `command:T-0320:docker-full-sync-build` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start Phase 8.3 Installed-Package Findings Cleanup. | T-0317 carried exact-npx/global-path ambiguity and governed docs doctor warnings; Phase 8.3 should resolve or document those consumer findings. | `docs/specs/0.3.1/rc1/03_Installed_Package_Findings_Cleanup.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Close proof state is intentionally not stored in task-local HANDOFF current state. | Stored close state in a close-source handoff creates fixed-point drift after close evidence is appended. | Use `task status`, `task audit-close`, proof status, or `state verify` read models for derived close state. |
