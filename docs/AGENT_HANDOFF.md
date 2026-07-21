# AGENT_HANDOFF

<!-- hadara:managed:start current-state-canon {"schema":"hadara.managedSection.v1","owner":"current-state.projection","kind":"single-block","mode":"replace","version":1,"required":true,"closeSourceRole":"included"} -->
## Canonical Continuation State

This section is projected from `.hadara/state/current.json` so a new session can resume without reconstructing project history from scratch.

| Area | State | Notes |
|---|---|---|
| Current Release | 0.5.0-rc.1 | Portable project state. |
| Latest Completed Task | T-0668 0.5.0-rc.1 post-publish record and GitHub release note | Highest Done task id, not close timestamp. |
| Latest Completed Task Basis | highest-done-task-id | Out-of-order close chronology is not tracked here. |
| Active Task | None | No active task is selected. |
| Next Work | None | Structured continuation title; not operator prose. |
| Next Work State | none | Controls whether task creation guidance is emitted. |
| Operator Guidance | No next work selected. Run `hadara task status --json` for current task-selection guidance. | Human constraints; never used as a task title. |
| Current Trusted Validation Baseline | T-0658 through T-0666 hardened close action boundaries and blocked status precedence, added and fixed project-level continuation handling, implemented anyOf in the schema validator, fixed stale bootstrap nextWork retirement, classified no-work handoffs as terminal, bumped/promoted the version to 0.5.0-rc.1, and validated the source with full-suite evidence. T-0667 then recycled release readiness from a freshly pulled node:22-bookworm Docker image and newly recreated hadara-dev container. T-0668 records that the operator published hadara@0.5.0-rc.1 to npm on next, workspace registry verification returned version=0.5.0-rc.1/next=0.5.0-rc.1/latest=0.4.6, the GitHub Release note artifact exists with evidence, installed-package recycle from hadara@next passed, and GitHub Release publication remains operator-controlled. | ev:T-0664:ccd90916a8c841b98d58a663, ev:T-0665:527eded82980411281445c9a, ev:T-0666:9c421996f28042b98203fad8, ev:T-0666:743b914bc1a341889cda50d2, ev:T-0667:87eb2cd5efa747458b8e749f, ev:T-0667:d533bf36c9e74741a12398f3, ev:T-0667:eed4dba170744234a38924bf, ev:T-0667:17932d8a4a684db18a62dbe8, ev:T-0667:af0b1df9f11c47a0a7e0691c, ev:T-0668:f04d19ba0b5f47e3bf51276e, ev:T-0668:1ec8ae46a0f04aa3830ff767, ev:T-0668:a16978bfab134da9abadc752 |

### Current Known Problems

| Issue | State | Operator Guidance |
|---|---|---|
| Task-scoped context pack is about 8-10s on the mounted WSL repository. | watch | Prefer bounded status/session paths; revisit performance only with an explicit trust/cache design. |
| Explicit live graph and context reads remain filesystem-sensitive. | watch | Warm cache first and opt into broad live diagnostics deliberately. |
| Tool-host child process launch can return EPERM while direct commands pass. | active | Run the command directly, then record it through validation run --direct-result. |
| Release artifact git-status preflight and full dev Docker workspace copy can exceed useful latency or fail on mounted WSL workspace-local state. | watch | Use a clean ext4 clone for release artifacts; direct /workspace artifact attempts can fail if local-only untracked state such as .claude/ is present. |
| HADARA-dev package smoke installed core smoke can exceed the default 120s timeout in the large source workspace. | watch | Use `--timeout 300` for release package smoke until the installed smoke path is optimized or decoupled from the large project root. |
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
