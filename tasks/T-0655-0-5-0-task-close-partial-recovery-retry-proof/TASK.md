# T-0655 0.5.0 task close partial recovery retry proof

## Identity

| Field | Value |
|---|---|
| ID | T-0655 |
| Title | 0.5.0 task close partial recovery retry proof |
| Status | Done |
| Created | 2026-07-18T21:45 |
| Updated | 2026-07-18T21:49 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0655 --json`.

## Goal

| Goal | Notes |
|---|---|
| Prove that a persisted partial `task close` operation can be recovered by rerunning the same public close command after the operator repairs the blocker. | This closes the remaining recovery-contract proof gap before treating `task close` as part of the 0.5.0 stable surface. |

## Scope

| Boundary | Items |
|---|---|
| In | Focused unit coverage for partial operation persistence, repair, public `task close` retry, operation-state cleanup, and close-proof idempotency. |
| Out | New production behavior, external process-kill fault injection, release packaging, or installed-package dogfood. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Add a focused partial recovery retry test to `tests/unit/task-close.test.ts`. | Done |
| 2 | Run focused close/finalize/schema tests and TypeScript build. | Done |
| 3 | Record evidence and close the capsule with `task close`. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A persisted partial close operation can be recovered by rerunning the same public `task close` command after repairing the blocker. | Done | `ev:T-0655:c14fb7facf0c421a9cbda03b` | `tests/unit/task-close.test.ts` |
| AC-2 | The recovery retry removes the local operation state and appends exactly one close-proof record. | Done | `ev:T-0655:c14fb7facf0c421a9cbda03b` | `tests/unit/task-close.test.ts` |
| AC-3 | Focused close/finalize/schema tests and TypeScript build pass. | Done | `ev:T-0655:c14fb7facf0c421a9cbda03b` | `npm test`, `npm run build` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm test -- tests/unit/task-close.test.ts tests/unit/task-finalize.test.ts tests/unit/schema-fixtures.test.ts` | Yes | Passed | `ev:T-0655:c14fb7facf0c421a9cbda03b` |
| `npm run build` | Yes | Passed | `ev:T-0655:c14fb7facf0c421a9cbda03b` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0654-0-5-0-task-close-installed-package-dogfood/DOGFOOD_REPORT.md` | reference | active | Installed dogfood proved clean close and idempotent retry; this capsule adds focused partial-recovery retry proof. |
| `tests/unit/task-close.test.ts` | implementation target | active | Existing close transaction test suite extended without changing production code. |

## Changes

| Area | Summary |
|---|---|
| `tests/unit/task-close.test.ts` | Added recovery retry coverage for persisted partial operation state after repair through the public close transaction report path. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full external process-kill fault injection remains optional future hardening; current coverage proves the same recovery contract with deterministic in-process interruption. | Open | `tasks/T-0653-0-5-0-task-close-transaction-locks-and-recovery-state/TASK.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-18 | Draft | Initial task scaffold. |
| 2026-07-18 | Done | Added and validated partial recovery retry proof for the public `task close` transaction. |
