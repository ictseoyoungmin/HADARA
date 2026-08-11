# T-0765 RC3 Release Contract and Current-State Reconciliation

## Identity

| Field | Value |
|---|---|
| ID | T-0765 |
| Title | RC3 Release Contract and Current-State Reconciliation |
| Status | Done |
| Created | 2026-08-11T15:24 |
| Updated | 2026-08-11T15:39 |

Schema hint: use `hadara schema --json` or `hadara schema --domain <domain-id> --json` for controlled values before replacing scaffold tokens.

Lifecycle note: do not hand-edit Identity `Status` or `docs/TASK_BOARD.md` Status to close work. Keep the task prose current, then run `hadara task close --task T-0765 --json`.

## Goal

| Goal | Notes |
|---|---|
| Reconcile the tracked RC3 release state with the public npm/GitHub surfaces, preserve the RC3 artifact-retention correction, investigate fresh standard-init warnings, and remove the Graphify guide's machine-specific path. | Produce a stable-promotion decision record; if the public artifact exposes a runtime defect, recommend rc.4 before stable rather than silently treating source and published artifact as identical. |

## Scope

| Boundary | Items |
|---|---|
| In | `docs/RELEASE_READINESS.md` current-state reconciliation; npm/GitHub RC3 read-only verification; T-0763 artifact-retention corrective record; independent npm/GitHub release-target contract; public RC3 fresh standard init warning reproduction; `docs/GRAPHIFY_FOR_HADARA_AGENTS.md` portability fix; stable vs rc.4 decision. |
| Out | Stable npm/GitHub promotion; new npm/GitHub publication; uploading regenerated files as original RC3 assets; unrelated runtime or Graphify feature work. A runtime fix, if required by the warning diagnosis, becomes a separately scoped rc.4 task. |

## Plan

| Step | Action | Status |
|---|---|---|
| 1 | Define the release-state, artifact-provenance, warning-diagnosis, and portability contract. | Done |
| 2 | Reconcile current-state docs and the shared npm/GitHub target contract; preserve T-0763 corrective history. | Done |
| 3 | Reproduce fresh standard-init warnings against source and public RC3, and classify the finding. | Done |
| 4 | Make the Graphify guide portable, refresh its registry projection, and validate all scoped changes. | Done |
| 5 | Record the stable/rc.4 decision and prepare the capsule for proof-last close. | Done |

## Acceptance

| ID | Criterion | State | Evidence | Reference |
|---|---|---|---|---|
| AC-1 | Tracked release current-state prose reports npm `next=0.5.0-rc.3`, stable `latest=0.4.6`, and GitHub `v0.5.0-rc.3` as a public prerelease. | Met | ev:T-0765:27a905b549d348c1803bc0b6 | `docs/RELEASE_READINESS.md` |
| AC-2 | The release contract explicitly treats npm publication and GitHub release assets as independent targets, and does not claim an exact custom RC3 asset without byte-identical provenance. | Met | ev:T-0765:27a905b549d348c1803bc0b6; ev:T-0765:78959c08ee5a43409c1d2ef7 | T-0763 evidence; reconciliation report |
| AC-3 | Registry recovery is attempted read-only; tarball, checksum, and manifest are each labeled recovered only when their expected bytes/hashes are proven. | Met | ev:T-0765:78959c08ee5a43409c1d2ef7 | T-0763 artifact report; registry command evidence |
| AC-4 | Fresh standard-init warning behavior is reproduced against the relevant source/public artifact and classified as false positive, documentation/scaffold drift, or runtime defect with a stable/rc.4 disposition. | Met | ev:T-0765:187224ea14f54698b5421bcf | Reconciliation report |
| AC-5 | Graphify guide contains no machine-specific absolute executable path and uses PATH discovery or a portable home-relative fallback. | Met | ev:T-0765:c51b84717b0f43308238c370 | `docs/GRAPHIFY_FOR_HADARA_AGENTS.md` |
| AC-6 | Task docs, validation, evidence, and handoff are complete before proof-last close. | Met | ev:T-0765:81536d4748da4e4ab22b2417; close proof pending | Capsule close proof |

## Validation

