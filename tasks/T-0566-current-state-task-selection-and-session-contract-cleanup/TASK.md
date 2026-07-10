# T-0566 Current-state task selection and session contract cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0566 |
| Title | Current-state task selection and session contract cleanup |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Restore structured current-state continuity in public read models. | `task status --json` should use `.hadara/state/current.json` for selection, `session start --json` should keep release status/version semantics separate, and docs currentness should catch common shell example prefixes. |

## Scope

| Boundary | Items |
|---|---|
| In | Task-selection current-state recommendations; session-start JSON contract; active-doc stale command/version detector normalization; focused tests and built-CLI smoke. |
| Out | New public commands, release publishing, broad context-pack performance work, provider/runtime changes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement current-state selection, session contract, and docs-currentness normalization. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `task status --json` can recommend the structured active task or next operator intent from `.hadara/state/current.json`. | Done | `ev:T-0566:b4f528dae8c14433b24d474d`, `ev:T-0566:f5d9d305dd07435a8582cc5f` | `src/task/task-selection.ts` |
| AC-2 | `session start --json` exposes `currentRelease` separately while preserving `releaseState` status semantics. | Done | `ev:T-0566:b4f528dae8c14433b24d474d` | `src/context/session-start.ts` |
| AC-3 | Docs currentness detects removed command and stale install examples with common shell/list prefixes. | Done | `ev:T-0566:ccf66e7dcece42ae9ba1758a` | `src/services/docs-registry.ts` |
| AC-4 | Validation evidence is recorded. | Done | `ev:T-0566:ccf66e7dcece42ae9ba1758a`, `ev:T-0566:2a045107396743b4befe7cc1`, `ev:T-0566:b4f528dae8c14433b24d474d`, `ev:T-0566:f5d9d305dd07435a8582cc5f`, `ev:T-0566:9ea4cbd8749a4769956c19ea` | `tasks/T-0566-current-state-task-selection-and-session-contract-cleanup/EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused current-state contract tests | Yes | Passed | ev:T-0566:ccf66e7dcece42ae9ba1758a |
| Docker sync-build and full suite | Yes | Passed | ev:T-0566:2a045107396743b4befe7cc1 |
| Built CLI current-state smoke | Yes | Passed | ev:T-0566:b4f528dae8c14433b24d474d |
| Post-close current-state selection title smoke | Yes | Passed | ev:T-0566:f5d9d305dd07435a8582cc5f |
| Docker sync-build after intent title normalization | Yes | Passed | ev:T-0566:9ea4cbd8749a4769956c19ea |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/state/current.json` | implementation-source | active | Structured current-state canon and next intent source. |
| T-0565 review findings | reference | active | Follow-up review identified task-selection, session contract, and docs-currentness gaps. |

## Changes

| Area | Summary |
|---|---|
| Task selection | `task status --json` now uses `.hadara/state/current.json` as a first-class source for active-task and next-intent recommendations. |
| Session start | `currentState.currentRelease` carries the version string and `releaseState` remains reserved for derived status projection. |
| Docs currentness | Active-doc removed-command and stale-install checks normalize common shell/list prefixes before matching. |
| Contracts/docs | JSON schema and CLI/schema contract docs describe the additive current-state source and `currentRelease` field. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Over-interpreting free-form `nextOperatorIntent` could produce weak task titles; keep recommendation explicit about its current-state source. | Closed | `.hadara/state/current.json` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Started current-state task-selection and session JSON contract cleanup. |
| 2026-07-10 | Done | Implemented and validated current-state selection, session release contract split, and docs currentness prefix normalization. |
