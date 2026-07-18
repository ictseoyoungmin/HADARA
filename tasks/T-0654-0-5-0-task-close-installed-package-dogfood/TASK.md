# T-0654 0.5.0 task close installed package dogfood

## Identity

| Field | Value |
|---|---|
| ID | T-0654 |
| Title | 0.5.0 task close installed package dogfood |
| Status | Done |
| Created | 2026-07-18T21:40 |
| Updated | 2026-07-18T21:44 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0654 --json`.

## Goal

| Goal | Notes |
|---|---|
| Verify the latest source package `task close` behavior from an external installed-package project. | Completes the task-close spec evidence gap after T-0652/T-0653 by exercising clean close, blocked close, and retry through a packaged CLI entrypoint. |

## Scope

| Boundary | Items |
|---|---|
| In | Local package tarball install under `/tmp`, fresh governed HADARA project, baseline/feature capsule close with installed CLI, blocked close zero-write check, idempotent retry check, dogfood report. |
| Out | npm publish, GitHub Release, broad delegated-agent product implementation, and full process-kill fault injection. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Pack and install latest source package into an external temp project. | Done |
| 3 | Exercise init, task create/status, task close clean/blocked/retry flows. | Done |
| 4 | Record dogfood report and validation evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Installed package entrypoint reports version `0.5.0-rc.0` from latest source tarball and initializes a fresh project. | Met | `ev:T-0654:4c6035c25fb04b9d996e1e42` | Task close spec |
| AC-2 | A clean installed-package capsule closes with one `hadara task close --task T --json` call and returns `hadara.task.close.v2` with ordered locks and closed-valid state. | Met | `ev:T-0654:4c6035c25fb04b9d996e1e42` | Task close spec |
| AC-3 | A blocked installed-package capsule returns zero lifecycle-owned writes and a structured recovery action. | Met | `ev:T-0654:4c6035c25fb04b9d996e1e42` | Task close spec |
| AC-4 | Re-running close on an already closed installed-package capsule is an idempotent no-op without duplicate close proof. | Met | `ev:T-0654:4c6035c25fb04b9d996e1e42` | Task close spec |
| AC-5 | Dogfood report records results and any residual UX issues. | Met | `ev:T-0654:4c6035c25fb04b9d996e1e42` | `DOGFOOD_REPORT.md` |
| AC-6 | Validation evidence is recorded. | Met | `ev:T-0654:4c6035c25fb04b9d996e1e42` | HADARA workflow |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Installed-package task close dogfood | Yes | Passed | `ev:T-0654:4c6035c25fb04b9d996e1e42` |
| `npm run build` | Yes | Passed | `ev:T-0653:c6420538b41f4c9aa38d447c` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5/0.5.1/HADARA_0_5_1_Task_Close_Transaction_Development_Plan.md` | reference | active | Requires installed dogfood before stable promotion. |
| `src/task/task-close-transaction.ts` | implementation target | active | Latest source package route under test. |

## Changes

| Area | Summary |
|---|---|
| Dogfood | Added installed-package task close dogfood report covering install/init, blocked close, clean close, and idempotent retry. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | If later delegated dogfood finds task close blockers, fix them before 0.5.0 stable. | Open | `DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-18 | Draft | Initial task scaffold. |
| 2026-07-18 | In Progress | Scoped installed-package task close dogfood. |
| 2026-07-18 | Done | Installed-package task close dogfood passed for blocked, clean, and retry flows. |