| Check | Gate | Result | Evidence |
|---|---|---|---|
| Current npm/GitHub RC3 state and release-target contract | Yes | Passed | ev:T-0765:27a905b549d348c1803bc0b6 |
| Published RC3 tarball provenance recovery | Yes | Passed | ev:T-0765:78959c08ee5a43409c1d2ef7 |
| Fresh standard-init warning reproduction and classification | Yes | Passed | ev:T-0765:187224ea14f54698b5421bcf; rc.4 remediation required before stable |
| Graphify guide portability and registry projection | Yes | Passed | ev:T-0765:c51b84717b0f43308238c370; ev:T-0765:d40c4b95dfba4cb18f53c8aa |
| Full repository check | Yes | Failed | ev:T-0765:858003cd88904ffa92c1298d; resolved by ev:T-0765:ad5149d0f06c4f408c6af94c |
| Full repository check after registry projection refresh | Yes | Passed | ev:T-0765:81536d4748da4e4ab22b2417 |

## Inputs / Constraints

| Source | Role | State | Notes |
|---|---|---|---|
| `docs/RELEASE_READINESS.md` | constraint | active | Tracked current-state and release-target contract. |
| `docs/specs/0.5.0-rc3/02_RC3_Release_Readiness.md` | reference | active | RC3 readiness and artifact expectations. |
| `tasks/T-0763-rc3-release-and-public-consumer-dogfood/TASK.md` | reference | active | Public RC3 dogfood, GitHub prerelease proof, and artifact-retention failure record. |
| `tasks/T-0763-rc3-release-and-public-consumer-dogfood/EVIDENCE.md` | reference | active | Durable evidence for npm/public consumer and GitHub state. |
| `docs/GRAPHIFY_FOR_HADARA_AGENTS.md` | implementation-source | active | Portable Graphify agent guide to correct. |
| Reviewer direction in the active request | constraint | active | Stable-blocker classification and required reconciliation scope. |

## Changes

| Area | Summary |
|---|---|
| Release readiness | Updated stale RC2 current-state claims to the observed RC3 public state and documented independent npm/GitHub target semantics. |
| Provenance | Preserved T-0763's missing-retained-artifact result as corrective history and proved byte-identical registry reconstruction for tarball/checksum/manifest without calling them retained originals. |
| Fresh init | Reproduced public/source standard-init warnings and classified the Init v1 scaffold/protocol contract mismatch as an rc.4-before-stable defect. |
| Graphify | Replaced the developer-machine absolute executable path with portable command discovery and refreshed the tracked registry projection. |
| Capsule | Maintained the report, evidence, decision, risks, and handoff as the reconciliation source of truth. |

## Risks / Follow-ups

| ID | Type | Summary | State | Link |
|---|---|---|---|---|
| RF-1 | Risk | The public RC3 artifact may contain standard-init scaffold/profile drift not present in current source. | Mitigated | Fresh-init reproduction shows the same defect in source and public RC3; rc.4 remediation remains required. |
| RF-2 | Risk | Published npm tarball may recover only the binary package, not the separately expected checksum/manifest bytes. | Mitigated | ev:T-0765:78959c08ee5a43409c1d2ef7 proves expected hashes by reconstruction; original operator-file retention remains unproven. |
| RF-3 | Follow-up | If standard-init warning is a source defect, prepare a separate rc.4 implementation capsule before stable promotion. | Open | Stable decision record |
| RF-4 | Follow-up | GitHub custom asset parity remains an independent release-target decision; no regenerated “original” asset upload is authorized by this capsule. | Accepted | Release contract; custom assets are optional unless a later capsule explicitly selects them. |

## History

| Date | State | Note |
|---|---|---|
| 2026-08-11 | Draft | Initial task scaffold. |
| 2026-08-11 | In Progress | Opened from reviewer direction to reconcile public RC3 state, artifact provenance, fresh-init warnings, and Graphify portability before stable promotion. |
| 2026-08-11 | In Progress | Reconciled release readiness, recovered all three expected artifact hashes from public npm bytes, reproduced the standard-init warning defect, corrected Graphify portability, refreshed the docs registry projection, and passed the full repository check after resolving projection drift. |
| 2026-08-11 | Done | Capsule prose, evidence, handoff, and rc.4-before-stable decision are complete; proof-last close remains the lifecycle operation. |
