# T-0767 RC4 Release Artifact Regeneration and Publish Preparation

## Identity

| Field | Value |
|---|---|
| ID | T-0767 |
| Title | RC4 Release Artifact Regeneration and Publish Preparation |
| Status | Draft |
| Created | 2026-08-11T15:58 |
| Updated | 2026-08-11T15:58 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0767 --json`.

## Goal

| Goal | Notes |
|---|---|
| Prepare and validate the `0.5.0-rc.4` release input from the T-0766 source fix, producing one exact artifact for package smoke and operator handoff without performing npm/GitHub mutation. | Rebuild the release candidate after the fresh Init v1 warning remediation; public publish/recycle remain separate approval-controlled actions. |

## Scope

| Boundary | Items |
|---|---|
| In | RC4 version/readiness metadata, release notes, current-source validation, clean-source artifact tarball/checksum/manifest, exact tarball package smoke, clean-checkout smoke, strict release gate, release dry-run, publish dry-run, and operator handoff. |
| Out | npm publish, GitHub Release creation/edit/upload, public registry recycle, and stable promotion. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Retarget release metadata and define the single-artifact/no-mutation contract for RC4. | Pending |
| 2 | Generate the clean-source RC4 artifact and run exact tarball package smoke. | Pending |
| 3 | Run clean-checkout smoke, strict gate, release dry-run, and publish dry-run. | Pending |
| 4 | Record artifact provenance and prepare the operator publish/recycle handoff. | Pending |
| 5 | Finish capsule docs and close with proof-last evidence. | Pending |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Source metadata, release notes, readiness, and roadmap target `0.5.0-rc.4` without changing immutable RC2/RC3 historical records. | Pending | TBD | `package.json`, `docs/RELEASE_READINESS.md`, `docs/RELEASE_NOTES.md` |
| AC-2 | A clean source produces one RC4 tarball, checksum, and manifest with a retained operator workspace and no committed binary. | Pending | TBD | release artifact journal |
| AC-3 | Exact tarball package smoke passes and its SHA-256 equals the release artifact tarball SHA-256. | Pending | TBD | package smoke report |
| AC-4 | Clean-checkout smoke, full repository validation, strict release gate, release dry-run, and publish dry-run pass without external mutation. | Pending | TBD | validation and release reports |
| AC-5 | Operator handoff states the exact artifact path, checksum/manifest provenance, and separate npm/GitHub/public recycle sequence. | Pending | TBD | `HANDOFF.md`, `GITHUB_RELEASE_NOTE.md` |
| AC-6 | Capsule evidence, handoff, and close-source docs are complete before proof-last close. | Pending | TBD | close proof |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Full repository validation | Yes | Not Run | TBD |
| Current-source RC4 release artifact | Yes | Not Run | TBD |
| Exact tarball package smoke | Yes | Not Run | TBD |
| Clean-checkout smoke | Yes | Not Run | TBD |
| Strict release gate | Yes | Not Run | TBD |
| Release dry-run and publish dry-run | Yes | Not Run | TBD |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/RELEASE_READINESS.md` | constraint | active | Canonical release recycle order, artifact retention, and no-mutation boundary. |
| `tasks/T-0766-rc4-fresh-init-scaffold-and-protocol-doctor-reconciliation/TASK.md` | constraint | active | Source fix and fresh three-preset warning-free proof. |
| `tasks/T-0765-rc3-release-contract-and-current-state-reconciliation/RECONCILIATION_REPORT.md` | reference | active | RC4-before-stable decision and RC3 provenance correction. |
| `docs/RC2_CONTRACT_FREEZE.md` | constraint | active | Immutable prior release records remain unchanged. |
| `scripts/release/manual-publish-rc.sh` | implementation-source | active | Operator-controlled publish boundary and handoff sequence. |

## Changes

| Area | Summary |
|---|---|
| Release metadata | Retarget package/lockfile, README release status, release notes, roadmap, readiness, and RC4 operator note to the corrected source candidate. |
| Artifact provenance | Build from a clean source clone into a separate output directory and retain exact tarball/checksum/manifest until operator review. |
| Release evidence | Attach artifact journal and exact package/checkout/gate/dry-run evidence to T-0767; do not publish or recycle public package here. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Follow-up | Operator must publish the reviewed RC4 artifact to npm `next`, create/update the independent GitHub prerelease, and then run public consumer recycle. | Open | Post-close release operator capsule |
| RF-2 | Risk | Source and evidence roots must remain separate or release artifact clean-tree checks self-invalidate. | Open | `docs/RELEASE_READINESS.md` |

## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | In Progress | Opened after T-0766 closed-valid; RC4 artifact regeneration is required before stable promotion. |
