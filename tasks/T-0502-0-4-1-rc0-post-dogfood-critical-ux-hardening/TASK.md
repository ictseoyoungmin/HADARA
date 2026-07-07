# T-0502 0.4.1 rc0 post-dogfood critical UX hardening

## Identity

| Field | Value |
|---|---|
| ID | T-0502 |
| Title | 0.4.1 rc0 post-dogfood critical UX hardening |
| Status | Done |
| Created | 2026-07-07 |
| Updated | 2026-07-07 |

## Goal

| Goal | Notes |
|---|---|
| Remove the remaining post-dogfood UX traps that can mislead a fresh installed-user project before `0.4.1-rc.0` release smoke. | Treat the second-review findings as release-blocking until each is fixed, proven already fixed with regression coverage, or explicitly documented as out of scope. |

## Scope

| Boundary | Items |
|---|---|
| In | Generated init docs/help drift around removed lifecycle commands, `--auto`, and slice state; installed-user command leakage in session-start guidance; `validation run` exit semantics; early `--help` behavior for representative command families; stale handoff-first selection guidance; minor status/scaffold/state-verify clarity fixes; focused tests, fresh init smoke, and built CLI smokes. |
| Out | npm publish, GitHub Release work, broad command-portfolio deletion, full 0.5 state-first implementation, historical docs cleanup unrelated to fresh generated/current UX, and large dashboard/TUI work. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reproduce or inspect each secondary-review finding and classify it as current bug, already-fixed regression surface, or out-of-scope. | Done |
| 2 | Harden generated init docs and lifecycle help: no removed lifecycle commands as normal guidance, visible `task finalize --execute --auto`, visible `hadara slice` state workflow, and no false low-level help-family promise. | Done |
| 3 | Audit session-start report/guidance command strings and replace installed-user copyable commands with `hadara ...` while preserving source-checkout-only docs where appropriate. | Done |
| 4 | Fix `validation run` process status semantics so failed child execution or launch failure returns non-zero while still recording evidence and JSON details. | Done |
| 5 | Add shared early `--help` handling before required-argument validation/execution for representative commands (`validation run`, `task finalize`, `slice add`, `harness validate`, `session start`). | Done |
| 6 | Fix stale handoff-first selected-work behavior so scaffold/meta guidance is not proposed as a real task title after capsules exist or close. | Done |
| 7 | Polish minor clarity issues: selected-task placeholder replacement, closed-valid readiness wording, task create `Created`/`Updated` scaffold dates plus token hint, `state verify` `ok` vs `consistent`, and missing-slices fix hints. | Done |
| 8 | Add regression tests and fresh-project dogfood covering generated docs, help, lifecycle, validation exit code, session-start command forms, task selection, and state/slice guidance. | Done |
| 9 | Update T-0502 evidence, shared state docs, and close with `task finalize --execute --auto` after validation. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh `hadara init` generated docs do not teach removed lifecycle commands as normal guidance, and they visibly document both `task finalize --execute --auto` and `hadara slice` state workflow. | Met | `ev:T-0502:bdd98fcb1aa449038e9c5380`, `ev:T-0502:9bd95384fc20448a8a0d2525` | RV-1, RV-2 |
| AC-2 | `help lifecycle` no longer promises unavailable low-level proof-boundary command help and instead routes to `task status --detail full` plus `task finalize`. | Met | `ev:T-0502:13a900a8a63d410f8cdf13a1` | RV-3 |
| AC-3 | Session-start JSON/text guidance intended for installed users uses copyable `hadara ...` command forms, not `node dist/cli/main.js ...`; source-checkout-only docs remain explicitly scoped. | Met | `ev:T-0502:13a900a8a63d410f8cdf13a1`, `ev:T-0502:bdd98fcb1aa449038e9c5380` | RV-4 |
| AC-4 | `validation run` exits non-zero when the wrapped child command fails or cannot launch, while preserving evidence recording and machine-readable failure details. | Met | `ev:T-0502:13a900a8a63d410f8cdf13a1`, `ev:T-0502:bdd98fcb1aa449038e9c5380` | RV-5 |
| AC-5 | `--help` is handled before required-argument validation/execution for the representative command set: `validation run`, `task finalize`, `slice add`, `harness validate`, and `session start`. | Met | `ev:T-0502:13a900a8a63d410f8cdf13a1`, `ev:T-0502:bdd98fcb1aa449038e9c5380` | RV-6 |
| AC-6 | Task selection/status no longer turns scaffold/meta handoff prose such as "Create or select first Task Capsule" into a recommended task title after real task state exists. | Met | `ev:T-0502:13a900a8a63d410f8cdf13a1` | RV-7 |
| AC-7 | Minor output polish is complete for selected-task placeholders, closed-valid readiness wording, task create `Created`/`Updated` scaffold dates plus token hint, state verify `ok`/`consistent` clarity, and stateConsistency missing-slices guidance. | Met | `ev:T-0502:13a900a8a63d410f8cdf13a1`, `ev:T-0502:bdd98fcb1aa449038e9c5380` | RV-8, RV-9, RV-10, RV-11, FU-1 |
| AC-8 | A fresh temporary project smoke proves the corrected generated docs and core lifecycle path before release smoke proceeds. | Met | `ev:T-0502:8cd65df224074988877dd410`, `ev:T-0502:9bd95384fc20448a8a0d2525` | T-0501 follow-up |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused unit tests for init/help/session-start/validation/slice/harness/task selection/state output | Yes | Passed | `ev:T-0502:13a900a8a63d410f8cdf13a1` |
| TypeScript build | Yes | Passed | `ev:T-0502:afb73b2121f0488983e51414` |
| Built CLI smokes for help, validation failure exit, session-start guidance, task create scaffold, state verify, and fresh init generated docs | Yes | Passed | `ev:T-0502:bdd98fcb1aa449038e9c5380` |
| Fresh temporary governed project dogfood | Yes | Passed | `ev:T-0502:8cd65df224074988877dd410` |
| Package smoke execute with generated init docs gate | Yes | Passed | `ev:T-0502:9bd95384fc20448a8a0d2525` |
| Harness validate T-0502 | Yes | Passed | `ev:T-0502:090d97e939bd4a299098c58b` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0501-0-4-1-rc0-generated-project-dogfood-and-markdown-review/DOGFOOD_REPORT.md` | reference | approved | Primary dogfood report plus secondary reviewer addendum. |
| User request 2026-07-07 | constraint | approved | Treat RV-1 through RV-11 as next-capsule scope. |
| `src/cli/init.ts` | reference | approved | Generated Markdown template source. |
| `src/cli/help.ts` | reference | approved | Lifecycle/help surface. |
| Session-start implementation files | reference | draft | Locate exact service/handler paths before editing; reviewer cited session-start command leakage. |
| `src/cli/validation.ts` | reference | approved | Validation wrapper command handling. |
| `docs/HADARA_WORKFLOW.md` | constraint | approved | Current workflow authority and generated-doc target behavior. |

## Changes

| Area | Summary |
|---|---|
| Generated docs/help | Updated current and generated workflow guidance for `finalize --execute --auto`, removed stale low-level lifecycle normal guidance, added slice workflow visibility, and fixed slice example status from invalid `planned` to `not-started`. |
| Package smoke gate | Added a `generated-init-docs` package-smoke execution step that runs installed `hadara init --profile standard --json` in a fresh disposable cwd and fails on stale generated workflow guidance. |
| Session-start guidance | Replaced installed-user guidance that leaked `node dist/cli/main.js` and removed `task ready` validation suggestions in favor of copyable `hadara ...` commands and `task status --detail full`. |
| Validation exit semantics | `validation run` now sets a non-zero wrapper exit when the child command fails or cannot launch while preserving evidence and JSON details. |
| Early help handling | Added early help interception for the representative command set before required-argument validation or execution. |
| Task selection/status/state output polish | Filtered scaffold/meta handoff prose from task-next recommendations, replaced selected-task `T-XXXX` placeholders, suppressed misleading closed-valid readiness text, added task create dates/schema hints, clarified state verify semantics, and improved missing-slices hints. |
| Tests/dogfood | Added/updated focused unit tests, fresh init/governed smokes, validation failure smoke, and package smoke execute validation. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Scope is broad for one capsule; preserve release-blocking critical fixes first and defer only low-risk copy polish if validation shows blast radius. | Closed | T-0501 RV-1 through RV-11 |
| RF-2 | Risk | Some reviewer observations may already be fixed in current source but still need regression coverage because generated templates were previously a gate blind spot. | Closed | `DOGFOOD_REPORT.md`, `ev:T-0502:13a900a8a63d410f8cdf13a1` |
| FU-1 | Follow-up | `hadara package smoke --help` currently runs dry-run instead of help; local feedback recorded outside git scope. | Open | `.hadara/local/feedback/T-0502-package-smoke-help-routing.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-07 | Draft | Initial task scaffold. |
| 2026-07-07 | In Progress | Expanded plan to cover all secondary-review findings from T-0501 dogfood. |
| 2026-07-07 | In Progress | Implemented post-dogfood hardening and recorded focused tests, build, built CLI smokes, governed smoke, and package smoke execute evidence. |
| 2026-07-07 | Done | Task docs and shared close-source state updated for finalize. |
