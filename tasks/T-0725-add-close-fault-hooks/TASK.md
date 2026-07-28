# T-0725 Add Close Fault Hooks

## Identity

| Field | Value |
|---|---|
| ID | T-0725 |
| Title | Add Close Fault Hooks |
| Status | Done |
| Created | 2026-07-28T18:53 |
| Updated | 2026-07-28T18:57 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Add internal task-close fault hooks for recovery tests. | Provide a non-public seam for simulating interruption after operation prepare, after close proof append, and before terminal cleanup. |

## Scope

| Boundary | Items |
|---|---|
| In | Internal `TaskCloseFaultHooks`, proof-append interruption test, terminal cleanup recovery test, focused validation. |
| Out | Public CLI options, broad distributed transaction support, full installed-package dogfood. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Add non-public close fault hooks. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Tests can interrupt after close proof append while leaving durable state for retry. | Met | ev:T-0725:fbccac6c872147da8ab63f1a | rc2 spec sections 25-26 |
| AC-2 | Retrying after a proof-append interruption returns closed-valid without duplicate close proof. | Met | ev:T-0725:fbccac6c872147da8ab63f1a | rc2 spec AC-11 |
| AC-3 | Tests can interrupt before terminal cleanup and retry cleans the marker without duplicate proof. | Met | ev:T-0725:fbccac6c872147da8ab63f1a | rc2 spec section 19.4 |
| AC-4 | Validation evidence is recorded. | Met | ev:T-0725:cd358b81b5cd44f096d16135 | HADARA protocol |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused task close tests | Yes | Passed | npm test -- --run tests/unit/task-close.test.ts passed: 30 tests | ev:T-0725:fbccac6c872147da8ab63f1a |
| TypeScript build | Yes | Passed | npm run build passed | ev:T-0725:aa61fcbeeadd491a8b77a4c9 |
| Full check | Yes | Passed | npm run check passed: public 136 files/1069 tests, HADARA-dev 16 files/134 tests | ev:T-0725:cd358b81b5cd44f096d16135 |
| TypeScript build | Yes | Passed | npm run build passed | ev:T-0725:aa61fcbeeadd491a8b77a4c9 |
| Full check | Yes | Passed | npm run check passed: public 136 files/1069 tests, HADARA-dev 16 files/134 tests | ev:T-0725:cd358b81b5cd44f096d16135 |
| Diff hygiene | Yes | Passed | git diff --check passed | ev:T-0725:dbbfa22eaa274d27ad3e57ed |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md | constraint | active | Fault hook and recovery contract. |
| src/task/close/execute.ts | implementation-source | active | Transaction orchestration and marker cleanup. |
| tests/unit/task-close.test.ts | implementation-source | active | Fault/recovery coverage. |

## Changes

| Area | Summary |
|---|---|
| Fault hooks | Added non-public `TaskCloseFaultHooks` for after operation prepare, after close proof append, and before terminal cleanup. |
| Recovery tests | Added proof-append interruption and terminal-cleanup interruption tests; both retry to `closed-valid` without duplicate close proof. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Remaining rc2 coverage should focus on installed-package dogfood and any strict blocked-preflight marker tightening. | Open | docs/specs/0.5.0-rc2/HADARA Task Close Transaction Specification.md |

## Close Summary

T-0725 added internal task-close fault hooks and regression coverage for interruption after close proof append and before terminal cleanup. Retrying both scenarios returns `closed-valid`, removes the local operation marker, and keeps close proof count at one. Focused close tests, TypeScript build, and full check passed.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | In Progress | Scoped internal fault hooks and proof-pending recovery tests. |
| 2026-07-28 | Done | Implemented hooks and completed validation. |
