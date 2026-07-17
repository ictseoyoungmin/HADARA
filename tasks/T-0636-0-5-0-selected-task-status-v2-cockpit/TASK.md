# T-0636 0.5.0 selected-task status v2 cockpit

## Identity

| Field | Value |
|---|---|
| ID | T-0636 |
| Title | 0.5.0 selected-task status v2 cockpit |
| Status | Done |
| Created | 2026-07-17 |
| Updated | 2026-07-17 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0636 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Implement 050-C04 selected-task status v2. | Make `hadara task status --task T-XXXX --json` emit `hadara.task.status.v2` by default while preserving the old workbench report through explicit compatibility. |

## Scope

| Boundary | Items |
|---|---|
| In | Selected-task v2 schema/read model, CLI routing for `--task`, explicit workbench v1 compatibility mode, focused tests and schema registration. |
| Out | Public task close mutation, session-start public removal, deeper close-engine changes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define selected-task v2 contract. | Done |
| 2 | Implement selected-task v2 wrapper and CLI routing. | Done |
| 3 | Add schema and focused tests. | Done |
| 4 | Validate and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara task status --task T-XXXX --json` emits `hadara.task.status.v2` by default with phase, health, readiness, and one primary action. | Done | ev:T-0636:868e2bfde039494b85deccdf | `docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md` |
| AC-2 | Existing `hadara.task.workbench.v1` remains available through explicit `--compat v1` with migration metadata. | Done | ev:T-0636:ad6cd5d69307422a90cebea3 | 050-C04 compatibility |
| AC-3 | The v2 cockpit exposes close/evidence evaluation state without treating command `ok` as readiness. | Done | ev:T-0636:4db398db0ad64028880ce42b | 050-C04 |
| AC-4 | Focused tests and TypeScript build pass. | Done | ev:T-0636:4db398db0ad64028880ce42b; ev:T-0636:6dbae4cabedd4785aea88219 | Validation section |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused selected-task status tests | Yes | Passed | ev:T-0636:4db398db0ad64028880ce42b |
| TypeScript build | Yes | Passed | ev:T-0636:6dbae4cabedd4785aea88219 |
| Built CLI selected-task v2 smoke | Yes | Passed | ev:T-0636:868e2bfde039494b85deccdf |
| Built CLI selected-task v1 compatibility smoke | Yes | Passed | ev:T-0636:ad6cd5d69307422a90cebea3 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md | implementation-source | active | 050-C04 selected-task cockpit. |
| docs/specs/0.5/all/HADARA_0_5_X_Combined_Lifecycle_Usecases.md | reference | active | Lifecycle phase/use-case mapping. |

## Changes

| Area | Summary |
|---|---|
| Selected-task v2 read model | Added `hadara.task.status.v2` with phase, health, readiness, evaluations, counts, primary action, and workbench v1 compatibility metadata. |
| CLI routing | `hadara task status --task T --json` now emits v2 by default; `--compat v1` preserves the old workbench report. |
| Tests/schema | Added schema registration and focused tests for default v2, compat v1, missing-task, and detail mode behavior. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Public `session start` removal remains for 050-C05 after selected-task v2 lands. | Open | 050-C05 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-17 | Draft | Initial task scaffold. |
| 2026-07-17 | In Progress | Started selected-task status v2 implementation. |
| 2026-07-17 | Done | Implemented selected-task status v2 cockpit with workbench v1 compatibility. |
