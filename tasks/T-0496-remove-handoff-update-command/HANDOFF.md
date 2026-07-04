# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Removed `handoff update` command surface. | `ev:T-0496:6254f6d51840411d97982927`, `ev:T-0496:87aff8ebc8b84437a567dec5`, `ev:T-0496:2805daa8175e40c2beff3283` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Choose the next `0.4.1-rc.0` debt item. | FD-007 is resolved by removal; remaining candidates include `docs.mark-drift`, registry correction, TASK.md enum vocabulary, and low-ceremony finalize. | `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| No CLI writes `docs/AGENT_HANDOFF.md`. | Agents must not expect an automatic post-finalize handoff writer. | Use `handoff suggest` for read-only fragments, then manually review/edit shared handoff docs before finalize. |
