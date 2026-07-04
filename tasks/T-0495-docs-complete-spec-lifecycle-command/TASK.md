# T-0495 docs complete-spec lifecycle command

## Identity

| Field | Value |
|---|---|
| ID | T-0495 |
| Title | docs complete-spec lifecycle command |
| Status | Done |
| Created | 2026-07-04 |
| Updated | 2026-07-04 |

## Goal

| Goal | Notes |
|---|---|
| Implement the first 0.4.1-rc.0 docs-governance command for completed implementation specs. | `docs.complete-spec` should move registered specs out of active/default routing through a reviewed registry-only mutation. |

## Scope

| Boundary | Items |
|---|---|
| In | `docs complete-spec` service, CLI handler, command registry activation, schema fixture, focused tests, built CLI smoke, and stable 0.4.0 feedback debt capture. |
| Out | `docs.mark-drift`; general registry correction path; `handoff update` bug fix; low-ceremony finalize; broader TASK.md enum help. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define completed-spec registry transition policy. | Done |
| 2 | Implement dry-run-first `docs.complete-spec` report and guarded execute. | Done |
| 3 | Wire CLI, command registry, schema fixtures, and tests. | Done |
| 4 | Record stable 0.4.0 feedback in the 0.4.1 debt document. | Done |
| 5 | Validate, record evidence, and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `docs complete-spec --json` produces a dry-run report for registered `kind: spec` documents without writing the registry. | Met | `ev:T-0495:e8d2f59d2c4348f0b2503b9a`, `ev:T-0495:85d467427c3d4142aa709bf7` | `src/services/docs-cleanup.ts` |
| AC-2 | Execute mode requires a matching reviewed registry `beforeHash` and writes only `.hadara/docs-registry.json`. | Met | `ev:T-0495:e8d2f59d2c4348f0b2503b9a`, `ev:T-0495:85d467427c3d4142aa709bf7` | `src/services/docs-cleanup.ts` |
| AC-3 | Completed specs transition to non-default routing metadata: historical status, `implemented-reference` read tier, `only-when-linked`, `requiredReading:false`, and `activeForTasks` including the implementing task. | Met | `ev:T-0495:e8d2f59d2c4348f0b2503b9a` | `tests/unit/docs-complete-spec.test.ts` |
| AC-4 | `docs.complete-spec` is active in command help/registry with schema `hadara.docs.completeSpec.v1`. | Met | `ev:T-0495:e8d2f59d2c4348f0b2503b9a`, `ev:T-0495:85d467427c3d4142aa709bf7` | `src/services/capability-registry.ts`, `src/schemas/docs-complete-spec.schema.json` |
| AC-5 | Stable 0.4.0 usage feedback is captured as 0.4.1 debt and positives to preserve. | Met | `ev:T-0495:a5d3f212ed4b4e1fb80cf421` | `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Container ext4 focused tests and build | Yes | Passed | `ev:T-0495:e8d2f59d2c4348f0b2503b9a` |
| Built CLI complete-spec help/dry-run/stale-hash smoke | Yes | Passed | `ev:T-0495:85d467427c3d4142aa709bf7` |
| Stable feedback debt document update | Yes | Passed | `ev:T-0495:a5d3f212ed4b4e1fb80cf421` |
| Final capsule hygiene | Yes | Passed | `ev:T-0495:e4c59d022ffa4c9dacff0bc6` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` | implementation-source | implemented | FD-001 selected `docs.complete-spec` as the first 0.4.1-rc.0 functional debt item. |
| Stable 0.4.0 usage feedback | constraint | implemented | Positive feedback and friction points were captured without expanding this capsule beyond `docs.complete-spec`. |
| `src/services/docs-cleanup.ts` | implementation-source | implemented | Existing docs cleanup before-hash mutation pattern was reused. |

## Changes

| Area | Summary |
|---|---|
| Docs cleanup service | Added `createDocsCompleteSpecReport` with dry-run, before-hash guarded execute, spec/task validation, and registry-only writes. |
| CLI and registry | Added `docs complete-spec` handler and changed command metadata from planned/disabled to experimental/schema-backed. |
| Schemas/tests | Added `hadara.docs.completeSpec.v1` fixture and focused unit coverage for service, CLI, registry, help, and schema index. |
| Debt docs | Added stable 0.4.0 feedback positives plus FD-007 through FD-010. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | `docs.mark-drift` remains planned and should be the next docs-governance command. | Open | `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` |
| RF-2 | Follow-up | General registry correction remains unresolved; `docs.complete-spec` only handles completed specs. | Open | `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` |
| RF-3 | Follow-up | `handoff update` overwrite bug is high priority from stable 0.4.0 feedback. | Open | `docs/RELEASE_0_4_1_RC0_FUNCTIONAL_DEBT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-04 | Draft | Initial task scaffold. |
| 2026-07-04 | In Progress | Implemented and validated `docs.complete-spec`; captured stable 0.4.0 feedback debt. |
