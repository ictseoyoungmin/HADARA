# AGENT_HANDOFF

<!-- hadara:managed:start current-state-canon {"schema":"hadara.managedSection.v1","owner":"current-state.projection","kind":"single-block","mode":"replace","version":1,"required":true,"closeSourceRole":"included"} -->
## Canonical Continuation State

This section is projected from `.hadara/state/current.json` so a new session can resume without reconstructing project history from scratch.

| Area | State | Notes |
|---|---|---|
| Current Release | 0.4.5 | Portable project state. |
| Latest Completed Task | T-0601 Fix 0.4.5 clean-clone test regressions | Most recent completed capsule. |
| Active Task | None | Resume this capsule first. |
| Next Work | 0.4.5 operator publish and installed-package recycle | Structured continuation title; not operator prose. |
| Next Work State | candidate | Controls whether task creation guidance is emitted. |
| Operator Guidance | Commit T-0601, then run the operator-controlled 0.4.5 npm/GitHub publish flow from a clean ext4 clone and follow with installed-package recycle against hadara@0.4.5. | Human constraints; never used as a task title. |
| Validation Baseline | T-0601 fixed the post-T-0600 clean-clone test regressions and Docker validation passed: build, focused clean-clone regressions, and full 153-file/1096-test suite. | ev:T-0601:5b2a2ce79b1e4da992bee548, ev:T-0601:fed96a7bc69f41c4bc76f889, ev:T-0601:d294bf75d06e47e89ed0fdfb, ev:T-0601:8907aba9189441969d45d6c5 |

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
