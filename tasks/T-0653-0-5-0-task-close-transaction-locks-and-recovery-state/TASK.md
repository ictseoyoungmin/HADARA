# T-0653 0.5.0 task close transaction locks and recovery state

## Identity

| Field | Value |
|---|---|
| ID | T-0653 |
| Title | 0.5.0 task close transaction locks and recovery state |
| Status | Done |
| Created | 2026-07-18T21:17 |
| Updated | 2026-07-18T21:38 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0653 --json`.

## Goal

| Goal | Notes |
|---|---|
| Harden the public `task close` transaction with explicit transaction locks and machine-owned recovery state. | This closes the main gap between T-0652's public route and the 0.5 task-close spec: fixed lock ordering, lock diagnostics, and partial-execution recovery persistence. |

## Scope

| Boundary | Items |
|---|---|
| In | `task close` transaction lock coordinator, v2 report lock/order metadata, local operation/recovery state, lock-timeout failure, focused tests for lock contention and retained recovery state after partial writes. |
| Out | Removing compatibility `task finalize`, full process-crash injection harness, and replacing the existing finalize engine internals. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement ordered close transaction locks and operation state. | Done |
| 3 | Add focused lock/recovery tests and schema coverage. | Done |
| 4 | Validate build/focused suite and close the capsule with `task close`. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `task close` acquires machine-owned transaction locks in the documented project lifecycle -> Task Board -> task-scoped order before lifecycle writes. | Met | `ev:T-0653:9f7b559b8a0f4fd2b38b0963`, `ev:T-0653:2dcc1ba88c01487ea9fb2a80` | `docs/specs/0.5/0.5.1/HADARA_0_5_1_Task_Close_Transaction_Development_Plan.md` |
| AC-2 | `hadara.task.close.v2` reports lock order and lock wait diagnostics without absolute machine paths. | Met | `ev:T-0653:9f7b559b8a0f4fd2b38b0963`, `ev:T-0653:2dcc1ba88c01487ea9fb2a80` | Task close v2 schema |
| AC-3 | Lock contention times out fail-closed with zero lifecycle-owned writes and a structured issue/recovery action. | Met | `ev:T-0653:9f7b559b8a0f4fd2b38b0963` | Task close spec |
| AC-4 | A partial execution that wrote lifecycle state but failed later persists machine-owned operation state under `.hadara/local/` for retry/recovery and reports it in v2 output. | Met | `ev:T-0653:9f7b559b8a0f4fd2b38b0963` | Task close spec |
| AC-5 | A successful or idempotent close removes completed operation state and preserves task-local evidence locality. | Met | `ev:T-0653:9f7b559b8a0f4fd2b38b0963` | Task close spec |
| AC-6 | Validation evidence is recorded. | Met | `ev:T-0653:9f7b559b8a0f4fd2b38b0963`, `ev:T-0653:c6420538b41f4c9aa38d447c`, `ev:T-0653:2dcc1ba88c01487ea9fb2a80` | HADARA workflow |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm test -- tests/unit/task-close.test.ts tests/unit/task-finalize.test.ts tests/unit/schema-fixtures.test.ts` | Yes | Passed | `ev:T-0653:9f7b559b8a0f4fd2b38b0963` |
| `npm run build` | Yes | Passed | `ev:T-0653:c6420538b41f4c9aa38d447c` |
| `npm run dev:docker-sync-build` and built CLI `task close --dry-run` smoke | Yes | Passed | `ev:T-0653:2dcc1ba88c01487ea9fb2a80` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5/0.5.1/HADARA_0_5_1_Task_Close_Transaction_Development_Plan.md` | reference | active | Requires fixed lock order, recovery state, proof-last, idempotent retry, and fault matrix evidence. |
| `src/task/task-close-transaction.ts` | implementation target | active | Public v2 transaction wrapper from T-0652. |
| `src/task/task-finalize.ts` | implementation target | active | Existing guarded engine remains the write executor. |
| `src/evidence/evidence.ts` | reference | active | Evidence append lock must remain the innermost lock. |

## Changes

| Area | Summary |
|---|---|
| Task close transaction | Added ordered outer transaction locks for project lifecycle, Task Board, and task-scoped close before lifecycle writes. |
| Task close transaction | Added local operation/recovery state under `.hadara/local/task-close/` for partial execution after lifecycle-owned writes. |
| Schema / tests | Extended `hadara.task.close.v2` with lock/order/operation metadata and added lock timeout plus partial recovery tests. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full process-kill fault injection remains a possible future hardening harness; current proof uses synchronous hook tests to cover the same recovery state transition. | Open | Task close spec |
| RF-2 | Risk | Docker sync-build passed but mounted `dist` sync took 421s in this session. | Open | `.hadara/local/feedback/T-0653-docker-sync-build-mounted-latency.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-18 | Draft | Initial task scaffold. |
| 2026-07-18 | In Progress | Scoped task close transaction lock and recovery-state hardening. |
| 2026-07-18 | Done | Implemented ordered task close locks, local recovery state, schema coverage, and focused validation. |
