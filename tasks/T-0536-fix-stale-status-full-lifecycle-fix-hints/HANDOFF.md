# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Replaced stale `task finish` done-level fix hints with `task finalize --execute --auto` guidance. | `ev:T-0536:a9ddd04930314c1c9289f643` |
| Updated ready/finish/close/audit report next-command guidance to current finalize/status surfaces. | `ev:T-0536:ddbc62ab30dc4f8dbc48048e` |
| Docker sync-build refreshed `dist` after the change. | `ev:T-0536:c6d62cf0831846479adc9438` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Investigate T-0535 session-start read-map count parity if it reproduces. | The stale lifecycle hint blocker is fixed; the remaining T-0535 dogfood observation was count/list consistency in session guidance. | `tasks/T-0535-post-dead-code-fresh-tmp-dogfood/DOGFOOD_REPORT.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Some historical docs and tests intentionally mention removed lifecycle commands as history, deprecation notes, or legacy installed-package fallback. | Broad `rg` for removed command names will still find intentional historical/negative strings. | Use targeted scans over current agent-facing hint/report files when checking this fix. |
