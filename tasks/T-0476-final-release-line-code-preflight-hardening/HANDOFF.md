# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Final release-line code preflight hardening completed. Explicit task-scoped CI gate now uses exact task lookup, and CI/release fixtures align with current 0.4 capsule docs without removed legacy sidecars. | Focused tests `ev:T-0476:82360c5c03b346218210b7ba`; build/dist refresh `ev:T-0476:6fe19cde6d3d4b00912d993a`; built CLI smoke `ev:T-0476:719663c6debc4b11b269c3f5`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Decide whether to open a dedicated 0.4.0 release readiness capsule. | The requested three pre-release cleanup capsules are complete; package/release mutation work was intentionally excluded. | docs/ROADMAP.md, docs/RELEASE_READINESS.md, docs/TASK_WORKFLOW_COMMANDS.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Task-scoped `ci gate` still computes global state consistency. | Built advisory smoke took about 12s on the mounted workspace even after exact task lookup. | Treat as a future state/projection performance candidate, not a T-0476 blocker. |
