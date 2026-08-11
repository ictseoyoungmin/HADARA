# T-0772 Publish the exact retained RC4 bytes to npm next and GitHub prerelease in the separately approved operator flow.

## Identity

| Field | Value |
|---|---|
| ID | T-0772 |
| Title | Publish the exact retained RC4 bytes to npm next and GitHub prerelease in the separately approved operator flow. |
| Status | Done |
| Created | 2026-08-11T19:19 |
| Updated | 2026-08-11T19:31 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Publish hadara@0.5.0-rc.4 to npm next, prepare and publish the reviewed GitHub prerelease, then verify a public consumer recycle using the retained T-0770 artifact contract. | This is an operator-owned external publication capsule; no runtime source or stable release work is in scope. |

## Scope

| Boundary | Items |
|---|---|
| In | T-0770 exact artifact handoff, approval-gated npm publication, GitHub prerelease draft/publication, registry verification, and public consumer recycle. |
| Out | Runtime/profile fixes, stable promotion, Docker publication, replacement artifact generation, and post-close HANDOFF currentness hardening. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the RC4 operator publication contract and GitHub release note. | Done |
| 2 | Run the approval-gated npm/GitHub publication from a clean ext4 clone. | Done |
| 3 | Verify public metadata and recycle an isolated consumer. | Done |
| 4 | Replay evidence into this workspace and complete proof-last close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | hadara@0.5.0-rc.4 is published under npm dist-tag next. | Met | ev:T-0772:f7fbfb98a701428ca14353e1 | T-0770 exact artifact handoff |
| AC-2 | GitHub v0.5.0-rc.4 is a reviewed public prerelease with the release note and intended assets. | Met | ev:T-0772:ca025cf911e149279e893b24 | GitHub release surface |
| AC-3 | npm metadata and a fresh public consumer report version 0.5.0-rc.4. | Met | ev:T-0772:f7fbfb98a701428ca14353e1; ev:T-0772:fdf2b2a585f3453db1fecc0b | Public registry verification |
| AC-4 | The public consumer recycle passes the package smoke/lifecycle checks and cleanup. | Met | ev:T-0772:fdf2b2a585f3453db1fecc0b | Isolated consumer |
| AC-5 | No npm latest/stable, Docker, or substitute artifact mutation is performed. | Met | ev:T-0772:e6d2757f156949888f7e4166 | Release boundary |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Approval-gated RC4 publication helper | Yes | Passed | npm publication completed and npm view observed 0.5.0-rc.4. | ev:T-0772:f7fbfb98a701428ca14353e1 |
| GitHub prerelease verification | Yes | Passed | Public, non-draft, prerelease release has tarball/checksum/manifest with retained digests. | ev:T-0772:ca025cf911e149279e893b24; ev:T-0772:e6d2757f156949888f7e4166 |
| Public npm consumer recycle | Yes | Passed | hadara@next installed as 0.5.0-rc.4; 57 commands, lifecycle, init, task/status/context smoke, and cleanup passed. | ev:T-0772:fdf2b2a585f3453db1fecc0b |
| Evidence lint and task close | Yes | Passed | Evidence lint passed; proof-last close is the terminal capsule step. | ev:T-0772:f7fbfb98a701428ca14353e1; docs/TASK_WORKFLOW_COMMANDS.md |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0770 exact RC4 publication handoff | constraint | active | Use the retained exact bytes and logical locator; do not label a regenerated substitute as original. |
| docs/RELEASE_READINESS.md | constraint | active | RC4 publication target and artifact retention record. |
| scripts/release/manual-publish-rc.sh | implementation-source | active | Approval-gated npm/GitHub operator flow. |
| scripts/release/prepare-publish-env.sh | implementation-source | active | Clean clone and ext4 preparation workflow. |

## Changes

| Area | Summary |
|---|---|
| Operator publication contract | Version-specific RC4 publish capsule created so the helper can verify package/version ownership. |
| GitHub release note | Added GITHUB_RELEASE_NOTE.md for reviewed prerelease publication. |
| Evidence | Pending operator execution and replay into the canonical workspace. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Public consumer recycle was required before acceptance and is complete. | Mitigated | ev:T-0772:fdf2b2a585f3453db1fecc0b |

## Close Summary

This capsule owns the explicit hadara@0.5.0-rc.4 npm/GitHub publication and public consumer recycle. It does not authorize runtime changes, stable promotion, or replacement artifact creation.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | In Progress | Reclassified as the version-specific operator publish capsule required by the release helper. |
| 2026-08-11 | In Progress | npm publication, GitHub prerelease asset upload, retained hash parity, and public consumer recycle completed; close-source docs are being finalized. |
| 2026-08-11 | Done | Publication, asset parity, consumer recycle, evidence lint, and close-source documentation completed; proof-last close remains the terminal command transaction. |
