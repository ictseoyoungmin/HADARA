# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Clarified that task-local `HANDOFF.md` can be a WIP checkpoint during work. | `ev:T-0641:cdca913e51bb4cdf804149e9` |
| Added the close-time conversion rule before finalize execute. | `ev:T-0641:cdca913e51bb4cdf804149e9` |
| Updated generated workflow template and current lifecycle command docs. | `ev:T-0641:2d93ed9323c046f0bf092fa7` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Continue with the next 0.5.x implementation capsule from `hadara task status --json`. | This task only changes workflow guidance; no open implementation follow-up is carried here. | `docs/specs/0.5/README.md`, `hadara status --json`, `hadara task status --json` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Historical closed capsules may still contain stale handoff prose from before this guidance. | Do not treat old task-local handoff text as current project state without checking newer task ids and `docs/TASK_BOARD.md`. | Use current-state/status read models first, then historical handoffs only for investigation. |
