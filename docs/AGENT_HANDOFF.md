# AGENT_HANDOFF

## Ownership

This document owns next-agent continuity: the active task, immediate next action, live warnings, and compact validation baseline.
Current product/release facts belong to `docs/PROJECT_STATE.md`; completed history belongs to the Historical Index.

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Stable 0.4.2 source line. |
| Current Phase | P0-P3 consolidation complete | Currentness, compact state, workflow budget, archive routing, and all-profile dogfood are complete. |
| Latest Completed Task | T-0560 Historical docs archive and multi-profile dogfood | Active-looking warnings are zero; archive docs are never-default; all profiles closed-valid. |
| Active / Next Task | None | Select the next capsule from real operator/adoption friction rather than speculative scope. |
| Validation Baseline | T-0560 Docker 151 files / 1041 tests | `distLooksStale:false`; basic/standard/governed toys each closed-valid in six calls. |

## Active Work

| Task | Summary | Evidence |
|---|---|---|
| None | T-0560 is ready to finalize; no follow-on capsule is implied. | `ev:T-0560:87f2998b851445bbaf91fe99`, `ev:T-0560:421bacf7fa7f4a3185d4ad9c`, `ev:T-0560:a9119e06127c423e93a5b5c0` |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0560 Historical archive and multi-profile dogfood | Completed/stale specs moved to historical/never-default archive; docs warning count is zero; all profiles closed-valid. | `ev:T-0560:87f2998b851445bbaf91fe99`, `ev:T-0560:421bacf7fa7f4a3185d4ad9c`, `ev:T-0560:a9119e06127c423e93a5b5c0` |
| T-0559 Primary workflow budget | Four unique primary commands and six post-init invocations are frozen and measured; standard toy closed-valid in 13.13s. | `ev:T-0559:4f9b167c4ca24aec8f4d007d`, `ev:T-0559:ace8a95f299341b8b6fc1773`, `ev:T-0559:7ad5dab1394b4be584b73235` |
| T-0558 Current-state ownership | Project State and Handoff now have bounded, non-overlapping ownership; pre-P1 snapshots are historical/never-default. | `ev:T-0558:2189cb84302145689de0f8cc`, `ev:T-0558:8ac7eeb68db34f7a824f944b`, `ev:T-0558:a0106f42bca342ca8341a17c` |

## Current Known Problems

| Issue | State | Impact | Next Step |
|---|---|---|---|
| Mounted task-scoped context pack remains about 8-10s. | Watch | Context reads can feel slow despite bounded correctness. | Prefer status/session defaults; revisit only with an explicit trust/cache design. |
| Explicit live graph/context reads remain heavier than bounded paths. | Watch | Broad diagnostics are unsuitable for the default loop. | Warm cache first; opt into live reads deliberately. |
| Tool-host child process launch can return `EPERM`. | Active | Validation wrapper may be blocked while direct commands pass. | Run direct, then use `validation run --direct-result` with an honest summary. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Review P0-P3 evidence and select a new capsule only from observed operator/adoption friction. | Consolidation targets are complete and capability growth is frozen by default. | A scoped new Task Capsule with explicit user evidence. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| T-0560 full Docker sync-build | `ev:T-0560:a9119e06127c423e93a5b5c0` | 151 files / 1041 tests passed; `dist` refreshed. |
| T-0560 docs archive/currentness | `ev:T-0560:87f2998b851445bbaf91fe99` | 75 active-looking warnings reduced to 0; doctor healthy. |
| T-0560 multi-profile dogfood | `ev:T-0560:421bacf7fa7f4a3185d4ad9c` | Basic 10.09s, standard 9.14s, governed 8.99s; all six calls and closed-valid. |
| T-0559 full Docker sync-build | `ev:T-0559:7ad5dab1394b4be584b73235` | 150 files / 1037 tests passed; `dist` refreshed. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Pre-P1 handoff snapshot | `docs/history/AGENT_HANDOFF_PRE_T0558.md` | Full handoff tables and historical known problems before compact ownership. |
| Pre-P1 project state snapshot | `docs/history/PROJECT_STATE_PRE_T0558.md` | Full project narrative through T-0557. |
| Documentation archive map | `docs/archive/README.md` | Locate completed specs and historical logs without default-reading them. |
| Completed task history | `docs/HANDOFF_HISTORY.md` | Older completed-task details. |
| Validation history | `docs/VALIDATION_HISTORY.md` | Older validation observations. |
| Work queue | `docs/TASK_BOARD.md` | Current status and capsule paths. |
| Task evidence | `tasks/T-*/evidence.jsonl` | Canonical per-task evidence. |
