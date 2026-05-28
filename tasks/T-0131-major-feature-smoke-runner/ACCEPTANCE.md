# Acceptance Criteria

- [x] `hadara smoke run --profile core --json` returns a reduced `hadara.featureSmoke.v1` report.
- [x] The core profile covers doctor, status, task list, tools list, TUI snapshot, and advisory release gate.
- [x] The runner stays read-only and avoids package smoke, install mutation, strict release-gate evidence cycles, shell execution, provider calls, MCP writes, and artifact writes.
- [x] `release-readiness` is accepted as a reserved profile but returns `FEATURE_SMOKE_PROFILE_DEFERRED`.
- [x] Schema registry, runtime schema validation, CLI capability discovery, and focused tests are updated.
- [x] Evidence is attached.
- [x] Handoff is updated.
