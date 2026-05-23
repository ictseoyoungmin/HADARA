# Acceptance Criteria

- [x] Missing `PROJECT_STATE`, `AGENT_HANDOFF`, `TASK_BOARD`, and `DEVELOPMENT_SLICES` produce warning issues.
- [x] Missing validation baseline produces `VALIDATION_BASELINE_MISSING`.
- [x] `tasks.counts` has stable keys: `done`, `draft`, `partial`, `superseded`, `inProgress`, `unknown`.
- [x] `tasks.rawStatusCounts` includes original normalized status counts.
- [x] Explicit `Phase: ...` and simple `## Current Phase` values are parsed.
- [x] Validation history can provide fallback latest validation summaries.
- [x] Contract docs clarify MCP status is not live process inspection.
- [x] Required Docker validation passes.
- [x] Done-level capsule validation passes.
- [x] Evidence and handoff documents are updated.
