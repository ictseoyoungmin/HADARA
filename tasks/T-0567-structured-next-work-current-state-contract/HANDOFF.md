# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Added structured `nextWork` to current-state canon and projections. | `ev:T-0567:1b919ecbb3cd45b09ed451cb` |
| Routed `task status --json` recommendations through `nextWork.title`; operator guidance is metadata only. | `ev:T-0567:1b919ecbb3cd45b09ed451cb` |
| Exposed `nextWork` through `session start --json` and `schema --domain project.nextWork.state`. | `ev:T-0567:1b919ecbb3cd45b09ed451cb` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Begin `v0.4.4 external-repository validation planning` when operator-controlled publication/recycle constraints are clear. | This is now represented as `.hadara/state/current.json.nextWork.title`, separate from operator guidance. | `.hadara/state/current.json`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `nextOperatorIntent` remains as a compatibility field. | Downstream consumers may still read the old field for one release. | Treat `nextWork` as authoritative for task-selection semantics and remove the legacy field only after compatibility review. |
