# T-0568 Fresh init dogfood from temporary project

## Identity

| Field | Value |
|---|---|
| ID | T-0568 |
| Title | Fresh init dogfood from temporary project |
| Status | Done |
| Created | 2026-07-10 |
| Updated | 2026-07-10 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Dogfood fresh HADARA init and lifecycle from `/tmp`. | Exercise all init profiles and close one governed toy-project capsule through finalize. |

## Scope

| Boundary | Items |
|---|---|
| In | Basic/standard/governed init smoke, generated-doc review, task selection/session/context/dogfood lifecycle, findings report. |
| Out | Fixing discovered product issues in this capsule. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Create fresh `/tmp` projects for all profiles. | Done |
| 2 | Run init/status/session/doc smokes. | Done |
| 3 | Implement and close a governed toy-project capsule. | Done |
| 4 | Record findings and evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | All three init profiles are exercised from `/tmp`. | Met | `ev:T-0568:2158875eac3347c89b5ab0ee` | `DOGFOOD_REPORT.md` |
| AC-2 | A governed toy project is taken from task create through closed-valid. | Met | `ev:T-0568:2158875eac3347c89b5ab0ee` | `DOGFOOD_REPORT.md` |
| AC-3 | UX issues and good results are documented for follow-up. | Met | `ev:T-0568:2158875eac3347c89b5ab0ee` | `DOGFOOD_REPORT.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Fresh init profile smokes | Yes | Passed | `ev:T-0568:2158875eac3347c89b5ab0ee` |
| Governed toy lifecycle | Yes | Passed | `ev:T-0568:2158875eac3347c89b5ab0ee` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User request | constraint | active | Run fresh init dogfood from a temporary folder. |
| `/tmp/hadara-t0568-*` | implementation-source | active | Disposable dogfood projects. |

## Changes

| Area | Summary |
|---|---|
| Dogfood report | Added profile, lifecycle, validation, finalize, and UX findings. |
| Local feedback | Added non-committed feedback note for actionable follow-up issues. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Fix stale bootstrap `nextWork` after first close. | Open | `DOGFOOD_REPORT.md` |
| RF-2 | Follow-up | Remove HADARA-dev-specific validation suggestions from generic context pack. | Open | `DOGFOOD_REPORT.md` |
| RF-3 | Follow-up | Improve selected-task status action when only finish bookkeeping remains. | Open | `DOGFOOD_REPORT.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-10 | Draft | Initial task scaffold. |
| 2026-07-10 | In Progress | Completed fresh init dogfood and documented findings. |
| 2026-07-10 | Done | Closed dogfood capsule after recording evidence and follow-up findings. |
