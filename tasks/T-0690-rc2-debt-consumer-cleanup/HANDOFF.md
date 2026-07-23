# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0690 |
| Title | RC2 Debt Consumer Cleanup |
| Status | Done |
| Created | 2026-07-23T20:46 |
| Updated | 2026-07-23T20:51 |
## Last Completed

| Item | Evidence |
|---|---|
| Default MCP bridge discovery no longer exposes `hadara.debt.list/show`; focused MCP/server/tools-list regressions passed. | `ev:T-0690:a911098b30724bd3b0b71dbb`, `ev:T-0690:6384685a6dfe40bcba25679c` |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Remove the remaining dashboard/TUI debt projections or retarget them out of the public user surfaces now that both CLI/MCP command exposure and default tests are split away from developer-only debt code. | actionable | yes | RC2 still leaks developer-only debt state through read-only UI consumers even after the MCP bridge cleanup. | `tasks/T-0687-rc2-developer-surface-alignment/RC2_DEVELOPER_SURFACE_REPORT.md`; `tasks/T-0690-rc2-debt-consumer-cleanup/TASK.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Dashboard and TUI still expose debt-derived data even after the MCP debt tools are removed here. | This capsule reduces only one public consumer of developer-only debt state. | Keep the next capsule focused on dashboard/TUI debt routes and read models instead of reopening MCP or CLI routing work. |
