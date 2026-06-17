# T-0329 Post rc1 state docs cleanup

## Metadata

| Field | Value |
|---|---|
| ID | T-0329 |
| Title | Post rc1 state docs cleanup |
| Status | Done |
| Created | 2026-06-17 |
| Updated | 2026-06-17 |

## Goal

| Goal | Notes |
|---|---|
| Align post-rc1 shared state docs after T-0328. | Refresh handoff recent-task state and release-note wording so the completed rc1 publish/recycle line is reflected consistently. |

## Scope

| In Scope | Reason |
|---|---|
| Update `docs/AGENT_HANDOFF.md` recent completed-task state. | Reviewer identified stale `Last 3 Completed Tasks` entries after T-0328. |
| Update `docs/RELEASE_NOTES.md` `0.3.1-rc.1` boundaries wording. | Reviewer identified pre-completion wording after T-0327/T-0328 completed. |
| Record focused documentation validation evidence. | This is a docs-only cleanup; validation should prove the targeted wording/state alignment. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Runtime/source CLI changes. | Not needed for state-doc wording cleanup. |
| Registry, npm dist-tag, or release mutation. | T-0327/T-0328 already completed publish/recycle verification. |
| Broad evidence v2 recycle artifact redesign. | Reviewer classified richer recycle artifacts as a future Phase 9 quality improvement, not a T-0329 blocker. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-17 | In Progress | Started focused post-rc1 shared-doc cleanup. | Reviewer notes; `task next` recommended creating a new capsule. |
| 2026-06-17 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
