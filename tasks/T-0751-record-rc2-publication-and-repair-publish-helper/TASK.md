# T-0751 Record RC2 Publication and Repair Publish Helper

## Identity

| Field | Value |
|---|---|
| ID | T-0751 |
| Title | Record RC2 Publication and Repair Publish Helper |
| Status | Done |
| Created | 2026-08-08T15:55 |
| Updated | 2026-08-08T15:58 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Record the completed RC2 publication and repair the publish helper's post-publish evidence command. | Publication already occurred outside this capsule; this task performs no new publication. |

## Scope

| Boundary | Items |
|---|---|
| In | Replace undefined `run_hadara` calls, verify npm/GitHub publication state, and record post-publish evidence and release metadata. |
| Out | Re-publishing npm, creating another GitHub release, deleting releases, and post-publish consumer recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Repair helper and record publication state. | Done |
| 3 | Validate and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The manual publish helper records post-publish evidence through the defined developer-surface runner. | Met | `ev:T-0751:10370fbfbce64ed0b605de45` | `scripts/release/manual-publish-rc.sh` |
| AC-2 | npm `0.5.0-rc.2` on `next` and GitHub `v0.5.0-rc.2` publication are independently verified and no duplicate release remains. | Met | `ev:T-0751:10370fbfbce64ed0b605de45` | Registry and GitHub observations |
| AC-3 | Reviewed close completes as `closed-valid`. | Met | `ev:T-0751:10370fbfbce64ed0b605de45`; reviewed close proof follows. | Close proof |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Helper syntax/tests | Yes | Passed | Helper syntax is valid and no undefined runner remains. | `ev:T-0751:10370fbfbce64ed0b605de45` |
| npm publication observation | Yes | Passed | npm version and `next` dist-tag verified. | `ev:T-0751:10370fbfbce64ed0b605de45` |
| GitHub release observation | Yes | Passed | Canonical public `v0.5.0-rc.2` verified; no duplicate release listed. | `ev:T-0751:10370fbfbce64ed0b605de45` |
| Post-publish helper and registry observation | Yes | Passed | exit 0 in 1293ms | ev:T-0751:10370fbfbce64ed0b605de45 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | Publish helper command surface. |
| npm registry | reference | active | Published RC2 observation. |
| GitHub Releases | reference | active | Published RC2 observation. |

## Changes

| Area | Summary |
|---|---|
| Publish helper | Replaced undefined post-publish `run_hadara` calls with `run_dev_surface`. |
| Publication record | Recorded npm `next` and GitHub RC2 publication state. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Post-publish installed consumer recycle remains a separate capsule. | Open | `docs/RELEASE_READINESS.md` |

## Close Summary

Pre-Close Operator Action: Review the external publication observations; no publication mutation is
performed by T-0751.

Post-Close Continuation: Create a separate post-publish recycle capsule before stable promotion.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-08 | Draft | Initial task scaffold. |
| 2026-08-08 | Done | Recorded completed RC2 publication and repaired the publish helper evidence path. |
