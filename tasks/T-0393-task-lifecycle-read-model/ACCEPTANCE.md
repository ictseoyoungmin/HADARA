# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara task lifecycle --task T --json` returns `hadara.task.lifecycle.v1` with normalized phase, checks, satisfied items, blockers, optional repair, and one primary next action. | Met | `src/task/task-lifecycle.ts`, `ev:T-0393:03d977cfde444c83862cfd3c` |
| AC-2 | The lifecycle command is read-only and does not replace finish/ready/close/audit-close. | Met | `tests/unit/task-lifecycle.test.ts`, `docs/TASK_WORKFLOW_COMMANDS.md` |
| AC-3 | Schema, CLI contract, command registry, and docs are updated. | Met | `docs/SCHEMAS.md`, `docs/CLI_JSON_CONTRACT.md`, `docs/COMMAND_SURFACE.md`, `src/services/capability-registry.ts` |
| AC-4 | Focused tests, full Docker sync-build, built CLI smoke, and diff cleanliness are recorded. | Met | `ev:T-0393:bc944ecc2c894e869dd7e557`, `ev:T-0393:5ec89716142c4e19b7e3abe0`, `ev:T-0393:03d977cfde444c83862cfd3c`, `ev:T-0393:1d249ff2caf745f6bba117bd` |
| AC-5 | Follow-up repair/optimization findings are not hidden. | Met | `FINDINGS.md`, `RISKS.md` |
