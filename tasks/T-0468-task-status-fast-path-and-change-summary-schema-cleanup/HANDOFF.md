# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Default selected-task `task status` is now a fast loop cockpit and skips close/protocol-grade checks unless full detail is requested. | `ev:T-0468:91055b787fda40469bca06b5`, `ev:T-0468:73df1894fd45461c9d043e28` |
| `task status --task T --detail full --json` remains available for explicit heavier diagnostics. | `ev:T-0468:91055b787fda40469bca06b5`, `ev:T-0468:73df1894fd45461c9d043e28` |
| Change Summary scaffolds now use `Area` instead of `Lines`; legacy `Lines` tables remain validator-compatible. | `ev:T-0468:91055b787fda40469bca06b5`, `ev:T-0468:73df1894fd45461c9d043e28` |
| Default git-derived Change Summary candidate generation was removed from `task status`. | `ev:T-0468:91055b787fda40469bca06b5` |
| Fast closed-valid status now preserves `closeProofValid:true` while still skipping current readiness checks. | `ev:T-0468:ea4c3539ac3144bd8d299aab` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Optimize full diagnostics/finalize mounted-workspace performance if it remains painful. | T-0468 makes default status fast, but explicit full status still took about 31s on the mounted workspace. | `src/task/task-close.ts`, `src/services/protocol-consistency.ts`, `src/services/task-workbench.ts` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Default `task status` is no longer a close-grade readiness gate. | Agents must not infer closability from fast status alone. | Use `task finalize --task T --json` for close planning or `task status --task T --detail full --json` for explicit diagnostics. |
| Historical/completed capsules may still have `Lines` Change Summary tables. | Rewriting them would create unnecessary churn. | Validator accepts legacy `Lines`; new templates use `Area`. |
