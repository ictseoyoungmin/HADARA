# Context

## Required Reading

- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/TEST_STRATEGY.md`
- `docs/V1_0_CAPSULE_BACKLOG.md`
- `tasks/T-0127-package-metadata-release-readiness/HANDOFF.md`
- Local-only ignored supporting plan when present: `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md`

## Constraints

- Host Node/npm remains unreliable; use Docker temp-copy validation.
- This capsule defines installer contracts and schemas only. It must not create or execute installer scripts.
- npm package registration, login, token setup, and publishing remain out of scope; no account information is needed for T-0128.
- Release gate remains read-only and may only inspect tracked docs/package metadata/evidence markers.
- T-0127 identified marker bloat risk; T-0128 should put new release/install readiness details in a dedicated tracked readiness source rather than growing `docs/TEST_STRATEGY.md`.
