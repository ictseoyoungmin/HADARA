# T-0616 Serialize task create allocation and managed board writes

## Identity

| Field | Value |
|---|---|
| ID | T-0616 |
| Title | Serialize task create allocation and managed board writes |
| Status | Done |
| Created | 2026-07-15 |
| Updated | 2026-07-15 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Serialize task ID allocation and Task Board managed-section writes so concurrent `task create` calls cannot produce duplicate task identities or append rows outside the managed task-board block. | The fix must fail closed on malformed Task Board managed sections and must be verified against the external quant dogfood retry. |

## Scope

| Boundary | Items |
|---|---|
| In | Task create locking, Task Board managed-section validation, focused unit coverage, build checks, and installed-candidate dogfood retry. |
| Out | General evidence append locking, command portfolio changes, delegated agent prompt redesign, and broader task selection semantics. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Reproduce and scope the parallel task-create failure from T-0615. | Done |
| 2 | Add a project-local task-create lock and fail-closed Task Board managed-section validation. | Done |
| 3 | Cover duplicate/missing managed sections and stale lock timeout with focused tests. | Done |
| 4 | Repack the candidate package and rerun governed quant delegated dogfood. | Done |
| 5 | Record evidence and update dogfood findings. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Concurrent task creation is serialized so task IDs are unique within the project. | Done | `ev:T-0616:77b7fb7630274f60bda4d923` | `src/task/task-capsule.ts`, `src/task/task-create.ts` |
| AC-2 | Task Board writes fail closed when the managed `task-board` section is missing or duplicated. | Done | `ev:T-0616:77b7fb7630274f60bda4d923` | `tests/unit/task-create.test.ts` |
| AC-3 | The external governed quant retry can create four capsules concurrently without duplicate IDs or rows outside the managed block. | Done | `ev:T-0616:77b7fb7630274f60bda4d923` | `tasks/T-0615-0-4-6-rc-0-installed-package-multi-scenario-delegated-dogfood/DOGFOOD_REPORT.md` |
| AC-4 | Validation evidence is recorded for focused tests, build, Docker build/version smoke, and external dogfood retry. | Done | `ev:T-0616:77b7fb7630274f60bda4d923` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm test -- tests/unit/task-create.test.ts tests/harness/task-capsule.test.ts` | Yes | Passed | `ev:T-0616:77b7fb7630274f60bda4d923` |
| `npm run build` | Yes | Passed | `ev:T-0616:77b7fb7630274f60bda4d923` |
| Docker direct build and version smoke | Yes | Passed | `ev:T-0616:77b7fb7630274f60bda4d923` |
| External quant retry tests | Yes | Passed | `ev:T-0616:77b7fb7630274f60bda4d923` |
| External installed-package `doctor` and `task status` | Yes | Passed | `ev:T-0616:77b7fb7630274f60bda4d923` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0615-0-4-6-rc-0-installed-package-multi-scenario-delegated-dogfood/DOGFOOD_REPORT.md` | reference | active | Records the original duplicate task ID and out-of-managed-block Task Board row blocker. |
| `src/task/task-capsule.ts` | implementation-source | active | Owns task capsule allocation and Task Board row append behavior. |
| `src/task/task-create.ts` | implementation-source | active | Owns task-create report generation and current-state activation. |
| `tests/unit/task-create.test.ts` | reference | active | Focused regression coverage for task-create locking and managed-section failures. |

## Changes

| Area | Summary |
|---|---|
| `src/task/task-capsule.ts` | Added project-local lock acquisition for task creation and exact managed-section validation before Task Board writes. |
| `src/task/task-create.ts` | Wrapped task creation plus active-task synchronization in the same project-local lock and surfaced lock/managed-section failures as structured issues. |
| `tests/unit/task-create.test.ts` | Added missing/duplicate managed-section and stale lock timeout regressions; updated Task Board fixture to use managed sections. |
| `tasks/T-0615.../DOGFOOD_REPORT.md` | Added the post-fix governed quant retry result and remaining UX findings. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Delegated dogfood should inject the candidate package onto PATH; otherwise later lifecycle calls may use a global `hadara`. | Open | `tasks/T-0615-0-4-6-rc-0-installed-package-multi-scenario-delegated-dogfood/DOGFOOD_REPORT.md` |
| RF-2 | Follow-up | Agents naturally use `Type=None` for no-risk rows; consider a scaffold pattern or alias. | Open | `tasks/T-0615-0-4-6-rc-0-installed-package-multi-scenario-delegated-dogfood/DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-15 | Draft | Initial task scaffold. |
| 2026-07-15 | In Progress | Implemented task-create serialization and fail-closed Task Board managed-section validation. |
| 2026-07-15 | Done | Validated focused tests/build/Docker smoke and completed the governed quant dogfood retry. |
