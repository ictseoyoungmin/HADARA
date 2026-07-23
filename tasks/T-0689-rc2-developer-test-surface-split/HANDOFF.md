# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0689 |
| Title | RC2 Developer Test Surface Split |
| Status | Done |
| Created | 2026-07-23T20:34 |
| Updated | 2026-07-23T20:43 |
## Last Completed

| Item | Evidence |
|---|---|
| Default/public `npm test` now excludes HADARA-dev-only developer-surface tests, while explicit `test:hadara-dev` and `test:all` scripts preserve repo maintenance coverage. | `ev:T-0689:d9d496acac294bacb5886fc8`, `ev:T-0689:cfa777f91da742b487906861` |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| Clean the remaining developer-only runtime coupling in dashboard/TUI/MCP debt consumers or release/readiness internals now that both command routing and default-test exposure are split away from public workflows. | actionable | yes | RC2 still carries developer-only runtime code behind repo-local tooling; the next capsule can either retarget those consumers into `tools/`/scripts or delete dead paths. | `tasks/T-0687-rc2-developer-surface-alignment/RC2_DEVELOPER_SURFACE_REPORT.md`; `tasks/T-0689-rc2-developer-test-surface-split/TASK.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| The runtime implementation for release/debt/dev/package smoke remains in the repo even though public/default command and test surfaces are now split. | RC2 can still leak developer-only maintenance behavior through internal consumers unless the next capsule removes or retargets those paths. | Use the T-0687 inventory and this capsule's test split as the guardrail: keep public/default workflow clean while deleting or extracting the remaining runtime consumers in small slices. |
