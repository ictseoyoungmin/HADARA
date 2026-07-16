# T-0620 0.4.6-rc.1 release readiness and publish preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0620 |
| Title | 0.4.6-rc.1 release readiness and publish preparation |
| Status | Done |
| Created | 2026-07-16 |
| Updated | 2026-07-16 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prepare `hadara@0.4.6-rc.1` source/readiness for operator-controlled npm and GitHub prerelease publication. | Retarget package metadata, release-facing docs, helper guidance, GitHub release note artifact, and validation evidence after rc.0 dogfood follow-ups. |

## Scope

| Boundary | Items |
|---|---|
| In | `package.json` / `package-lock.json` version, README release status, release notes/readiness docs, publish helper comments, GitHub release note artifact, source/readiness validation, current-state baseline. |
| Out | npm publish, GitHub Release publication, token loading, installed-package recycle after publication, stable `0.4.6` decision. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Retarget source metadata and release-facing docs to `0.4.6-rc.1`. | Done |
| 2 | Add the `v0.4.6-rc.1` GitHub Release note artifact and helper guidance. | Done |
| 3 | Validate source/readiness with build, package smoke, strict release gate, Docker fast sync-build, and npm unpublished check. | Done |
| 4 | Update current-state baseline and close the release-readiness capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Package metadata and release-facing docs target `0.4.6-rc.1` without publish mutation. | Done | `ev:T-0620:ac6df15e331f481a81fb1e43` | `package.json`, `README.md`, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md` |
| AC-2 | The npm registry does not already contain `hadara@0.4.6-rc.1` before operator publish. | Done | `ev:T-0620:a5a1acda3d994e5ca744e219` | npm registry exact-version check |
| AC-3 | Release package smoke and strict release gate pass for the rc.1 candidate. | Done | `ev:T-0620:f37bb4127a4d4ff9a26e7cd7`, `ev:T-0620:f4077b5fbc514fceb9c19596` | `smoke package`, `release gate` |
| AC-4 | Docker fast sync-build validates the reusable HADARA-dev build/dist refresh path. | Done | `ev:T-0620:40bc0c052d2a49d0a5a9fef8` | `npm run dev:docker-sync-build` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm run build && node dist/cli/main.js version --verbose --json` | Yes | Passed | `ev:T-0620:ac6df15e331f481a81fb1e43` |
| `npm view hadara@0.4.6-rc.1 version --registry=https://registry.npmjs.org` | Yes | Passed | `ev:T-0620:a5a1acda3d994e5ca744e219` |
| `npm run dev:docker-sync-build` | Yes | Passed | `ev:T-0620:40bc0c052d2a49d0a5a9fef8` |
| `node dist/cli/main.js smoke package --execute --timeout 300 --json` | Yes | Passed | `ev:T-0620:f37bb4127a4d4ff9a26e7cd7` |
| `node dist/cli/main.js release gate --mode strict --json` | Yes | Passed | `ev:T-0620:f4077b5fbc514fceb9c19596` |
| `node dist/cli/main.js docs doctor --scope all --json` | Yes | Passed | `ev:T-0620:98e6832e02a14143877d5a91` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0615-*/DOGFOOD_REPORT.md` | reference | active | rc.0 installed-package dogfood drove follow-up fixes before rc.1. |
| `tasks/T-0616-*/TASK.md` | reference | active | Serialized task create allocation and managed board writes. |
| `tasks/T-0617-*/TASK.md` | reference | active | First-user onboarding and brownfield quickstart docs. |
| `tasks/T-0618-*/TASK.md` | reference | active | Minimal init docs and optional `docs add` workflow. |
| `tasks/T-0619-*/TASK.md` | reference | active | Docker sync-build fast path and progress diagnostics. |
| `docs/RELEASE_READINESS.md` | reference | active | Current release-readiness contract. |

## Changes

| Area | Summary |
|---|---|
| Package metadata | `package.json` and root lockfile metadata now target `0.4.6-rc.1`. |
| Release docs | README, release notes, release readiness, and publish-helper comments now describe the rc.1 candidate and operator publish boundary. |
| Release artifact | Added `GITHUB_RELEASE_NOTE.md` for the `v0.4.6-rc.1` GitHub prerelease draft/publication flow. |
| Current state | Trusted validation baseline is updated to the T-0620 source/readiness evidence. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Operator must run npm publish and GitHub Release publication from the clean publish workflow; this capsule does not mutate registries. | Open | `scripts/release/manual-publish-rc.sh` |
| RF-2 | Follow-up | Post-publish installed-package recycle should install `hadara@next` and verify it resolves to `0.4.6-rc.1`. | Open | `tasks/T-0615-*/DOGFOOD_REPORT.md` |
| RF-3 | Risk | Package smoke still reports known empty-stdout fallback warnings in this environment, but direct parity checks and strict gate pass. | Accepted | `ev:T-0620:f37bb4127a4d4ff9a26e7cd7` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-16 | Draft | Initial task scaffold. |
| 2026-07-16 | In Progress | Retargeted source/docs to `0.4.6-rc.1` and validated release readiness. |
| 2026-07-16 | Done | Prepared and validated `0.4.6-rc.1` source/readiness; publish remains operator-controlled. |
