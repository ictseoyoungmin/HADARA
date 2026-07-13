# AGENT_HANDOFF

<!-- hadara:managed:start current-state-canon {"schema":"hadara.managedSection.v1","owner":"current-state.projection","kind":"single-block","mode":"replace","version":1,"required":true,"closeSourceRole":"included"} -->
## Canonical Continuation State

This section is projected from `.hadara/state/current.json` so a new session can resume without reconstructing project history from scratch.

| Area | State | Notes |
|---|---|---|
| Current Release | 0.4.4-rc.0 | Portable project state. |
| Latest Completed Task | T-0579 v0.4.4-rc.0 release readiness and publish preparation | Most recent completed capsule. |
| Active Task | None | Resume this capsule first. |
| Next Work | v0.4.4-rc.0 operator publish and installed-package recycle | Structured continuation title; not operator prose. |
| Next Work State | candidate | Controls whether task creation guidance is emitted. |
| Operator Guidance | After committing T-0579, run the approval-gated publish helper for hadara@0.4.4-rc.0 with dist-tag next, then run a separate installed-package recycle capsule against hadara@next expected 0.4.4-rc.0. | Human constraints; never used as a task title. |
| Validation Baseline | hadara@0.4.4-rc.0 source readiness through T-0579: exact npm version is unpublished, Docker /workspace build plus full check passed 153 files and 1068 tests, built CLI reports packageVersion 0.4.4-rc.0 with fresh dist, docs doctor currentness is clean, and strict release gate passes. | ev:T-0579:ec780f1860244bdcac80bc0b, ev:T-0579:99e9627ede96433f97a13ab1, ev:T-0579:1e85fffe14f2401b88aa8211, ev:T-0579:370b652d038c4ec6a01c42cb, ev:T-0579:e57bc1d6ce8f429d98d5eda8 |

### Current Known Problems

| Issue | State | Operator Guidance |
|---|---|---|
| Task-scoped context pack is about 8-10s on the mounted WSL repository. | watch | Prefer bounded status/session paths; revisit performance only with an explicit trust/cache design. |
| Explicit live graph and context reads remain filesystem-sensitive. | watch | Warm cache first and opt into broad live diagnostics deliberately. |
| Tool-host child process launch can return EPERM while direct commands pass. | active | Run the command directly, then record it through validation run --direct-result. |
| Release artifact git-status preflight and full dev Docker workspace copy can exceed useful latency on the mounted WSL workspace. | watch | Use the clean publish ext4 worktree for release artifacts and treat the direct /workspace Docker build path as the fallback when sync-copy stalls. |
<!-- hadara:managed:end current-state-canon -->

## Ownership

This document is the compact human projection for next-session continuity.
The structured canon owns the active task, next intent, live warnings, and validation baseline; completed history belongs to the Historical Index.

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
