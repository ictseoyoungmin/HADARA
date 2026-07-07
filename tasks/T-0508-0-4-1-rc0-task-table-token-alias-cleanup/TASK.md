# T-0508 0.4.1 rc0 task table token alias cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0508 |
| Title | 0.4.1 rc0 task table token alias cleanup |
| Status | Done |
| Created | 2026-07-07 |
| Updated | 2026-07-07 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Accept natural TASK.md table tokens for completed acceptance rows and active input constraints. | `Acceptance` rows may use `Done` as a human-friendly alias for canonical `Met`; `Inputs / Constraints` rows may use `active` for currently applicable sources. |

## Scope

| Boundary | Items |
|---|---|
| In | Add `Done` to `task.acceptance.state` controlled vocabulary without changing internal readiness normalization; add `active` to `task.source.state`; update new capsule/template scaffold examples; add focused tests for schema output and harness validation. |
| Out | Broader task status token changes; project-level vocabulary overrides; full canonical/alias metadata model. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm current vocabulary, harness, and acceptance readiness behavior. | Done |
| 2 | Add the allowed tokens and align scaffold examples. | Done |
| 3 | Add focused vocabulary/harness tests. | Done |
| 4 | Run validation and record evidence. | Done |
| 5 | Update close-source docs and finalize. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara schema --domain task.acceptance.state` lists `Done`, and `Done` acceptance rows pass draft-level harness validation as completed rows. | Done | ev:T-0508:145f99b5933d4f1cab7f022c | `src/services/controlled-vocabulary.ts`, `src/task/acceptance.ts`, `tests/harness/harness-validate.test.ts` |
| AC-2 | `hadara schema --domain task.source.state` lists `active`, and `Inputs / Constraints` rows with `State=active` pass draft-level harness validation. | Done | ev:T-0508:145f99b5933d4f1cab7f022c | `src/services/controlled-vocabulary.ts`, `tests/harness/harness-validate.test.ts` |
| AC-3 | New Task Capsule scaffolds and template scaffolds use `active` for the default `Inputs / Constraints` row. | Done | ev:T-0508:145f99b5933d4f1cab7f022c | `src/task/task-capsule.ts`, `src/task/task-templates.ts` |
| AC-4 | Focused tests pass and evidence is recorded. | Done | ev:T-0508:145f99b5933d4f1cab7f022c | `tests/unit/controlled-vocabulary.test.ts`, `tests/harness/harness-validate.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused vocabulary/harness tests | Yes | Passed | ev:T-0508:145f99b5933d4f1cab7f022c |
| Built CLI schema smoke | Yes | Passed | ev:T-0508:145f99b5933d4f1cab7f022c |
| Focused vocabulary and harness tests | Yes | Passed | ev:T-0508:145f99b5933d4f1cab7f022c |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | constraint | active | Allow `Acceptance=Done` and `Inputs / Constraints State=active`. |
| src/services/controlled-vocabulary.ts | implementation-source | active | Shared schema/harness vocabulary source. |
| src/task/acceptance.ts | implementation-source | active | Already normalizes `Done` to canonical `Met` for readiness. |
| src/harness/validate.ts | implementation-source | active | Enforces table controlled values. |

## Changes

| Area | Summary |
|---|---|
| Vocabulary | Added `Done` to `task.acceptance.state` and `active` to `task.source.state`. |
| Task scaffolds | New default and template TASK.md `Inputs / Constraints` rows now use `active`. |
| Tests | Added schema/vocabulary and harness validation coverage; updated exact scaffold fixture strings. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full canonical/alias vocabulary metadata remains future 0.5 scope if aliases grow beyond this narrow UX fix. | Deferred | docs/specs/0.5/state-first/RFC.md |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-07 | Draft | Initial task scaffold. |
| 2026-07-07 | In Progress | Scoped token alias cleanup after user UX review. |
| 2026-07-07 | Done | Implemented token aliases and recorded focused validation evidence. |
