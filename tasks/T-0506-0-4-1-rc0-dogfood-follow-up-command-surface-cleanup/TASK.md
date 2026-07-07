# T-0506 0.4.1 rc0 dogfood follow-up command surface cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0506 |
| Title | 0.4.1 rc0 dogfood follow-up command surface cleanup |
| Status | Done |
| Created | 2026-07-07 |
| Updated | 2026-07-07 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Resolve the T-0505 release-smoke dogfood findings and remove obsolete compatibility CLI surfaces that now have canonical replacements. | Keep release-required package/recycle capabilities available through canonical routes; rerun fresh-project dogfood after the fixes. |

## Scope

| Boundary | Items |
|---|---|
| In | T-0505 F-1 through F-7; registry/routing/docs/tests for obsolete compatibility surfaces: `task show`, `task next`, `task upgrade-scaffold`, `evidence collect`, `write preflight`, `policy check-shell`, `ops status`, `handoff suggest`, `handoff stale-problems`, `init register-doc`, `docs archive`, `harness replay`, `run`, `run scaffold`, `run-state show`, `run-state resume`, `package smoke`, and planned-disabled `docs mark-drift`; generated/current docs that mention removed surfaces; fresh `/tmp` dogfood proof. |
| Out | Public release publish, npm package recycle, broad command-portfolio RFC decisions, dashboard/TUI surfaces, historical specs except where current generated/user-facing docs are contradicted. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Map T-0505 findings and obsolete command candidates to code/docs/tests. | Done |
| 2 | Implement T-0505 fixes: handoff/static guidance, closed-valid summary semantics, docs mark help, validation-row normalization, spawn fallback guidance, missing-slices/release-readiness noise. | Done |
| 3 | Remove or redirect obsolete compatibility command surfaces and update registry/help/docs/tests. | Done |
| 4 | Build and run focused tests plus built-CLI smokes. | Done |
| 5 | Rerun fresh `/tmp` dogfood and write resolution report. | Done |
| 6 | Update capsule/shared state docs before finalize and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Fresh-project handoff guidance no longer routes users to stale `task next` / misleading “Latest Completed” fragments; obsolete `handoff suggest` and `handoff stale-problems` public surfaces are removed or structured-redirected. | Met | `ev:T-0506:c03f654276be450986c48743` | T-0505 F-1 |
| AC-2 | `task status --summary-json` for a `closed-valid` task has non-contradictory readiness fields. | Met | `ev:T-0506:c03f654276be450986c48743` | T-0505 F-2 |
| AC-3 | `docs mark --help` renders help before argument validation and exits successfully. | Met | `ev:T-0506:c03f654276be450986c48743` | T-0505 F-3 |
| AC-4 | `validation run --update-task` updates a Validation row written as inline-code instead of appending a duplicate row. | Met | `ev:T-0506:c03f654276be450986c48743` | T-0505 F-4 |
| AC-5 | `validation run` npm launch friction is mitigated with a documented/direct-result fallback or a verified wrapper fix in fresh-project guidance. | Met | `ev:T-0506:c03f654276be450986c48743` | T-0505 F-5 |
| AC-6 | Fresh governed projects do not warn about missing `docs/DEVELOPMENT_SLICES.md` or `docs/RELEASE_READINESS.md` until slice/release state is actually active. | Met | `ev:T-0506:c03f654276be450986c48743` | T-0505 F-6, F-7 |
| AC-7 | Obsolete compatibility command surfaces are absent from default/help registry or return structured redirect stubs to canonical commands. | Met | `ev:T-0506:6bf1c1251fbc4bd3ac621efc` | Command-surface cleanup notes |
| AC-8 | Fresh `/tmp` dogfood repeats init -> task create -> validation evidence -> finalize auto and records a resolution report for every T-0505 finding. | Met | `ev:T-0506:c03f654276be450986c48743` | `DOGFOOD_REPORT.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused unit tests | Yes | Passed | `ev:T-0506:10d49b029b3a4424921fddd9` |
| TypeScript build | Yes | Passed | `ev:T-0506:10d49b029b3a4424921fddd9` |
| Built CLI smokes | Yes | Passed | `ev:T-0506:6bf1c1251fbc4bd3ac621efc` |
| Fresh `/tmp` dogfood | Yes | Passed | `ev:T-0506:c03f654276be450986c48743` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0505-0-4-1-rc0-fresh-toy-project-dogfood-review/DOGFOOD_REPORT.md` | reference | implemented | Source findings resolved before release smoke. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | implemented | Canonical task workflow and removed-command semantics. |
| `src/services/capability-registry.ts` | reference | implemented | Authoritative command inventory. |
| `docs/COMMAND_SURFACE.md` | reference | implemented | Human-facing command taxonomy aligned to removed stubs. |

## Changes

| Area | Summary |
|---|---|
| CLI | Added generic removed-command helper; redirected obsolete public surfaces; moved package smoke public route to `smoke package`; softened optional state verify noise. |
| Docs | Updated current/generated command-surface guidance, task workflow docs, CLI JSON contract, test strategy, command portfolio notes, and T-0506 dogfood report. |
| Tests | Updated registry/help/removed-surface/status/evidence/handoff/write/task tests; full Docker check passes. |
| Dogfood | Fresh governed `/tmp` toy project reached `closed-valid` and verified T-0505 findings. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | `validation run` still hits `spawnSync node EPERM` in this tool environment; generated fallback guidance makes the workflow recoverable but root cause remains separate. | Open | `.hadara/local/feedback/T-0506-command-surface-cleanup-feedback.md` |
| RF-2 | Follow-up | `smoke package` still returns package-smoke schema command id for compatibility. | Open | `DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-07 | Draft | Initial task scaffold. |
| 2026-07-07 | In Progress | Implemented command cleanup, fixed T-0505 findings, reran fresh dogfood, and passed Docker check. |
| 2026-07-07 | In Progress | Shared state and handoff docs updated for closeout; ready for finalize. |
| 2026-07-07 | Done | Ready for close with full validation, command-surface smoke, and fresh dogfood evidence. |
