# T-0648 0.5.0-rc.0 release readiness and publish preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0648 |
| Title | 0.5.0-rc.0 release readiness and publish preparation |
| Status | Done |
| Created | 2026-07-18T18:13 |
| Updated | 2026-07-18T18:22 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0648 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Prepare `hadara@0.5.0-rc.0` source, release notes, GitHub Release note artifact, and validation evidence for operator-controlled npm/GitHub publication. | Keep publish, GitHub Release publication, token loading, and installed-package recycle outside this source/readiness capsule. |

## Scope

| Boundary | Items |
|---|---|
| In | Version metadata, release notes, README release-status row, current-state release projection, GitHub Release note artifact, focused release validation, package-smoke dry-run evidence. |
| Out | npm publish, GitHub Release publication, Docker image push, installer execution, post-publish installed-package recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the release-readiness contract. | Done |
| 2 | Update source metadata and release documentation for `0.5.0-rc.0`. | Done |
| 3 | Validate release candidate source and record evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Source metadata identifies `hadara@0.5.0-rc.0`. | Done | ev:T-0648:fde14fbcea9b4d71bd5b5001 | `package.json`, `package-lock.json` |
| AC-2 | Release notes and GitHub Release note artifact summarize the 0.5.0-rc.0 changes and boundaries. | Done | ev:T-0648:1dbe2f6fdb334ca293963917 | `docs/RELEASE_NOTES.md`, `GITHUB_RELEASE_NOTE.md` |
| AC-3 | Focused status/session/package release validation passes from built `dist`. | Done | ev:T-0648:25b814358b374b8083791da1, ev:T-0648:d828f730140f4e8093ef6d8a, ev:T-0648:e7e62d6f7e294ccda8fa1ee6 | Validation table |
| AC-4 | Operator publish commands remain explicit and separate from source readiness. | Done | ev:T-0648:1dbe2f6fdb334ca293963917 | `scripts/release/manual-publish-rc.sh` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| TypeScript build | Yes | Passed | ev:T-0648:fde14fbcea9b4d71bd5b5001 |
| Focused status and session workflow tests | Yes | Passed | ev:T-0648:25b814358b374b8083791da1 |
| Context routing status ingress smoke | Yes | Passed | ev:T-0648:d828f730140f4e8093ef6d8a |
| Package smoke dry-run | Yes | Passed | ev:T-0648:e7e62d6f7e294ccda8fa1ee6 |
| Strict release gate dry-run | Yes | Passed | ev:T-0648:1dbe2f6fdb334ca293963917 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.5/0.5.0/HADARA_0_5_0_Status_Ingress_and_Evaluation_Development_Plan.md` | reference | active | 0.5.0 implementation contract and release gates. |
| `scripts/release/manual-publish-rc.sh` | implementation | active | Operator-controlled npm/GitHub release helper. |

## Changes

| Area | Summary |
|---|---|
| Release metadata | Prepare source package version `0.5.0-rc.0`. |
| Release docs | Add `0.5.0-rc.0` notes and GitHub Release note artifact. |
| Validation | Record focused release-readiness evidence before publish. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Publish `hadara@0.5.0-rc.0` on npm `next`, publish GitHub prerelease, then run installed-package recycle/dogfood. | Open | T-0648 handoff |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-18 | Draft | Initial task scaffold. |
| 2026-07-18 | In Progress | Preparing 0.5.0-rc.0 source metadata and release documentation. |
| 2026-07-18 | In Progress | Source metadata, release docs, focused validation, package smoke dry-run, and strict release gate are complete. |
| 2026-07-18 | Done | Prepared 0.5.0-rc.0 release readiness source and validation evidence for operator publication. |
