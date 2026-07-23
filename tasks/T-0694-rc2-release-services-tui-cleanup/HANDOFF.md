# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0694 |
| Title | RC2 Release Services TUI Cleanup |
| Status | Done |
| Created | 2026-07-23T22:35 |
| Updated | 2026-07-23T23:10 |

## Last Completed

| Item | Evidence |
|---|---|
| The remaining debt/release/smoke services and debt handler were moved out of shipped `src/` into `tools/dev-surface/`; shipped TUI/status surfaces now expose placeholder-only debt/release projections and focused validation remained green. | `ev:T-0694:00990ab2fe634a3b95d52285`, `ev:T-0694:39777b30d3d44bdeb8c125d3`, `ev:T-0694:430acdc105e9499d8fd976e3`, `ev:T-0694:3d72f6b4cddd4f148a4b581c`, `ev:T-0694:748d569ab17b444f8b1ed616` |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Start a narrow follow-up capsule that cleans up release-readiness context/schema ownership references still pointing at the removed developer surface, especially under `src/context/` and `src/schemas/`. | actionable | yes | The code relocation is complete, but release-readiness context extraction and schema ownership notes can still carry stale references to removed `src/services` files. | `tasks/T-0687-rc2-developer-surface-alignment/RC2_DEVELOPER_SURFACE_REPORT.md`, `docs/PROJECT_STATE.md`, `docs/ARCHITECTURE.md`, `src/context/release-extractors.ts`, `src/schemas/schema-index.json` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not redesign task-status, context extraction, or the TUI schema in this capsule. | That would mix RC2 developer-surface removal with broader product behavior changes. | Keep shipped read models schema-compatible and replace only the developer-only computations with placeholders. |
