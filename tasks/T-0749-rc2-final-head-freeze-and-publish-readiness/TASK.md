# T-0749 RC2 Final Head Freeze and Publish Readiness

## Identity

| Field | Value |
|---|---|
| ID | T-0749 |
| Title | RC2 Final Head Freeze and Publish Readiness |
| Status | Done |
| Created | 2026-08-08T14:49 |
| Updated | 2026-08-08T15:18 |

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
| 3 | Update RC2 release documents and final-head acceptance evidence. | Done |
| 4 | Run reviewed close and record terminal proof. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Release artifact, package smoke, and clean-checkout evidence record the same current `releaseInputHash`; strict gate and release dry-run reject missing or mismatched hashes. | Met | `ev:T-0749:18293ac8813a4cd18b527bd3`, `ev:T-0749:795cd0cbd3de403387961990`, `ev:T-0749:55888462d6254c2bad4509cc`, `ev:T-0749:0973493e484e4b1d8374f47f`, `ev:T-0749:b1f515044957444d9a6f6bf7` | `tools/dev-surface/release-input.ts`, release evidence reports, strict gate |
| AC-2 | A release-input source change invalidates all three linked evidence types, while an evidence-only/docs commit does not invalidate them. | Met | `tests/unit/release-dry-run.test.ts`, full check `ev:T-0749:4566954aa8e44dd686fa277f` | Source-drift and evidence-only regression coverage |
| AC-3 | RC2 freeze/readiness, README, release notes, and roadmap identify T-0749 as the final head-freeze owner and include T-0748/T-0749 boundaries. | Met | `ev:T-0749:4566954aa8e44dd686fa277f`, T-0749 source/document commit `1af5c012` | Release documents |
| AC-4 | Final current-head `npm run check`, release artifact/checksum/manifest, package smoke, clean-checkout smoke, installed lifecycle, strict gate, release dry-run, and publish dry-run pass without external mutation or a committed tarball. | Met | `ev:T-0749:4566954aa8e44dd686fa277f`, `ev:T-0749:55888462d6254c2bad4509cc`, `ev:T-0749:18293ac8813a4cd18b527bd3`, `ev:T-0749:795cd0cbd3de403387961990`, `ev:T-0749:f872d39216cd4f4aaae0afe4`, `ev:T-0749:0973493e484e4b1d8374f47f`, `ev:T-0749:b1f515044957444d9a6f6bf7`, `ev:T-0749:779a4494fdce4bd6a2b8dc5a` | Final artifact, smoke, lifecycle, gate, and dry-run evidence |
| AC-5 | Reviewed proof-last close completes as `closed-valid`. | Met | `ev:T-0749:061d582213be4e89851ef78e`, proof-last execute follows this reviewed plan. | Close proof |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| `npm run check` | Yes | Passed | Full source, type, schema, and test check; final clean-checkout rerun also passed. | `ev:T-0749:4566954aa8e44dd686fa277f`, clean-checkout artifact |
| Release artifact/checksum/manifest | Yes | Passed | Final current-head package artifact and metadata. | `ev:T-0749:55888462d6254c2bad4509cc`, final report artifact |
| Package/consumer smoke | Yes | Passed | Installed package smoke from the final artifact. | `ev:T-0749:18293ac8813a4cd18b527bd3`, package summary artifact |
| Clean-checkout smoke | Yes | Passed | Fresh checkout lifecycle smoke. | `ev:T-0749:795cd0cbd3de403387961990`, clean-checkout summary artifact |
| Installed lifecycle | Yes | Passed | exit 0 in 3507ms | ev:T-0749:f872d39216cd4f4aaae0afe4 |
| Strict release gate | Yes | Passed | exit 0 in 852ms | ev:T-0749:0973493e484e4b1d8374f47f |
| Release dry-run | Yes | Passed | exit 0 in 1017ms | ev:T-0749:b1f515044957444d9a6f6bf7 |
| Publish dry-run | Yes | Passed | exit 0 in 980ms | ev:T-0749:779a4494fdce4bd6a2b8dc5a |
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
publication is included in this capsule. Final release input hash is
`sha256:4fdc075ee6b68638067925bc233c621212e8543fa3f8be231256bc944eba8c7a`.

Post-Close Continuation: Terminal for T-0749. Publication, if approved, is a separate operator task.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-08 | Draft | Initial task scaffold. |
| 2026-08-08 | In Progress | Bound release evidence to current release inputs and began final RC2 freeze refresh. |
| 2026-08-08 | Done | Final artifact, package/clean-checkout smoke, installed lifecycle, strict gate, release dry-run, and publish dry-run passed without publication mutation; reviewed close is the remaining terminal operation. |
