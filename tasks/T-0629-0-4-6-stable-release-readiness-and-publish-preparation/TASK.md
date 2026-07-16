# T-0629 0.4.6 stable release readiness and publish preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0629 |
| Title | 0.4.6 stable release readiness and publish preparation |
| Status | Done |
| Created | 2026-07-16 |
| Updated | 2026-07-16 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task finalize --task T-0629 --execute --auto --json`.

## Goal

| Goal | Notes |
|---|---|
| Prepare source, docs, release notes, and validation evidence for operator-controlled `hadara@0.4.6` stable publication. | Publish itself remains outside source prep until the operator runs the release helper from a clean ext4 publish clone. |

## Scope

| Boundary | Items |
|---|---|
| In | Retarget package metadata and package lock to `0.4.6`; update README, Getting Started, release notes, release readiness docs, current-state release marker, helper guidance, and GitHub Release note artifact; refresh built `dist`; run release validation evidence. |
| Out | npm publish, GitHub Release publication, token loading, Docker image publication, PyPI publication, installed-package recycle after public publish. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Retarget source metadata and release-facing docs to stable `0.4.6`. | Done |
| 2 | Create `GITHUB_RELEASE_NOTE.md` for `v0.4.6`. | Done |
| 3 | Refresh built `dist` and run release validation gates. | Done |
| 4 | Record publish commands and close readiness capsule. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Package metadata, lockfile, docs, current-state release marker, and helper guidance target `0.4.6` stable. | Met | `ev:T-0629:5b8a1002bd774ac38481d46c` | `package.json`, `README.md`, `docs/RELEASE_NOTES.md`, `docs/RELEASE_READINESS.md` |
| AC-2 | GitHub stable release note artifact exists and summarizes concrete 0.4.6 changes. | Met | `tasks/T-0629-0-4-6-stable-release-readiness-and-publish-preparation/GITHUB_RELEASE_NOTE.md` | release note artifact |
| AC-3 | Built CLI reports version `0.4.6`, package smoke passes, and strict release gate passes. | Met | `ev:T-0629:1bbd0107c26d4ff788b22da3`, `ev:T-0629:78e72e046cdf499787751567`, `ev:T-0629:ebdc4d27b38643448ef95176` | `dist`, `smoke package`, `release gate` |
| AC-4 | Operator publish commands are documented for npm `latest` and GitHub Release `v0.4.6`. | Met | `tasks/T-0629-0-4-6-stable-release-readiness-and-publish-preparation/HANDOFF.md` | release handoff |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| `npm run dev:docker-sync-build` | Yes | Passed | `ev:T-0629:1bbd0107c26d4ff788b22da3` |
| `node dist/cli/main.js version` | Yes | Passed | `ev:T-0629:5b8a1002bd774ac38481d46c` |
| `node dist/cli/main.js smoke package --execute --timeout 300 --json` | Yes | Passed | `ev:T-0629:78e72e046cdf499787751567` |
| `node dist/cli/main.js release gate --mode strict --json` | Yes | Passed | `ev:T-0629:ebdc4d27b38643448ef95176` |
| `npm view hadara@0.4.6 version --registry=https://registry.npmjs.org` | No | Passed | unpublished E404 before operator publish; `ev:T-0629:5b8a1002bd774ac38481d46c` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `tasks/T-0628-0-4-6-current-package-delegated-dogfood-rerun-after-finalize-fix/DOGFOOD_REPORT.md` | reference | active | Stable blocker rerun evidence; baseline and MVP feature close passed. |
| `docs/RELEASE_NOTES.md` | reference | active | Product-facing release notes. |
| `docs/RELEASE_READINESS.md` | reference | active | Release gate/readiness source. |
| `scripts/release/prepare-publish-env.sh` | constraint | active | Clean ext4 publish workflow entrypoint. |

## Changes

| Area | Summary |
|---|---|
| Package metadata | Retargeted `package.json` and `package-lock.json` to `0.4.6`. |
| Release docs | Retargeted README, Getting Started, release notes, release readiness, current-state release marker, and helper comments to stable `0.4.6`. |
| Release artifact | Added stable GitHub Release note artifact for `v0.4.6`. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | After operator npm/GitHub publish, run installed-package recycle from `hadara@latest` expected `0.4.6`. | Open | future publish/recycle capsule |

## History

| Date | State | Note |
|---|---|---|
| 2026-07-16 | Draft | Initial task scaffold. |
| 2026-07-16 | In Progress | Retargeting source and release docs to stable 0.4.6. |
| 2026-07-16 | Done | Stable 0.4.6 source/readiness prepared; package smoke and strict release gate passed. |
