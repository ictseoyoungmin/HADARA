# AGENT_HANDOFF

<!-- hadara:managed:start current-state-canon {"schema":"hadara.managedSection.v1","owner":"current-state.projection","kind":"single-block","mode":"replace","version":1,"required":true,"closeSourceRole":"included"} -->
## Canonical Continuation State

This section is projected from `.hadara/state/current.json` so a new session can resume without reconstructing project history from scratch.

| Area | State | Notes |
|---|---|---|
| Current Release | 0.4.5 | Portable project state. |
| Latest Completed Task | T-0606 0.4.6 Antigravity delegated onboarding dogfood | Most recent completed capsule. |
| Active Task | None | Resume this capsule first. |
| Next Work | 0.4.6 first-user onboarding and brownfield quickstart | Structured continuation title; not operator prose. |
| Next Work State | candidate | Controls whether task creation guidance is emitted. |
| Operator Guidance | T-0604/T-0605 close the small residual trust and evidence-category friction gaps; next high-value scope is first-user onboarding and brownfield quickstart polish without expanding the command surface. | Human constraints; never used as a task title. |
| Validation Baseline | T-0605 closed evidence category UX friction and Go module /vN inference polish for the 0.4.6 line: test/tests category aliases persist validation, invalid category errors expose allowed tokens and schema hints, focused tests and host/Docker builds passed. | ev:T-0605:af322c3ca9b74660b779a72c, ev:T-0605:7f55c4f94bd14f8abc1875ce, ev:T-0605:fd5bde394aab4b578533ef98, ev:T-0605:5f11394fd2054660bb82a227, ev:T-0605:1b0fb3e455914aaead83d486 |

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
