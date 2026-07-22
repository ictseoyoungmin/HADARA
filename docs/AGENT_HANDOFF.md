# AGENT_HANDOFF

<!-- hadara:managed:start current-state-canon {"schema":"hadara.managedSection.v1","owner":"current-state.checkpoint-projection","kind":"single-block","mode":"replace","version":1,"required":false,"closeSourceRole":"included"} -->
## Compatibility Continuation Checkpoint

This command-owned projection supports older 0.5.x readers. New sessions use `hadara task status`, the Task Board, and the selected Task Capsule; raw `.hadara/state/current.json` is not normal reading.

| Area | State | Notes |
|---|---|---|
| Current Release | 0.5.0-rc.1 | Portable project state. |
| Latest Completed Task | T-0684 Remove Redundant Task Lifecycle Note | Highest Done task id, not close timestamp. |
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

T-0683 completes the pre-stable remediation derived from T-0682 dogfood. Basic/Standard/Governed built scaffolds and doctors are clean, Basic full status no longer asks for `PROJECT_STATE.md`, continuation is review-first without a next-title field, evidence callers may run independently under the internal append lock, and successful close explicitly says to report and stop. T-0684 removes the redundant lifecycle note from newly created TASK.md files and records `T-XXXX Task Title` as the capsule commit convention. The complete non-Dashboard source suite passed 321 suites / 1,193 tests; Dashboard remains intentionally deferred by operator direction.

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
