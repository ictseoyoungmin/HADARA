# T-0583 v0.4.4 stable source and release preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0583 |
| Title | v0.4.4 stable source and release preparation |
| Status | In Progress |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prepare stable `hadara@0.4.4` source, release docs, helper guidance, and GitHub Release note artifact without publishing. | Use T-0580/T-0581/T-0582 evidence to promote the RC line to stable source readiness while keeping npm/GitHub mutation operator-controlled. |

## Scope

| Boundary | Items |
|---|---|
| In | Retarget package metadata and lockfile to `0.4.4`; update README, release notes/readiness, release helper examples, current-state projections, and stable GitHub release note artifact; run release-readiness validation. |
| Out | npm publish, GitHub Release publication, Docker/PyPI publishing, token loading, installed-package recycle after stable publish. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define stable 0.4.4 source/readiness contract. | Done |
| 2 | Retarget source metadata, package-facing docs, and helper examples to stable `0.4.4`. | Done |
| 3 | Write stable GitHub Release note artifact with concrete changes and boundaries. | Done |
| 4 | Run release-readiness validation and record evidence. | In Progress |
| 5 | Close the capsule and hand off operator publish commands. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `package.json`, lockfile, and built CLI report stable `0.4.4`. | Met | `ev:T-0583:5518f956424c431a96f9206a` | `package.json`, `package-lock.json`, `dist/cli/main.js version` |
| AC-2 | README, release notes, release readiness, and helper examples describe stable `0.4.4` and preserve operator-controlled publish boundaries. | Met | `ev:T-0583:5518f956424c431a96f9206a` | README/release docs/scripts |
| AC-3 | A stable GitHub Release note artifact exists for `v0.4.4` with concrete changes, validation, and boundaries. | Met | `ev:T-0583:5518f956424c431a96f9206a` | `GITHUB_RELEASE_NOTE.md` |
| AC-4 | Release artifact/package/clean-checkout/release gate/dry-run checks pass or any blocker is fixed before handoff. | Pending | TBD | release validation evidence |
| AC-5 | Stable publish remains explicitly operator-controlled after this source-preparation capsule. | Pending | TBD | `HANDOFF.md`, helper scripts |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Version/source metadata | Yes | Passed | `ev:T-0583:5518f956424c431a96f9206a` |
| Focused release/docs tests | Yes | Blocked | Host run hit known `spawnSync bash EPERM`; Docker full suite passed. |
| Docker build / full check / dist refresh | Yes | Passed | `ev:T-0583:7124c5762ff64ec5b166cb69` |
| Package smoke | Yes | Passed | `ev:T-0583:7124c5762ff64ec5b166cb69`; initial sandbox attempt failed on npm cache EROFS and approved rerun passed. |
| Clean checkout smoke | Yes | Passed | `ev:T-0583:7124c5762ff64ec5b166cb69` |
| Release artifact / release dry-run / publish dry-run | Yes | Not Run | Requires clean source-prep commit first. |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/state/current.json` | reference | active | Current release and next-work canon. |
| `docs/RELEASE_READINESS.md` | reference | active | Release boundary and historical status source. |
| `docs/RELEASE_NOTES.md` | reference | active | Package-facing release notes. |
| `tasks/T-0582-v0-4-4-major-cli-dogfood-before-stable/DOGFOOD_REPORT.md` | reference | active | Final pre-stable major CLI dogfood evidence. |
| `tasks/T-0581-v0-4-4-stable-promotion-decision/TASK.md` | reference | active | Stable promotion decision baseline. |

## Changes

| Area | Summary |
|---|---|
| Version metadata | Retargeted package metadata and lockfile from `0.4.4-rc.0` to stable `0.4.4`. |
| Package-facing docs | Updated README, Getting Started, release notes, and release readiness for stable `0.4.4`. |
| Release helpers | Updated publish helper examples to the T-0583 stable path while preserving manual `--execute` as the mutation boundary. |
| Release artifact | Added stable `v0.4.4` GitHub Release note artifact. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Boundary | This capsule must not publish npm or GitHub Release artifacts; operator runs the publish helper after review. | Open | `HANDOFF.md` |
| RF-2 | Risk | `release artifact` requires a clean source-prep commit; run it after this source state is committed. | Open | `ev:T-0583:b4c516001bd248fabf5fe8f3` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Started stable `0.4.4` source/readiness preparation after T-0582 major CLI dogfood. |
| 2026-07-13 | In Progress | Retargeted stable source/docs/helpers, refreshed dist, and passed package/clean-checkout smoke; release artifact remains after clean commit. |
