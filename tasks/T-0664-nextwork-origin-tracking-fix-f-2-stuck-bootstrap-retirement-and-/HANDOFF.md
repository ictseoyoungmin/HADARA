# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0664 |
| Title | nextWork origin tracking: fix F-2 stuck bootstrap retirement and add stale-bootstrap advisory |
| Status | Done |
| Created | 2026-07-20T18:47 |
| Updated | 2026-07-20T19:09 |
## Last Completed

| Item | Evidence |
|---|---|
| Fixed T-0663's F-2 at the root (unified `nextWork.origin` replacing three duplicated title-matching bootstrap detectors), added the `STATE_CURRENT_CANON_STALE_BOOTSTRAP_NEXT_WORK` advisory, verified F-3 no longer reproduces as a direct consequence, and added F-1's PATH-precedence warning to generated docs. All four dogfood findings from T-0663 are now resolved or addressed. | ev:T-0664:c21d4948ff8d4806b61fc112, ev:T-0664:3b325ef3c8f941b2bf0e3886, ev:T-0664:ccd90916a8c841b98d58a663 |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| No further work is queued from this dogfood/fix cycle. If resuming external dogfood, note that `/mnt/f/NowWorking/dev/driftlog`'s stuck `nextWork` will self-heal the next time any task closes there under a build that includes this fix. | RF-2 in this capsule's Risks/Follow-ups; nothing else is pending. | N/A |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
