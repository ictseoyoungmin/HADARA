# T-0719 Journal Task Close Transaction Writes

## Identity

| Field | Value |
|---|---|
| ID | T-0719 |
| Title | Journal Task Close Transaction Writes |
| Status | Done |
| Created | 2026-07-28T15:07 |
| Updated | 2026-07-28T15:15 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make `task close` journal actual step outcomes and mutation summaries, and stop counting `existing-noop` close proof reuse as a write. | Keep proof-first recovery explicit without overstating actual writes in summary or recovery state. |

## Scope

| Boundary | Items |
|---|---|
| In | Extend close-operation state with per-step journal/mutation summary, propagate actual finalize step mutation metadata into the transaction marker, fix `executedWrites`/`idempotentNoop` for `existing-noop`, and add recovery/no-op regressions. |
| Out | Reordering close to make the whole proof/write/projection/audit path a single cross-file atomic commit, and unrelated Init continuity cleanup. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement the smallest useful slice. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `task close` records step-level journal/mutation state so recovery markers reflect actual close-proof append and finish/audit outcomes, and `existing-noop` no longer counts as an executed write. | Met | `ev:T-0719:d9c7a99c1e5f419d8da4c508` | `src/task/task-close-transaction.ts`, `src/task/task-finalize.ts` |
| AC-2 | Regressions cover proof-first recovery journaling and execute-time duplicate close-proof no-op accounting. | Met | `ev:T-0719:d9c7a99c1e5f419d8da4c508` | `tests/unit/task-close.test.ts`, `tests/unit/task-finalize.test.ts` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| `npm test -- tests/unit/task-close.test.ts tests/unit/task-finalize.test.ts` | Yes | Passed | Targeted close/finalize regressions passed: 2 files, 47 tests. | `ev:T-0719:d9c7a99c1e5f419d8da4c508` |
| `npm run check` | Yes | Passed | Full repository validation passed: build, tools typecheck, 142 public files/1111 tests, and 16 HADARA-dev files/134 tests. | `ev:T-0719:d9c7a99c1e5f419d8da4c508` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Public close transaction semantics and recovery expectations. |
| `src/task/task-close-transaction.ts` | constraint | active | Operation-marker schema, recovery journaling, and write summary logic. |
| `src/task/task-finalize.ts` | constraint | active | Finalize executed-step metadata and progress propagation. |
| `tests/unit/task-close.test.ts` | reference | active | Regression coverage for proof-first recovery and no-op close-proof reuse. |

## Changes

| Area | Summary |
|---|---|
| `src/task/task-finalize.ts` | Propagates executed-step mutation metadata through finalize progress events and treats virtual proof-first close appends as actual evidence-append writes in the transaction journal. |
| `src/task/task-close-transaction.ts` | Adds step journal and mutation summary fields to operation state, derives `executedWrites` from actual mutations, and keeps `existing-noop` from inflating recovery/write summaries. |
| `tests/unit/task-close.test.ts` | Adds regressions for execute-time duplicate close-proof no-op accounting and proof-first recovery journaling. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Recovery markers are now honest about actual mutations, but the close transaction still is not a single cross-file atomic commit across proof append, finish writes, projections, and final audit. | Open | `src/task/task-close-transaction.ts` |

## Close Summary

`task close` now journals actual step outcomes and mutation summaries, so proof-first recovery markers reflect real append/write behavior and execute-time `existing-noop` close-proof reuse no longer counts as a write.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | Done | Journaled close-step mutation outcomes, fixed existing-noop write accounting, added regressions, and passed full repository validation. |
