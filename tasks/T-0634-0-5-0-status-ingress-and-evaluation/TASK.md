# T-0634 0.5.0 status ingress and evaluation

## Identity

| Field | Value |
|---|---|
| ID | T-0634 |
| Title | 0.5.0 status ingress and evaluation |
| Status | Done |
| Created | 2026-07-17 |
| Updated | 2026-07-17 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0634 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Implement the first 0.5.0 status ingress slice. | Make `hadara status --json` emit lifecycle-aware v2 project status by default while preserving explicit v1 compatibility routes. |

## Scope

| Boundary | Items |
|---|---|
| In | Shared status evaluation vocabulary, project status v2 read model, default CLI routing, explicit v1 compatibility mode, focused schema/tests/docs for the status ingress slice. |
| Out | Public task close transaction, task close command migration, broad structured-state migration, full session-start removal beyond status command routing/docs touched by this slice. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the 0.5.0 status ingress contract. | Done |
| 2 | Add shared status v2 evaluation/readiness/next-action model. | Done |
| 3 | Route default `status --json` to v2 and keep v1 compatibility explicit. | Done |
| 4 | Add schema and focused tests. | Done |
| 5 | Update docs touched by the command contract. | Done |
| 6 | Validate and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara status --json` emits `hadara.project.status.v2` by default with one primary next action or explicit idle terminal state. | Done | ev:T-0634:42fcbebc9c014652947f3e61 | `docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md` |
| AC-2 | Existing `hadara.ops.status.v1` remains available through an explicit compatibility route with migration metadata. | Done | ev:T-0634:573b66d48db540f9bb8f7784 | 0.5.0 compatibility policy |
| AC-3 | Status v2 distinguishes command `ok`, project `health`, readiness, evaluation state, and write boundary. | Done | ev:T-0634:d2b3eaf8c787400abbd4219a | 050-C01/C02 |
| AC-4 | Focused tests and TypeScript build pass. | Done | ev:T-0634:d2b3eaf8c787400abbd4219a; ev:T-0634:6ae4618500d54ef0afca34be | Validation section |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused status ingress tests | Yes | Passed | ev:T-0634:d2b3eaf8c787400abbd4219a |
| TypeScript build | Yes | Passed | ev:T-0634:6ae4618500d54ef0afca34be |
| Built CLI status v2 smoke | Yes | Passed | ev:T-0634:42fcbebc9c014652947f3e61 |
| Built CLI status v1 compatibility smoke | Yes | Passed | ev:T-0634:573b66d48db540f9bb8f7784 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md | implementation-source | active | 0.5.0 status ingress contract. |
| docs/specs/0.5/all/HADARA_0_5_X_Combined_Agent_Loop_Plan.md | reference | active | Combined command-loop intent. |
| docs/specs/0.5/all/HADARA_0_5_X_Combined_Lifecycle_Usecases.md | reference | active | Lifecycle/status use cases. |

## Changes

| Area | Summary |
|---|---|
| Status v2 read model | Added `hadara.project.status.v2` with phase, health, readiness, evaluations, sources, compatibility metadata, and one primary next action. |
| CLI routing | `hadara status --json` and `--detail full` now emit v2 unless `--compat v1` is explicitly requested; v1 reports include migration metadata. |
| Tests/schema/docs | Added project status schema registration, focused status tests, feature-smoke alignment, and capability registry help metadata. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Full public `session start` removal may require a separate 0.5.0 capsule after status v2 is stable. | Open | 050-C05 |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-17 | Draft | Initial task scaffold. |
| 2026-07-17 | In Progress | Started 0.5.0 status v2 ingress implementation. |
| 2026-07-17 | Done | Implemented status v2 default ingress with explicit v1 compatibility and focused validation. |
