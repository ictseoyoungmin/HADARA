# T-0718 Share Reviewed Finalize Plan In Task Close

## Identity

| Field | Value |
|---|---|
| ID | T-0718 |
| Title | Share Reviewed Finalize Plan In Task Close |
| Status | Done |
| Created | 2026-07-28T14:57 |
| Updated | 2026-07-28T15:01 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Make `task close` use one reviewed finalize plan for both the operation marker and the actual execute path. | Eliminate hash drift between `transaction.operation.planHash` and the finalize plan that actually runs. |

## Scope

| Boundary | Items |
|---|---|
| In | Refactor close/finalize planning so the public close transaction reuses one reviewed finalize artifact, update operation-marker semantics, and add regression coverage for plan-hash consistency and stale reviewed plans. |
| Out | Full journal transaction unification, release-baseline promotion, and unrelated continuation cleanup. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the reviewed-plan sharing contract between `task close` and auto finalize. | Done |
| 2 | Implement the refactor and add regression coverage. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Public `task close` creates one reviewed finalize artifact and uses its `planHash` both for the operation marker and for finalize execution/replay semantics. | Met | `ev:T-0718:8d0591670dfd4350b6c59a43` | `src/task/task-close-transaction.ts`, `src/task/task-finalize.ts` |
| AC-2 | Regression tests cover marker/execute hash equality and stale reviewed-plan refusal through the public close surface. | Met | `ev:T-0718:8d0591670dfd4350b6c59a43` | `tests/unit/task-close.test.ts`, `tests/unit/task-finalize.test.ts` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| `npm test -- tests/unit/task-close.test.ts tests/unit/task-finalize.test.ts` | Yes | Passed | Targeted close/finalize regressions passed: 2 files, 45 tests. | `ev:T-0718:8d0591670dfd4350b6c59a43` |
| `npm run check` | Yes | Passed | Full repository validation passed: build, tools typecheck, 142 public files/1109 tests, and 16 HADARA-dev files/134 tests. | `ev:T-0718:8d0591670dfd4350b6c59a43` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/TASK_WORKFLOW_COMMANDS.md` | reference | active | Close transaction semantics and reviewed execute contract. |
| `/home/ymin/.codex/attachments/b283ecd5-42cc-43dc-baca-b9842ad61e36/pasted-text.txt` | reference | active | Reviewer finding for operation-marker/plan-hash drift. |
| `src/task/task-close-transaction.ts` | constraint | active | Current operation-marker and public close orchestration. |
| `src/task/task-finalize.ts` | constraint | active | Auto finalize review/execute flow and stale-plan guard. |

## Changes

| Area | Summary |
|---|---|
| `src/task/task-finalize.ts` | Extracted a reusable reviewed finalize artifact so dry-run review, auto execute, and stale-plan rechecks can share one plan contract instead of recomputing unrelated review objects. |
| `src/task/task-close-transaction.ts` | Public close now creates operation markers from the actual requested/reviewed finalize plan hash and injects the shared reviewed artifact into auto finalize. |
| `src/cli/task.ts` | Removed the stale internal `executeRequested` option pass-through from public close routing. |
| `tests/unit/task-close.test.ts` | Added regressions proving `transaction.operation.planHash === transaction.planHash === finalize.execution.requestedPlanHash` for both auto and reviewed-plan refusal paths. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | This task aligns the reviewed finalize artifact and operation marker, but it does not yet make the full close transaction journal atomic across proof append, finish writes, projection, and final audit. | Open | `src/task/task-close-transaction.ts` |

## Close Summary

`task close` and auto finalize now share one reviewed finalize artifact, so the operation marker and the actual requested execute plan hash stay aligned even when the public close transaction refuses a stale reviewed plan.


## History

| Date | State | Note |
|---|---|---|
| 2026-07-28 | Draft | Initial task scaffold. |
| 2026-07-28 | In Progress | Scoped the close/marker plan-sharing refactor around one reviewed finalize artifact. |
| 2026-07-28 | Done | Shared the reviewed finalize artifact across task close and auto finalize, added public hash-consistency regressions, and passed full repository validation. |
