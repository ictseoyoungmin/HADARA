# T-0626 0.4.6 atomic finalize auto close preflight

## Identity

| Field | Value |
|---|---|
| ID | T-0626 |
| Title | 0.4.6 atomic finalize auto close preflight |
| Status | Done |
| Created | 2026-07-16 |
| Updated | 2026-07-16 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0626 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Prevent `task finalize --execute --auto` from creating partial lifecycle-owned state when post-finish readiness would still block. | Use a virtual finish preflight so auto close either reaches a clean executable path or refuses with zero real writes. |

## Scope

| Boundary | Items |
|---|---|
| In | Strengthen finalize auto preflight, remove partial-write recommendations when deferred checks can still fail, and cover first-capsule close behavior with focused tests. |
| Out | Public repair command design, 0.5 state-first migration, broad task schema redesign. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the close-boundary contract and failing dogfood scenario. | Done |
| 2 | Implement virtual finish preflight for finalize auto. | Done |
| 3 | Validate with focused finalize tests and build. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `--execute --auto` refuses with zero writes when virtual post-finish ready/close checks still have blockers. | Done | ev:T-0626:8eaf357e67434369b24bd278 | T-0625 dogfood |
| AC-2 | A clean first-capsule style task can still close in one auto call. | Done | ev:T-0626:8eaf357e67434369b24bd278 | task-finalize tests |
| AC-3 | Finalize auto preflight catches hidden post-finish blockers before real lifecycle writes. | Done | ev:T-0626:8eaf357e67434369b24bd278 | task-finalize tests |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npx vitest run tests/unit/task-finalize.test.ts` | Yes | Passed | ev:T-0626:8eaf357e67434369b24bd278 |
| `npm run build` | Yes | Passed | ev:T-0626:8eaf357e67434369b24bd278 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0625-0-4-6-rc1-current-package-codex-dogfood-before-stable/DOGFOOD_REPORT.md` | reference | active | Stable blocker reproduced by delegated Codex. |
| `src/task/task-finalize.ts` | implementation-source | active | Finalize planner/executor boundary. |
| `src/task/task-finish.ts` | implementation-source | active | Bounded finish write plan used for virtual preflight. |

## Changes

| Area | Summary |
|---|---|
| `src/task/task-finalize.ts` | Added virtual finish preflight for auto finalize using a bounded temporary overlay, so hidden post-finish blockers are detected before real writes. |
| `src/task/task-finish.ts` | Added planned `contentAfter` for task status and Task Board writes so the finalize preflight can reuse exact finish output. |
| `tests/unit/task-finalize.test.ts` | Added hidden post-finish blocker and clean first-capsule style auto-close coverage. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Placeholder semantics for finalizer validation rows will be handled in the next capsule. | Open | T-0627 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-16 | Draft | Initial task scaffold. |
| 2026-07-16 | In Progress | Implementing atomic finalize auto preflight before 0.4.6 stable. |
| 2026-07-16 | Done | Virtual finish preflight implemented and validated with focused finalize tests plus TypeScript build. |
