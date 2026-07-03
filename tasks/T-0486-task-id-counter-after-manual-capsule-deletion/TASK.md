# T-0486 task id counter after manual capsule deletion

## Identity

| Field | Value |
|---|---|
| ID | T-0486 |
| Title | task id counter after manual capsule deletion |
| Status | Done |
| Created | 2026-07-03 |
| Updated | 2026-07-03 |

## Goal

| Goal | Notes |
|---|---|
| Prevent task id reuse after manual capsule deletion. | `task create` and write preflight should reserve ids already present in `docs/TASK_BOARD.md`, even if the matching capsule directory was manually removed. |

## Scope

| Boundary | Items |
|---|---|
| In | Make next task id allocation consider both existing capsule directories and Task Board rows; cover deleted-directory scenarios with tests; keep Task Board collision retry behavior. |
| Out | Building a durable global allocator, repairing existing missing capsules, deleting stale Task Board rows, or changing task id format. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement the smallest useful slice. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `task create` allocates an id greater than the highest Task Board id after the highest capsule directory is manually deleted. | Met | `ev:T-0486:c4f5c6009a6a499191748196` | `src/task/task-capsule.ts` |
| AC-2 | Write preflight predicts the same post-deletion id without creating files. | Met | `ev:T-0486:c4f5c6009a6a499191748196` | `src/services/write-preflight.ts` |
| AC-3 | Focused regression tests and build/check validation pass with evidence. | Met | `ev:T-0486:c4f5c6009a6a499191748196` | `tests/unit` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused task id counter tests | Yes | Passed | `ev:T-0486:c4f5c6009a6a499191748196` |
| Build / full check or accepted ext4 substitute | Yes | Passed | `ev:T-0486:c4f5c6009a6a499191748196` |
| Built CLI smoke / diff hygiene | Yes | Passed | `ev:T-0486:c4f5c6009a6a499191748196` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` | reference | implemented | Required capsule 5: task id counter after manual capsule deletion. |
| `docs/AGENT_HANDOFF.md` | reference | implemented | Names this as the next stable pre-release capsule after T-0485. |
| `src/task/task-capsule.ts` | implementation-source | implemented | `nextTaskId` now derives its max from both task directories and Task Board rows, then preserves blocked-id retry behavior. |
| `src/services/write-preflight.ts` | implementation-source | implemented | Task create write preview now uses the same `nextTaskId` helper as real task creation. |

## Changes

| Area | Summary |
|---|---|
| Task id allocation | `nextTaskId` now includes the highest `docs/TASK_BOARD.md` row id in the counter floor, preventing backwards allocation when a capsule directory is missing. |
| Write preflight | Removed duplicate preflight-only id scan and routed task-create preview through the shared allocator. |
| Tests | Added regression tests for missing high-id capsule rows in both real task creation and write preflight. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | This does not auto-repair Task Board rows that point to missing capsules. | Accepted | `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-03 | Draft | Initial task scaffold. |
| 2026-07-03 | In Progress | Scoped fix to id allocation after manual deletion while preserving local collision retries. |
| 2026-07-03 | Done | Task Board row ids now participate in next-id allocation; ext4 focused/full validation and built CLI smoke passed. |
