# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0693 |
| Title | RC2 Release Readiness Surface Cleanup |
| Status | Done |
| Created | 2026-07-23T22:13 |
| Updated | 2026-07-23T22:34 |

## Last Completed

| Item | Evidence |
|---|---|
| Repo-local release/smoke/package/dev wrappers now live in `tools/`, the old shipped wrapper files under `src/cli`/`src/dev` were removed, and focused developer-surface plus lifecycle regression validation passed. | `ev:T-0693:ff793e1c4b6547ffad0b2857`, `ev:T-0693:e71261fc41ef4562aa7c40e7`, `ev:T-0693:5cdb5edbff6b4abd838515c8`, `ev:T-0693:0b108ce45fa14a56ae564b8d` |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Start a narrow capsule that removes or demotes the remaining release/readiness service and TUI debt/release consumers from the shipped `src/services`/`src/tui` tree while keeping repo-local `tools/dev-surfaces.ts` workflows intact. | actionable | yes | Wrapper extraction removed the developer-only command entrypoints from the installed source tree, but deeper release/readiness internals still remain in shipped services and TUI consumers. | `tasks/T-0687-rc2-developer-surface-alignment/RC2_DEVELOPER_SURFACE_REPORT.md`, `docs/PROJECT_STATE.md`, `docs/ARCHITECTURE.md`, `docs/TEST_STRATEGY.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not broaden this capsule into release service deletion or TUI redesign. | That would mix wrapper extraction with deeper behavior changes and make regression scope hard to prove. | Keep the implementation limited to repo-local entrypoint relocation plus coupled metadata/tests, and leave `src/services/release-*`/`src/tui` follow-up to a later capsule. |
