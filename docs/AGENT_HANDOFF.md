# AGENT_HANDOFF

<!-- hadara:managed:start current-state-canon {"schema":"hadara.managedSection.v1","owner":"current-state.projection","kind":"single-block","mode":"replace","version":1,"required":true,"closeSourceRole":"included"} -->
## Canonical Continuation State

This section is projected from `.hadara/state/current.json` so a new session can resume without reconstructing project history from scratch.

| Area | State | Notes |
|---|---|---|
| Current Release | 0.4.3 | Portable project state. |
| Latest Completed Task | T-0575 v0.4.4 R1 dogfood UX findings cleanup | Most recent completed capsule. |
| Active Task | None | Resume this capsule first. |
| Next Work | v0.4.4 R2 external dogfood validation | Structured continuation title; not operator prose. |
| Next Work State | candidate | Controls whether task creation guidance is emitted. |
| Operator Guidance | Run the next external/delegated dogfood pass with the T-0575 fixed CLI surface before v0.4.4 release readiness. | Human constraints; never used as a task title. |
| Validation Baseline | hadara@0.4.3 plus T-0575 R1 UX cleanup: Docker sync build/full suite passed (153 files / 1063 tests), focused R1 regressions passed, and built-CLI R1 smoke checks passed. | ev:T-0575:ded5c44171ac4a719dec415b, ev:T-0575:91c5965a97ff4e5c9ad86db2, ev:T-0575:a8e689410ea74b439ad6922e |

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
