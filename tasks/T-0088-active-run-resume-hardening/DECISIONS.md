# Decisions

- Canonical Task Capsule path comes from `listTaskCapsules(projectRoot)` matched by `activeRun.taskId`.
- If the Task Capsule exists, projection and resume guidance use the canonical path even when the manifest has a different `capsule` value.
- `ACTIVE_RUN_CAPSULE_MISMATCH` is a warning because the surface is read-only and can still provide safe canonical guidance.
- Schema fixtures document the stable read models but do not introduce runtime validation in this slice.
- Active-run projection/resume fixtures are now tracked as future runtime-validation candidates because they read mutable local project state.
