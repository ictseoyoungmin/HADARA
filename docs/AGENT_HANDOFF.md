# AGENT_HANDOFF

## Current State

| Area | State | Notes |
|---|---|---|
| Branch | main | Working tree contains completed T-0156 changes. |
| Current Phase | Project Protocol Consistency Phase 2 | Phase 1 init scaffold/follow-up work is complete; T-0152 through T-0156 are complete. |
| Latest Completed Task | T-0156 Profile Drift Remediation Guide | Added profile-scope protocol doctor diagnostics and manual remediation guidance while keeping writes deferred. |
| Active / Next Task | T-0157 Safe Protocol Remediation MVP | Next Phase 2 slice should add dry-run-first bounded protocol remediation writes. |
| Validation Baseline | Docker full check passed | Latest Docker temp-copy `npm run check` passed with 60 files and 440 tests; built CLI profile/task/docs smokes passed after refreshing `/workspace/dist`. |

## Last 3 Completed Tasks

| Task | Summary | Evidence |
|---|---|---|
| T-0154 Project Docs Consistency Doctor | Implemented docs-scope protocol doctor reports for required project docs, SOP Required Reading missing paths, Task Board versus capsule drift, and latest-completed handoff drift. | T-0154 evidence: focused protocol/error tests passed with 3 files / 13 tests; full Docker check passed with 60 files / 432 tests; built CLI smoke returned `ok: true`; done-level harness `ok: true`. |
| T-0155 Project Docs Consistency Doctor Completion | Added semantic handoff checks, Project State marker checks, Development Slices drift, Decisions evidence sanity, Test Strategy baseline checks, SOP scaffold checks, mixed profile diagnostics, and `--task`/`--scope` mutual exclusion. | T-0155 evidence: focused protocol tests passed with 3 files / 15 tests; full Docker check passed with 60 files / 434 tests; built CLI smokes returned `ok: true`; done-level harness `ok: true`. |
| T-0156 Profile Drift Remediation Guide | Added `hadara protocol doctor --scope profile --json`, profile doc-set/metadata/Required Reading drift diagnostics, manual remediation objects, and `summary.profile` declared/detected/target/source separation. | T-0156 evidence: focused protocol/profile tests passed with 2 files / 21 tests after edge-case additions; full Docker check passed with 60 files / 440 tests; built CLI profile/task/docs smokes passed after refreshing `/workspace/dist`. |

## Current Known Problems

| Issue | Impact | Next Step |
|---|---|---|
| Host workspace has no `node_modules`. | Host `npm run build` and host `npx vitest` are unreliable; escalated `npx` found registry access but could not resolve local `vitest/config`. | Use the reusable Docker workflow for validation or install dependencies intentionally before host validation. |
| HADARA-dev has multiple CLI execution paths. | `/tmp/hadara/dist` may be fresh while `/workspace/dist` or container-global `/usr/local/bin/hadara` is stale, causing agents to test old CLI behavior. | For CLI changes, build in Docker, refresh `/workspace/dist` from `/tmp/hadara/dist`, and run final smokes via `node /workspace/dist/cli/main.js ... --project /workspace` or explicitly via `/tmp/hadara/dist/cli/main.js`; do not assume global `hadara` is current. |
| `hadara.protocol.consistency.v1` schema fixture is not registered yet. | T-0153 through T-0155 emit the report shape, but broad schema/contract fixture work remains future scope. | Keep T-0156/T-0157 compatible with the current report shape; T-0158 owns schema registration. |
| Existing historical capsules mostly use legacy frames. | This is expected and should not fail validation solely for not using v2 tables. | Future `task upgrade-scaffold` / remediation work must be non-destructive and dry-run-first. |
| Docs-scope protocol doctor reports historical T-0073 Task Board drift and legacy Decisions structure as warnings. | `hadara protocol doctor --scope docs --json` remains `ok: true`; warning-only reports exit 0. | T-0156/T-0157 can decide whether to guide or safely remediate these historical drifts. |

## Next Recommended Step

| Step | Reason | Done Evidence |
|---|---|---|
| Start T-0157 Safe Protocol Remediation MVP. | T-0156 added manual remediation guidance; the next slice should add dry-run-first bounded writes for low-risk protocol fixes. | Dry-run no-write evidence, execute-mode bounded-write evidence, and updated protocol remediation docs. |

## Validation Baseline

| Check | Latest Evidence | Notes |
|---|---|---|
| Focused protocol checks | Docker `npx vitest run tests/unit/protocol-consistency.test.ts tests/unit/protocol-cli.test.ts` passed with 2 files and 21 tests. | Covers profile-scope report shape, declared/detected/target policy, metadata/doc-set edge cases, mixed declarations, basic-to-governed remediation guidance, partial doc-set hints, Required Reading table-only drift, JSON CLI output, and mutual exclusion behavior. |
| Full repository check | Docker temp-copy `npm run check` passed with 60 files and 440 tests. | Host dependencies were unavailable; Docker was used per SOP and changed files were synced into `/tmp/hadara` before the final check. |
| Built CLI smoke | Refreshed `/workspace/dist` from `/tmp/hadara/dist`; built CLI `protocol doctor --scope profile --json --project /workspace` returned `ok: true` with `summary.profile` and 0 issues; `protocol doctor --task T-0156 --json` returned `ok: true`; `protocol doctor --scope docs --json` returned `ok: true` with two historical warnings; `--task` plus `--scope profile` returned `CLI_OPTION_INVALID_VALUE`. | Run through `node /workspace/dist/cli/main.js ... --project /workspace`. |
| Done-level harness | Docker built CLI `harness validate --task T-0156 --level done --json --project /workspace` returned `ok: true` with no issues. | Run after T-0156 docs/evidence updates. |

## Historical Index

| History Type | Path | When to Use |
|---|---|---|
| Completed task history | docs/HANDOFF_HISTORY.md | Older completed-task details beyond the last three tasks. |
| Validation history | docs/VALIDATION_HISTORY.md | Older accumulated validation evidence. |
| Work queue | docs/TASK_BOARD.md | Current task status and capsule paths. |
| Roadmap slices | docs/DEVELOPMENT_SLICES.md | Development slice ordering and done evidence. |
| Task evidence | tasks/T-*/EVIDENCE.md | Per-task authoritative evidence. |
