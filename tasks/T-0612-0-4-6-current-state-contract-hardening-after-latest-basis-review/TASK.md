# T-0612 0.4.6 current-state contract hardening after latest-basis review

## Identity

| Field | Value |
|---|---|
| ID | T-0612 |
| Title | 0.4.6 current-state contract hardening after latest-basis review |
| Status | Done |
| Created | 2026-07-14 |
| Updated | 2026-07-14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Harden the T-0611 current-state contract and validation capture wording. | Keep `latestCompletedTask` aligned with its declared highest-Done-id basis, preserve v1 schema compatibility, refresh the current validation baseline, and rename file-backed capture as a normal strategy rather than a fallback. |

## Scope

| Boundary | Items |
|---|---|
| In | Current-state completion mutators and planning, project-current-state schema compatibility, current validation baseline projection, validation-run capture metadata, focused tests, build, Docker validation, and capsule evidence. |
| Out | Adding close timestamp chronology, changing the current-state schemaVersion to v2, changing package smoke fallback semantics, or introducing new public CLI commands. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Make current-state completion choose the highest task id and keep v1 schema backward-compatible. | Done |
| 3 | Refresh current validation baseline and clarify validation capture metadata. | Done |
| 4 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Completing an older task after a newer Done task does not move `latestCompletedTask` backwards under `latestCompletedTaskBasis=highest-done-task-id`. | Done | `ev:T-0612:bc7b53484a6a4665ac217604` | `src/services/project-current-state.ts` |
| AC-2 | Existing v1 current-state JSON without `latestCompletedTaskBasis` remains schema-compatible while readers/writers still normalize and serialize the field. | Done | `ev:T-0612:bc7b53484a6a4665ac217604` | `src/schemas/project-current-state.schema.json` |
| AC-3 | Current validation baseline reflects the latest full-suite T-0611 evidence or has an explicit non-current meaning. | Done | `ev:T-0612:bc7b53484a6a4665ac217604` | `.hadara/state/current.json` |
| AC-4 | Validation-run file-backed capture reports `mode: file` without calling the default strategy a fallback. | Done | `ev:T-0612:bc7b53484a6a4665ac217604` | `src/services/validation-run.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused current-state and validation-run tests | Yes | Passed | `ev:T-0612:bc7b53484a6a4665ac217604` |
| TypeScript build | Yes | Passed | `ev:T-0612:bc7b53484a6a4665ac217604` |
| Docker dev sync build and full suite | Yes | Passed | `ev:T-0612:ba7804c638b44fdbaee8fc0d` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User review | constraint | active | P1 issues: completion mutator must enforce highest-id semantics, schema v1 compatibility, baseline currentness; P2 capture naming polish. |
| T-0611 | reference | active | Introduced the explicit latest-task basis and shared evidence vocabulary source. |

## Changes

| Area | Summary |
|---|---|
| `src/services/project-current-state.ts` | Completion writes now keep `latestCompletedTask` at the max of the existing latest task id and the completed task id. |
| `src/schemas/project-current-state.schema.json` | `latestCompletedTaskBasis` remains defined but is no longer required for legacy v1 raw schema compatibility. |
| `.hadara/state/current.json` and projections | Validation baseline now points to T-0611 full-suite/current-state evidence instead of the older T-0605 baseline. |
| `src/services/validation-run.ts` | File-backed capture reports `fallbackUsed:false` because it is the default capture strategy, not an error fallback. |
| Tests | Added focused coverage for out-of-order completion, legacy current-state schema compatibility, and validation capture metadata. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Close timestamp chronology remains intentionally out of scope; add a separate field only if future workflows need true close-time ordering. | Open | Future current-state schema work |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-14 | Draft | Initial task scaffold. |
| 2026-07-14 | In Progress | Started hardening current-state basis enforcement and validation capture wording. |
| 2026-07-14 | Done | Implemented contract hardening and validated focused tests, build, Docker full suite, and dist freshness. |
