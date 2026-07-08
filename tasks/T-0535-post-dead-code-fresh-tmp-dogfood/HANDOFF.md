# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Docker sync-build refreshed development `dist` before dogfood. | `ev:T-0535:790f953ae3674eeda652dbf2` |
| Fresh governed `/tmp` project dogfood closed toy `T-0001` with `task finalize --execute --auto`. | `ev:T-0535:229bd625b59d4eeea0007435` |
| Dogfood report recorded command coverage, positives, findings, and follow-ups. | `ev:T-0535:ce3a1f50232c4a7388216e72` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Fix stale `task finish` fix hints in `task status --detail full`. | Fresh-project dogfood found status full still pointing agents at a removed command while the main lifecycle otherwise works. | `tasks/T-0535-post-dead-code-fresh-tmp-dogfood/DOGFOOD_REPORT.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `task status --detail full` stale fix hints mention removed `task finish`. | Fresh-project agents can follow a bad close-loop suggestion even though `task finalize --execute --auto` works. | Replace fix hints with current finalize/status commands in a follow-up capsule. |
| Top-level status can preserve a pre-close handoff recommendation after the referenced task is closed. | A fresh project may show `done:1` while still recommending "Finalize T-0001" from handoff prose. | Treat status selection output and selected-task closed-valid status as authoritative; consider handoff-staleness suppression later. |
