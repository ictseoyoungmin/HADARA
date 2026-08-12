# T-0778 Publish exact retained RC5 bytes to npm next and GitHub prerelease, then recycle public package and verify terminal lifecycle

## Identity

| Field | Value |
|---|---|
| ID | T-0778 |
| Title | Publish exact retained RC5 bytes to npm next and GitHub prerelease, then recycle public package and verify terminal lifecycle |
| Status | Done |
| Created | 2026-08-11T22:17 |
| Updated | 2026-08-12T16:55 |

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
| 1 | Verify the retained RC5 artifact set and operator environment. | Done |
| 2 | Publish exact retained bytes to npm and GitHub under explicit operator approval. | Done |
| 3 | Recycle the public RC5 consumer and record terminal lifecycle evidence. | Done |
| 4 | Reconcile current-state docs and close with proof-last evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Retained RC5 tarball, checksum, and manifest are present at the operator locator and match the expected bytes. | Met | `ev:T-0778:da43a3e5cb8b490b94891d25` | `$HADARA_RELEASE_WORKSPACE/0.5.0-rc.5` |
| AC-2 | npm publishes exactly `hadara@0.5.0-rc.5` under `next`; `latest` remains unchanged. | Met | `ev:T-0778:c4798cf9909f42b6a97493d7`; npm verification | External operator publication |
| AC-3 | GitHub `v0.5.0-rc.5` is public, `isPrerelease=true`, and has the tarball/checksum/manifest assets with digest parity. | Met | `ev:T-0778:a14983a2a9ba4e99a0c2b527` | GitHub public verification artifact |
| AC-4 | Public RC5 consumer passes fresh init, validation/evidence, close dry-run, real close execute, `closed-valid`, same-close zero-write retry, and fresh idle status with no stale continuation. | Met | `ev:T-0778:94dc7fb15ce34d7c9d273cce` | Codex CLI disposable consumer report |
| AC-5 | No source/runtime/package changes are introduced by publication; Docker and stable/latest mutation boundaries are recorded as false. | Met | `ev:T-0778:c4798cf9909f42b6a97493d7`; `ev:T-0778:a14983a2a9ba4e99a0c2b527` | Release operation report |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Retained artifact byte verification | Yes | Passed | Tarball SHA-256 `e6e740773f0db1df1716436b45b2d68e48e3874deabf002f439c4e2b1fd20df6`; checksum SHA-256 `e3a903cca75160585e22b1ee138e0e80abb5a7e389219694aa38020d31275d17`; manifest SHA-256 `2c9f4bcda84704bbb0c5e8bcd15bf9a90a8214e7e5fe8281f436127fc39b6b22`. | T-0777 release artifact evidence |
| Publish environment preparation | Yes | Passed | Clean Docker ext4 clone at `/root/hadara-publish`, commit `295a645b`, package/build version `0.5.0-rc.5`, strict release gate passed; exact retained bytes verified. | `ev:T-0778:da43a3e5cb8b490b94891d25` |
| Public npm/GitHub publication | Yes | Passed | npm `next=0.5.0-rc.5`, `latest=0.4.6`; GitHub public prerelease with 3 exact assets. | `ev:T-0778:c4798cf9909f42b6a97493d7`; `ev:T-0778:a14983a2a9ba4e99a0c2b527` |
| Public RC5 lifecycle recycle | Yes | Passed | Codex CLI disposable consumer installed public `hadara@next` RC5, completed real close execute as `closed-valid`, verified zero-write post-close retry, and observed fresh idle status with no stale continuation. | `ev:T-0778:94dc7fb15ce34d7c9d273cce` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0777 | background | implemented | RC5 exact artifact/readiness capsule; source commit `e3ac410e6f635f1625d87f75f5cb4016a5bc5786`. |
| `docs/RELEASE_READINESS.md` | reference | active | RC5 readiness and retained artifact locator/hashes. |
| `scripts/release/prepare-publish-env.sh` | implementation-source | active | Prepares the Docker ext4 publish clone; never publishes by itself. |
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | Current helper regenerates release artifacts; it was not used as the exact retained-byte input path. |

## Changes

| Area | Summary |
|---|---|
| Capsule | Created the separate RC5 publication/recycle boundary. |
| Release input | Retained exact RC5 bytes from T-0777; no regeneration permitted. |
| External state | npm RC5 publication and GitHub prerelease/assets completed; Docker and stable/latest mutation remained false. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | `manual-publish-rc.sh` was not used as the exact-input publication path because it rebuilds artifacts; the observed RC5 publication matched the retained bytes. | Closed | `ev:T-0778:c4798cf9909f42b6a97493d7` |
| RF-2 | Follow-up | Publication report and public lifecycle acceptance must bind structured artifacts with SHA-256/byte length. | Closed | `ev:T-0778:c4798cf9909f42b6a97493d7`; `ev:T-0778:94dc7fb15ce34d7` |

## Close Summary

RC5 publication and public consumer lifecycle acceptance are complete. npm `next`, GitHub prerelease asset parity, real close execute, `closed-valid`, zero-write retry, and fresh idle status are recorded in byte-bound canonical evidence. Close after final current-state reconciliation and proof-last audit.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | Prepared | Scoped as a separate operator publication/recycle capsule; exact retained bytes are mandatory and helper regeneration is explicitly out of scope. |
| 2026-08-12 | Published | npm RC5 publication and GitHub public prerelease asset parity completed; public consumer recycle remains before close. |
| 2026-08-12 | Recycled | Public RC5 Codex CLI consumer completed terminal lifecycle acceptance; close execute was `closed-valid`, retry was zero-write, and fresh status was idle. |
| 2026-08-12 | Done | Current-state docs reconciled; all T-0778 acceptance and validation criteria are met. |
