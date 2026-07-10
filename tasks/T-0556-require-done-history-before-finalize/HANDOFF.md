# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| Done-level validation now blocks v2 Task Capsules whose `TASK.md ## History` latest row is not `Done`. | `ev:T-0556:f260d2562365467ea77ef880` |
| `task status --detail full` and `task finalize --json` expose pre-close History authoring guidance before execute. | `ev:T-0556:a2060c65544e4af98834e0b5` |
| Current workflow docs and generated init workflow templates tell agents to append the final `History` Done row before finalize execute. | `ev:T-0556:f260d2562365467ea77ef880` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Select the next capsule from operator priority. | T-0556 closes the T-0554-style missing final History row gap without editing historical close-source documents. | `docs/TASK_BOARD.md`, `docs/AGENT_HANDOFF.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Historical closed capsules may still lack a v2 `History` Done row. | Editing them would require intentional close-source changes and refreshed close proof. | Repair only in a dedicated capsule when the operator chooses to rewrite that task history. |
| `npm run dev:docker-sync-build` tar-copy mode is slow on the current mounted workspace. | Routine CLI development validation can stall while copying historical task artifacts. | Use the `hadara-dev` mounted workspace Docker build path when appropriate; local feedback is recorded at `.hadara/local/feedback/T-0556-dev-docker-sync-build-tar-copy-latency.md`. |
