# T-0611 0.4.6 current-state latest semantics and evidence vocabulary cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0611 |
| Title | 0.4.6 current-state latest semantics and evidence vocabulary cleanup |
| Status | Done |
| Created | 2026-07-14 |
| Updated | 2026-07-14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make current-state latest-task semantics explicit and remove evidence category vocabulary duplication. | Preserve the existing ID-based latest Done contract while making out-of-order close behavior clear to agents and diagnostics. |

## Scope

| Boundary | Items |
|---|---|
| In | `.hadara/state/current.json` schema/service/projections, state projection diagnostics, evidence category CLI vocabulary source, focused tests, Docker validation, and capsule evidence. |
| Out | Replacing `latestCompletedTask` with close timestamp chronology, scanning evidence to compute completion order, or changing evidence category persisted tokens. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Add an explicit `latestCompletedTaskBasis` current-state field and projection wording. | Done |
| 3 | Move evidence category aliases/tokens to the shared controlled vocabulary source. | Done |
| 4 | Validate focused tests, build, Docker full suite, and dist freshness. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Current-state schema and projections state that `latestCompletedTask` is based on the highest Done task id, not close timestamp chronology. | Done | `ev:T-0611:d8394da2a5dd40099d23d53a`, `ev:T-0611:780770a1aa32481f94af6597` | `src/services/project-current-state.ts` |
| AC-2 | State projection mismatch diagnostics mention highest Done task id semantics and do not imply close chronology. | Done | `ev:T-0611:d8394da2a5dd40099d23d53a` | `src/services/state-projection.ts` |
| AC-3 | Evidence category tokens and `test`/`tests` aliases are sourced from `controlled-vocabulary.ts`, not duplicated in CLI code. | Done | `ev:T-0611:d8394da2a5dd40099d23d53a` | `src/cli/evidence.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused current-state/evidence/schema tests | Yes | Passed | `ev:T-0611:d8394da2a5dd40099d23d53a` |
| Post-close serializer-order focused tests | Yes | Passed | `ev:T-0611:780770a1aa32481f94af6597` |
| TypeScript build | Yes | Passed | `ev:T-0611:d8394da2a5dd40099d23d53a`, `ev:T-0611:780770a1aa32481f94af6597` |
| Docker dev sync build and full suite | Yes | Passed | `ev:T-0611:d8394da2a5dd40099d23d53a`, `ev:T-0611:780770a1aa32481f94af6597` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | constraint | active | Keep current implementation's ID-based latest Done contract, but make it robust for interrupted/out-of-order work. |
| `.hadara/state/current.json` | implementation-source | active | Structured current-state canon. |
| `src/services/controlled-vocabulary.ts` | implementation-source | active | Single shared source for controlled token sets. |

## Changes

| Area | Summary |
|---|---|
| `src/services/project-current-state.ts` | Added and projected `latestCompletedTaskBasis: highest-done-task-id`; normalized missing legacy state; stabilized serialized current-state field order. |
| `src/schemas/project-current-state.schema.json` | Added schema field and description for latest task basis. |
| `src/services/state-projection.ts` | Clarified latest mismatch diagnostics around highest Done task id semantics. |
| `src/cli/evidence.ts` / `src/services/controlled-vocabulary.ts` | Removed local evidence category token duplication and shared aliases from the vocabulary module. |
| Tests | Updated focused coverage for current-state projection and evidence/schema behavior. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Close timestamp chronology remains out of scope; add a separate close chronology field only if a future workflow truly needs "most recently closed by time". | Open | Future current-state schema work |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-14 | Draft | Initial task scaffold. |
| 2026-07-14 | In Progress | Implemented explicit latest task basis and evidence vocabulary cleanup. |
| 2026-07-14 | Done | Validated focused tests, build, Docker full suite, and dist freshness. |
