# T-0661 Continuation model: task-close promotion and idle-precedence fix (Phase C: declarative DAG status redesign)

## Identity

| Field | Value |
|---|---|
| ID | T-0661 |
| Title | Continuation model: task-close promotion and idle-precedence fix (Phase C: declarative DAG status redesign) |
| Status | Done |
| Created | 2026-07-20T17:29 |
| Updated | 2026-07-20T17:46 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0661 --json`.

## Goal

| Goal | Notes |
|---|---|
| Add an explicit `continuation` field to `ProjectCurrentState`, promote a closed task's HANDOFF "Next Recommended Step" into it during `task close`, and read it in `task-selection-status-v2` before falling back to `idle`. This is the actual fix for the reported class of bug: after a task closes with `nextWork: null`, the project-level next step decided by the closing session was silently lost and `hadara task status --json` reported terminal `idle` even though real follow-up work existed (release readiness, a declared next step, etc.). | Phase C of the Declarative DAG status/context-routing redesign (docx section 1.1 problem statement, section 9, section 16.3 step 7 "Close continuation promotion... T-0658 유사 손실 방지"). Does not depend on Phase A (T-0659) or Phase B (T-0660). |

## Scope

| Boundary | Items |
|---|---|
| In | `ProjectContinuation` type (`disposition: actionable\|waiting-for-operator\|blocked\|terminal\|unresolved`, `kind`, `title`, `reason?`, `references?`, `createCommandAllowed?`, `source?`) and `continuation: ProjectContinuation \| null` on `ProjectCurrentState` in `src/services/project-current-state.ts`, with back-compat normalization (absent field reads as `null`), validation, and inclusion in the canonical serialized/writable shape; `continuationFromTaskHandoffStep()` promotion helper; `task-finish.ts` reads the closing task's own `HANDOFF.md` "Next Recommended Step" row and passes a computed continuation into `planCompletedProjectCurrentStateWrites`/`completeProjectCurrentTask`, only ever setting it when a real (non-placeholder) step exists, never clearing an existing continuation based on absence; `task-selection.ts` exposes `sources.currentState.continuation` in `TaskSelectionReport`; `task-selection-status-v2.ts` adds a `continuation-ready` phase that overrides `idle` only when `continuation.disposition` is `actionable` or `waiting-for-operator`, with a review-only action (no invented command) for `waiting-for-operator` and a `task create` action for `actionable`; regression tests for promotion, back-compat, and each disposition. |
| Out | `blocked`/`terminal`/`unresolved` disposition phase differentiation (all three fall through to today's `idle` behavior unchanged); disposition inference beyond a fixed `actionable` default on promotion (no heuristic classification of HANDOFF prose into `waiting-for-operator`/`blocked`); DAG evaluator/registry wiring from Phase A/B; CLI/public schema version bump; any change to existing command output for projects whose current-state has no continuation set. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Add `ProjectContinuation` type and `continuation` field to `ProjectCurrentState`, with normalize/validate/serialize/write support. | Done |
| 2 | Add `continuationFromTaskHandoffStep()` and thread an optional continuation through `completeProjectCurrentTask`/`planCompletedProjectCurrentStateWrites`. | Done |
| 3 | Wire `task-finish.ts` to read the closing task's HANDOFF "Next Recommended Step" and promote it. | Done |
| 4 | Expose `continuation` in `TaskSelectionReport.sources.currentState` and add the `continuation-ready` phase/action to `task-selection-status-v2.ts`. | Done |
| 5 | Add regression tests (promotion, back-compat, each disposition) and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `continuation` is nullable, validated, and round-trips through read/write; old `current.json` files without the field normalize to `continuation: null` without error. | Met | ev:T-0661:2e732e9cfe094b8cb249de77 | src/services/project-current-state.ts, tests/unit/status-continuation.test.ts |
| AC-2 | `task close` on a capsule with a real (non-placeholder) HANDOFF "Next Recommended Step" promotes it into `continuation` with `disposition: actionable`; a placeholder/TBD step does not overwrite an existing continuation. | Met | ev:T-0661:2e732e9cfe094b8cb249de77 | src/task/task-finish.ts, tests/unit/status-continuation.test.ts |
| AC-3 | `task-selection-status-v2` phase is not `idle` when `continuation.disposition` is `actionable` or `waiting-for-operator` and no other recommendation source matched, reproducing the exact `nextWork: null` scenario from this project's own `current.json` history. | Met | ev:T-0661:2e732e9cfe094b8cb249de77 | src/services/task-selection-status-v2.ts, tests/unit/task-selection-continuation.test.ts |
| AC-4 | `waiting-for-operator` never fabricates a command (`primaryNextAction.command` is absent/undefined, `requiresReview: true`); `terminal`/`blocked`/`unresolved`/absent continuation leave `idle` behavior unchanged. | Met | ev:T-0661:2e732e9cfe094b8cb249de77 | tests/unit/task-selection-continuation.test.ts |
| AC-5 | No existing CLI command output changes for projects with no continuation set (back-compat). | Met | ev:T-0661:37bb835634a84762b82c4711 | build + full suite (164 files, 1213 tests, no regressions) |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused unit tests (continuation model) | Yes | Passed | ev:T-0661:2e732e9cfe094b8cb249de77 |
| TypeScript build | Yes | Passed | ev:T-0661:e1bca6f6cd1d4612922a405c |
| Full test suite | Yes | Passed | ev:T-0661:37bb835634a84762b82c4711 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/local/tmp_plan/status/redesign_candidate/HADARA_Declarative_DAG_Status_Context_Routing_Design.docx` | reference | active | Section 1.1 (problem statement), section 9 (continuation as a runtime-derived, source-of-truth field), section 16.3 step 7. |
| `src/services/project-current-state.ts` | implementation-source | active | Owns `ProjectCurrentState`; `completeProjectCurrentTask`/`planCompletedProjectCurrentStateWrites` are the write path this capsule extends. |
| `src/task/task-finish.ts` | implementation-source | active | Underlying finish step inside `task close`; calls `planCompletedProjectCurrentStateWrites` today. |
| `src/task/task-selection.ts`, `src/services/task-selection-status-v2.ts` | implementation-source | active | `idle` precedence chain this capsule extends without disturbing existing precedence order. |

