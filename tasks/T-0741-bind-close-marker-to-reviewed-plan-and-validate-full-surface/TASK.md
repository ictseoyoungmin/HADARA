# T-0741 Bind close marker to reviewed plan and validate full surface

## Identity

| Field | Value |
|---|---|
| ID | T-0741 |
| Title | Bind close marker to reviewed plan and validate full surface |
| Status | In Progress |
| Created | 2026-07-29T23:01 |
| Updated | 2026-07-29T23:13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Close the final close transaction and validation v2 promotion blockers. | Bind persisted close operation markers to the currently reviewed close plan, fix argv preview hard byte-budget edge cases, clarify v1 compatibility shape, and run full check plus package/consumer smoke evidence. |

## Scope

| Boundary | Items |
|---|---|
| In | Enforce `guard.planHash === currentPlanHash` and marker plan hash binding before mutation. |
| In | Enforce normalized equality between marker/guard task-local expected writes and the reviewed close-plan guarded writes. |
| In | Fix argv truncation so marker text never pushes joined `argvPreview` beyond the byte limit. |
| In | Document that validation.run v1 compatibility is additive v2-plus-argv compatibility, not historical exact-key projection. |
| In | Run and record `npm run check` plus package/consumer smoke evidence. |
| Out | New close transaction architecture, CI/GitHub Actions, and broad release publication. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define reviewer-requested plan and acceptance. | Done |
| 2 | Bind proof guard/marker authority to the current reviewed close plan. | Done |
| 3 | Fix argv preview hard byte-budget edge case. | Done |
| 4 | Clarify validation.run v1 compatibility documentation. | Done |
| 5 | Run focused tests, full check, and package/consumer smoke. | Blocked |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Direct close-plan execute refuses with zero writes when marker/guard plan hash or task-local expected writes do not match the currently reviewed close plan. | Done | Focused transaction tests passed. | ev:T-0741:9c82e4cdb2174cc8a3c2c0be |
| AC-2 | Joined `argvPreview` byte length never exceeds `argvPreviewLimitBytes`, including the boundary where remaining space is smaller than the truncation marker. | Done | Focused validation-run tests passed. | ev:T-0741:9c82e4cdb2174cc8a3c2c0be |
| AC-3 | Docs state that `--compat v1` is additive compatibility retaining raw `argv`, not a byte-for-byte historical v1 projection. | Done | Focused command registry/schema tests passed. | ev:T-0741:9c82e4cdb2174cc8a3c2c0be |
| AC-4 | `npm run check` passes and evidence is recorded. | Failed | Full check ran and failed on retired-state/current-doc contract drift unrelated to close marker binding. | ev:T-0741:b102de440e5442df9b46c215 |
| AC-5 | Package/consumer smoke passes and evidence is recorded, or blocked outcome is recorded with cause. | Blocked | Built/source CLI `hadara smoke` routing is missing; dev-surface package smoke fails on doctor/command-surface/init workflow drift; clean-checkout smoke fails at `npm run check`. | ev:T-0741:2e59d414d1544554902b0587, ev:T-0741:b4d64d8c66d646c69cd12ae8, ev:T-0741:fb833b588fda4f7983068292, ev:T-0741:3a2c4244c8e54ff08a69c4b5 |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused transaction and argv tests | Yes | Passed | exit 0 in 7290ms | ev:T-0741:9c82e4cdb2174cc8a3c2c0be |
| Full npm check | Yes | Failed | exit 1 in 31204ms | ev:T-0741:b102de440e5442df9b46c215 |
| Package/consumer smoke | Yes | Failed | Replaced by split built/source CLI routing attempts and dev-surface smoke runs below. | ev:T-0741:2e59d414d1544554902b0587, ev:T-0741:b4d64d8c66d646c69cd12ae8, ev:T-0741:fb833b588fda4f7983068292, ev:T-0741:3a2c4244c8e54ff08a69c4b5 |
| Package smoke | Yes | Failed | exit 1 in 50ms | ev:T-0741:2e59d414d1544554902b0587 |
| Consumer clean-checkout smoke | Yes | Failed | exit 1 in 53ms | ev:T-0741:b4d64d8c66d646c69cd12ae8 |
| Package smoke dev surface | Yes | Failed | exit 6 in 3153ms | ev:T-0741:fb833b588fda4f7983068292 |
| Consumer clean-checkout smoke dev surface | Yes | Failed | exit 6 in 86411ms | ev:T-0741:3a2c4244c8e54ff08a69c4b5 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer T-0740 follow-up note | background | active | Defines marker/current-plan binding, argv marker-reserve boundary, v1 compat wording, and full validation requirements. |
| T-0740 implementation | implementation-source | active | Current persisted authority and validation v2 implementation to tighten. |

## Changes

| Area | Summary |
|---|---|
| Close proof authority | Pre-mutation proof authority now receives the current reviewed close plan hash and guarded writes, refuses stale marker/guard plan hashes before mutation, and compares normalized pending task-local expected writes against the reviewed guarded writes. |
| Validation argv preview | Truncation now reserves marker bytes before appending a bounded argument so the joined preview cannot exceed `argvPreviewLimitBytes` when remaining capacity is smaller than the marker. |
| Validation contract docs | `validation.run --compat v1` is documented as additive v1 compatibility carrying raw `argv` plus v2 metadata, not a historical exact-key v1 projection. |
| Validation evidence | Focused close/validation/schema tests pass; full check and release/package smoke expose unrelated retired-state and command-surface blockers that must be handled in the next capsule. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Binding marker expected writes to reviewed writes can break proof-pending recovery if evidence-append expected writes are not normalized carefully. | Closed | Covered by focused prefix-partial recovery and stale marker/write-set tests. |
| RF-2 | Follow-up | Full check fails on retired-state/current-doc contract tests after `PROJECT_STATE.md`, `AGENT_HANDOFF.md`, and `.hadara/state/current.json` were removed from default init/current-state surfaces. | Open | ev:T-0741:b102de440e5442df9b46c215 |
| RF-3 | Follow-up | Public command registry advertises `hadara smoke package` and `hadara smoke clean-checkout`, but source/built CLI dispatcher does not route those commands. | Open | ev:T-0741:2e59d414d1544554902b0587, ev:T-0741:b4d64d8c66d646c69cd12ae8 |
| RF-4 | Follow-up | Dev-surface package smoke fails on installed doctor, command-surface drift, and generated init workflow doc checks; clean-checkout smoke fails at full `npm run check`. | Open | ev:T-0741:fb833b588fda4f7983068292, ev:T-0741:3a2c4244c8e54ff08a69c4b5 |

## Close Summary

Not closed. Close marker binding, argv byte-budget, and v1 compatibility wording are implemented and focused tests pass, but full check and release smoke blockers remain. The next capsule must clear retired-state/current-doc test contracts and smoke routing drift before T-0741 can close.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-29 | Draft | Initial task scaffold. |
| 2026-07-29 | In Progress | Started final close marker binding and full-surface validation follow-up. |
| 2026-07-29 | In Progress | Implemented close marker/current-plan binding, argv marker reserve, and v1 compatibility wording; focused tests passed, but full check and package/consumer smoke are blocked by broader stale state-doc and command-surface drift. |
