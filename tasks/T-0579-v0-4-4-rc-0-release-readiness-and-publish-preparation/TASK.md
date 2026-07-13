# T-0579 v0.4.4-rc.0 release readiness and publish preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0579 |
| Title | v0.4.4-rc.0 release readiness and publish preparation |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prepare the `hadara@0.4.4-rc.0` source, release notes, publish helper guidance, and GitHub Release note artifact without performing npm or GitHub mutation. | Include T-0572 through T-0578 external/delegated dogfood and pre-release UX cleanup, and leave publish to the operator-run helper. |

## Scope

| Boundary | Items |
|---|---|
| In | Package version metadata, README release status, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md`, release helper examples, `GITHUB_RELEASE_NOTE.md`, pre-publish npm availability check, release validation evidence, current-state projection. |
| Out | npm publish, GitHub Release creation/publication, Docker/PyPI publication, token loading, post-publish installed-package recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the v0.4.4-rc.0 release-readiness contract and source inputs. | Done |
| 2 | Retarget package metadata and release-facing docs to `0.4.4-rc.0`. | Done |
| 3 | Add concrete GitHub Release notes and publish-helper guidance for the operator path. | Done |
| 4 | Run release validation, verify npm unpublished state, refresh `dist`, and record evidence. | Done |
| 5 | Update current-state/handoff projections and close the capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `package.json`, lockfile, and built `dist` report `0.4.4-rc.0`. | Met | `ev:T-0579:1e85fffe14f2401b88aa8211` | `package.json`, `package-lock.json`, `dist/cli/main.js version` |
| AC-2 | Release notes/readiness/README describe v0.4.4-rc.0 accurately and preserve stable install guidance for `0.4.3`. | Met | `ev:T-0579:370b652d038c4ec6a01c42cb` | `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md`, `README.md` |
| AC-3 | A GitHub Release note artifact exists for prerelease `v0.4.4-rc.0` with concrete changes and boundaries. | Met | `ev:T-0579:99e9627ede96433f97a13ab1` | `GITHUB_RELEASE_NOTE.md` |
| AC-4 | Exact npm version availability is checked before publish and validation evidence is recorded. | Met | `ev:T-0579:ec780f1860244bdcac80bc0b` | `npm view hadara@0.4.4-rc.0 version`, validation evidence |
| AC-5 | Release-helper examples point at T-0579/current version and keep `manual-publish-rc.sh --execute` as the publish boundary. | Met | `ev:T-0579:e57bc1d6ce8f429d98d5eda8` | `scripts/release/prepare-publish-env.sh`, `scripts/release/manual-publish-rc.sh` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm view hadara@0.4.4-rc.0 version` | Yes | Passed | `ev:T-0579:ec780f1860244bdcac80bc0b` |
| Focused release/docs tests | Yes | Passed | `ev:T-0579:99e9627ede96433f97a13ab1` |
| Docker build / full check / dist refresh | Yes | Passed | `ev:T-0579:99e9627ede96433f97a13ab1` |
| Built CLI version smoke | Yes | Passed | `ev:T-0579:1e85fffe14f2401b88aa8211` |
| Docs doctor currentness | Yes | Passed | `ev:T-0579:370b652d038c4ec6a01c42cb` |
| Strict release gate | Yes | Passed | `ev:T-0579:e57bc1d6ce8f429d98d5eda8` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `.hadara/state/current.json` | constraint | active | Names `0.4.4-rc.0` source readiness and operator publish/recycle as next work. |
| `tasks/T-0572-v0-4-4-external-repository-validation-planning/EXTERNAL_REPOSITORY_VALIDATION_PLAN.md` | reference | active | Defines v0.4.4 external validation gates. |
| `tasks/T-0573-v0-4-4-r1-delegated-agent-basic-profile-dogfood-pilot/R1_DELEGATED_DOGFOOD_REPORT.md` | reference | active | R1 basic-profile delegated dogfood evidence. |
| `tasks/T-0576-v0-4-4-r2-external-dogfood-validation/R2_DOGFOOD_REPORT.md` | reference | active | R2 standard-profile external validation evidence. |
| `tasks/T-0577-v0-4-4-r3-delegated-claude-external-dogfood-validation/R3_REVIEWER_CLASSIFICATION.md` | reference | active | R3 governed-profile delegated dogfood classification. |
| `tasks/T-0578-v0-4-4-pre-release-delegated-dogfood-ux-cleanup/TASK.md` | reference | active | Final pre-release UX cleanup from R3 findings. |
| `docs/RELEASE_NOTES.md` | implementation-source | active | Release notes target. |
| `docs/RELEASE_READINESS.md` | implementation-source | active | Release readiness target. |
| `README.md` | implementation-source | active | Package-facing release status target. |

## Changes

| Area | Summary |
|---|---|
| Release metadata | Retargeted package metadata and lockfile to `0.4.4-rc.0`; refreshed built `dist` through the Docker container. |
| Release docs | Added `0.4.4-rc.0` release notes, readiness text, README source/publish status, helper examples, and GitHub prerelease note artifact. |
| Drift prevention | Adjusted docs doctor so explicit stable install guidance is not misclassified as stale while source metadata is prerelease; added regression coverage and clarified Getting Started/README stable wording. |
| Test stability | Increased timing budget for heavy dashboard read-model tests and made the validation-run lock contention fixture deterministic under full-suite load. |
| Current state | Updated structured current-state canon and synchronized `PROJECT_STATE.md` / `AGENT_HANDOFF.md` projections. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | After npm/GitHub publication, run installed-package recycle against `hadara@next` expected `0.4.4-rc.0`. | Open | Future Task Capsule |
| RF-2 | Risk | Actual npm publish and GitHub Release publication remain operator-controlled after this committed source-preparation state. | Open | `scripts/release/manual-publish-rc.sh` |
| RF-3 | Follow-up | `npm run dev:docker-sync-build` can stall during mounted workspace tar copy; use clean ext4 publish clone for release artifacts and improve progress diagnostics later. | Open | `.hadara/local/feedback/T-0579-dev-docker-sync-build-tar-stall.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Started v0.4.4-rc.0 release readiness and publish-preparation updates. |
| 2026-07-13 | Done | Prepared v0.4.4-rc.0 source/readiness, fixed docs-doctor prerelease stable-install drift, stabilized timing-sensitive tests, passed full Docker check, docs doctor currentness, built version smoke, npm unpublished check, and strict release gate. |
