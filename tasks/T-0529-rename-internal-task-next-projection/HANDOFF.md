# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Renamed the internal next-work projection from `task-next` / `hadara.task.next.v1` / `sources.taskNext` to `task-selection` / `hadara.task.selection.v1` / `sources.taskSelection`. | `ev:T-0529:c6c93453bfc04f939193a923` |
| Confirmed public `task next --json` remains unrouted while `task status --json` still returns selection recommendations. | `ev:T-0529:c6c93453bfc04f939193a923` |
| Docker sync-build passed and refreshed workspace `dist`; final status smoke no longer recommends completed T-0521 from stale handoff text. | `ev:T-0529:941cfef9cd80400f94ef3e08` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Continue deferred command portfolio reduction only after deciding which remaining stubs still need migration time. | T-0529 only renamed the internal projection; it did not remove `write preflight`, `policy check-shell`, old `package smoke`, or lifecycle migration stubs. | `tasks/T-0521-command-portfolio-reduction-inventory/COMMAND_PORTFOLIO.md`, `docs/COMMAND_SURFACE.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Historical docs still mention `task next` and `hadara.task.next.v1`. | These are release history, not current implementation names. | Do not rewrite historical records unless a separate archival cleanup is requested. |
