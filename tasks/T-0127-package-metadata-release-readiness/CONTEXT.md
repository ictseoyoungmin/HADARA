# Context

## Required Reading

- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/TEST_STRATEGY.md`
- `docs/V1_0_CAPSULE_BACKLOG.md`
- `tasks/T-0126-package-smoke-command-surface-design/HANDOFF.md`
- Local-only ignored supporting plan when present: `docs/specs/HADARA_Release_Install_Package_Smoke_Capsule_Plan.md`

## Constraints

- Host Node/npm remains unreliable; use Docker temp-copy validation.
- This capsule records release metadata decisions only. It must not publish, package, install, build release artifacts, call GitHub, add Docker images, or execute package smoke.
- `package.json` currently remains bootstrap-stage with `name: "hadara"`, `version: "0.0.0-bootstrap"`, `private: true`, and `bin.hadara: "./dist/cli/main.js"`.
- The release gate remains read-only and may only inspect package metadata and tracked documentation markers.
- `docs/specs/` remains ignored by `.gitignore`; tracked docs must carry any decisions needed by future GitHub clones.
