# T-0490 stable 0.4.0 publish preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0490 |
| Title | stable 0.4.0 publish preparation |
| Status | Done |
| Created | 2026-07-03 |
| Updated | 2026-07-03 |

## Goal

| Goal | Notes |
|---|---|
| Prepare and record approval-gated `hadara@0.4.0` stable npm publish. | GitHub stable release creation remains skipped unless explicitly requested later. |

## Scope

| Boundary | Items |
|---|---|
| In | Retarget package metadata, lockfile, README, release notes/readiness docs, release helper notes, GitHub release note, build output, release artifact/package/clean smoke evidence, npm publish evidence, and npm registry verification for stable `0.4.0`. |
| Out | Public GitHub stable release creation, Docker/PyPI/installer execution, and post-publish installed-package recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm T-0489 decision, current registry state, and release helper expectations. | Done |
| 2 | Retarget source metadata and package-facing docs to stable `0.4.0`. | Done |
| 3 | Build, run release readiness checks/dry-runs, record evidence, and close. | Done |
| 4 | Import operator publish evidence and update release state after npm publish. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Package metadata and lockfile target `0.4.0`. | Met | `ev:T-0490:5bc67bef93e744289490bfb6` | `package.json`, `package-lock.json` |
| AC-2 | Package-facing README and release docs describe stable `0.4.0` and preserve approval-gated publish boundaries. | Met | `ev:T-0490:5bc67bef93e744289490bfb6` | `README.md`, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md` |
| AC-3 | Operator-facing publish helper notes are no longer rc.0-specific for the stable path. | Met | `ev:T-0490:5bc67bef93e744289490bfb6` | `scripts/release/prepare-publish-env.sh` |
| AC-4 | Stable GitHub release note artifact is ready for optional draft creation. | Met | `ev:T-0490:5bc67bef93e744289490bfb6` | `GITHUB_RELEASE_NOTE.md` |
| AC-5 | Validation evidence proves build/release readiness without npm publish mutation. | Met | `ev:T-0490:612ac562b8564f12b3881032`, `ev:T-0490:767408285ae34a27b334aa5d`, `ev:T-0490:5bc67bef93e744289490bfb6` | `EVIDENCE.md` |
| AC-6 | npm publish completed and registry verifies stable `hadara@0.4.0` on `latest`. | Met | `ev:T-0490:40deeacaa24640d499a498c4` | `EVIDENCE.md` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Exact stable npm precheck | Yes | Passed | `ev:T-0490:5bc67bef93e744289490bfb6` |
| Build/version smoke | Yes | Passed | `ev:T-0490:5bc67bef93e744289490bfb6` |
| Package smoke | Yes | Passed | `ev:T-0490:612ac562b8564f12b3881032` |
| Clean-checkout smoke | Yes | Passed | `ev:T-0490:767408285ae34a27b334aa5d` |
| Release dry-run boundary | Yes | Passed | `ev:T-0490:5bc67bef93e744289490bfb6` |
| Release artifact from clean publish clone | Yes | Passed | `ev:T-0490:9bff847b4185492cb51c4345` |
| npm publish and registry verification | Yes | Passed | `ev:T-0490:40deeacaa24640d499a498c4` |
| Post-publish workspace verification | Yes | Passed | `ev:T-0490:4d5e44912eae4936ac5faab1` |
| Harness done validation | Yes | Passed | `ev:T-0490:a50470bfe0944c59aa980cda` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0489-0-4-0-stable-readiness-decision/artifacts/STABLE_READINESS_DECISION.md` | decision | implemented | Stable publish preparation is approved; publish remains separate and approval-gated. |
| `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` | constraint | implemented | Stable execution capsule order. |
| `docs/RELEASE_READINESS.md` | reference | implemented | Release metadata and mutation boundaries. |
| `docs/RELEASE_NOTES.md` | reference | implemented | Package-facing release notes. |

## Changes

| Area | Summary |
|---|---|
| Package metadata | Retargeted `package.json`, `package-lock.json`, and built `dist` to `0.4.0`. |
| Release docs | Updated README, release notes, release readiness, helper notes, and stable GitHub release note artifact. |
| Validation | Exact npm stable precheck, ext4 full check/build, package smoke, clean-checkout smoke, strict release gate, release artifact evidence, and npm publish verification were recorded. |
| npm publish | Published `hadara@0.4.0` to npm with `latest`; `next` remains `0.4.0-rc.0`; GitHub stable release draft was skipped. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | GitHub stable release draft was skipped during npm publish. | Open | `GITHUB_RELEASE_NOTE.md` |
| RF-2 | Follow-up | After stable publish, run stable installed-package recycle in a fresh unmounted container. | Open | `docs/STABLE_0_4_0_PRE_RELEASE_PLAN.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-03 | Draft | Initial task scaffold. |
| 2026-07-03 | In Progress | Started stable publish preparation from T-0489 decision. |
| 2026-07-03 | Done | Stable `0.4.0` source/readiness is prepared for operator approval-gated publish execution. |
| 2026-07-03 | Done | Operator published `hadara@0.4.0`; npm registry verification returned `latest=0.4.0` and `next=0.4.0-rc.0`. |
