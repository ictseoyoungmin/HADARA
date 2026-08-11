# T-0770 RC4 Exact Artifact Retention and Publication Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0770 |
| Title | RC4 Exact Artifact Retention and Publication Handoff |
| Status | Done |
| Created | 2026-08-11T19:00 |
| Updated | 2026-08-11T19:05 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Prove that the reviewed RC4 tarball, checksum, and manifest remain recoverable at a stable logical locator and hand them off for operator publication. | No source rebuild, package mutation, npm publish, GitHub API call, or GitHub upload is performed by this capsule. |

## Scope

| Boundary | Items |
|---|---|
| In | Verify the ignored local retention metadata, exact three filenames, byte hashes, checksum content, manifest/source provenance, and record the stable logical locator in this capsule and current release readiness. |
| Out | Runtime changes, Init/profile work, artifact regeneration, npm publish, GitHub Release mutation/upload, and post-publish consumer recycle. |

## Capsule Budget

| Budget | Limit / decision |
|---|---|
| Capsule count | One pre-publication handoff capsule: T-0770. |
| Source boundary | No `src/**`, `tools/**`, package metadata, or release input changes. |
| Artifact boundary | Consume the retained RC4 bytes; do not rebuild or relabel a replacement as original. |
| Mutation boundary | No npm/GitHub/Docker mutation. Publish remains a later explicit operator action. |
| Evidence | Record exact locator, filenames, hashes, source commit, input hash, and verification commands as public evidence without private absolute paths. |
| Stop condition | Stop with `blocked` if any file is missing, any byte hash differs, or provenance is inconsistent. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the retention and publication-handoff contract. | Done |
| 2 | Verify the retained exact RC4 artifact and update current release readiness. | Done |
| 3 | Validate, record evidence, and close without publish mutation. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The stable logical locator and all three exact reviewed filenames are recorded. | Met | ev:T-0770:b23dcb8573b04738bfc00aa9 | `docs/RELEASE_READINESS.md`; task HANDOFF |
| AC-2 | The retained tarball, checksum, and manifest exist and match the expected byte hashes. | Met | ev:T-0770:b23dcb8573b04738bfc00aa9 | `.hadara/local/release-workspace.json`; RC4 artifact report |
| AC-3 | Source commit, release input hash, package version, checksum content, and manifest provenance are consistent. | Met | ev:T-0770:b23dcb8573b04738bfc00aa9 | RC4 artifact report; verification command |
| AC-4 | No artifact rebuild, npm publish, GitHub mutation, or Docker mutation occurred. | Met | ev:T-0770:b23dcb8573b04738bfc00aa9 | command evidence and publish boundary |
| AC-5 | Capsule budget is honored and the next operator can publish the exact reviewed bytes without reopening T-0769. | Met | ev:T-0770:b23dcb8573b04738bfc00aa9 | task HANDOFF; release readiness |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Exact RC4 retention verification | Yes | Passed | Three files, hashes, checksum content, manifest, and source provenance verified. | ev:T-0770:b23dcb8573b04738bfc00aa9 |
| Release readiness / publish dry-run review | Yes | Passed | Current release readiness records the exact locator and publish remains operator-gated. | ev:T-0770:b23dcb8573b04738bfc00aa9 |
| Evidence lint and task close | Yes | Passed | Evidence lint passed; proof-last close remains the terminal capsule step. | ev:T-0770:f7f0d7f5709e4509bdbc7863 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/RELEASE_READINESS.md` | constraint | active | Current release target, retention contract, and publish boundary. |
| `.hadara/local/release-workspace.json` | implementation-source | active | Ignored local locator and expected exact artifact metadata. |
| T-0769 RC4 artifact evidence | reference | implemented | Source commit, input hash, package version, and public artifact report. |
| T-0769 HANDOFF | reference | archived | Do not edit the closed capsule; carry forward only the publication handoff. |

## Changes

| Area | Summary |
|---|---|
| Retention | Exact RC4 files verified at the stable logical locator; no bytes were rebuilt. |
| Provenance | Source commit, release input hash, package version, checksum, and manifest are consistent. |
| Publication handoff | Active release readiness and HANDOFF now direct the operator to the exact bytes; publication remains outside this capsule. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | The operator must verify this handoff before any npm/GitHub publish mutation. | Mitigated | `HANDOFF.md`; ev:T-0770:b23dcb8573b04738bfc00aa9 |

## Close Summary

This capsule verifies retention and publication handoff only. It intentionally leaves npm/GitHub publication to the operator.

RC4 exact bytes are ready for operator publication. Do not rebuild or substitute the artifact after this close.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | In Progress | Defined the no-rebuild, no-publish retention and publication-handoff boundary. |
| 2026-08-11 | Done | Verified exact RC4 retention and documented the operator publication handoff without mutation. |
