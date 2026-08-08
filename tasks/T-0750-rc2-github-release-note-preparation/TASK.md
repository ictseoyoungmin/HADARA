# T-0750 RC2 GitHub Release Note Preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0750 |
| Title | RC2 GitHub Release Note Preparation |
| Status | Done |
| Created | 2026-08-08T15:45 |
| Updated | 2026-08-08T15:46 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prepare the tracked GitHub Release note and publish-helper handoff for `0.5.0-rc.2`. | Do not publish or mutate external release targets. |

## Scope

| Boundary | Items |
|---|---|
| In | RC2 GitHub Release note, publish-helper command guidance, and evidence of note readiness. |
| Out | npm publish, GitHub Release creation, registry mutation, and post-publish recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Write and review the RC2 GitHub Release note. | Done |
| 3 | Record validation and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | A tracked `GITHUB_RELEASE_NOTE.md` describes RC2 highlights, validation, and publication boundaries without private paths or tokens. | Met | `ev:T-0750:18a7dd497148451abd2aa266` | `GITHUB_RELEASE_NOTE.md` |
| AC-2 | The publish helper can be invoked with the note path and no external mutation is performed by this capsule. | Met | `ev:T-0750:18a7dd497148451abd2aa266` | `scripts/release/manual-publish-rc.sh` |
| AC-3 | Reviewed close completes as `closed-valid`. | Met | `ev:T-0750:18a7dd497148451abd2aa266`; reviewed close proof follows. | Close proof |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Note content review | Yes | Passed | Note is non-empty, redacted, and helper syntax is valid. | `ev:T-0750:18a7dd497148451abd2aa266` |
| Publish helper dry-run | Yes | Passed | Note path exists and is accepted as the helper input; no publication executed. | `ev:T-0750:18a7dd497148451abd2aa266` |
| GitHub Release note review | Yes | Passed | exit 0 in 23ms | ev:T-0750:18a7dd497148451abd2aa266 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/RELEASE_NOTES.md` | reference | active | RC2 public release scope and boundaries. |
| `docs/RELEASE_READINESS.md` | constraint | active | Publish helper and operator boundary. |

## Changes

| Area | Summary |
|---|---|
| Release note | Added the tracked RC2 GitHub Release note for operator use. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | External publication remains operator-controlled. | Open | `docs/RELEASE_READINESS.md` |

## Close Summary

Pre-Close Operator Action: Review the RC2 note and run publication only through the approved helper.

Post-Close Continuation: Terminal. Publication and post-publish recycle require separate operator capsules.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-08 | Draft | Initial task scaffold. |
| 2026-08-08 | Done | Created a dedicated publish-preparation capsule because T-0749 did not contain the public release note artifact. |
