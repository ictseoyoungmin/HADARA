# T-0627 0.4.6 finalize validation placeholder semantics cleanup

## Identity

| Field | Value |
|---|---|
| ID | T-0627 |
| Title | 0.4.6 finalize validation placeholder semantics cleanup |
| Status | Done |
| Created | 2026-07-16 |
| Updated | 2026-07-16 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0627 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Avoid misclassifying a deliberate pre-close `task finalize` validation row as unfinished scaffold content. | Preserve strict rejection of default scaffold validation rows while allowing a finalizer row to remain `Not Run` until close evidence is appended. |

## Scope

| Boundary | Items |
|---|---|
| In | Refine TASK.md validation placeholder detection and add done-level harness coverage. |
| Out | Public repair command design, broader validation table schema redesign. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define placeholder semantics cleanup from T-0625 dogfood. | Done |
| 2 | Exempt planned finalizer validation rows from generic scaffold detection. | Done |
| 3 | Validate focused harness and finalize tests plus build. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A validation row for `hadara task finalize ...` with pre-close result and placeholder evidence no longer triggers `TASK_SCAFFOLD_PLACEHOLDER` by itself. | Done | ev:T-0627:fad57d989a9d4351b6306c07 | harness tests |
| AC-2 | Default scaffold validation rows with placeholder check/evidence remain rejected. | Done | ev:T-0627:fad57d989a9d4351b6306c07 | existing harness tests |
| AC-3 | Focused tests and TypeScript build pass. | Done | ev:T-0627:fad57d989a9d4351b6306c07 | validation |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npx vitest run tests/harness/harness-validate.test.ts tests/unit/task-finalize.test.ts` | Yes | Passed | ev:T-0627:fad57d989a9d4351b6306c07 |
| `npm run build` | Yes | Passed | ev:T-0627:fad57d989a9d4351b6306c07 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0625-0-4-6-rc1-current-package-codex-dogfood-before-stable/DOGFOOD_REPORT.md` | reference | active | Source dogfood finding. |
| `src/task/task-capsule.ts` | implementation-source | active | TASK.md scaffold detection. |
| `src/harness/validate.ts` | reference | active | Done-level validation caller for scaffold detection. |

## Changes

| Area | Summary |
|---|---|
| `src/task/task-capsule.ts` | Added TASK.md validation-section placeholder semantics that ignore planned finalizer pre-close rows while preserving scaffold row detection. |
| `tests/harness/harness-validate.test.ts` | Added done-level coverage for planned finalizer validation rows. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Rerun delegated current-package dogfood after this cleanup. | Open | T-0625 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-16 | Draft | Initial task scaffold. |
| 2026-07-16 | In Progress | Cleaning up finalize validation placeholder semantics before stable dogfood rerun. |
| 2026-07-16 | Done | Placeholder semantics cleanup implemented and validated with focused harness/finalize tests plus TypeScript build. |
