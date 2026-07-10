# AGENT_HANDOFF

## Ownership

This document owns next-agent continuity: the active task, immediate next action, live warnings, and compact validation baseline.
Current product/release facts belong to `docs/PROJECT_STATE.md`; completed history belongs to the Historical Index.

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Stable 0.4.2 source line. |
| Current Phase | P3 external-style validation next | Archive stale docs and dogfood basic/standard/governed profiles. |
| Latest Completed Task | T-0559 Primary workflow budget and capability freeze | Four primary command ids, six-invocation budget, measurement harness, and lifecycle docs are aligned. |
| Active / Next Task | Create P3 capsule | Reduce 75 active-looking historical warnings and run multi-profile dogfood. |
| Validation Baseline | T-0559 Docker 150 files / 1037 tests | `distLooksStale:false`; standard measured toy reached `closed-valid` in 6 calls / 13.13s. |

## Active Work

| Task | Summary | Evidence |
|---|---|---|
| None | T-0559 is ready to finalize; create P3 after close. | `ev:T-0559:4f9b167c4ca24aec8f4d007d`, `ev:T-0559:7ad5dab1394b4be584b73235` |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0559 Primary workflow budget | Four unique primary commands and six post-init invocations are frozen and measured; standard toy closed-valid in 13.13s. | `ev:T-0559:4f9b167c4ca24aec8f4d007d`, `ev:T-0559:ace8a95f299341b8b6fc1773`, `ev:T-0559:7ad5dab1394b4be584b73235` |
| T-0558 Current-state ownership | Project State and Handoff now have bounded, non-overlapping ownership; pre-P1 snapshots are historical/never-default. | `ev:T-0558:2189cb84302145689de0f8cc`, `ev:T-0558:8ac7eeb68db34f7a824f944b`, `ev:T-0558:a0106f42bca342ca8341a17c` |
| T-0557 Currentness integrity | Historical Partial rows are backlog-only; docs doctor currentness diagnostics exist; active docs and T-0556 fixtures are aligned. | `ev:T-0557:5979f12a38234a989563372d`, `ev:T-0557:09506d560d374230b2d29399`, `ev:T-0557:57062741eb8e4fa7a27302a3` |

## Current Known Problems

| Issue | State | Impact | Next Step |
|---|---|---|---|
| Mounted task-scoped context pack remains about 8-10s. | Watch | Context reads can feel slow despite bounded correctness. | Prefer status/session defaults; revisit only with an explicit trust/cache design. |
| Explicit live graph/context reads remain heavier than bounded paths. | Watch | Broad diagnostics are unsuitable for the default loop. | Warm cache first; opt into live reads deliberately. |
| Tool-host child process launch can return `EPERM`. | Active | Validation wrapper may be blocked while direct commands pass. | Run direct, then use `validation run --direct-result` with an honest summary. |
| Historical specs produce active-looking docs warnings. | Active | Docs routing output is noisy even when current sources are correct. | P3 archives/classifies obsolete docs and records before/after counts. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Create the P3 stale-doc archive and multi-profile external-style dogfood capsule. | P2 established the budget; P3 should remove historical routing noise and validate profile portability. | New P3 capsule, archive map, and profile matrix evidence. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| T-0559 full Docker sync-build | `ev:T-0559:7ad5dab1394b4be584b73235` | 150 files / 1037 tests passed; `dist` refreshed. |
| T-0559 primary workflow regression | `ev:T-0559:ace8a95f299341b8b6fc1773` | Four focused files / 20 tests passed. |
| T-0559 measured standard toy | `ev:T-0559:4f9b167c4ca24aec8f4d007d` | Six invocations / 13.13s / `closed-valid`. |
| T-0558 full Docker sync-build | `ev:T-0558:a0106f42bca342ca8341a17c` | 149 files / 1034 tests passed; `dist` refreshed. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Pre-P1 handoff snapshot | `docs/history/AGENT_HANDOFF_PRE_T0558.md` | Full handoff tables and historical known problems before compact ownership. |
| Pre-P1 project state snapshot | `docs/history/PROJECT_STATE_PRE_T0558.md` | Full project narrative through T-0557. |
| Completed task history | `docs/HANDOFF_HISTORY.md` | Older completed-task details. |
| Validation history | `docs/VALIDATION_HISTORY.md` | Older validation observations. |
| Work queue | `docs/TASK_BOARD.md` | Current status and capsule paths. |
| Task evidence | `tasks/T-*/evidence.jsonl` | Canonical per-task evidence. |