## Changes

| Area | Summary |
|---|---|
| `src/services/project-current-state.ts` | `ProjectContinuationDisposition`/`ProjectContinuationReference`/`ProjectContinuationSource`/`ProjectContinuation` types; `continuation: ProjectContinuation \| null` on `ProjectCurrentState`; normalize/validate/serialize/`createInitialProjectCurrentState` support; `continuationFromTaskHandoffStep()`; `continuation?` param threaded through `completeProjectCurrentTask`/`planCompletedProjectCurrentStateWrites` (only overwrites when explicitly passed, including the early-bail write-skip check). |
| `src/schemas/project-current-state.schema.json` | `continuation` added to `required` and `$defs`; uses `oneOf` (not `anyOf` — see RF-3). |
| `src/task/task-finish.ts` | `readTaskHandoffNextStep()` reads the closing task's own `HANDOFF.md` "Next Recommended Step" row (skipping the header/placeholder rows), promotes it via `continuationFromTaskHandoffStep()`, and passes it into `planCompletedProjectCurrentStateWrites`. |
| `src/task/task-selection.ts` | `TaskSelectionReport.sources.currentState.continuation` exposed. |
| `src/services/task-selection-status-v2.ts` | New `continuation-ready` phase; `continuationNextAction()` builds a `create` action for `actionable` and a command-less `review` action for `waiting-for-operator`; `determinePhase`/`buildReadiness`/`taskSelectionPrecedence`/`selection.sourceExplanation` updated; `blocked`/`terminal`/`unresolved`/absent continue to route to `idle` unchanged. |
| `tests/unit/status-continuation.test.ts` | 9 tests: promotion helper, schema validation, back-compat normalization, write-path never-clears-on-absence, end-to-end `task close` promotion via `createTaskFinishReport`. |
| `tests/unit/task-selection-continuation.test.ts` | 5 tests: reproduces the reported bug scenario, `waiting-for-operator` review-only action, `terminal`/`blocked`/`unresolved`/absent leave `idle` unchanged, existing recommendation outranks a declared continuation. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Promotion always defaults to `disposition: actionable`; classifying HANDOFF prose into `waiting-for-operator`/`blocked` automatically is deferred pending real usage evidence. | Open | Future continuation-classification capsule |
| RF-2 | Follow-up | Project-level `hadara status` (not `task status`) does not yet read `continuation`; only the task-selection idle path was fixed in this MVP. | Open | Future status-scope capsule |
| RF-3 | Follow-up | Discovered during this capsule: `src/core/schema.ts`'s hand-rolled validator does not implement JSON Schema `anyOf` (only `oneOf`/`$ref`/`const`), so the pre-existing `nextWork`/`latestCompletedTask`/`activeTask` `anyOf` branches in `project-current-state.schema.json` silently validate nothing. This capsule used `oneOf` for the new `continuation` field to avoid the gap, but did not fix the shared validator (out of scope; affects other schemas project-wide). | Open | Future schema-validator hardening capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-20 | Draft | Initial task scaffold. |
| 2026-07-20 | Done | Continuation model, task-close promotion, and task-selection idle-precedence fix implemented; 14 focused tests plus 71-test regression re-run, build, and full suite (164 files / 1213 tests) passed. |
