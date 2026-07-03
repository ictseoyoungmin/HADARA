# T-0491 0.4.0 stable GitHub Release draft

## Identity

| Field | Value |
|---|---|
| ID | T-0491 |
| Title | 0.4.0 stable GitHub Release draft |
| Status | Done |
| Created | 2026-07-03 |
| Updated | 2026-07-03 |

## Goal

| Goal | Notes |
|---|---|
| Create and verify the stable `v0.4.0` GitHub Release draft. | Use the T-0490 stable release note artifact and keep the release as a draft for operator review. |

## Scope

| Boundary | Items |
|---|---|
| In | Check existing `v0.4.0` release state, create the stable draft release, verify tag/draft/prerelease/target fields, and record evidence. |
| Out | Publishing the draft release publicly, changing npm package state, changing source release contents, or publishing the RC GitHub prerelease. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm `v0.4.0` is not already present on GitHub. | Done |
| 2 | Create the stable GitHub Release draft from the T-0490 release note. | Done |
| 3 | Verify release metadata and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Stable GitHub Release draft `v0.4.0` exists. | Met | `ev:T-0491:11c7e0bbbaa348efbb4c4174` | `gh release view v0.4.0` |
| AC-2 | Draft metadata is correct: draft yes, prerelease no, target commit recorded. | Met | `ev:T-0491:11c7e0bbbaa348efbb4c4174` | `gh release view --json` |
| AC-3 | Validation evidence is recorded in the task capsule. | Met | `ev:T-0491:c1d1638d717642cb9ac64887` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Existing release precheck | Yes | Passed | `ev:T-0491:11c7e0bbbaa348efbb4c4174` |
| GitHub release metadata verification | Yes | Passed | `ev:T-0491:11c7e0bbbaa348efbb4c4174` |
| Harness done validation | Yes | Passed | `ev:T-0491:c1d1638d717642cb9ac64887` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0490-stable-0-4-0-publish-preparation/GITHUB_RELEASE_NOTE.md` | implementation-source | implemented | Stable release notes used for the draft body. |
| `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` | constraint | implemented | T-0490 stable publish is complete; GitHub draft was skipped and is now handled here. |
| GitHub `ictseoyoungmin/HADARA` | reference | implemented | `v0.4.0` draft was created after the repository redirect from `HADARA-dev` to `HADARA`. |

## Changes

| Area | Summary |
|---|---|
| GitHub Release | Created draft `v0.4.0` titled `HADARA 0.4.0`, targeting `205e9aad0e01ea5332dbdca39c10403c00e845be`, with `isDraft=true` and `isPrerelease=false`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Publicly publish the stable GitHub Release only after operator review. | Open | GitHub draft release |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-03 | Draft | Initial task scaffold. |
| 2026-07-03 | In Progress | Confirmed no existing `v0.4.0` release; preparing stable draft creation. |
| 2026-07-03 | Done | Created and verified the stable GitHub Release draft. |
