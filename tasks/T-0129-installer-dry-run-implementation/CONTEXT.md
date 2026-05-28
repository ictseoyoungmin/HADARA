# Context

## Required Reading

- `docs/PROJECT_STATE.md`
- `docs/AGENT_HANDOFF.md`
- `docs/TASK_BOARD.md`
- `docs/IMPLEMENTATION_SOP.md`
- `docs/DEVELOPMENT_SLICES.md`
- `docs/V1_0_CAPSULE_BACKLOG.md`
- `docs/TEST_STRATEGY.md`
- `docs/RELEASE_READINESS.md`
- `docs/SCHEMAS.md`
- `tasks/T-0128-installer-script-surface-and-schema/HANDOFF.md`

## Constraints

- Host Node/npm remains unreliable; use Docker temp-copy validation.
- T-0129 implements dry-run planning only. It must not create installer scripts, launchers, install directories, symlinks, or package copies.
- Public install-plan output must use redacted path-reference objects, not raw private absolute paths.
- `mode: execute` is schema-reserved only; this capsule must keep execution disabled and report `INSTALL_EXECUTION_DISABLED`.
- The release gate remains read-only and must not call installer planning or install execution.
