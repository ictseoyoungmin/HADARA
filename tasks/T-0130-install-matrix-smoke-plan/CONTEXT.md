# Context

- Required protocol context: `AGENTS.md`, `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/IMPLEMENTATION_SOP.md`, and `docs/DEVELOPMENT_SLICES.md`.
- Release/install context: `docs/TEST_STRATEGY.md`, `docs/RELEASE_READINESS.md`, and `docs/V1_0_CAPSULE_BACKLOG.md`.
- Prior prerequisite: T-0129 implemented read-only `hadara install plan --json` with Linux/Windows/WSL/USB planning, explicit USB-root requirements, Linux-style WSL defaults, redacted paths, and execute-disabled behavior.
- T-0130 is planning-only. It must define the matrix before future executable smoke work, and must preserve the release gate as read-only.
- Docker validation remains the reproducible local path. Real Windows validation must be planned separately and must not be treated as replaced by Docker/Linux.
