# Acceptance Criteria

- [x] Invalid permission modes are rejected in policy, run, and fake-shell paths.
- [x] Non-zero fake-shell observations make the agent loop result fail.
- [x] Invalid evidence result values are rejected at CLI runtime and by harness validation.
- [x] Re-running run scaffold for the same task/command fails instead of silently keeping stale files.
- [x] `task create` excludes global flags from the title.
- [x] Required Docker validation passes.
- [x] Done-level capsule validation passes.
- [x] Evidence and handoff documents are updated.
