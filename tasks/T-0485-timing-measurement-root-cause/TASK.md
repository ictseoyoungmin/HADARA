# T-0485 timing measurement root cause

## Identity

| Field | Value |
|---|---|
| ID | T-0485 |
| Title | timing measurement root cause |
| Status | Done |
| Created | 2026-07-03 |
| Updated | 2026-07-03 |

## Goal

| Goal | Notes |
|---|---|
| Identify and remove the negative duration source from dogfood timing. | The T-0479 report showed `-1.26s`, `-0.60s`, and `-0.66s` durations; stable 0.4.0 should not rely on wall-clock timing that can move backward. |

## Scope

| Boundary | Items |
|---|---|
| In | Root-cause the negative T-0479 dogfood durations, patch the committed dogfood harness to use monotonic timing, and harden current CLI duration helpers against wall-clock drift. |
| Out | Re-running the full T-0479 installed-package dogfood MVP, adding user-facing timing footers, optimizing slow commands, or changing release/publish behavior. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement the smallest useful slice. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The negative durations are traced to a concrete harness or CLI timing mechanism and documented in the capsule. | Met | `ev:T-0485:c2aaa91b5fa74d5bb063085d` | `reports/HADARA_DOGFOOD_REPORT.md` |
| AC-2 | Duration collection touched by this capsule uses a monotonic elapsed timer or clamps against negative elapsed values. | Met | `ev:T-0485:c541e1fabdc54b35a1be92e5` | `src/core/timing.ts` |
| AC-3 | Tests or script checks cover the monotonic timer and the dogfood harness timing contract. | Met | `ev:T-0485:c541e1fabdc54b35a1be92e5` | `tests/unit` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused timing/script tests | Yes | Passed | `ev:T-0485:c541e1fabdc54b35a1be92e5` |
| Full check or accepted ext4 substitute | Yes | Passed | `ev:T-0485:c541e1fabdc54b35a1be92e5` |
| Built CLI smoke / diff hygiene | Yes | Passed | `ev:T-0485:c2aaa91b5fa74d5bb063085d` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` | reference | implemented | Required capsule 4: timing measurement root cause before stable. |
| `tasks/T-0479-0-4-0-rc-0-installed-dogfood-mvp-build/artifacts/flowforge-mvp/reports/HADARA_DOGFOOD_REPORT.md` | reference | implemented | Shows negative per-capsule and command durations. |
| `tasks/T-0479-0-4-0-rc-0-installed-dogfood-mvp-build/artifacts/run_flowforge_dogfood.sh` | implementation-source | implemented | Dogfood wrapper now measures elapsed time with `process.hrtime.bigint()` and clamps reversed readings to zero. |
| `src/core/timing.ts` | implementation-source | implemented | Shared monotonic elapsed timer helper added over `performance.now()` with nonnegative rounding. |
| `src/services/validation-run.ts` | implementation-source | implemented | Validation duration now uses the shared monotonic helper. |
| CLI diagnostics and release/package timing services | implementation-source | implemented | Existing CLI elapsed metadata paths now use the shared monotonic helper instead of direct wall-clock subtraction. |

## Changes

| Area | Summary |
|---|---|
| Dogfood harness | Replaced separate `Date.now()` probes with `process.hrtime.bigint()` duration capture and nonnegative clamping. |
| CLI timing | Added `startMonotonicTimer()` and routed validation, task diagnostics, release diagnostics, package/recycle/smoke, clean-checkout, release artifact, dev docker-check, and evidence lock timeout elapsed paths through it. |
| Tests | Added focused unit coverage for the monotonic timer and dogfood harness timing contract. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Optional user-facing command timing footer remains a later UX feature, not part of this root-cause fix. | Open | `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-03 | Draft | Initial task scaffold. |
| 2026-07-03 | In Progress | Scoped timing root-cause work to dogfood harness and CLI elapsed-time hardening. |
| 2026-07-03 | Done | Root cause confirmed as dogfood harness wall-clock timing; harness and CLI elapsed paths hardened and ext4 validation passed. |
