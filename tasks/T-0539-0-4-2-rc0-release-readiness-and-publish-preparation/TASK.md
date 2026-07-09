# T-0539 0.4.2 rc0 release readiness and publish preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0539 |
| Title | 0.4.2 rc0 release readiness and publish preparation |
| Status | Done |
| Created | 2026-07-09 |
| Updated | 2026-07-09 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prepare `hadara@0.4.2-rc.0` source/readiness for operator publish. | Retarget source metadata and release-facing docs from stable `0.4.1` to `0.4.2-rc.0`, generate release notes/artifacts for review, run pre-publish validation, and leave npm/GitHub mutation as explicit operator action. |

## Scope

| Boundary | Items |
|---|---|
| In | `package.json`/lockfile version, README release status, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md`, RC GitHub release note artifact, build/release dry-run evidence, and operator command handoff. |
| Out | npm publish, GitHub Release publication, Docker image push, PyPI publish, installer execution, token loading, MCP release/package execution, and post-publish installed-package recycle. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Confirm `hadara@0.4.2-rc.0` is not already published. | Done |
| 2 | Retarget package metadata and release-facing docs to `0.4.2-rc.0`. | Done |
| 3 | Add the RC GitHub release note artifact and publish handoff. | Done |
| 4 | Build and run release-readiness/package dry-runs without publish mutation. | Done |
| 5 | Record evidence, update shared state docs, finalize, and commit. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Source metadata and built CLI report `0.4.2-rc.0`. | Done | `ev:T-0539:707dc09b46744269b33f47b9` | `package.json`; `dist/cli/main.js version` |
| AC-2 | README and release docs describe stable `0.4.1` as latest and `0.4.2-rc.0` as the prepared RC target. | Done | `ev:T-0539:707dc09b46744269b33f47b9` | `README.md`; `docs/RELEASE_NOTES.md`; `docs/RELEASE_READINESS.md` |
| AC-3 | RC GitHub release note artifact exists for `v0.4.2-rc.0`. | Done | `ev:T-0539:707dc09b46744269b33f47b9` | `GITHUB_RELEASE_NOTE.md` |
| AC-4 | Publish helpers keep `prepare-publish-env.sh` non-publishing and leave `manual-publish-rc.sh --execute` as the explicit npm mutation boundary. | Done | `ev:T-0539:707dc09b46744269b33f47b9` | `scripts/release/prepare-publish-env.sh`; `scripts/release/manual-publish-rc.sh` |
| AC-5 | Pre-publish gates pass where valid before commit; clean publish clone remains responsible for release artifact/package smoke regeneration before npm publish. | Done | `ev:T-0539:707dc09b46744269b33f47b9` | `release gate`; package smoke; publish helper |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm view hadara@0.4.2-rc.0 version --registry=https://registry.npmjs.org` | Yes | Passed | `ev:T-0539:707dc09b46744269b33f47b9` |
| `npm run dev:docker-sync-build -- --smoke-command "version --json"` | Yes | Passed | `ev:T-0539:707dc09b46744269b33f47b9` |
| `node dist/cli/main.js version --json` | Yes | Passed | `ev:T-0539:707dc09b46744269b33f47b9` |
| `node dist/cli/main.js release gate --mode strict --json` | Yes | Passed | `ev:T-0539:707dc09b46744269b33f47b9` |
| `node dist/cli/main.js release dry-run --json` | Yes | Passed | `ev:T-0539:707dc09b46744269b33f47b9` |
| `bash -n scripts/release/manual-publish-rc.sh scripts/release/prepare-publish-env.sh` | Yes | Passed | `ev:T-0539:707dc09b46744269b33f47b9` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/AGENT_HANDOFF.md` | implementation-source | active | T-0538 points to this release-readiness capsule as the next step. |
| `docs/RELEASE_READINESS.md` | reference | active | Current release metadata and publish boundary. |
| `docs/RELEASE_NOTES.md` | reference | active | Package-facing release notes. |
| `tasks/T-0538-0-4-2-rc0-pre-release-dogfood/DOGFOOD_REPORT.md` | reference | active | Fresh-project dogfood recommendation and residuals. |

## Changes

| Area | Summary |
|---|---|
| Metadata | Retarget package source from `0.4.1` to `0.4.2-rc.0`. |
| Docs | Add `0.4.2-rc.0` release notes/readiness and update package-facing README release status. |
| Artifacts | Add RC GitHub Release note artifact. |
| Validation | Record release readiness evidence and expected dirty-worktree artifact refusal boundary. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | After npm/GitHub publication, run installed-package recycle for `hadara@next` expected `0.4.2-rc.0`. | Open | Future capsule |
| RF-2 | Follow-up | Run `prepare-publish-env.sh T-0539`, then `manual-publish-rc.sh T-0539 --execute` from the clean ext4 clone so release artifact/package smoke evidence is regenerated from committed source before npm publish. | Open | `scripts/release/prepare-publish-env.sh` |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-09 | Draft | Initial task scaffold. |
| 2026-07-09 | In Progress | Preparing `0.4.2-rc.0` release source/readiness; publish remains operator-controlled. |
| 2026-07-09 | Done | Prepared `0.4.2-rc.0` source/readiness and recorded release evidence; publish remains operator-controlled. |
