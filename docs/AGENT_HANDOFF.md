# AGENT_HANDOFF

## Ownership

This document owns next-agent continuity: the active task, immediate next action, live warnings, and compact validation baseline.
Current product/release facts belong to `docs/PROJECT_STATE.md`; completed history belongs to the Historical Index.

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Stable 0.4.2 source line. |
| Current Phase | P2 product compression next | Freeze capability growth and measure the six-command primary path. |
| Latest Completed Task | T-0558 Current-state ownership and compact projection | Compact ownership, historical snapshots, routing tests, and governed toy dogfood are complete. |
| Active / Next Task | Create P2 capsule | Define a primary workflow budget and executable measurement without adding a public command. |
| Validation Baseline | T-0558 Docker 149 files / 1034 tests | `distLooksStale:false`; P1 governed toy lifecycle reached `closed-valid`. |

## Active Work

| Task | Summary | Evidence |
|---|---|---|
| None | T-0558 is ready to finalize; create P2 after close. | `ev:T-0558:a0106f42bca342ca8341a17c`, `ev:T-0558:c5b24e7f72c143dd89e22d7c` |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0558 Current-state ownership | Project State and Handoff now have bounded, non-overlapping ownership; pre-P1 snapshots are historical/never-default. | `ev:T-0558:2189cb84302145689de0f8cc`, `ev:T-0558:8ac7eeb68db34f7a824f944b`, `ev:T-0558:a0106f42bca342ca8341a17c` |
| T-0557 Currentness integrity | Historical Partial rows are backlog-only; docs doctor currentness diagnostics exist; active docs and T-0556 fixtures are aligned. | `ev:T-0557:5979f12a38234a989563372d`, `ev:T-0557:09506d560d374230b2d29399`, `ev:T-0557:57062741eb8e4fa7a27302a3` |
| T-0556 Done-history gate | Done-level validation requires the final v2 TASK History row to be Done. | `ev:T-0556:f260d2562365467ea77ef880`, `ev:T-0556:a2060c65544e4af98834e0b5` |

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
| Create the P2 product-compression and primary-workflow measurement capsule. | P1 established compact ownership; P2 should freeze growth and measure the six-command primary path. | New P2 capsule and measurement evidence. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| T-0558 full Docker sync-build | `ev:T-0558:a0106f42bca342ca8341a17c` | 149 files / 1034 tests passed; `dist` refreshed. |
| T-0558 focused compact-state regression | `ev:T-0558:2189cb84302145689de0f8cc` | Four files / 28 tests passed. |
| T-0558 governed toy lifecycle | `ev:T-0558:c5b24e7f72c143dd89e22d7c` | Current-state routing and finalize reached `closed-valid`. |
| T-0557 full Docker sync-build | `ev:T-0557:09506d560d374230b2d29399` | 148 files / 1031 tests passed; `dist` refreshed. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Pre-P1 handoff snapshot | `docs/history/AGENT_HANDOFF_PRE_T0558.md` | Full handoff tables and historical known problems before compact ownership. |
| Pre-P1 project state snapshot | `docs/history/PROJECT_STATE_PRE_T0558.md` | Full project narrative through T-0557. |
| Completed task history | `docs/HANDOFF_HISTORY.md` | Older completed-task details. |
| Validation history | `docs/VALIDATION_HISTORY.md` | Older validation observations. |
| Work queue | `docs/TASK_BOARD.md` | Current status and capsule paths. |
| Task evidence | `tasks/T-*/evidence.jsonl` | Canonical per-task evidence. |
