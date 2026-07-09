# T-0545 0.4.2 stable release readiness and publish preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0545 |
| Title | 0.4.2 stable release readiness and publish preparation |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prepare `hadara@0.4.2` stable source/readiness for operator publish. | Promote the published/dogfooded `0.4.2-rc.0` line to stable `0.4.2`, update package-facing docs and release notes, run pre-publish validation, and leave npm/GitHub mutation as explicit operator action. |

## Scope

| Boundary | Items |
|---|---|
| In | `package.json`/lockfile version, README release status, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md`, stable GitHub release note artifact, release helper guidance review, build/release dry-run evidence, and operator command handoff. |
| Out | npm publish, GitHub Release publication, Docker image push, PyPI publish, installer execution, token loading, MCP release/package execution, and post-publish installed-package recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm `hadara@0.4.2` is not already published. | Done |
| 2 | Retarget package metadata and release-facing docs to stable `0.4.2`. | Done |
| 3 | Add the stable GitHub release note artifact and publish handoff. | Done |
| 4 | Build and run release-readiness/package dry-runs without publish mutation. | Done |
| 5 | Record evidence, update shared state docs, finalize, and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Source metadata and built CLI report stable `0.4.2`. | Done | `ev:T-0545:c0615e6dadba492ba83a0610` | `package.json`; `dist/cli/main.js version` |
| AC-2 | README and release docs describe stable `0.4.2` as the prepared target and keep `0.4.2-rc.0` as release-candidate history. | Done | `ev:T-0545:c0615e6dadba492ba83a0610` | `README.md`; `docs/RELEASE_NOTES.md`; `docs/RELEASE_READINESS.md` |
| AC-3 | Stable GitHub release note artifact exists for `v0.4.2`. | Done | `ev:T-0545:c0615e6dadba492ba83a0610` | `GITHUB_RELEASE_NOTE.md` |
| AC-4 | Publish helpers keep `prepare-publish-env.sh` non-publishing and leave `manual-publish-rc.sh --execute` as the explicit npm mutation boundary. | Done | `ev:T-0545:c0615e6dadba492ba83a0610` | `scripts/release/prepare-publish-env.sh`; `scripts/release/manual-publish-rc.sh` |
| AC-5 | Pre-publish gates pass where valid before commit; clean publish clone remains responsible for release artifact/package smoke regeneration before npm publish. | Done | `ev:T-0545:c0615e6dadba492ba83a0610` | `release gate`; package smoke; publish helper |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Stable release source readiness | Yes | Passed | ev:T-0545:c0615e6dadba492ba83a0610 |
| Workspace diff check | Yes | Passed | ev:T-0545:eef89d90d81a43cbbe972580 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/AGENT_HANDOFF.md` | implementation-source | active | T-0544 points to this stable release-readiness capsule as the next step. |
| `docs/RELEASE_READINESS.md` | reference | active | Current release metadata and publish boundary. |
| `docs/RELEASE_NOTES.md` | reference | active | Package-facing release notes. |
| `tasks/T-0544-0-4-2-stable-preflight-dogfood-rerun/DOGFOOD_REPORT.md` | reference | active | Stable-preflight dogfood rerun and fixes. |
| `tasks/T-0542-0-4-2-rc0-installed-toy-project-dogfood-across-init-profiles/artifacts/DOGFOOD_REPORT.md` | reference | active | Installed RC toy project dogfood findings. |

## Changes

| Area | Summary |
|---|---|
| Metadata | Retargeted package metadata and lockfile from `0.4.2-rc.0` to stable `0.4.2`. |
| Docs | Updated README release status, release notes, release readiness, and release helper examples for stable `0.4.2`. |
| Artifacts | Added stable GitHub Release note artifact for `v0.4.2`. |
| Validation | Docker sync-build/full Vitest, built version smoke, strict release gate, helper syntax, npm absence check, and release dry-run boundary check were recorded under one release readiness evidence record. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | After npm/GitHub publication, run installed-package recycle for `hadara@latest` expected `0.4.2`. | Open | Future capsule |
| RF-2 | Follow-up | Run `prepare-publish-env.sh T-0545`, then `manual-publish-rc.sh T-0545 --execute` from the clean ext4 clone so release artifact/package smoke evidence is regenerated from committed source before npm publish. | Open | `scripts/release/prepare-publish-env.sh` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | In Progress | Preparing stable `0.4.2` release source/readiness; publish remains operator-controlled. |
| 2026-07-09 | Done | Stable `0.4.2` source/readiness is prepared; publish remains operator-controlled through the clean ext4 publish clone. |
