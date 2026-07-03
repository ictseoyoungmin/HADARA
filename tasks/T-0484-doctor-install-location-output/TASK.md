# T-0484 doctor install location output

## Identity

| Field | Value |
|---|---|
| ID | T-0484 |
| Title | doctor install location output |
| Status | Done |
| Created | 2026-07-03 |
| Updated | 2026-07-03 |

## Goal

| Goal | Notes |
|---|---|
| Add install-origin diagnostics to `hadara doctor`. | Stable 0.4.0 operators should be able to tell which installed CLI binary/package root/Node runtime is being used before publishing or recycling. |

## Scope

| Boundary | Items |
|---|---|
| In | `hadara doctor` JSON/text output for executable path, resolved executable path, package root when discoverable, package version, Node executable path/version, and npm install/registry hints. |
| Out | npm registry mutation, GitHub Release work, timing-harness fixes, task id counter changes, broad release readiness, or secret-bearing npm config inspection. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement the smallest useful slice. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `hadara doctor --json` exposes non-secret install-origin fields for CLI executable, resolved executable, package root/version, Node executable/version, registry, and install hints. | Met | `ev:T-0484:8b9c1b5d460c43168e8a67b0` | `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` |
| AC-2 | Non-JSON `hadara doctor` includes a compact install-location block without replacing existing path/check output. | Met | `ev:T-0484:8b9c1b5d460c43168e8a67b0` | `src/cli/doctor.ts` |
| AC-3 | Unit or smoke validation covers the new report fields and text output. | Met | `ev:T-0484:9c02d42dfceb46bdb8cd545d` | `tests/unit/doctor.test.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused doctor tests | Yes | Passed | `ev:T-0484:9c02d42dfceb46bdb8cd545d` |
| Full check | Yes | Passed | `ev:T-0484:9c02d42dfceb46bdb8cd545d` |
| Built CLI doctor smoke | Yes | Passed | `ev:T-0484:8b9c1b5d460c43168e8a67b0` |
| Done-level harness | Yes | Passed | `ev:T-0484:ab8f4a1f34d042ec9eb2b449` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` | reference | implemented | Required capsule 3: doctor install-location output before stable. |
| `docs/AGENT_HANDOFF.md` | reference | implemented | Routes next work to doctor install location hardening. |
| `src/cli/doctor.ts` | implementation-source | implemented | Current doctor report and text formatter. |

## Changes

| Area | Summary |
|---|---|
| CLI doctor | Added additive `installation` diagnostics and `runtime.nodePath` while preserving existing doctor fields. |
| Tests | Extended doctor unit tests for JSON fields, package-root detection, unknown-root fallback, and text install block. |
| Build output | Refreshed workspace `dist` from the passing container ext4 build. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Timing measurement root cause remains the next pre-stable capsule after doctor output. | Open | `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-03 | Draft | Initial task scaffold. |
| 2026-07-03 | In Progress | Scoped doctor install-location output for stable pre-release cleanup. |
| 2026-07-03 | Done | Implemented doctor install-location output and validated with ext4 full check plus built CLI smoke. |
