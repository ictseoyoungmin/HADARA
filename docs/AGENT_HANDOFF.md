# AGENT_HANDOFF

<!-- hadara:managed:start current-state-canon {"schema":"hadara.managedSection.v1","owner":"current-state.checkpoint-projection","kind":"single-block","mode":"replace","version":1,"required":false,"closeSourceRole":"included"} -->
## Compatibility Continuation Checkpoint

This command-owned projection supports older 0.5.x readers. New sessions use `hadara task status`, the Task Board, and the selected Task Capsule; raw `.hadara/state/current.json` is not normal reading.

| Area | State | Notes |
|---|---|---|
| Current Release | 0.5.0-rc.1 | Portable project state. |
| Latest Completed Task | T-0701 Init v1 Safe Apply Rollback Hardening | Highest Done task id, not close timestamp. |
| Latest Completed Task Basis | highest-done-task-id | Out-of-order close chronology is not tracked here. |
| Active Task | None | No active task is selected. |
| Next Work | None | Compatibility planning hint; never copy it verbatim as a task title. |
| Next Work State | none | Controls whether task creation guidance is emitted. |
| Operator Guidance | No next work selected. Run `hadara task status --json` for current task-selection guidance. | Human constraints; never used as a task title. |
| Current Trusted Validation Baseline | 0.5.0-rc.2 planning baseline preserves rollup evidence through T-0678: source validation and rc1 release-readiness recycle, npm publish record, GitHub Release publication, installed-package recycle/dogfood, reviewer remediation, structured continuation semantic fail-closed validation, and project status continuation-ready routing. This baseline carries T-0667 through T-0669 forward for session resume until a first-class validationBaseline.rollup schema is introduced. | ev:T-0667:17932d8a4a684db18a62dbe8, ev:T-0667:af0b1df9f11c47a0a7e0691c, ev:T-0668:f04d19ba0b5f47e3bf51276e, ev:T-0668:a16978bfab134da9abadc752, ev:T-0669:9d08f787f7d64d85ad72c1b3, ev:T-0669:374d423870f14757ada477b2, ev:T-0669:39c8691d556943e68141f1fa, ev:T-0676:2f4ac932c93e48d5b9bd9a38, ev:T-0676:a0597da28fc847c2a390bd1c, ev:T-0677:befc562b23d64cbe82a74623, ev:T-0678:ec36c75ccc504537b635db44 |

### Current Known Problems

| Issue | State | Operator Guidance |
|---|---|---|
| Task-scoped context pack is about 8-10s on the mounted WSL repository. | watch | Prefer bounded status/session paths; revisit performance only with an explicit trust/cache design. |
| Explicit live graph and context reads remain filesystem-sensitive. | watch | Warm cache first and opt into broad live diagnostics deliberately. |
| Tool-host child process launch can return EPERM while direct commands pass. | active | Run the command directly, then record it through validation run --direct-result. |
| Release artifact git-status preflight and full dev Docker workspace copy can exceed useful latency or fail on mounted WSL workspace-local state. | watch | Use a clean ext4 clone for release artifacts; direct /workspace artifact attempts can fail if local-only untracked state such as .claude/ is present. |
| Historical HADARA-dev package smoke timeout incidents are mitigated by isolated smokeProjectRoot and per-step timeout reporting. | watch | Package smoke/recycle now default to 300s per step for npm/recycle paths and report timeoutStepIds; use explicit `--timeout` only for a reviewed release exception. |
<!-- hadara:managed:end current-state-canon -->

## Ownership

This optional document owns explicit cross-session handoff prose and live warnings for governed projects. Task identity and lifecycle state remain inspectable in the Task Board and Task Capsules; completed history belongs to the Historical Index.

## Current Handoff

Human review of T-0698~T-0700 (2026-07-24) confirmed the capsule/model/planner/transaction split is the right direction but flagged one important gap: rollback of a pre-existing file did not check whether another actor had changed the file after the transaction's own mutation before restoring `beforeContent`, so a failed apply could silently overwrite a concurrent external edit. T-0701 closes that gap as a small hotfix capsule ahead of Re-init/Upgrade Ownership, per that review's explicit direction. `rollbackJournal()` now hashes the current file for a pre-existing entry and only restores when the current hash still matches the transaction's own after-hash; a hash matching before-hash is treated as an already-restored no-op; anything else is retained untouched and reported as `INIT_ROLLBACK_EXTERNAL_MODIFICATION` instead of being clobbered (same guard added for a newly-created file). Also fixed `recovery.required` incorrectly staying `false` when startup recovery leaves unresolved issues, and clarified interactive-TTY vs JSON/CI apply-mode wording in `hadara init --help` and `docs/HADARA_WORKFLOW.md`. Focused tests (10/10 transaction incl. new regression, 35/35 init) and the HADARA-dev suite (127/127) passed; the Docker `npm run check` public suite passed 1089/1090, with 1 unrelated pre-existing failure (`status-current-state-source.test.ts`'s repo-self-reproduction case, caused by `dev-docker-sync-build.sh` excluding the whole `.hadara` directory from its check-only copy, verified reproducible on unmodified sources) — recorded as RF-3 in the T-0701 capsule, not fixed there (out of scope). `dist` was refreshed and the built CLI smoke passed. Continue with Init v1 Re-init and Upgrade Ownership and do not resume RC2 release promotion until the final installed-package acceptance capsule passes.

## Previous Handoff

T-0697 fixes the RC2 release build boundary before fresh dogfood: `npm run check` emits current `dist`, the manual RC publish helper rebuilds and verifies `node dist/cli/main.js version` before artifact creation, `package-lock.json` root metadata matches `package.json` with Dashboard-only direct dependencies removed, and public `context pack` routing/registry/docs/recycle-smoke exposure is gone while internal context-pack helpers remain only for internal candidate/historical use. Clean install/check proof came from a Docker ext4 clean copy including `.hadara`; host `npm ci` on the mounted WSL workspace hit npm bin symlink EPERM.

T-0698 adopts and maps the complete eight-capsule Init v1 program. T-0699 implements its canonical model and deterministic zero-write planner. T-0700 adds reviewed safe apply for greenfield and conflict-free brownfield projects: exact ownership actions, hash/adoption guards, lock-scoped replan, journal-before-write atomic mutation, rollback/recovery, root/symlink/nested/case safety, runtime cleanup, and same-process TTY confirmation; clean Docker passed 140 public files/1089 tests plus 16 HADARA-dev files/127 tests.

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
