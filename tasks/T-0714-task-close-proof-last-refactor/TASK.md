# T-0714 Task Close Proof-Last Refactor

## Identity

| Field | Value |
|---|---|
| ID | T-0714 |
| Title | Task Close Proof-Last Refactor |
| Status | Done |
| Created | 2026-07-28T13:02 |
| Updated | 2026-07-28T13:10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Move lifecycle-owned `Done` writes behind close-proof generation in the guarded `task close` path, so TASK.md and Task Board are no longer marked `Done` before close proof exists. | This is a proof-last refactor, not a full atomic journal transaction; recovery behavior and documentation must match the new partial-failure shape. |

## Scope

| Boundary | Items |
|---|---|
| In | Reorder `task finalize`/`task close` so the public close path computes readiness and close proof from the virtual post-finish root, appends proof before the real lifecycle-owned `Done` writes, and audits only after finish bookkeeping lands. Update focused lifecycle tests and workflow/init docs to describe the new order. |
| Out | Full journaled atomic close; changing append-only evidence semantics; redesigning done-level harness tokens outside what the new proof-last path requires. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Trace the current close/finalize ordering and identify every place that assumes `Done` is written before close proof. | Done |
| 2 | Reorder the guarded close engine to reuse virtual post-finish reports for readiness/proof, then commit lifecycle-owned `Done` bookkeeping and audit. | Done |
| 3 | Run focused regression coverage and update task/workflow documentation to match the new recovery semantics. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `task close` no longer writes TASK.md / Task Board `Done` before close proof generation on the normal guarded path. | Met | `ev:T-0714:ff578bcf6ac446a0b06b0b9f` | User instruction |
| AC-2 | Partial recovery now reflects the new ordering: proof may already be appended before final lifecycle bookkeeping/audit completes, and focused tests cover that shape. | Met | `ev:T-0714:ff578bcf6ac446a0b06b0b9f` | User instruction |
| AC-3 | Workflow/operator docs describe readiness/proof on the virtual post-finish state and final `Done` bookkeeping before audit. | Met | `ev:T-0714:ff578bcf6ac446a0b06b0b9f` | User instruction |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused lifecycle and docs regressions | Yes | Passed | `vitest run tests/unit/task-finalize.test.ts tests/unit/task-close.test.ts tests/harness/harness-validate.test.ts tests/unit/init.test.ts` passed after proof-last refactor and expectation updates. | ev:T-0714:ff578bcf6ac446a0b06b0b9f |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User review of T-0713 residual atomicity gap | decision | active | Requires naming the current behavior accurately and moving lifecycle-owned `Done` writes behind close-proof generation. |
| `tasks/T-0713-task-close-atomicity-and-evidence-integrity-hardening/TASK.md` | reference | active | Confirms T-0713 only hardened preflight and left RF-1 open. |
| `src/task/task-finalize.ts` / `src/task/task-close-transaction.ts` | implementation-source | active | Own the guarded close ordering and recovery state. |
| `docs/TASK_WORKFLOW_COMMANDS.md` / `src/init/templates.ts` | reference | active | Must describe the new close order and recovery semantics. |

## Changes

| Area | Summary |
|---|---|
| `src/task/task-finalize.ts` | Added virtual post-finish close/ready report reuse for execute mode, so readiness and close proof run against the projected post-finish capsule state before real TASK.md / Task Board `Done` writes. |
| `tests/unit/task-finalize.test.ts`, `tests/unit/task-close.test.ts` | Updated dry-run and recovery expectations to the new proof-last ordering, including proof-before-finish partial recovery and reordered executed steps. |
| `docs/TASK_WORKFLOW_COMMANDS.md`, `src/init/templates.ts` | Updated lifecycle text to say readiness/proof are recorded against the virtual post-finish state and lifecycle-owned `Done` bookkeeping is committed before final audit. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | This refactor still is not a full atomic journal transaction. If finish bookkeeping fails after proof append, recovery now leaves proof recorded before final audit/terminal `Done`, which is more honest but still not a single-filesystem-transaction close. | Open | src/task/task-finalize.ts |
| RF-2 | Follow-up | Dry-run semantics for a brand-new Draft capsule are now stricter because virtual readiness is evaluated earlier and can surface weak-evidence blockers before finish is ever recommended. | Open | tests/unit/task-finalize.test.ts |

## Close Summary

Guarded `task close` now computes readiness and close proof from the virtual post-finish capsule state, appends proof before real lifecycle-owned `Done` writes, and only audits after finish bookkeeping lands; focused lifecycle/docs regression coverage passes.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | Done | Reordered guarded close to append proof from the virtual post-finish state before TASK.md / Task Board `Done` bookkeeping; focused lifecycle/docs regressions passed. |
