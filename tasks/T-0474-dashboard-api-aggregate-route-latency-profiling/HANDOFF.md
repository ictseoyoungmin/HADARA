# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Dashboard aggregate route latency profiling complete. | Focused dashboard/workbench tests passed in `ev:T-0474:e0d2c6eb9ca448e9858bacb4`; Docker build/dist refresh passed in `ev:T-0474:814e9786faaa41aabd4b0087`; built route timing smoke passed in `ev:T-0474:7878feaa7ef14577b16e08ff`. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start the compatibility-only legacy sidecar cleanup/refactor capsule. | T-0471 and T-0472 moved current runtime/read-model paths toward 0.4 TASK.md sections, but migration/template/write-preflight/historical compatibility code still needs a narrow release-line audit before 0.4.0. | `.hadara/context/HADARA_CONTEXT.md`, `docs/AGENT_HANDOFF.md`, `docs/TASK_BOARD.md`, `docs/TASK_WORKFLOW_COMMANDS.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Cold `/api/status` and `/api/tasks` still broad-read task state. | First-hit dashboard aggregate calls on mounted workspaces can still take about 5s each; the repeated same-process bootstrap hit is cached and the task-scoped timeline broad scan is removed. | Treat status/tasks cold-path optimization as separate projection-store work only if release validation still needs it. |
