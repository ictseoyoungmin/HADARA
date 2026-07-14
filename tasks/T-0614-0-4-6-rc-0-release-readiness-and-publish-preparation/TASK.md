# T-0614 0.4.6-rc.0 release readiness and publish preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0614 |
| Title | 0.4.6-rc.0 release readiness and publish preparation |
| Status | Done |
| Created | 2026-07-14 |
| Updated | 2026-07-14 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prepare `hadara@0.4.6-rc.0` source metadata, release docs, GitHub prerelease notes, and validation evidence without performing npm or GitHub mutation. | Leave `manual-publish-rc.sh T-0614 --execute` and GitHub Release publication as operator-controlled follow-up actions. |

## Scope

| Boundary | Items |
|---|---|
| In | Package metadata, lockfile, README release status, release notes/readiness docs, release helper examples, GitHub Release note artifact, npm version availability check, build/package/release validation, Docker dist refresh, current-state projection, and capsule evidence. |
| Out | npm publish, GitHub Release creation/publication, Docker image push, PyPI publish, token loading, or post-publish installed-package recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the release-readiness contract and inputs. | Done |
| 2 | Retarget package metadata and release-facing docs to `0.4.6-rc.0`. | Done |
| 3 | Add concrete GitHub prerelease notes and helper guidance for the operator path. | Done |
| 4 | Run release validation, npm availability check, Docker dist refresh, and record evidence. | Done |
| 5 | Prepare current-state/handoff projection updates and close the capsule through finalize. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | `package.json`, lockfile, and built `dist` report `0.4.6-rc.0`. | Done | `ev:T-0614:32b52d29237f4b44bf5ff288`, `ev:T-0614:99b32b5930ea41539c4d4138` | `package.json`, `package-lock.json`, `dist/cli/main.js` |
| AC-2 | README, release notes, and release readiness docs describe `0.4.6-rc.0` accurately while stable install guidance remains `0.4.5`. | Done | `ev:T-0614:0420632db26e43098bbbe235` | `README.md`, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md` |
| AC-3 | GitHub Release note artifact exists for prerelease `v0.4.6-rc.0`. | Done | `ev:T-0614:0420632db26e43098bbbe235` | `GITHUB_RELEASE_NOTE.md` |
| AC-4 | Exact npm version availability is checked before publish and validation evidence is recorded. | Done | `ev:T-0614:53e4f099939a499092e13ac4` | `npm view hadara@0.4.6-rc.0 version` |
| AC-5 | Publish helper examples point at T-0614/current version and keep `manual-publish-rc.sh --execute` as the publish boundary. | Done | `ev:T-0614:0420632db26e43098bbbe235` | `scripts/release/*.sh` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm view hadara@0.4.6-rc.0 version` | Yes | Passed | `ev:T-0614:53e4f099939a499092e13ac4` |
| TypeScript build and built version smoke | Yes | Passed | `ev:T-0614:32b52d29237f4b44bf5ff288` |
| Docker dev sync build and full suite | Yes | Passed | `ev:T-0614:99b32b5930ea41539c4d4138` |
| Package smoke / release gate | Yes | Passed | `ev:T-0614:0420632db26e43098bbbe235` |
| Docs doctor currentness | Yes | Passed | `ev:T-0614:9cd821818d604e0f9fe395da` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0604 through T-0613 | reference | active | 0.4.6 implementation, delegated dogfood, validation capture, bootstrap next-work, and current-state contract line. |
| `docs/RELEASE_NOTES.md` | implementation-source | active | Release notes target. |
| `docs/RELEASE_READINESS.md` | implementation-source | active | Release readiness target. |
| `README.md` | implementation-source | active | Package-facing release status target. |

## Changes

| Area | Summary |
|---|---|
| Release metadata | Retargeted package metadata and lockfile to `0.4.6-rc.0`. |
| Release docs | Updated README release status, release notes, readiness docs, helper examples, and GitHub prerelease note artifact. |
| Current state | Updated structured current release and trusted validation baseline for the 0.4.6-rc.0 source/readiness state. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | After npm/GitHub publication, run installed-package recycle against `hadara@next` expected `0.4.6-rc.0`. | Open | Future Task Capsule |
| RF-2 | Risk | Actual npm publish and GitHub Release publication remain operator-controlled after this committed source-preparation state. | Open | `scripts/release/manual-publish-rc.sh` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-14 | Draft | Initial task scaffold. |
| 2026-07-14 | In Progress | Started 0.4.6-rc.0 source/readiness retargeting. |
| 2026-07-14 | Done | Prepared 0.4.6-rc.0 source/readiness, passed npm unpublished check, package smoke, strict release gate, Docker full suite, and dist freshness. |
