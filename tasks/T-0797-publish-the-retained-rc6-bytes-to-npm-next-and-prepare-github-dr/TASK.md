# T-0797 Publish the retained RC6 bytes to npm next and prepare GitHub draft and public package recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0797 |
| Title | Publish the retained RC6 bytes to npm next and prepare GitHub draft and public package recycle |
| Status | Done |
| Created | 2026-08-23T00:12 |
| Updated | 2026-08-23T00:38 |

> Command-owned identity: do not hand-edit `ID`, `Title`, `Status`, `Created`, or `Updated`; use `task create` and `task close`.

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

## Goal

| Goal | Notes |
|---|---|
| Publish the exact retained `0.5.0-rc.6` bytes to npm with dist-tag `next`, then create the reviewed GitHub prerelease draft/tag from the same bytes. | This is the approval-gated operator mutation capsule. The operator runs the prepared command; no substitute artifact may be generated. |

## Scope

| Boundary | Items |
|---|---|
| In | npm `hadara@0.5.0-rc.6` publication to `https://registry.npmjs.org` with `next`; GitHub tag `v0.5.0-rc.6` and draft prerelease with the retained tarball, checksum, manifest, and capsule evidence/report. |
| Out | Public GitHub draft promotion (`--draft=false`), stable/latest promotion, Docker publication, and installed-package public recycle; those require a reviewed follow-up capsule. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Bind this operator capsule to T-0796's retained exact artifact and GitHub release note. | Done |
| 2 | Run the prepared `manual-publish-rc.sh` command after npm/GitHub authentication and explicit operator confirmation. | Done |
| 3 | Reconcile npm/GitHub publication reports and close the capsule with proof-last evidence. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The exact T-0796 artifact bytes are consumed without regeneration and the npm destination is `https://registry.npmjs.org` with dist-tag `next`. | Met | npm report records `hadara@0.5.0-rc.6`, registry, `next`, and the retained tarball lineage; read-only npm verification agrees. | `ev:T-0797:ff3cd5173b5042a28cae5221`; `ev:T-0797:181c408e398e488e9160a91a` |
| AC-2 | npm publication evidence is recorded and the GitHub draft/tag uses the same version, source lineage, and exact release assets. | Met | Operator report records both mutation boundaries and all three exact asset digests; operator then promoted the prerelease from draft. | `ev:T-0797:23f1da59a6e64dd29f1d4297`; `ev:T-0797:629ef61202bf43749e3fe30e` |
| AC-3 | No stable/latest or Docker mutation occurs; public package recycle remains a separate follow-up. | Met | Report records `latest` unchanged and Docker mutation false; package recycle remains explicitly outside this capsule. | `ev:T-0797:23f1da59a6e64dd29f1d4297`; `docs/RELEASE_READINESS.md` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Retained artifact and release-input reconciliation | Yes | Passed | Current release input hash matches the retained T-0796 artifact; retained files are present with the recorded tarball/checksum/manifest digests. | `ev:T-0796:ac12337f30834c0eb91ba498` |
| Publish helper syntax and command surface | Yes | Passed | bash -n scripts/release/manual-publish-rc.sh and the --help command both passed; retained artifact hash and release-input hash were verified without mutation. | ev:T-0797:de1b9887b3e2428fb7d4d7e9 |
| npm publication and GitHub draft | Yes | Passed | npm publication and GitHub draft/tag completed from the retained artifact; the operator then promoted the prerelease publicly. | `ev:T-0797:ff3cd5173b5042a28cae5221`; `ev:T-0797:23f1da59a6e64dd29f1d4297`; `ev:T-0797:629ef61202bf43749e3fe30e` |
| Operator publish preflight | Yes | Passed | Initial attempt failed before mutation because Docker-owned ignored `dist/` files caused `tsc` EACCES; the generated directory was safely replaced with a user-owned one and `npm run build` then passed. | `ev:T-0797:18716ecddf8c441fb5c6f341` (failed); `ev:T-0797:081ce35ded7d41f082600ee9` (resolved) |
| Published npm identity and dist-tag | Yes | Passed | Read-only npm verification passed: hadara@0.5.0-rc.6 resolves and dist-tag next points to 0.5.0-rc.6; latest remains 0.4.6. | ev:T-0797:181c408e398e488e9160a91a |
| Publish GitHub prerelease | Yes | Passed | Operator-provided `gh release edit` output returned the `v0.5.0-rc.6` release URL with `--draft=false --prerelease`; independent `gh release view` was unavailable here because `api.github.com` connectivity failed. | `ev:T-0797:629ef61202bf43749e3fe30e` |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0796 `TASK.md`, `HANDOFF.md`, and release artifact evidence | reference | active | Exact bytes and source commit `e8143c0fe86dcb29aa8f99cb70612b4bd606c800` are authoritative. |
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | Executed with the retained artifact directory/report and explicit `--npm-tag next`. |
| `docs/RELEASE_READINESS.md` | constraint | active | npm mutation precedes GitHub draft; public recycle is separate. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | workflow | active | Keep evidence and capsule handoff current; close only after mutation proof exists. |

## Changes

| Area | Summary |
|---|---|
| Capsule preparation | Added the release note, exact retained-artifact command, authentication prerequisites, and mutation boundaries. |
| External publication | Published npm `next`, created the GitHub prerelease draft/tag with exact assets, and promoted it publicly after operator review. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | npm and GitHub credentials were required for mutation; token values were not entered into evidence or committed files. | Accepted | `ev:T-0797:23f1da59a6e64dd29f1d4297`; `HANDOFF.md` |
| RF-2 | Follow-up | Publish the GitHub draft publicly only after human review, then run installed-package recycle in a separate capsule. | Open | `HANDOFF.md`; `docs/RELEASE_READINESS.md` |

## Close Summary

Close proof is now ready: npm publication, GitHub draft/tag creation, public prerelease promotion, exact asset lineage, and the no-stable/no-Docker mutation boundary are recorded. Public package recycle remains a separate follow-up capsule.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-23 | Draft | Initial task scaffold. |
| 2026-08-23 | Done | Published RC6 to npm `next`, created and publicly promoted the GitHub prerelease, and recorded exact publication evidence. |
