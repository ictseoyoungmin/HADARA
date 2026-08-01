# T-0741 Bind close marker to reviewed plan and validate full surface

## Identity

| Field | Value |
|---|---|
| ID | T-0741 |
| Title | Bind close marker to reviewed plan and validate full surface |
| Status | Done |
| Created | 2026-07-29T23:01 |
| Updated | 2026-08-01T18:44 |

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
| 5 | Run focused tests, full check, and package/consumer smoke. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Direct close-plan execute refuses with zero writes when marker/guard plan hash or task-local expected writes do not match the currently reviewed close plan. | Done | Focused transaction tests passed. | ev:T-0741:9c82e4cdb2174cc8a3c2c0be |
| AC-2 | Joined `argvPreview` byte length never exceeds `argvPreviewLimitBytes`, including the boundary where remaining space is smaller than the truncation marker. | Done | Focused validation-run tests passed. | ev:T-0741:9c82e4cdb2174cc8a3c2c0be |
| AC-3 | Docs state that `--compat v1` is additive compatibility retaining raw `argv`, not a byte-for-byte historical v1 projection. | Done | Focused command registry/schema tests passed. | ev:T-0741:9c82e4cdb2174cc8a3c2c0be |
| AC-4 | `npm run check` passes and evidence is recorded. | Met | Host full check passed: 129 files / 1042 tests plus 16 dev files / 135 tests. | ev:T-0741:5a4590fece4f41e9aa375056 |
| AC-5 | Package/consumer smoke passes and evidence is recorded, or blocked outcome is recorded with cause. | Met | Host package smoke passed Init v1 apply, installed doctor, command-surface drift, and generated-init-docs; host clean-checkout passed npm ci, build, full check, built CLI doctor/status, and strict release gate. | ev:T-0741:415cb1d782ee4e49a8cc96b3, ev:T-0741:c4ad7bbd70e8424d9b164659 |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Focused transaction and argv tests | Yes | Passed | exit 0 in 7290ms | ev:T-0741:9c82e4cdb2174cc8a3c2c0be |
| Full npm check | Yes | Passed | exit 0 in 38649ms | ev:T-0741:5a4590fece4f41e9aa375056 |
| Package/consumer smoke | Yes | Passed | Host package and clean-checkout smoke passed; prior failed projections are explicitly resolved. | ev:T-0741:415cb1d782ee4e49a8cc96b3, ev:T-0741:c4ad7bbd70e8424d9b164659, ev:T-0741:31ffd54b946f4ed3a35b4d55, ev:T-0741:a104869b9d9f4219b83c8ae9 |
| Package smoke | Yes | Passed | Host installed package smoke passed Init v1 plan/apply, doctor, command-surface drift, generated-init-docs, and cleanup. | ev:T-0741:415cb1d782ee4e49a8cc96b3 |
| Consumer clean-checkout smoke | Yes | Passed | Host clean checkout passed npm ci, build, full check, built CLI doctor/status, strict release gate, and cleanup. | ev:T-0741:c4ad7bbd70e8424d9b164659 |
| Package smoke dev surface | Yes | Passed | Same host dev-surface package smoke pass; sandbox-era failure is resolved. | ev:T-0741:31ffd54b946f4ed3a35b4d55 |
| Consumer clean-checkout smoke dev surface | Yes | Passed | Same host dev-surface clean-checkout pass; sandbox-era failure is resolved. | ev:T-0741:a104869b9d9f4219b83c8ae9 |

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
| Validation evidence | Focused close/validation/schema tests, host full check, installed package smoke, and clean-checkout consumer smoke pass. Historical failures are retained and explicitly resolved in the evidence projection. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | Binding marker expected writes to reviewed writes can break proof-pending recovery if evidence-append expected writes are not normalized carefully. | Closed | Covered by focused prefix-partial recovery and stale marker/write-set tests. |
| RF-2 | Follow-up | Full check previously failed on retired-state/current-doc contract tests after `PROJECT_STATE.md`, `AGENT_HANDOFF.md`, and `.hadara/state/current.json` were removed from default init/current-state surfaces. | Closed | ev:T-0741:5a4590fece4f41e9aa375056 |
| RF-3 | Follow-up | Smoke validation is intentionally exposed through repo-local dev-surface tooling documented in the current CLI contract; the prior direct `hadara smoke ...` attempt is historical and resolved. | Closed | ev:T-0741:31ffd54b946f4ed3a35b4d55 |
| RF-4 | Follow-up | Dev-surface package and clean-checkout smoke previously failed on installed doctor, command-surface, generated-init workflow, and check execution. | Closed | ev:T-0741:415cb1d782ee4e49a8cc96b3, ev:T-0741:c4ad7bbd70e8424d9b164659 |

## Close Summary

Ready for reviewed close. Close marker binding, argv byte-budget, and v1 compatibility wording are implemented; host full check, installed package smoke, and clean-checkout consumer smoke pass. Historical failed evidence is retained with explicit resolution tags.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-29 | Draft | Initial task scaffold. |
| 2026-07-29 | In Progress | Started final close marker binding and full-surface validation follow-up. |
| 2026-07-29 | In Progress | Implemented close marker/current-plan binding, argv marker reserve, and v1 compatibility wording; focused tests passed, but full check and package/consumer smoke are blocked by broader stale state-doc and command-surface drift. |
| 2026-08-01 | Done | T-0742 projections were cleaned up; Init v1 package smoke now applies its reviewed plan before doctor, doctor accepts the Init v1 READ_MAP fallback, and generated workflow validation accepts the current routing/ownership contract. Host full check, package smoke, and clean-checkout smoke passed; historical failures were explicitly resolved. |
