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
- Local supporting plan section `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md` for T-0134

Current baseline:

- T-0133 added read-only `hadara package smoke --dry-run --json` planning reports.
- `hadara.packageSmoke.v1` already allows `mode: "local"` and execution booleans for package/install/feature smoke, while release mutation and publish markers are schema-forced false.
- Docker is the required validation path because host Node/npm is unreliable in this workspace.

Key constraint:

- Local package smoke may execute `npm pack`, isolated prefix install, and installed command-form smoke only when explicitly requested. It must not publish, mutate release state, install globally, write public raw logs, call GitHub, build Docker images, or expose an MCP package-smoke surface.
