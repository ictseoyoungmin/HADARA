# T-0487 dogfood output UX pass

## Identity

| Field | Value |
|---|---|
| ID | T-0487 |
| Title | dogfood output UX pass |
| Status | Done |
| Created | 2026-07-03 |
| Updated | 2026-07-03 |

## Goal

| Goal | Notes |
|---|---|
| Reduce the highest-friction dogfood output surfaces before stable. | T-0479 measured `task status --json` as the longest recurring output and noted that validation-run plain output did not clearly separate child command and HADARA evidence summary. |

## Scope

| Boundary | Items |
|---|---|
| In | Add a compact selected-task `task status --summary-json` response for automation/human scanning; clarify non-JSON `validation run` output boundaries between child command execution and HADARA evidence recording; update tests and docs evidence. |
| Out | Redesigning all JSON envelopes, changing existing `--json` payloads, adding batch task creation, adding timing footers, or changing evidence semantics. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement the smallest useful slice. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Selected-task `task status --summary-json` emits a compact task-scoped payload with phase, readiness, blockers, primary next action, counts, and diagnostics. | Met | `ev:T-0487:7a5ab714f865434782d625c8` | `src/cli/task.ts` |
| AC-2 | Non-JSON `validation run` output clearly labels child command result, evidence recording, TASK.md sync state, and next actions. | Met | `ev:T-0487:7a5ab714f865434782d625c8` | `src/cli/validation.ts` |
| AC-3 | Focused tests, build/full check, and built CLI smokes pass with evidence. | Met | `ev:T-0487:7a5ab714f865434782d625c8`, `ev:T-0487:297d367095914b3095794bd1` | `tests/unit` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused output UX tests | Yes | Passed | `ev:T-0487:7a5ab714f865434782d625c8` |
| Build / full check or accepted ext4 substitute | Yes | Passed | `ev:T-0487:7a5ab714f865434782d625c8` |
| Built CLI smoke / diff hygiene | Yes | Passed | `ev:T-0487:7a5ab714f865434782d625c8`, `ev:T-0487:297d367095914b3095794bd1` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` | reference | implemented | Required capsule 6: dogfood output UX pass. |
| `tasks/T-0479-0-4-0-rc-0-installed-dogfood-mvp-build/artifacts/flowforge-mvp/reports/HADARA_DOGFOOD_REPORT.md` | reference | implemented | Identifies long `task status --json` output and validation-run boundary confusion. |
| `src/cli/task.ts` | implementation-source | implemented | Routes selected task status output. |
| `src/cli/validation.ts` | implementation-source | implemented | Formats non-JSON validation-run output. |

## Changes

| Area | Summary |
|---|---|
| Task status compact JSON | Added `task status --summary-json` for compact selection and selected-task payloads while preserving existing `--json`. |
| Validation text output | Split non-JSON `validation run` output into explicit child command, evidence, task-sync, and next-action sections. |
| Tests | Added focused coverage for compact selected-task status JSON, validation text boundaries, command registry docs, and workflow docs. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Batch task creation remains a separate post-stable candidate. | Open | `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` |
| RF-2 | Follow-up | Compact init JSON and timing footers remain out of scope for this stable pre-release slice. | Open | `tasks/T-0479-0-4-0-rc-0-installed-dogfood-mvp-build/artifacts/flowforge-mvp/reports/HADARA_DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-03 | Draft | Initial task scaffold. |
| 2026-07-03 | In Progress | Scoped the output UX pass to compact selected-task status JSON and clearer validation-run text boundaries. |
| 2026-07-03 | Done | Implemented output UX pass and validated with ext4 tests, full check, build, dist refresh, and built CLI smokes. |
