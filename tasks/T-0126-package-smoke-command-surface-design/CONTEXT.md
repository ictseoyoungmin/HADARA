# Context

## Required Reading

- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/TEST_STRATEGY.md`
- `docs/V1_0_CAPSULE_BACKLOG.md`
- `docs/V1_0_IMPLEMENTATION_SCHEMAS.md`
- Local-only ignored supporting plan: `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md`
- `tasks/T-0125-executable-package-smoke-artifact-boundary-design/HANDOFF.md`

## Constraints

- Host Node/npm remains unreliable; use Docker temp-copy validation.
- T-0126 is a design/readiness capsule only. It must not add package-smoke execution, `npm pack`, install smoke, release artifact creation, publish/deploy behavior, GitHub calls, Docker image builds, or MCP release/package tools.
- Release gate remains read-only and may only inspect documented markers.
- `docs/specs/` remains ignored by `.gitignore`; the release/install/package-smoke plan is local-only supporting context for workspace agents and must not be committed to GitHub.
