# T-0753 Repair RC2 Publication Truth and Tarball Provenance

## Identity

| Field | Value |
|---|---|
| ID | T-0753 |
| Title | Repair RC2 Publication Truth and Tarball Provenance |
| Status | Done |
| Created | 2026-08-08T16:46 |
| Updated | 2026-08-08T16:54 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Goal | Repair the RC2 publication helper and tracked release truth, and bind tarball package smoke evidence to the release artifact tarball hash. |

## Scope

| Boundary | Items |
|---|---|
| In | Shipped CLI evidence dispatch, RC prerelease flags, RC2 GitHub note/readiness state, package-smoke tarball SHA-256, release-gate provenance comparison, and focused regression coverage. |
| Out | Republishing npm, deleting releases, broad release redesign, and post-publish consumer recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement helper, publication truth, and tarball provenance changes. | Done |
| 3 | Validate and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Publish helper post-publish evidence reaches the shipped CLI dispatcher and RC GitHub creation/publication commands preserve prerelease metadata. | Met | `ev:T-0753:1d126ad6f5ef4a98a51075da`, `ev:T-0753:6a45b1b3abf940c9a1d6dbae` | Helper syntax/contract and focused regression tests passed. |
| AC-2 | RC2 public note and `RELEASE_READINESS.md` agree that npm/GitHub publication completed and RC2 is the current public prerelease. | Met | `ev:T-0753:a22a52bbd16b4b5b87679851` | npm `next`, GitHub `isDraft=false`, `isPrerelease=true`, and tag verified. |
| AC-3 | Tarball package smoke records SHA-256 and release readiness rejects a tarball smoke whose hash differs from the release artifact tarball. | Met | `ev:T-0753:6a45b1b3abf940c9a1d6dbae` | Tarball hash unit test and provenance mismatch regression passed. |
| AC-4 | Reviewed close completes as `closed-valid`. | Met | `ev:T-0753:6a45b1b3abf940c9a1d6dbae`; reviewed close proof follows. | Close proof |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Helper and release metadata tests | Yes | Passed | Build, tool typecheck, and focused helper/package/release tests passed. | `ev:T-0753:6a45b1b3abf940c9a1d6dbae` |
| Tarball provenance regression | Yes | Passed | Source tarball SHA-256 is recorded and compared with release artifact tarball hash. | `ev:T-0753:6a45b1b3abf940c9a1d6dbae` |
| Publication observation | Yes | Passed | RC2 GitHub prerelease metadata and npm current state verified. | `ev:T-0753:a22a52bbd16b4b5b87679851` |
| Helper and provenance tests | Yes | Passed | exit 0 in 13945ms | ev:T-0753:6a45b1b3abf940c9a1d6dbae |
| Publish helper dispatch and RC metadata contract | Yes | Passed | exit 0 in 34ms | ev:T-0753:1d126ad6f5ef4a98a51075da |
| RC2 publication observation | Yes | Passed | exit 0 in 1662ms | ev:T-0753:a22a52bbd16b4b5b87679851 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | Operator publish helper. |
| `tools/dev-surface/package-smoke.ts` | implementation-source | active | Package smoke source/provenance report. |
| `docs/RELEASE_READINESS.md` | constraint | active | Current publication truth and release gates. |

## Changes

| Area | Summary |
|---|---|
| Publish helper | Uses `dist/cli/main.js evidence add-command`; RC GitHub commands carry `--prerelease`. |
| Release truth | RC2 note/readiness state describes completed npm/GitHub publication. |
| Tarball provenance | Package smoke and release artifact expose comparable tarball SHA-256 values. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Post-publish installed consumer recycle remains separate. | Open | `docs/RELEASE_READINESS.md` |

## Close Summary

Pre-Close Operator Action: Review the helper dispatch, public RC2 metadata, and tarball provenance
regression evidence. No npm republish or release deletion is part of this capsule.

Post-Close Continuation: Create a separate post-publish consumer recycle capsule before stable
promotion.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-08 | Draft | Initial task scaffold. |
| 2026-08-08 | In Progress | Repairing publication truth, helper dispatch, and tarball provenance. |
| 2026-08-08 | Done | Helper, public RC2 metadata/body, and tarball provenance checks passed. |
