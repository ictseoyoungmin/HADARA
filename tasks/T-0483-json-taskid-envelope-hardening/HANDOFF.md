# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| T-0483 JSON taskId envelope hardening is implemented and validated. | `ev:T-0483:39a179e7507c461886c664e7`, `ev:T-0483:42ea8a6985a64d6a88bf6372` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Continue the 0.4.0 stable pre-release friction cleanup plan. | JSON task-scoped responses now expose root `.taskId`; next plan items are doctor install location, timing negative duration root cause, task counter cleanup, output UX, GitHub Release draft, and stable promotion/recycle. | `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Standard full workspace sync-build tar can still stall after large dogfood artifacts. | Full mounted workspace copy may be I/O-bound. | Use tracked-file ext4 copy workaround or fix sync-build artifact exclusion in a later capsule. |
