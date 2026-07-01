# Handoff

## Last Completed

| Item | Evidence |
|---|---|
| `task status` now owns no-task next-work selection through `hadara.task.status.v1` and selected-capsule loop guidance through additive `loop` fields in `hadara.task.workbench.v1`. | `ev:T-0458:23de043e969f4cfe821911da`, `ev:T-0458:904b129902fa47839432ede7` |
| `task next` and `task lifecycle` remain callable but are registry/help/docs compatibility commands planned for removal from the default loop. | `ev:T-0458:23de043e969f4cfe821911da` |
| Current workflow docs, generated init workflow text, README, AGENTS, schema docs, and lifecycle guide were aligned to status-first finalize flow. | `ev:T-0458:23de043e969f4cfe821911da`, `ev:T-0458:43643f1971ac43a2a6a74e6c` |
| Concrete lifecycle cockpit specs were added under `docs/specs/0.4.0/lifecycle/`. | `ev:T-0458:904b129902fa47839432ede7` |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Open a follow-up capsule to align `session start` guidance with the status cockpit. | This capsule intentionally leaves `session start` behavior mostly untouched; current historical tests/docs can still route users to `task lifecycle` or `task next`. | `src/context/session-start.ts`, `tests/unit/session-start.test.ts`, `docs/specs/0.4.0/lifecycle/00_Task_Status_Cockpit.md` |
| After dogfooding status-first flow, schedule the actual removal window for `task next` and `task lifecycle`. | They are now compatibility commands, but removal needs release-note and migration timing rather than same-capsule deletion. | `docs/specs/0.4.0/lifecycle/02_Command_Deprecation_Plan.md`, `src/services/capability-registry.ts` |
| Continue the separate mounted-workspace progress/latency UX line if operator friction remains. | `task status` still takes tens of seconds on mounted workspaces; this capsule simplified command choice but did not optimize status/finalize execution time. | `docs/AGENT_HANDOFF.md`, `.hadara/context/MEMORY.md` |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| `task status --json` embeds the existing `task next` report as a compatibility source. | The output still exposes `sources.taskNext` until the lower-level next-work implementation is retired. | Treat `sources.taskNext` as source metadata; consumers should use top-level `task.status` fields and `loop.primaryNextAction`. |
| The selected-capsule status report is still a broad workbench read. | It can be slow on `/mnt/f` workspaces and may still feel silent while running. | Use the existing Docker/ext4 validation path for heavy proof work; address progress/latency semantics in a separate capsule. |
