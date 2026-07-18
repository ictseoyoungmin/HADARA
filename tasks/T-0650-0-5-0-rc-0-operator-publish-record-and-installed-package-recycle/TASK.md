# T-0650 0.5.0-rc.0 operator publish record and installed-package recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0650 |
| Title | 0.5.0-rc.0 operator publish record and installed-package recycle |
| Status | Done |
| Created | 2026-07-18T19:39 |
| Updated | 2026-07-18T19:47 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0650 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Record the completed 0.5.0-rc.0 operator publication and verify the published installed package. | npm and GitHub publication were performed outside this capsule by the operator; this capsule records the outcome and recycles the installed package from the public registry. |

## Scope

| Boundary | Items |
|---|---|
| In | Verify npm registry metadata for `hadara@0.5.0-rc.0`, verify the public GitHub prerelease, run installed-package recycle for `hadara@next`, and record release evidence. |
| Out | Source code changes, release-note rewriting beyond already-published notes, and a new release artifact build. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Verify npm registry metadata for the published rc package. | Done |
| 2 | Verify GitHub Release publication state and target commit. | Done |
| 3 | Run installed-package recycle for `hadara@next` and attach reduced public evidence. | Done |
| 4 | Resolve sandbox/network-only failed evidence with the successful recycle evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | npm registry exposes `hadara@0.5.0-rc.0`, `next` points to `0.5.0-rc.0`, and `latest` remains stable `0.4.6`. | Done | ev:T-0650:e83a40c81c404d8284e695a1 | npm registry metadata |
| AC-2 | GitHub Release `v0.5.0-rc.0` is public, prerelease, and targets `b4223f7782d813ec7420c104b883ebc48ffb71f9`. | Done | ev:T-0650:8e33a891e3f74f1d8b76c8ae | GitHub Release |
| AC-3 | Installed-package recycle verifies the published `hadara@next` package from npm in an isolated consumer workspace. | Done | ev:T-0650:b738ff91e7c64d5db95b4df7 | `artifacts/package-recycle/2026-07-18T10-44-35.028Z-summary.json` |
| AC-4 | Earlier sandbox/network-only recycle failure is explicitly resolved by later passing recycle evidence. | Done | ev:T-0650:613eeea103b445be8bdfb083 | ev:T-0650:ec5b0ec3a2264a7e9c08c764 |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| npm registry published rc0 metadata | Yes | Passed | ev:T-0650:e83a40c81c404d8284e695a1 |
| GitHub Release public prerelease verification | Yes | Passed | ev:T-0650:8e33a891e3f74f1d8b76c8ae |
| Installed-package recycle from `hadara@next` | Yes | Passed | ev:T-0650:b738ff91e7c64d5db95b4df7 |
| Recycle sandbox failure resolution | Yes | Passed | ev:T-0650:613eeea103b445be8bdfb083 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| User publish transcript | constraint | active | npm and GitHub publication completed before this capsule. |
| tasks/T-0649-0-5-0-full-suite-regression-cleanup-before-rc-publish/GITHUB_RELEASE_NOTE.md | reference | active | Superseding GitHub release notes applied after rc publication. |
| tasks/T-0650-0-5-0-rc-0-operator-publish-record-and-installed-package-recycle/artifacts/package-recycle/2026-07-18T10-44-35.028Z-summary.json | reference | active | Reduced public installed-package recycle summary. |

## Changes

| Area | Summary |
|---|---|
| Release record | Recorded npm and GitHub rc publication evidence for `0.5.0-rc.0`. |
| Installed package | Verified the public `hadara@next` package through package recycle in an isolated workspace. |
| Evidence | Resolved the initial sandbox/network recycle failure with later passing recycle evidence. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | `validation run` and non-escalated package recycle can fail under sandbox/network restrictions while direct or escalated commands pass. | Open | `.hadara/local/feedback/T-0649-validation-wrapper-timeout-for-full-suite.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-18 | Draft | Initial task scaffold. |
| 2026-07-18 | In Progress | Verified npm/GitHub publication and installed-package recycle evidence. |
| 2026-07-18 | Done | Release publication record and installed-package recycle were recorded with resolved residual evidence. |
