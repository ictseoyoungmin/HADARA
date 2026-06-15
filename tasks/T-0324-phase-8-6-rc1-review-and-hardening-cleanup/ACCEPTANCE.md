# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Phase 8 rc1 self-review identifies and resolves at least one bounded hardening finding or records no actionable finding. | Done | Empty local T-0073 directory drift was traced to Task Capsule discovery and fixed. |
| AC-2 | Task Capsule discovery ignores task-like directories without `TASK.md`. | Done | `src/task/task-capsule.ts`; focused regression in `tests/harness/task-capsule.test.ts`. |
| AC-3 | Focused and full validation pass on Docker. | Done | `command:T-0324:focused-docker`; `command:T-0324:full-docker-sync-build`. |
| AC-4 | Built CLI advisory smokes confirm T-0073 drift is gone and state checks remain advisory. | Done | `command:T-0324:built-advisory-smokes`. |
| AC-5 | Capsule and shared handoff/state docs are updated before close. | Done | `docs/PROJECT_STATE.md`; `docs/AGENT_HANDOFF.md`; `docs/DEVELOPMENT_SLICES.md`; capsule handoff. |
