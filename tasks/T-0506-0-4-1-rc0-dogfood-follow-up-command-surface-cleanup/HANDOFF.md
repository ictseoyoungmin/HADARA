# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| T-0506 resolved T-0505 dogfood findings and removed obsolete compatibility command surfaces. | `ev:T-0506:c03f654276be450986c48743`, `ev:T-0506:6bf1c1251fbc4bd3ac621efc`, `ev:T-0506:10d49b029b3a4424921fddd9` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Proceed to `0.4.1-rc.0` release smoke/readiness using canonical `smoke package`. | T-0506 passed fresh `/tmp` dogfood, command-surface smoke, and full Docker validation after removing obsolete compatibility surfaces. | `docs/RELEASE_READINESS.md`, `docs/TASK_WORKFLOW_COMMANDS.md`, `DOGFOOD_REPORT.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `package smoke` is now a removed-command stub. | Release validation must use the canonical `smoke package` route. | Keep package-smoke report schema compatibility until a schema migration is deliberately planned. |
| Historical specs contain old command examples. | Mass-editing history can destroy useful traceability. | Update current/generated/user-facing docs and active tests; leave historical specs unless they drive live guidance. |
