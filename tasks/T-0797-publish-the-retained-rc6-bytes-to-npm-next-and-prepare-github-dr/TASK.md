# T-0797 Publish the retained RC6 bytes to npm next and prepare GitHub draft and public package recycle

## Identity

| Field | Value |
|---|---|
| ID | T-0797 |
| Title | Publish the retained RC6 bytes to npm next and prepare GitHub draft and public package recycle |
| Status | Draft |
| Created | 2026-08-23T00:12 |
| Updated | 2026-08-23T00:12 |

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
| 2 | Run the prepared `manual-publish-rc.sh` command after npm/GitHub authentication and explicit operator confirmation. | Pending operator action |
| 3 | Reconcile npm/GitHub publication reports and close the capsule with proof-last evidence. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | The exact T-0796 artifact bytes are consumed without regeneration and the npm destination is `https://registry.npmjs.org` with dist-tag `next`. | Pending | T-0796 artifact report: `sha256:a2ad5b5a2e058ecb958eaf0fcf5846f586b032320760868f294f7dd84754681b`; tarball: `sha256:f078d6edc4529943dd0842b787a6dc98fb04e4bdbefbd7e138dbcfe6c4202e1f` | T-0796 `ev:T-0796:ac12337f30834c0eb91ba498`; prepared command in `HANDOFF.md` |
| AC-2 | npm publication evidence is recorded and the GitHub draft/tag uses the same version, source lineage, and exact release assets. | Pending | Operator-generated reports and evidence are required. | `artifacts/operator-publication/`; `GITHUB_RELEASE_NOTE.md` |
| AC-3 | No stable/latest or Docker mutation occurs; public package recycle remains a separate follow-up. | Pending | Operator report mutation boundary and follow-up handoff. | `docs/RELEASE_READINESS.md` |

## Validation

| Check | Gate | Status | Detail | Evidence |
|---|---|---|---|---|
| Retained artifact and release-input reconciliation | Yes | Passed | Current release input hash matches the retained T-0796 artifact; retained files are present with the recorded tarball/checksum/manifest digests. | `ev:T-0796:ac12337f30834c0eb91ba498` |
| Publish helper syntax and command surface | Yes | Passed | bash -n scripts/release/manual-publish-rc.sh and the --help command both passed; retained artifact hash and release-input hash were verified without mutation. | ev:T-0797:de1b9887b3e2428fb7d4d7e9 |
| npm publication and GitHub draft | Yes | Not Run | Awaiting the operator command and the two explicit confirmations. | TBD |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| T-0796 `TASK.md`, `HANDOFF.md`, and release artifact evidence | release input | active | Exact bytes and source commit `e8143c0fe86dcb29aa8f99cb70612b4bd606c800` are authoritative. |
| `scripts/release/manual-publish-rc.sh` | implementation | active | Execute only with the retained artifact directory/report and explicit `--npm-tag next`. |
| `docs/RELEASE_READINESS.md` | constraint | active | npm mutation precedes GitHub draft; public recycle is separate. |
| `docs/TASK_WORKFLOW_COMMANDS.md` | workflow | active | Keep evidence and capsule handoff current; close only after mutation proof exists. |

## Changes

| Area | Summary |
|---|---|
| Capsule preparation | Added the release note, exact retained-artifact command, authentication prerequisites, and mutation boundaries. |
| External publication | Not executed by preparation work. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Operator | npm and GitHub credentials must already be authenticated; token values must not enter evidence or committed files. | Open | `HANDOFF.md`; `scripts/release/manual-publish-rc.sh` |
| RF-2 | Follow-up | Publish the GitHub draft publicly only after human review, then run installed-package recycle in a separate capsule. | Open | `HANDOFF.md`; `docs/RELEASE_READINESS.md` |

## Close Summary

Close only after the helper records npm publication and GitHub draft evidence, or records an honest blocked/partial outcome. The prepared command is intentionally not run by capsule preparation.


## History

| Date | State | Note |
|---|---|---|
| 2026-08-23 | Draft | Initial task scaffold. |
