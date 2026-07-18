# T-0646 0.5.0 task-selection status v2 and selected-task cockpit

## Identity

| Field | Value |
|---|---|
| ID | T-0646 |
| Title | 0.5.0 task-selection status v2 and selected-task cockpit |
| Status | Done |
| Created | 2026-07-18T17:13 |
| Updated | 2026-07-18T17:23 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0646 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Harden the already-landed 050-C03/C04 status v2 reports against the final 0.5.0 plan. | Preserve existing v2 routing while adding explicit task-selection precedence and selected-task cockpit phase vocabulary. |

## Scope

| Boundary | Items |
|---|---|
| In | `hadara.taskSelection.status.v2` selection metadata, `hadara.task.status.v2` cockpit phase mapping, schemas, focused tests, build, built CLI smoke. |
| Out | Public `session start` removal, task close transaction mutation, full structured-state migration. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Verify T-0635/T-0636 already implemented the default v2 status shells. | Done |
| 2 | Add missing C03/C04 explicitness: precedence metadata and cockpit phase mapping. | Done |
| 3 | Validate focused schemas/tests, TypeScript build, and built CLI smoke. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Task-selection status v2 exposes explicit precedence, selected source, source explanation, and primary action id. | Met | ev:T-0646:4091d6b9b1e84fa2b10e67fb, ev:T-0646:f217cd7b34a54271b7467164 | `src/services/task-selection-status-v2.ts` |
| AC-2 | Selected-task status v2 maps public phases to `author-task`, `plan-work`, `implement`, `validate`, `repair-evidence`, `close-ready`, `blocked`, `closed-valid`, and `closed-stale`. | Met | ev:T-0646:4091d6b9b1e84fa2b10e67fb | `src/services/task-status-v2.ts` |
| AC-3 | Selected-task status v2 keeps old workbench phase as source metadata and hides active guidance for terminal closed-valid state. | Met | ev:T-0646:4091d6b9b1e84fa2b10e67fb | `tests/unit/task-workbench.test.ts` |
| AC-4 | Validation evidence is recorded. | Met | ev:T-0646:4091d6b9b1e84fa2b10e67fb, ev:T-0646:a882339f0ff0418387c640d9, ev:T-0646:f217cd7b34a54271b7467164 | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| npm test -- tests/unit/task-workbench.test.ts tests/unit/schema-fixtures.test.ts tests/unit/status-json.test.ts | Yes | Passed | ev:T-0646:4091d6b9b1e84fa2b10e67fb |
| npm run build | Yes | Passed | ev:T-0646:a882339f0ff0418387c640d9 |
| Built CLI `task status --json` and `task status --task T-0646 --json` smoke | Yes | Passed | ev:T-0646:f217cd7b34a54271b7467164 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md` | implementation-source | active | Defines 050-C03 task-selection and 050-C04 selected-task cockpit requirements. |
| `tasks/T-0635-0-5-0-task-selection-status-v2-projection/TASK.md` | reference | active | Previous v2 selection shell implementation. |
| `tasks/T-0636-0-5-0-selected-task-status-v2-cockpit/TASK.md` | reference | active | Previous v2 selected-task shell implementation. |

## Changes

| Area | Summary |
|---|---|
| Task-selection v2 | Added `selection` metadata with precedence chain, selected source, source explanation, and primary action id. |
| Selected-task v2 | Added `cockpit` metadata and mapped public phase vocabulary to the 0.5.0 plan while preserving source workbench phase. |
| Schemas/tests | Updated v2 schemas and focused task-workbench tests for selection precedence, phase mapping, terminal hidden sections, and stale close state. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | 050-C05 public `session start` removal remains next in the 0.5.0 plan. | Open | `docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-18 | Draft | Initial task scaffold. |
| 2026-07-18 | In Progress | Added explicit C03/C04 v2 metadata and started validation. |
| 2026-07-18 | Done | Focused tests, build, and built CLI smoke passed. |
