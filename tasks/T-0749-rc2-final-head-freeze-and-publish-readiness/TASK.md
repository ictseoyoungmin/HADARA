# T-0749 RC2 Final Head Freeze and Publish Readiness

## Identity

| Field | Value |
|---|---|
| ID | T-0749 |
| Title | RC2 Final Head Freeze and Publish Readiness |
| Status | Draft |
| Created | 2026-08-08T14:49 |
| Updated | 2026-08-08T14:49 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Bind RC2 release evidence to the exact current release inputs and freeze the final source head for publish readiness. | Source-only changes must invalidate release evidence while evidence-only capsule commits remain valid. Publication remains operator-controlled. |

## Scope

| Boundary | Items |
|---|---|
| In | Release input hashing; release artifact/package smoke/clean-checkout evidence binding; strict gate and dry-run checks; RC2 freeze/readiness/release-note/roadmap updates; final current-head validation. |
| Out | npm/GitHub/Docker publication, registry mutation, committed binary tarballs, new product features, and unrelated refactors. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the task contract. | Done |
| 2 | Implement release-input evidence binding and regression coverage. | Done |
| 3 | Update RC2 release documents and final-head acceptance evidence. | In Progress |
| 4 | Run reviewed close and record terminal proof. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Release artifact, package smoke, and clean-checkout evidence record the same current `releaseInputHash`; strict gate and release dry-run reject missing or mismatched hashes. | Pending | TBD | `tools/dev-surface/release-input.ts`, release evidence reports, strict gate |
| AC-2 | A release-input source change invalidates all three linked evidence types, while an evidence-only/docs commit does not invalidate them. | Pending | TBD | `tests/unit/release-dry-run.test.ts` |
| AC-3 | RC2 freeze/readiness, README, release notes, and roadmap identify T-0749 as the final head-freeze owner and include T-0748/T-0749 boundaries. | Pending | TBD | Release documents |
| AC-4 | Final current-head `npm run check`, release artifact/checksum/manifest, package smoke, clean-checkout smoke, installed lifecycle, strict gate, release dry-run, and publish dry-run pass without external mutation or a committed tarball. | Pending | TBD | Validation/evidence records |
| AC-5 | Reviewed proof-last close completes as `closed-valid`. | Pending | TBD | Close proof |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| `npm run check` | Yes | Not Run | Full source, type, schema, and test check. | TBD |
| Release artifact/checksum/manifest | Yes | Not Run | Final current-head package artifact and metadata. | TBD |
| Package/consumer smoke | Yes | Not Run | Installed package smoke from the final artifact. | TBD |
| Clean-checkout smoke | Yes | Not Run | Fresh checkout lifecycle smoke. | TBD |
| Installed lifecycle | Yes | Not Run | Reproducible installed-package lifecycle script and result. | TBD |
| Strict release gate | Yes | Not Run | All linked evidence hashes match current inputs. | TBD |
| Release dry-run | Yes | Not Run | Readiness report is current-head clean. | TBD |
| Publish dry-run | Yes | Not Run | Publish command plans without mutation. | TBD |
| Full npm check | Yes | Passed | exit 0 in 54478ms | ev:T-0749:4566954aa8e44dd686fa277f |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/RC2_CONTRACT_FREEZE.md` | constraint | active | Final RC2 freeze boundary and publish separation. |
| `docs/RELEASE_READINESS.md` | constraint | active | Required release gates and evidence surfaces. |
| `docs/ARCHITECTURE.md` | reference | active | Release tooling and portable store boundaries. |

## Changes

| Area | Summary |
|---|---|
| Release evidence | Added canonical release-input hashing and cross-artifact freshness enforcement. |
| Regression coverage | Added source-change invalidation and evidence-only freshness coverage. |
| Release documents | Moved RC2 state from T-0747 to the final T-0749 head-freeze contract. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | External publication remains operator-controlled after this capsule. | Open | `docs/RELEASE_READINESS.md` |

## Close Summary

Pre-Close Operator Action: Review the final release dry-run and publish dry-run reports; no external
publication is included in this capsule.

Post-Close Continuation: Terminal for T-0749. Publication, if approved, is a separate operator task.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-08 | Draft | Initial task scaffold. |
| 2026-08-08 | In Progress | Bound release evidence to current release inputs and began final RC2 freeze refresh. |
