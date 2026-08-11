# T-0778 Publish exact retained RC5 bytes to npm next and GitHub prerelease, then recycle public package and verify terminal lifecycle

## Identity

| Field | Value |
|---|---|
| ID | T-0778 |
| Title | Publish exact retained RC5 bytes to npm next and GitHub prerelease, then recycle public package and verify terminal lifecycle |
| Status | Draft |
| Created | 2026-08-11T22:17 |
| Updated | 2026-08-11T22:17 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Publish the retained HADARA 0.5.0-rc.5 bytes without regeneration, then verify the public RC5 package/release and terminal lifecycle. | This is a separate operator publication capsule. External npm/GitHub mutations remain human-approved execution steps. |

## Scope

| Boundary | Items |
|---|---|
| In | Verify the retained tarball/checksum/manifest; publish the exact tarball to npm `next`; create/promote GitHub `v0.5.0-rc.5` as a prerelease with all three assets; run public consumer recycle including real close execute, `closed-valid`, idempotent retry, and fresh status. |
| Out | Rebuilding or regenerating RC5 release bytes; changing runtime/source/package version; mutating npm `latest`, Docker, or stable release state; treating a helper dry-run artifact as the retained artifact. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Verify the retained RC5 artifact set and operator environment. | In Progress |
| 2 | Publish exact retained bytes to npm and GitHub under explicit operator approval. | Pending |
| 3 | Recycle the public RC5 consumer and record terminal lifecycle evidence. | Pending |
| 4 | Reconcile current-state docs and close with proof-last evidence. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Retained RC5 tarball, checksum, and manifest are present at the operator locator and match the expected bytes. | Pending | T-0777 release artifact evidence | `$HADARA_RELEASE_WORKSPACE/0.5.0-rc.5` |
| AC-2 | npm publishes exactly `hadara@0.5.0-rc.5` under `next`; `latest` remains unchanged. | Pending | TBD | External operator publication |
| AC-3 | GitHub `v0.5.0-rc.5` is public, `isPrerelease=true`, and has the tarball/checksum/manifest assets with digest parity. | Pending | TBD | External operator publication |
| AC-4 | Public RC5 consumer passes fresh init, validation/evidence, close dry-run, real close execute, `closed-valid`, same-close zero-write retry, and fresh idle status with no stale continuation. | Pending | TBD | Public consumer recycle evidence |
| AC-5 | No source/runtime/package changes are introduced by publication; Docker and stable/latest mutation boundaries are recorded as false. | Pending | T-0777 readiness evidence; T-0778 operator report | Release operation report |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Retained artifact byte verification | Yes | Passed in T-0777 | Tarball SHA-256 `e6e740773f0db1df1716436b45b2d68e48e3874deabf002f439c4e2b1fd20df6`; checksum SHA-256 `e3a903cca75160585e22b1ee138e0e80abb5a7e389219694aa38020d31275d17`; manifest SHA-256 `2c9f4bcda84704bbb0c5e8bcd15bf9a90a8214e7e5fe8281f436127fc39b6b22`. | T-0777 release artifact evidence |
| Publish environment preparation | Yes | In Progress | Must use a clean Docker ext4 clone and the retained artifact locator; do not run the current helper against the retained directory because it regenerates artifacts. | Operator handoff |
| Public npm/GitHub publication | Yes | Not Run | Human approval and authenticated npm/gh sessions required. | AC-2, AC-3 |
| Public RC5 lifecycle recycle | Yes | Not Run | Execute only after public package publication is verified. | AC-4 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0777 | predecessor | complete | RC5 exact artifact/readiness capsule; source commit `e3ac410e6f635f1625d87f75f5cb4016a5bc5786`. |
| `docs/RELEASE_READINESS.md` | current-state | active | RC5 readiness and retained artifact locator/hashes. |
| `scripts/release/prepare-publish-env.sh` | operator tool | active | Prepares the Docker ext4 publish clone; never publishes by itself. |
| `scripts/release/manual-publish-rc.sh` | operator tool | conditional | Current helper regenerates release artifacts; do not use it for exact retained RC5 publication until an exact-input path is explicitly provided. |

## Changes

| Area | Summary |
|---|---|
| Capsule | Created the separate RC5 publication/recycle boundary. |
| Release input | Retained exact RC5 bytes from T-0777; no regeneration permitted. |
| External state | No npm, GitHub, Docker, or stable/latest mutation performed by this preparation step. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Operator safety | `manual-publish-rc.sh` currently rebuilds the artifact before publishing; exact retained RC5 publication must use a verified exact-input workflow or be blocked. | Open | `scripts/release/manual-publish-rc.sh` |
| RF-2 | Evidence | Publication report and public lifecycle acceptance must bind structured artifacts with SHA-256/byte length. | Open | T-0776 contract |

## Close Summary

Publication is intentionally not complete until the operator has authenticated npm/gh sessions, reviewed the exact retained asset hashes, completed npm/GitHub mutation, and run the public RC5 recycle. Close only after canonical evidence is attached and current-state docs are reconciled.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | Prepared | Scoped as a separate operator publication/recycle capsule; exact retained bytes are mandatory and helper regeneration is explicitly out of scope. |
