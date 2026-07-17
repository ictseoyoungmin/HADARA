# T-0635 0.5.0 task-selection status v2 projection

## Identity

| Field | Value |
|---|---|
| ID | T-0635 |
| Title | 0.5.0 task-selection status v2 projection |
| Status | Done |
| Created | 2026-07-17 |
| Updated | 2026-07-17 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0635 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Implement 050-C03 task-selection status v2. | Make `hadara task status --json` without `--task` return `hadara.taskSelection.status.v2` by default while preserving the old selection report through explicit compatibility. |

## Scope

| Boundary | Items |
|---|---|
| In | Task-selection v2 schema/read model, no-selected-task CLI routing, explicit v1 compatibility mode, focused tests and schema registration. |
| Out | Selected-task cockpit v2, task close mutation, public `session start` removal. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task-selection v2 contract. | Done |
| 2 | Implement no-selected-task v2 projection and CLI routing. | Done |
| 3 | Add schema and focused tests. | Done |
| 4 | Validate and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara task status --json` without `--task` emits `hadara.taskSelection.status.v2` with one primary action or terminal idle state. | Done | ev:T-0635:6d3053b41c2b4a8c9381e7f2 | `docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md` |
| AC-2 | Existing `hadara.task.status.v1` select-work report remains available through an explicit compatibility route with migration metadata. | Done | ev:T-0635:55d39aba2aff4f21ae823902 | 050-C03 compatibility |
| AC-3 | The v2 projection preserves recommendation source, required reading, write boundary, review requirement, and create/inspect/review action distinction. | Done | ev:T-0635:c9301105ecae4850b9792586 | 050-C03 |
| AC-4 | Focused tests and TypeScript build pass. | Done | ev:T-0635:c9301105ecae4850b9792586; ev:T-0635:3bc40f7466f14b14a3cb5c30 | Validation section |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused task-selection status tests | Yes | Passed | ev:T-0635:c9301105ecae4850b9792586 |
| TypeScript build | Yes | Passed | ev:T-0635:3bc40f7466f14b14a3cb5c30 |
| Built CLI task-selection v2 smoke | Yes | Passed | ev:T-0635:6d3053b41c2b4a8c9381e7f2 |
| Built CLI task-selection v1 compatibility smoke | Yes | Passed | ev:T-0635:55d39aba2aff4f21ae823902 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md | implementation-source | active | 050-C03 task-selection projection. |
| docs/specs/0.5/all/HADARA_0_5_X_Combined_Agent_Loop_Plan.md | reference | active | Combined command-loop intent. |

## Changes

| Area | Summary |
|---|---|
| Task-selection v2 read model | Added `hadara.taskSelection.status.v2` for no-selected-task mode with phase, health, readiness, evaluations, recommendations, source details, and primary action boundary. |
| CLI routing | `hadara task status --json` without `--task` now emits v2; `hadara task status --compat v1 --json` preserves the old select-work report with migration metadata. |
| Tests/schema | Added schema registration and focused CLI/service tests for default v2 and explicit v1 compatibility. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Selected-task cockpit stays v1 until the 050-C04 capsule. | Open | 050-C04 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-17 | Draft | Initial task scaffold. |
| 2026-07-17 | In Progress | Started task-selection status v2 implementation. |
| 2026-07-17 | Done | Implemented no-selected-task status v2 projection with explicit v1 compatibility. |
