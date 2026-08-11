# T-0772 Publish the exact retained RC4 bytes to npm next and GitHub prerelease in the separately approved operator flow.

## Identity

| Field | Value |
|---|---|
| ID | T-0772 |
| Title | Publish the exact retained RC4 bytes to npm next and GitHub prerelease in the separately approved operator flow. |
| Status | Draft |
| Created | 2026-08-11T19:19 |
| Updated | 2026-08-11T19:19 |

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
| 2 | Run the approval-gated npm/GitHub publication from a clean ext4 clone. | Pending |
| 3 | Verify public metadata and recycle an isolated consumer. | Pending |
| 4 | Replay evidence into this workspace and complete proof-last close. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | hadara@0.5.0-rc.4 is published under npm dist-tag next. | Pending | Operator evidence | T-0770 exact artifact handoff |
| AC-2 | GitHub v0.5.0-rc.4 is a reviewed public prerelease with the release note and intended assets. | Pending | Operator evidence | GitHub release surface |
| AC-3 | npm metadata and a fresh public consumer report version 0.5.0-rc.4. | Pending | Operator evidence | Public registry verification |
| AC-4 | The public consumer recycle passes the package smoke/lifecycle checks and cleanup. | Pending | Operator evidence | Isolated consumer |
| AC-5 | No npm latest/stable, Docker, or substitute artifact mutation is performed. | Pending | Operator record | Release boundary |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Approval-gated RC4 publication helper | Yes | Not Run | Must run from a clean ext4 clone and be reviewed before external mutation. | scripts/release/manual-publish-rc.sh |
| GitHub prerelease verification | Yes | Not Run | Confirm tag, prerelease state, note, and intended assets. | scripts/release/prepare-publish-env.sh |
| Public npm consumer recycle | Yes | Not Run | Install hadara@next in an isolated consumer and exercise the release smoke path. | T-0770 handoff |
| Evidence lint and task close | Yes | Not Run | Replay operator evidence, then use the dry-run/proof-last close path. | docs/TASK_WORKFLOW_COMMANDS.md |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0770 exact RC4 publication handoff | constraint | active | Use the retained exact bytes and logical locator; do not label a regenerated substitute as original. |
| docs/RELEASE_READINESS.md | current-state | active | RC4 publication target and artifact retention record. |
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
| RF-1 | Follow-up | Public consumer recycle is required before acceptance and close. | Open | Operator evidence |

## Close Summary

This capsule owns the explicit hadara@0.5.0-rc.4 npm/GitHub publication and public consumer recycle. It does not authorize runtime changes, stable promotion, or replacement artifact creation.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | In Progress | Reclassified as the version-specific operator publish capsule required by the release helper. |
