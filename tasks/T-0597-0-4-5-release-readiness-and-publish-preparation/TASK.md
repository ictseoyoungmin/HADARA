# T-0597 0.4.5 release readiness and publish preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0597 |
| Title | 0.4.5 release readiness and publish preparation |
| Status | Done |
| Created | 2026-07-13 |
| Updated | 2026-07-13 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prepare source and release artifacts for `hadara@0.4.5`. | Retarget package metadata, release docs, helper examples, and GitHub Release notes after the 0.4.5 docs-registry/brownfield adoption line. |

## Scope

| Boundary | Items |
|---|---|
| In | Version bump to 0.4.5, release notes/readiness docs, README release status, publish helper examples, GitHub Release note artifact, package-smoke cache hardening found during release validation, build/package/docs/release validation. |
| Out | npm publish, GitHub Release publication, dist-tag mutation, Docker/PyPI publish, token loading, post-publish installed-package recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Retarget package metadata and release-facing docs to 0.4.5. | Done |
| 2 | Build and run release validation gates. | Done |
| 3 | Record evidence and prepare operator publish commands. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Package metadata and lockfile target `0.4.5`. | Done | `package.json`; `package-lock.json` | `package.json`; `package-lock.json` |
| AC-2 | README, release notes, release readiness, publish helper examples, and GitHub Release note artifact describe 0.4.5 accurately. | Done | `README.md`; `docs/RELEASE_NOTES.md`; `docs/RELEASE_READINESS.md`; `GITHUB_RELEASE_NOTE.md` |
| AC-3 | Build, docs/init doctor, Docker package smoke, and strict release gate are validated. | Done | `EVIDENCE.md` | `EVIDENCE.md` |
| AC-4 | Release artifact clean-worktree boundary is preserved; final artifact generation remains in the clean publish clone after this source-preparation commit. | Done | `EVIDENCE.md` | `scripts/release/manual-publish-rc.sh`; `scripts/release/prepare-publish-env.sh` |
| AC-5 | Publish remains operator-controlled and is not executed in this capsule. | Done | `scripts/release/manual-publish-rc.sh` | `scripts/release/manual-publish-rc.sh`; `scripts/release/prepare-publish-env.sh` |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| TypeScript build | Yes | Passed | ev:T-0597:dc01645fec90418db3e3bb72 |
| Docker build | Yes | Passed | ev:T-0597:6fd6a9c608c544c9aecfb7eb |
| Docs and init doctor | Yes | Passed | ev:T-0597:1db86afa631d4d13891f009c |
| Package smoke | Yes | Passed | ev:T-0597:7ef239b757d24c36a0f8c150 |
| Release artifact and strict gate | Yes | Passed | ev:T-0597:60d4ee55202944daab3308bd |
| Package smoke cache regression | Yes | Passed | ev:T-0597:07e3478a7f9d49e1874c0df2 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/specs/0.4.5/docs-registry-v3-and-init-cleanup.md` | reference | active | 0.4.5 registry/init cleanup release scope. |
| `docs/specs/0.4.5/brownfield-init-adoption.md` | reference | active | Brownfield adoption safety contract. |
| `tasks/T-0596-0-4-5-fresh-and-brownfield-init-dogfood/DOGFOOD_REPORT.md` | reference | active | Fresh/brownfield dogfood evidence source. |

## Changes

| Area | Summary |
|---|---|
| `package.json`, `package-lock.json` | Retarget package version to `0.4.5`. |
| Release docs | Retarget README, release notes, readiness docs, publish helper examples, and GitHub Release note artifact. |
| Current state docs | Align current release projection to source-prepared `0.4.5`. |
| `src/services/package-smoke.ts`, `tests/unit/package-smoke-dry-run.test.ts` | Ensure package-smoke npm pack/install use a workspace-local npm cache so read-only host npm cache does not block release smoke. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | After operator npm/GitHub publication, run installed-package recycle for `hadara@latest` expected `0.4.5`. | Open | `docs/RELEASE_READINESS.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-13 | Draft | Initial task scaffold. |
| 2026-07-13 | In Progress | Retargeted source metadata and release docs to `0.4.5`. |
| 2026-07-13 | Done | Release readiness validation passed; publish remains operator-controlled. |
