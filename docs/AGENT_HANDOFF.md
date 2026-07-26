# AGENT_HANDOFF

<!-- hadara:managed:start current-state-canon {"schema":"hadara.managedSection.v1","owner":"current-state.checkpoint-projection","kind":"single-block","mode":"replace","version":1,"required":false,"closeSourceRole":"included"} -->
## Compatibility Continuation Checkpoint

This command-owned projection supports older 0.5.x readers. New sessions use `hadara task status`, the Task Board, and the selected Task Capsule; raw `.hadara/state/current.json` is not normal reading.

| Area | State | Notes |
|---|---|---|
| Current Release | 0.5.0-rc.1 | Portable project state. |
| Latest Completed Task | T-0709 Compact Task Identity Targets | Highest Done task id, not close timestamp. |
| Latest Completed Task Basis | highest-done-task-id | Out-of-order close chronology is not tracked here. |
| Active Task | None | No active task is selected. |
| Next Work | None | Compatibility planning hint; never copy it verbatim as a task title. |
| Next Work State | none | Controls whether task creation guidance is emitted. |
| Operator Guidance | No next work selected. Run `hadara task status --json` for current task-selection guidance. | Human constraints; never used as a task title. |
| Current Trusted Validation Baseline | T-0702 trust-boundary baseline: clean npm ci (0 vulnerabilities), source build, tools type-check, 140 public files/1094 tests, 16 HADARA-dev files/129 tests, built CLI 0.5.0-rc.1, verified 261-file release artifact, dependency metadata, and diff hygiene passed. | ev:T-0702:a1508bd12c0340fdad9da779, ev:T-0702:90af75bb32cf424598a1ddab, ev:T-0702:62a86a87d37144d7a81dee6f, ev:T-0702:3cd630eb99e0451c9868ba3a, ev:T-0702:65150d5d65734fe7874e36eb |

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

T-0709 removes the redundant default `Targets | project` row from new TASK.md identity while preserving explicit targets and Task Board target ownership. Full validation passed 142 public files/1104 tests and 16 HADARA-dev files/129 tests. Resume existing T-0708 registered shared close projection, then add HADARA-dev-only low-resource Docker tooling under `tools/`, failure classification, and live-document archival.

## Previous Handoff

T-0703 completed Init v1 Re-init and Upgrade Ownership: complete-project base init is a no-op, configuration expansion fails closed, and reviewed upgrade repairs only canonical managed core artifacts while preserving registry bytes and user-owned content.

T-0702 restored the cross-cutting trust boundary before the Init v1 program continued. Release artifact execution builds and version-checks current source; acceptance evidence is outcome-consistent; Docker copies tracked `.hadara` without local state; HANDOFF sync is idempotent; rollback/TUI branches are covered; dependency metadata is clean. Clean Docker passed 140 public files/1094 tests plus 16 HADARA-dev files/129 tests with zero npm vulnerabilities, and the executed artifact verified 261 packaged files.

### Earlier Context

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
