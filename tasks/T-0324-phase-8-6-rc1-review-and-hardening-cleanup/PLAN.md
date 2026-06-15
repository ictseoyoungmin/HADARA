# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Review Phase 8 rc1 specs, shared state docs, and T-0323 advisory outputs. | Done | Current repo `state verify` showed empty-directory T-0073 drift before the fix. |
| 2 | Harden Task Capsule discovery to ignore task-like directories without `TASK.md`. | Done | `src/task/task-capsule.ts`; `tests/harness/task-capsule.test.ts`. |
| 3 | Run focused and full validation. | Done | `command:T-0324:focused-docker`; `command:T-0324:full-docker-sync-build`. |
| 4 | Run built CLI advisory smokes and whitespace check. | Done | `command:T-0324:built-advisory-smokes`; `command:T-0324:diff-check`. |
| 5 | Update capsule and shared handoff/state docs before lifecycle close. | Done | Capsule docs plus `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, and `docs/DEVELOPMENT_SLICES.md`. |
