# Context

Required reading completed:

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/V1_0_CAPSULE_BACKLOG.md`
- `docs/TEST_STRATEGY.md`
- `docs/RELEASE_READINESS.md`
- T-0141 Task Capsule files

T-0141 follows T-0140. T-0140 added read-only `hadara release dry-run --json`; T-0141 adds the next command surface but keeps release mutation blocked because the current package metadata is still `private: true` and versioned `0.0.0-bootstrap`.

Safety boundary:

- Token presence may be reported by token name only.
- Token values, raw logs, private paths, registry responses, GitHub API payloads, and artifact upload logs must not enter public output or Task Capsule evidence.
- Execute-mode requests are privately audited and blocked before mutation.
- MCP release/package/install execution remains deferred.
