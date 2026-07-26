# T-0706 Init v1 Mutation Authority

## Identity

| Field | Value |
|---|---|
| ID | T-0706 |
| Title | Init v1 Mutation Authority |
| Status | Done |
| Targets | project |
| Created | 2026-07-26T20:54 |
| Updated | 2026-07-26T20:59 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Let current mutation commands recognize a valid Init v1 project without restoring legacy scaffold metadata. | Reuse the canonical project/document validators; keep `hadaraProtocol: 0.4` only as a legacy compatibility fallback. |

## Scope

| Boundary | Items |
|---|---|
| In | Init v1 authority detection at the shared mutation guard; legacy 0.4 compatibility; malformed/partial authority rejection; fresh init → task create regression and built CLI smoke. |
| Out | Removing legacy scaffold readers, changing Init v1 persistence schemas, Validation redesign, Docker resource mode, failure classification, or docs archival. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Characterize the shared legacy mutation guard and Init v1 authority contract. | Done |
| 2 | Accept validated Init v1 authority before the legacy scaffold fallback and add focused regressions. | Done |
| 3 | Validate fresh init/task lifecycle ingress, record evidence, update handoff/state, and close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A complete fresh Init v1 project can run `task create` without `.hadara/scaffold.json`. | Met | `ev:T-0706:b835038366494070ac87e429` | User-observed regression |
| AC-2 | Invalid or partial Init v1 authority remains fail-closed, while legacy `hadaraProtocol: 0.4` projects remain compatible. | Met | `ev:T-0706:26d05aee6b2b421999162d08` | `docs/SECURITY_MODEL.md` |
| AC-3 | Focused tests, full validation, and built CLI fresh-init smoke pass with current `dist`. | Met | `ev:T-0706:86988fb579774c37840eab29`, `ev:T-0706:d6a51a7205a74d029f745f98` | `docs/TEST_STRATEGY.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Focused mutation authority tests | Yes | Passed | ev:T-0706:26d05aee6b2b421999162d08 |
| Full repository validation | Yes | Passed | ev:T-0706:86988fb579774c37840eab29 |
| Built CLI fresh Init v1 task-create smoke | Yes | Passed | ev:T-0706:b835038366494070ac87e429 |
| Diff and evidence hygiene | Yes | Passed | ev:T-0706:d6a51a7205a74d029f745f98 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| Current user instruction | decision | active | Replace obsolete 0.4 metadata with Init v1 authority, then continue the ordered improvements. |
| `src/schemas/init-project.schema.json` | implementation-source | active | `schemaVersion` plus lifecycle version define the current project contract. |
| `docs/ARCHITECTURE.md` | constraint | active | Preserve the Init v1 transaction and portable project boundary. |
| `docs/SECURITY_MODEL.md` | constraint | active | Mutation commands must fail closed on invalid or ambiguous authority. |
| `docs/TEST_STRATEGY.md` | constraint | active | Prove focused, full, and built CLI behavior. |

## Changes

| Area | Summary |
|---|---|
| Mutation authority | The shared guard now validates canonical Init v1 `project.json` and `documents.json` before falling back to legacy `hadaraProtocol: 0.4`. |
| Failure boundary | Missing, partial, malformed, or schema-invalid Init v1 authority remains blocked before writes. |
| Regression coverage | Added fresh Init v1 task-create and invalid-authority tests; refreshed `dist` through the full build. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Continue with Validation state/detail separation after fresh lifecycle ingress works. | Open | User instruction |
| RF-2 | Follow-up | Shared projection policy, low-resource Docker, failure classification, and docs archival remain ordered later capsules. | Open | User instruction |

## Close Summary

Fresh Init v1 projects can now mutate through validated project authority without legacy scaffold metadata.

## History

| Date | State | Note |
|---|---|---|
| 2026-07-26 | Draft | Initial task scaffold. |
| 2026-07-26 | In Progress | Confirmed fresh Init v1 status works but task mutation is blocked by the legacy scaffold-only guard. |
| 2026-07-26 | Done | Validated Init v1 authority now permits task mutation; legacy compatibility and fail-closed checks remain. |
