# T-0762 Integrate RC3 Reviewer Feedback

## Identity

| Field | Value |
|---|---|
| ID | T-0762 |
| Title | Integrate RC3 Reviewer Feedback |
| Status | Done |
| Created | 2026-08-09T21:53 |
| Updated | 2026-08-09T22:00 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0762 --json`.

## Goal

| Goal | Notes |
|---|---|
| Apply the RC3 reviewer corrections in one audited capsule: preserve the Init v1 fail-closed authority implementation, strengthen its regression coverage, and align read-routing/release specs with the actual delegated and clean-checkout boundaries. | No release publication, registry mutation, or edits to closed historical capsule identity/status are in scope. |

## Scope

| Boundary | Items |
|---|---|
| In | Init v1 partial/invalid-state regression coverage, canonical validator consumer coverage, RC3 delegated-work/evidence/handoff wording, RC3 clean-checkout gate wording, full check, focused tests, evidence, and proof-last close. |
| Out | npm/GitHub mutation, installed recycle, reopening T-0758/T-0759, changing closed capsule identity/status, and unrelated architecture/runtime changes. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define reviewer corrections and inspect the existing T-0760 authority implementation. | Done |
| 2 | Add regression coverage and correct the two RC3 specification boundaries. | Done |
| 3 | Run focused/full validation, update evidence and handoff, and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Init v1 authority selection requires the valid `.hadara/project.json` + `.hadara/documents.json` pair; partial or invalid states expose `INIT_V1_PARTIAL_STATE`/canonical validation blockers and do not expose a writable inferred authority across doctor, docs read, docs write, and init upgrade paths. | Met | ev:T-0760:4c7302fc2dbe41348c3ce504; ev:T-0762:edb59c75f9a641b2b72cc037 | `src/init/model.ts`; `src/init/doctor.ts`; `src/services/docs-registry.ts`; `src/init/planner.ts` |
| AC-2 | Canonical Init v1 validators are covered by regression tests for malformed project/documents state and blocked docs mutation. | Met | ev:T-0762:edb59c75f9a641b2b72cc037 | `tests/unit/init-v1-model.test.ts`; `tests/unit/docs-registry.test.ts` |
| AC-3 | RC3 delegated acceptance is described as delegated work + evidence + handoff, explicitly stopping before `task close` and operator release actions. | Met | ev:T-0762:d7a81294672e42b6b5892533 | `docs/specs/0.5.0-rc3/01_RC3_Read_Routing_and_Delegated_Lifecycle.md` |
| AC-4 | RC3 clean-checkout acceptance lists install/build/full check/doctor/task status only and states that strict gate runs separately after evidence attachment. | Met | ev:T-0762:d7a81294672e42b6b5892533 | `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md`; `docs/RELEASE_READINESS.md` |
| AC-5 | Focused tests, full repository validation, evidence lint, and capsule close pass. | Met | ev:T-0762:edb59c75f9a641b2b72cc037; ev:T-0762:6c72feeea3fc46eda2f0bd73; ev:T-0762:bba4e245fe2743c4b3c0dacd | Validation table and close proof |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused Init v1 authority and docs mutation tests | Yes | Passed | Focused Init v1 reviewer regression tests passed. ev:T-0762:edb59c75f9a641b2b72cc037 |
| Full repository validation | Yes | Passed | `npm run check` passed. ev:T-0762:6c72feeea3fc46eda2f0bd73 |
| Evidence lint and git diff check | Yes | Passed | Evidence lint reported no issues and git diff --check passed. ev:T-0762:bba4e245fe2743c4b3c0dacd |
| RC3 specification boundary alignment | Yes | Passed | Delegated scope and clean-checkout/strict-gate ordering match the executable contracts. ev:T-0762:d7a81294672e42b6b5892533 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5.0-rc3/00_Init_V1_Document_Routing_Authority.md` | constraint | active | Canonical two-file authority and fail-closed boundary. |
| `docs/specs/0.5.0-rc3/01_RC3_Read_Routing_and_Delegated_Lifecycle.md` | constraint | active | Delegated work/evidence/handoff acceptance wording. |
| `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md` | constraint | active | RC3 consumer and strict-gate ordering wording. |
| T-0760 implementation and proof | reference | active | Existing shared Init v1 state reader and regression baseline. |

## Changes

| Area | Summary |
|---|---|
| Init v1 authority | Added reviewer-focused regression coverage while preserving the T-0760 shared state-reader implementation. |
| RC3 acceptance contracts | Corrected delegated scope and clean-checkout/strict-gate ordering to match executable behavior. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | T-0758/T-0759 remain immutable historical capsules; this capsule owns only shared contract corrections and new evidence. | Accepted | T-0758; T-0759 |

## History

| Date | State | Note |
|---|---|---|
| 2026-08-09 | Draft | Initial task scaffold. |
| 2026-08-09 | In Progress | Reviewer corrections routed into one capsule: verify T-0760 fail-closed implementation, add regression coverage, and correct RC3 contract wording. |
| 2026-08-09 | Ready for close | Regression coverage, RC3 spec corrections, focused/full validation, evidence lint, and diff check passed. |
| 2026-08-09 | Done | Close-source documents prepared for proof-last close; no external release mutation was performed. |

## Close Summary

T-0760's shared Init v1 authority boundary is covered by additional malformed-state and no-write regression checks. RC3 delegated acceptance now names delegated work/evidence/handoff rather than full lifecycle, and clean-checkout validation explicitly runs strict gate afterward as a separate check.
