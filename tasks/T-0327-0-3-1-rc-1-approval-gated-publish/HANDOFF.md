# Handoff

## Current State

<!-- hadara:managed:start task-handoff-current-state {"schema":"hadara.managedSection.v1","owner":"handoff.update","kind":"key-value-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Field | Value |
|---|---|
| Task | T-0327 |
| TaskStatus | Draft |
| Last Updated | 2026-06-16 |
<!-- hadara:managed:end task-handoff-current-state -->

## Last Completed

| Item | Evidence |
|---|---|
| Draft publish capsule is ready for T-0326 handoff. | `TASK.md` contains `0.3.1-rc.1`, so the manual publish helper can validate task/version alignment. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Wait for T-0326 to close, then run approval-gated publish. | T-0326 must provide final release artifact/package/clean-checkout evidence first. | `docs/RELEASE_READINESS.md`, `scripts/release/manual-publish-rc.sh` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Do not run before T-0326 closes and is committed. | Helper may publish from a source state that lacks final readiness evidence. | Commit T-0326 first, then publish from a clean clone or clean worktree. |
