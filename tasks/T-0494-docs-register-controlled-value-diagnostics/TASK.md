# T-0494 docs register controlled value diagnostics

## Identity

| Field | Value |
|---|---|
| ID | T-0494 |
| Title | docs register controlled value diagnostics |
| Status | Done |
| Created | 2026-07-03 |
| Updated | 2026-07-03 |

## Goal

| Goal | Notes |
|---|---|
| Make `docs register` controlled-token failures self-correcting for agents and humans. | Failed JSON issues and help output should expose allowed values and suggestions without requiring a second docs-list or registry inspection pass. |

## Scope

| Boundary | Items |
|---|---|
| In | Add allowed-value metadata and suggestions to `docs.register` invalid-token issues; show controlled values in `help command docs.register`; make `docs register --help` render the same help; document reviewer-requested 0.4.1-rc.0 functional debt. |
| Out | Automatic alias correction; implementing `docs.complete-spec`; implementing `docs.mark-drift`; broader command-family controlled-value audit. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Export docs-register controlled values from the registry service. | Done |
| 2 | Add structured invalid-token issue fields and alias suggestions. | Done |
| 3 | Align `help command docs.register` and `docs register --help`. | Done |
| 4 | Add focused tests and built CLI smokes. | Done |
| 5 | Record 0.4.1-rc.0 functional debt separately. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Invalid `docs register` controlled-token JSON issues include `field`, `received`, and `allowedValues`. | Met | `ev:T-0494:e05199a733814fbe97abda8a`, `ev:T-0494:87f93c47f42448a0a0fcdf27` | `src/services/docs-registry.ts` |
| AC-2 | Common alias mistakes such as `guide`, `linked`, `project`, and `human-reviewed` return suggestions without auto-correcting. | Met | `ev:T-0494:e05199a733814fbe97abda8a`, `ev:T-0494:87f93c47f42448a0a0fcdf27` | `src/services/docs-registry.ts` |
| AC-3 | `help command docs.register` displays controlled values for kind, status, read-when, read-tier, authority, edit-policy, and drift. | Met | `ev:T-0494:e05199a733814fbe97abda8a`, `ev:T-0494:87f93c47f42448a0a0fcdf27` | `src/cli/help.ts` |
| AC-4 | `docs register --help` renders the same registry-backed command help before requiring mutation arguments. | Met | `ev:T-0494:e05199a733814fbe97abda8a`, `ev:T-0494:87f93c47f42448a0a0fcdf27` | `src/cli/docs.ts` |
| AC-5 | Reviewer functional debt for `0.4.1-rc.0` is captured separately. | Met | `ev:T-0494:26e15e37462143e08ef4d154` | `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Container ext4 focused tests and build | Yes | Passed | `ev:T-0494:e05199a733814fbe97abda8a` |
| Built CLI docs-register help and invalid-token smoke | Yes | Passed | `ev:T-0494:87f93c47f42448a0a0fcdf27` |
| 0.4.1-rc.0 functional debt document and registry entry | Yes | Passed | `ev:T-0494:26e15e37462143e08ef4d154` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Reviewer pasted feedback | constraint | implemented | `docs register` failure output lacked allowed token lists and forced a second discovery loop. |
| `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` | reference | implemented | Captures reviewer/dogfood functionality that should be handled in `0.4.1-rc.0`. |

## Changes

| Area | Summary |
|---|---|
| Docs registry service | Exported docs-register allowed values, reused them for parsing diagnostics, and added structured invalid-token issue fields. |
| CLI help | Added a `Controlled values` section for `docs.register` and routed `docs register --help` to the same renderer. |
| Schemas/tests | Allowed optional issue fields in `hadara.docs.register.v1` and added focused coverage for invalid tokens and help output. |
| Release debt docs | Added and registered the `0.4.1-rc.0` functional debt document. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Implement `docs.complete-spec` and completed-spec Required Reading lifecycle. | Deferred | `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` |
| RF-2 | Follow-up | Implement `docs.mark-drift` for existing registry entries. | Deferred | `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` |
| RF-3 | Follow-up | Audit other closed-token command options for the same allowed-values diagnostics pattern. | Deferred | `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-03 | Draft | Initial task scaffold. |
| 2026-07-03 | In Progress | Implemented docs-register controlled-value diagnostics and documented `0.4.1-rc.0` functional debt. |
