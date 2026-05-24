# Acceptance Criteria

- [x] Active-run projection canonicalizes existing Task Capsule paths from `taskId`.
- [x] Active-run projection and resume report warn with `ACTIVE_RUN_CAPSULE_MISMATCH` when manifest capsule differs from the canonical path.
- [x] Resume guidance `mustRead` uses the canonical capsule path when the Task Capsule exists.
- [x] `hadara.active_run.projection.v1` and `hadara.active_run.resume.v1` schema fixtures exist and are indexed.
- [x] CLI/docs clearly state `run-state resume` is read-only guidance and does not resume a process.
- [x] Tests or explicit constraints are recorded.
- [x] Evidence is attached.
- [x] Handoff is updated.
