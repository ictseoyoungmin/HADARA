# AGENT_HANDOFF

<!-- hadara:managed:start current-state-canon {"schema":"hadara.managedSection.v1","owner":"current-state.projection","kind":"single-block","mode":"replace","version":1,"required":true,"closeSourceRole":"included"} -->
## Canonical Continuation State

This section is projected from `.hadara/state/current.json` so a new session can resume without reconstructing project history from scratch.

| Area | State | Notes |
|---|---|---|
| Current Release | 0.4.3 | Portable project state. |
| Latest Completed Task | T-0567 Structured next work current-state contract | Most recent completed capsule. |
| Active Task | None | Resume this capsule first. |
| Next Work | v0.4.4 external-repository validation planning | Structured continuation title; not operator prose. |
| Next Work State | candidate | Controls whether task creation guidance is emitted. |
| Operator Guidance | Keep npm/GitHub publication operator-controlled. Run post-publish recycle only after publication. | Human constraints; never used as a task title. |
| Validation Baseline | hadara@0.4.3: Docker 153 files / 1052 tests; installed local-tarball workflow closed-valid; artifact/package/clean-checkout smokes, strict gate, release dry-run, and docs currentness passed. | ev:T-0560:a9119e06127c423e93a5b5c0, ev:T-0560:421bacf7fa7f4a3185d4ad9c, ev:T-0561:c91062958d2344d8bae89643, ev:T-0562:f3c88bbcbbc1461e9fa75015, ev:T-0563:c2961dbcf55a491c8bf2ddd7, ev:T-0563:f91b077b38c848879b1fd749, ev:T-0563:6ecd43540a0c4fc9947762fa, ev:T-0564:f044cd06cd674977a473c5c9, ev:T-0564:fe7f2a90beb045e793a8a63d, ev:T-0565:910e72184029437fb97f5c7e, ev:T-0565:e9c78040f1b2478eb6d695fd, ev:T-0565:674c57cb80c84c4c92887880, ev:T-0565:b14bfda248e844179027f134, ev:T-0565:c6cfa0b13ff44604aec81d05, ev:T-0565:f241c2bd2f384a98988f66d4 |

### Current Known Problems

| Issue | State | Operator Guidance |
|---|---|---|
| Task-scoped context pack is about 8-10s on the mounted WSL repository. | watch | Prefer bounded status/session paths; revisit performance only with an explicit trust/cache design. |
| Explicit live graph and context reads remain filesystem-sensitive. | watch | Warm cache first and opt into broad live diagnostics deliberately. |
| Tool-host child process launch can return EPERM while direct commands pass. | active | Run the command directly, then record it through validation run --direct-result. |
| Release artifact git-status preflight can exceed its 10-second limit on the mounted WSL workspace. | watch | Build release artifacts from a clean ext4 worktree so commit metadata and package contents remain aligned. |
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
