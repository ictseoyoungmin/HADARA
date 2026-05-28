# Context

- Required session docs read: `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/IMPLEMENTATION_SOP.md`, and `docs/DEVELOPMENT_SLICES.md`.
- Package-smoke planning sources read: `docs/TEST_STRATEGY.md`, `docs/RELEASE_READINESS.md`, `docs/V1_0_CAPSULE_BACKLOG.md`, `docs/SCHEMAS.md`, and local supporting `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md` T-0133 section.
- User clarification: T-0131 validates internal service/read-model health, safe reduced summaries, feature-smoke schema validity, TUI snapshot rendering, and advisory release gate service calls. It does not validate installed `hadara`, PATH/launcher wiring, package-installed CLI, subprocess command execution, or actual package-smoke execution.
- T-0133 must keep package smoke to dry-run planning only. Actual `npm pack`, package install, installed CLI smoke, and evidence attachment remain later capsules.
- Host Node/npm remains unreliable per handoff; use the reusable Docker workflow for validation.
