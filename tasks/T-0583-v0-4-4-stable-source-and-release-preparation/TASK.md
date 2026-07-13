# T-0583 v0.4.4 stable source and release preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0583 |
| Title | v0.4.4 stable source and release preparation |
| Status | Done |
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
| 4 | Run release-readiness validation and record evidence. | Done |
| 5 | Close the capsule and hand off operator publish commands. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `package.json`, lockfile, and built CLI report stable `0.4.4`. | Met | `ev:T-0583:5518f956424c431a96f9206a` | `package.json`, `package-lock.json`, `dist/cli/main.js version` |
| AC-2 | README, release notes, release readiness, and helper examples describe stable `0.4.4` and preserve operator-controlled publish boundaries. | Met | `ev:T-0583:5518f956424c431a96f9206a` | README/release docs/scripts |
| AC-3 | A stable GitHub Release note artifact exists for `v0.4.4` with concrete changes, validation, and boundaries. | Met | `ev:T-0583:5518f956424c431a96f9206a` | `GITHUB_RELEASE_NOTE.md` |
| AC-4 | Release artifact/package/clean-checkout/release gate/dry-run checks pass or any blocker is fixed before handoff. | Met | `ev:T-0583:f0ed9b5cb09f429198437689`, `ev:T-0583:6ef3051d7e7948d4a614c11e`, `ev:T-0583:21cef95476e142c49e884b63`, `ev:T-0583:7b86c5b10f054f9d9a8be71d` | release validation evidence |
| AC-5 | Stable publish remains explicitly operator-controlled after this source-preparation capsule. | Met | `ev:T-0583:7b86c5b10f054f9d9a8be71d` | `HANDOFF.md`, helper scripts |
| AC-6 | Document registry entry profiles no longer expose `hadara-dev` as a product scaffold profile token. | Met | `ev:T-0583:5723e0f57f404a2cab627cef` | `.hadara/docs-registry.json`, `src/services/docs-registry.ts` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Version/source metadata | Yes | Passed | `ev:T-0583:5518f956424c431a96f9206a` |
| Focused release/docs tests | Yes | Passed | `ev:T-0583:5723e0f57f404a2cab627cef`; host release-focused wrapper previously hit known `spawnSync bash EPERM`, Docker full suite passed. |
| Docker build / full check / dist refresh | Yes | Passed | `ev:T-0583:5723e0f57f404a2cab627cef` |
| Docs registry profile hotfix | Yes | Passed | `ev:T-0583:5723e0f57f404a2cab627cef` |
| Package smoke | Yes | Passed | `ev:T-0583:f0ed9b5cb09f429198437689`, `ev:T-0583:308d82caa20f47a59cbc9415`; sandbox npm-pack failure resolved by approved rerun. |
| Clean checkout smoke | Yes | Passed | `ev:T-0583:21cef95476e142c49e884b63` |
| Release artifact / release dry-run / publish dry-run | Yes | Passed | `ev:T-0583:6ef3051d7e7948d4a614c11e`, `ev:T-0583:7b86c5b10f054f9d9a8be71d` |
| Task finalize | Yes | Passed | `ev:T-0583:6ca7e2bbf8e4461993b2d5e4`; close proof appended and audit returned `closed-valid`. |

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
| Docs registry | Removed `hadara-dev` from document entry `profiles`; kept HADARA-dev identity in `projectProfile`/`owner` metadata and added validation for invalid profile tokens. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | This capsule must not publish npm or GitHub Release artifacts; operator runs the publish helper after review. | Closed | `HANDOFF.md` |
| RF-2 | Risk | `release artifact` requires a clean source-prep/hotfix commit; rerun it after this source state is committed. | Closed | `ev:T-0583:6ef3051d7e7948d4a614c11e` |
| RF-3 | Follow-up | After operator publish, verify npm/GitHub public availability and installed-package recycle for `hadara@0.4.4`. | Open | next capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Started stable `0.4.4` source/readiness preparation after T-0582 major CLI dogfood. |
| 2026-07-13 | In Progress | Retargeted stable source/docs/helpers, refreshed dist, and passed package/clean-checkout smoke; release artifact remains after clean commit. |
| 2026-07-13 | In Progress | Hotfixed docs registry profile semantics so document entry profiles are product scaffold profiles only. |
| 2026-07-13 | Done | Stable `0.4.4` source/readiness validation passed; publish remains an operator-controlled external mutation. |
